"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "lucide-react";
import {
  adminKeys,
  fetchArtists,
  type SerializedArtist,
} from "@/lib/admin-queries";
import { deleteArtist } from "@/app/admin/actions";
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
import { EmptyState, ErrorState } from "@/components/admin/table-states";

export function ArtistsTable({
  initialData,
}: {
  initialData?: SerializedArtist[];
}) {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: adminKeys.artists,
    queryFn: fetchArtists,
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
        title="No artists yet"
        cta={{ href: "/admin/artists/new", label: "Add the first artist" }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Releases</TableHead>
            <TableHead className="w-0 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((artist) => (
            <TableRow key={artist.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/admin/artists/${artist.id}`}
                  className="hover:text-primary"
                >
                  {artist.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {artist.slug}
              </TableCell>
              <TableCell className="text-muted-foreground text-right tabular-nums">
                {artist._count.releases}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/artists/${artist.id}`}
                    aria-label="Edit"
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <PencilIcon />
                  </Link>
                  <DeleteDialog
                    kind="artist"
                    name={artist.name}
                    onConfirm={() => deleteArtist(artist.id)}
                    onDeleted={() =>
                      queryClient.invalidateQueries({ queryKey: adminKeys.artists })
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
