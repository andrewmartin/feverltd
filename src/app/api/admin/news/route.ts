import { NextResponse } from "next/server";
import { guardAdminRoute } from "@/lib/api-guard";
import { listNews } from "@/lib/cms";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;
  const news = await listNews();
  return NextResponse.json(news);
}
