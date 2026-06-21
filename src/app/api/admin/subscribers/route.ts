import { NextResponse } from "next/server";
import { guardAdminRoute } from "@/lib/api-guard";
import { listSubscribers } from "@/lib/newsletter";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;
  const subscribers = await listSubscribers();
  return NextResponse.json(subscribers);
}
