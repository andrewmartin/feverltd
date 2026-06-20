"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/lib/cms";

type DeleteDialogProps = {
  /** Runs the destructive server action. */
  onConfirm: () => Promise<ActionResult>;
  /** Human label, e.g. the artist/release/post title. */
  name: string;
  /** What kind of thing, e.g. "artist", "release", "post". */
  kind: string;
  /** Called after a successful delete (e.g. invalidate queries). */
  onDeleted?: () => void;
  /** Navigate here after a successful delete (e.g. back to the index). */
  redirectTo?: string;
  /** Optional custom trigger; defaults to an icon button. */
  trigger?: React.ReactNode;
};

export function DeleteDialog({
  onConfirm,
  name,
  kind,
  onDeleted,
  redirectTo,
  trigger,
}: DeleteDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await onConfirm();
      if (!result.ok) {
        toast.error(result.error);
        setOpen(false);
        return;
      }
      toast.success(`Deleted “${name}”`);
      setOpen(false);
      onDeleted?.();
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      }
    });
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${name}`}
          >
            <Trash2Icon />
          </Button>
        )}
      </span>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes “{name}”. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={pending}
            >
              {pending ? "Deleting…" : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
