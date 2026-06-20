"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import {
  adminKeys,
  fetchReleases,
  type SerializedRelease,
} from "@/lib/admin-queries";
import { deleteRelease } from "@/app/admin/actions";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState, ErrorState } from "@/components/admin/table-states";

export function ReleasesTable({
  initialData,
}: {
  initialData?: SerializedRelease[];
}) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: adminKeys.releases,
    queryFn: fetchReleases,
    initialData,
  });

  if (isPending) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="No releases yet"
        cta={{ href: "/admin/releases/new", label: "Add the first release" }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Artists</TableHead>
            <TableHead>Catalog #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-0 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((release) => (
            <TableRow key={release.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/releases/${release.id}`}
                  className="hover:text-primary"
                >
                  {release.title}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {release.artists.map((a) => a.name).join(", ")}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {release.catalogNo}
              </TableCell>
              <TableCell>
                <StatusBadge status={release.status} />
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {new Date(release.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/releases/${release.id}`}
                    aria-label="Edit"
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <PencilIcon />
                  </Link>
                  <DeleteDialog
                    kind="release"
                    name={release.title}
                    onConfirm={() => deleteRelease(release.id)}
                    onDeleted={() =>
                      queryClient.invalidateQueries({
                        queryKey: adminKeys.releases,
                      })
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
