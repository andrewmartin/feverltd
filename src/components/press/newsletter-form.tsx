"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribe } from "@/app/actions/newsletter";
import { subscribeSchema, type SubscribeInput } from "@/lib/newsletter";

/** Footer newsletter capture — stores the email in our own DB. */
export function NewsletterForm() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "", company: "" },
  });

  function onSubmit(values: SubscribeInput) {
    startTransition(async () => {
      const result = await subscribe(values);
      if (!result.ok) {
        setError("email", { message: result.error });
        return;
      }
      reset();
      setDone(true);
    });
  }

  if (done) {
    return (
      <p
        role="status"
        className="max-w-[400px] border border-rule bg-surface px-4 py-3.5 font-editorial text-[15px] text-ink"
      >
        You’re on the list. Watch your inbox<span className="text-fever">.</span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-[400px]" noValidate>
      <div className="flex border border-rule bg-surface">
        <input
          type="email"
          placeholder="your@email.com"
          aria-label="Email"
          autoComplete="email"
          disabled={pending}
          {...register("email")}
          className="flex-1 border-0 bg-transparent px-4 py-3.5 font-editorial text-[15px] text-ink outline-none placeholder:text-quiet disabled:opacity-60"
        />
        {/* Honeypot — hidden from real users, catches bots. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...register("company")}
        />
        <button
          type="submit"
          disabled={pending}
          className="cursor-pointer border-0 bg-fever px-[22px] font-press text-[11px] uppercase tracking-[0.16em] text-white transition hover:[box-shadow:0_0_24px_-2px_var(--glow)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {errors.email ? (
        <p role="alert" className="mt-2 font-editorial text-[13px] text-fever">
          {errors.email.message}
        </p>
      ) : null}
    </form>
  );
}
