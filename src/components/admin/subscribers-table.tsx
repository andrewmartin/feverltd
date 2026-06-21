"use client";

import { useTransition } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SubscriberStatus } from "@prisma/client";
import {
  adminKeys,
  fetchSubscribers,
  type SerializedSubscriber,
} from "@/lib/admin-queries";
import { setSubscriberStatus, deleteSubscriber } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState, ErrorState } from "@/components/admin/table-states";

function StatusBadge({ status }: { status: SubscriberStatus }) {
  const subscribed = status === SubscriberStatus.SUBSCRIBED;
  return (
    <Badge
      variant={subscribed ? "default" : "secondary"}
      className={cn(!subscribed && "text-muted-foreground")}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          subscribed ? "bg-primary-foreground" : "bg-muted-foreground",
        )}
      />
      {subscribed ? "Subscribed" : "Unsubscribed"}
    </Badge>
  );
}

function SubscriberRow({
  subscriber,
  onChanged,
}: {
  subscriber: SerializedSubscriber;
  onChanged: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const subscribed = subscriber.status === SubscriberStatus.SUBSCRIBED;
  const next = subscribed
    ? SubscriberStatus.UNSUBSCRIBED
    : SubscriberStatus.SUBSCRIBED;

  function toggle() {
    startTransition(async () => {
      const result = await setSubscriberStatus(subscriber.id, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(
        subscribed ? "Marked unsubscribed" : "Marked subscribed",
      );
      onChanged();
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{subscriber.email}</TableCell>
      <TableCell>
        <StatusBadge status={subscriber.status} />
      </TableCell>
      <TableCell className="text-muted-foreground tabular-nums">
        {new Date(subscriber.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={toggle}
            disabled={pending}
          >
            {pending ? "…" : subscribed ? "Unsubscribe" : "Resubscribe"}
          </Button>
          <DeleteDialog
            kind="subscriber"
            name={subscriber.email}
            onConfirm={() => deleteSubscriber(subscriber.id)}
            onDeleted={onChanged}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export function SubscribersTable({
  initialData,
}: {
  initialData?: SerializedSubscriber[];
}) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: adminKeys.subscribers,
    queryFn: fetchSubscribers,
    initialData,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: adminKeys.subscribers });

  if (isPending) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No subscribers yet"
        description="Signups from the site’s newsletter form will show up here."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-0 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((subscriber) => (
            <SubscriberRow
              key={subscriber.id}
              subscriber={subscriber}
              onChanged={invalidate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
