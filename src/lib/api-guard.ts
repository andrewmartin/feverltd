import { NextResponse } from "next/server";
import { getAdminSession } from "@/auth";

/**
 * Guard for admin GET route handlers. Returns null when authorized, or a 401
 * NextResponse to return early. Respects the dev auth bypass via
 * getAdminSession() (same pattern as the server actions).
 */
export async function guardAdminRoute(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
