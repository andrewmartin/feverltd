import { NextResponse } from "next/server";
import { guardAdminRoute } from "@/lib/api-guard";
import { listArtistOptions } from "@/lib/cms";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;
  const options = await listArtistOptions();
  return NextResponse.json(options);
}
