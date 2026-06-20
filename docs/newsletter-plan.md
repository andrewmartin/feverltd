# Fever LTD — Newsletter / Email List Plan

> Reference for adding a self-owned newsletter (subscriber capture + broadcast
> sending) to the site. Distilled from the infra review on 2026-06-20. Living
> doc — update as we go. **Nothing built yet — this is the agreed plan to pick
> up later.**

## 1. Goal

A low-budget (**$0**), self-owned way to collect newsletter subscribers and
send the occasional broadcast (release announcements, news). Built on the
existing Next.js 16 + Prisma + Postgres + shadcn/ui + server-actions stack.
Expected list size: small.

## 2. Key decisions

| Area | Decision | Why |
| :--- | :--- | :--- |
| **Who owns the list** | **We do.** Subscribers stored as rows in **our own Postgres** (`Subscriber` model). | Full control, portable, no lock-in. The send provider never owns the list — swap it anytime without losing a contact. |
| **Send transport** | **Resend** (free tier: 3,000/mo, 100/day). | Best deliverability for the price, drops into our server-action pattern, React Email templates. |
| Why not Gmail SMTP | Rejected as primary. | ~500/day cap, weaker deliverability, must send from `@gmail.com`. Kept as a fallback only if domain DNS ever becomes a problem. |
| Why not Buttondown/MailerLite | Rejected. | They'd own (or co-own) the list and the UX. We want it in our codebase + DB. |
| **Domain** | We **own `feverltd.com`** and control its DNS. | Resend only needs DNS records (SPF/DKIM) — **no email mailboxes/accounts required.** Outbound auth is separate from having inboxes. |
| From / Reply-to | Send as `news@feverltd.com`; set `reply-to:` to a real Gmail. | No inbox exists at `news@feverltd.com` and none is needed — replies route to Gmail. |
| Unsubscribe | We build it (token link, auto-appended to every send). | Legally required (CAN-SPAM) + keeps us off spam lists. |
| Spam protection | Honeypot field + idempotent-on-email insert. | Public form; tiny, cheap defenses. |

## 3. Data model (to add)

```
Subscriber (id, email*, status, unsubscribeToken*, createdAt, updatedAt)
  status   SUBSCRIBED | UNSUBSCRIBED          // enum
  email             @unique                    // idempotent signups
  unsubscribeToken  @unique                    // random, used by /unsubscribe
```

Optional later: a `Broadcast` model (subject, body, sentAt, recipientCount) to
keep a history of what was sent. Not required for v1.

## 4. Build checklist

- [ ] **`Subscriber` model** + `SubscriberStatus` enum in `prisma/schema.prisma` → `bun run db:push`
- [ ] **Subscribe server action** — react-hook-form + zod, honeypot, idempotent on email, generates `unsubscribeToken`. Wire into `src/components/marketing/newsletter-cta.tsx` + `src/components/site/footer.tsx`.
- [ ] **Admin: subscriber list** — count, table, manual remove, CSV export. New page under `/admin` (matches existing CMS patterns: React Query for the table, server action for mutations, sonner toasts).
- [ ] **Admin: broadcast composer** — subject + body (React Email), "Send to all SUBSCRIBED" via Resend, sent sequentially with the 100/day free cap in mind. Auto-append unsubscribe link.
- [ ] **`/unsubscribe?token=…` route** — flips status to UNSUBSCRIBED, simple confirmation page.
- [ ] **Env + deps** — `RESEND_API_KEY`, `EMAIL_FROM="news@feverltd.com"`, `EMAIL_REPLY_TO="<gmail>"` in `.env.local` + `.env.example`. Add deps: `resend`, `@react-email/components`.

## 5. One-time external setup (Andrew, ~5 min)

Can be done in parallel with the build; sending is stubbed until done.

1. Sign up at **resend.com** (free, no card required).
2. Add domain **`feverltd.com`** → Resend shows 2–3 DNS records (SPF + DKIM).
3. Paste those records into the **DNS host** for `feverltd.com`.
4. Wait for verification (usually minutes), then copy the **API key** into `.env.local` as `RESEND_API_KEY`.
5. Decide the **reply-to Gmail** address → set `EMAIL_REPLY_TO`.

## 6. Cost

**$0.** Resend free tier covers a small list comfortably (3,000 emails/mo).
Domain already owned. No mailboxes to buy. If the list ever outgrows the free
tier, paid Resend or AWS SES are cheap upgrades with no data migration (list
stays in our Postgres).

## 7. Open questions / later

- Double opt-in (confirmation email) vs. single opt-in — single is fine for v1.
- `Broadcast` history model — nice-to-have, defer.
- Throttling/queue if a future send exceeds 100/day — defer until the list is big enough to matter.
