"use server";

import { randomUUID } from "node:crypto";
import { SubscriberStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  subscribeSchema,
  type SubscribeInput,
  type SubscribeResult,
} from "@/lib/newsletter";

/**
 * Public newsletter signup. Idempotent on email: a new address is inserted, an
 * existing one is (re)set to SUBSCRIBED so returning unsubscribers can opt back
 * in. The honeypot (`company`) silently no-ops bot submissions.
 */
export async function subscribe(input: SubscribeInput): Promise<SubscribeResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" };
  }

  const { email, company } = parsed.data;

  // Honeypot tripped — pretend success without touching the DB.
  if (company && company.trim() !== "") {
    return { ok: true };
  }

  try {
    await prisma.subscriber.upsert({
      where: { email },
      update: { status: SubscriberStatus.SUBSCRIBED },
      create: { email, unsubscribeToken: randomUUID() },
    });
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  return { ok: true };
}
