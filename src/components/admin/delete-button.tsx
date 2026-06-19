"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/admin/ui";
import type { ActionResult } from "@/lib/cms";

type DeleteButtonProps = {
  id: string;
  label: string;
  action: (id: string) => Promise<ActionResult>;
  /** Where to navigate after a successful delete (optional). */
  redirectTo?: string;
};

export function DeleteButton({ id, label, action, redirectTo }: DeleteButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="danger"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${label}`}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="danger"
        onClick={handleDelete}
        disabled={pending}
      >
        {pending ? "Deleting…" : "Confirm"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => setConfirming(false)}
        disabled={pending}
      >
        Cancel
      </Button>
      {error ? (
        <span className="text-xs text-red-400" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
