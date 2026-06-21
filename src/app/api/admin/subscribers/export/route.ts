import { guardAdminRoute } from "@/lib/api-guard";
import { listSubscribers, subscribersToCsv } from "@/lib/newsletter";

export async function GET() {
  const denied = await guardAdminRoute();
  if (denied) return denied;

  const subscribers = await listSubscribers();
  const csv = subscribersToCsv(subscribers);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fever-subscribers.csv"`,
    },
  });
}
