import { NextResponse } from "next/server";
import { guardAdminRoute } from "@/lib/api-guard";
import { listArtists } from "@/lib/cms";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;
  const artists = await listArtists();
  return NextResponse.json(artists);
}
