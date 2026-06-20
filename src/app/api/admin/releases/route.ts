import { NextResponse } from "next/server";
import { guardAdminRoute } from "@/lib/api-guard";
import { listReleases } from "@/lib/cms";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;
  const releases = await listReleases();
  return NextResponse.json(releases);
}
