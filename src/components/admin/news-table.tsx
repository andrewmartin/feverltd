"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import {
  adminKeys,
  fetchNews,
  type SerializedNews,
} from "@/lib/admin-queries";
import { deleteNews } from "@/app/admin/actions";
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

export function NewsTable({
  initialData,
}: {
  initialData?: SerializedNews[];
}) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: adminKeys.news,
    queryFn: fetchNews,
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
        title="No posts yet"
        cta={{ href: "/admin/news/new", label: "Write the first post" }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-0 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/news/${post.id}`}
                  className="hover:text-primary"
                >
                  {post.title}
                </Link>
              </TableCell>
              <TableCell>
                <StatusBadge status={post.status} />
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {new Date(post.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/news/${post.id}`}
                    aria-label="Edit"
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <PencilIcon />
                  </Link>
                  <DeleteDialog
                    kind="post"
                    name={post.title}
                    onConfirm={() => deleteNews(post.id)}
                    onDeleted={() =>
                      queryClient.invalidateQueries({ queryKey: adminKeys.news })
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
