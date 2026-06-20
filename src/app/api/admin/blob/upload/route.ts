import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/auth";

/**
 * Client-upload token endpoint for the admin image picker.
 *
 * The browser uploads directly to Vercel Blob (bypassing the 4.5 MB server
 * body limit); this route only mints a short-lived, scoped upload token and
 * gates it behind an authenticated admin session.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getAdminSession();
        if (!session) throw new Error("Unauthorized");
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true,
        };
      },
      // Required by the API; nothing to persist here since the form save stores
      // the returned URL.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
