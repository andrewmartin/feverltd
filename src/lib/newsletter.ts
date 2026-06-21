import { z } from "zod";
import { SubscriberStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/**
 * Public subscribe form. `company` is a honeypot — real users never see it, so
 * any value means a bot; we accept the request but skip the insert.
 */
export const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  company: z.string().optional(),
});

export type SubscribeInput = z.input<typeof subscribeSchema>;

/** Shared result shape returned from the subscribe action. */
export type SubscribeResult =
  | { ok: true }
  | { ok: false; error: string };

/* ------------------------------------------------------------------ */
/* Read helpers (admin route handlers / server components)             */
/* ------------------------------------------------------------------ */

export function listSubscribers() {
  return prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getSubscriberStats() {
  const [total, subscribed] = await Promise.all([
    prisma.subscriber.count(),
    prisma.subscriber.count({ where: { status: SubscriberStatus.SUBSCRIBED } }),
  ]);
  return { total, subscribed, unsubscribed: total - subscribed };
}

export type SubscriberRow = Awaited<ReturnType<typeof listSubscribers>>[number];

/* ------------------------------------------------------------------ */
/* CSV export                                                          */
/* ------------------------------------------------------------------ */

/** Escape a value for CSV (RFC 4180): quote and double inner quotes. */
function csvCell(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

const CSV_COLUMNS = ["email", "status", "subscribedAt", "updatedAt"] as const;

/** Serialize subscribers to a CSV string with a header row. */
export function subscribersToCsv(subscribers: SubscriberRow[]): string {
  const rows = subscribers.map((s) =>
    [
      s.email,
      s.status,
      s.createdAt.toISOString(),
      s.updatedAt.toISOString(),
    ]
      .map(csvCell)
      .join(","),
  );
  return [CSV_COLUMNS.join(","), ...rows].join("\r\n");
}
