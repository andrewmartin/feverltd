"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReleaseStatus, type Release } from "@prisma/client";
import { releaseSchema, type ReleaseInput } from "@/lib/cms";
import { createRelease, updateRelease } from "@/app/admin/actions";
import { Button, Field, Input, Select, Textarea } from "@/components/admin/ui";

type ArtistOption = { id: string; name: string };

type ReleaseFormProps = {
  artists: ArtistOption[];
  /** Present when editing. */
  release?: Release;
};

/** Format a Date to the yyyy-MM-dd value an <input type="date"> expects. */
function toDateInput(value: Date | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function ReleaseForm({ artists, release }: ReleaseFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReleaseInput>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      title: release?.title ?? "",
      slug: release?.slug ?? "",
      catalogNo: release?.catalogNo ?? "",
      description: release?.description ?? "",
      coverUrl: release?.coverUrl ?? "",
      releaseDate: toDateInput(release?.releaseDate),
      status: release?.status ?? ReleaseStatus.DRAFT,
      artistId: release?.artistId ?? artists[0]?.id ?? "",
    },
  });

  function onSubmit(values: ReleaseInput) {
    setFormError(null);
    startTransition(async () => {
      const result = release
        ? await updateRelease(release.id, values)
        : await createRelease(values);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      router.push("/admin/releases");
      router.refresh();
    });
  }

  const busy = pending || isSubmitting;
  const noArtists = artists.length === 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-5">
      {noArtists ? (
        <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          You need at least one artist before creating a release.
        </p>
      ) : null}

      <Field label="Title" htmlFor="title" error={errors.title?.message}>
        <Input id="title" autoComplete="off" {...register("title")} />
      </Field>

      <Field label="Artist" htmlFor="artistId" error={errors.artistId?.message}>
        <Select id="artistId" disabled={noArtists} {...register("artistId")}>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </Select>
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Slug"
          htmlFor="slug"
          error={errors.slug?.message}
          hint="Optional — from title if blank."
        >
          <Input id="slug" placeholder="auto-generated" autoComplete="off" {...register("slug")} />
        </Field>

        <Field label="Catalog no." htmlFor="catalogNo" error={errors.catalogNo?.message}>
          <Input id="catalogNo" placeholder="FEV-001" autoComplete="off" {...register("catalogNo")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Status" htmlFor="status" error={errors.status?.message}>
          <Select id="status" {...register("status")}>
            <option value={ReleaseStatus.DRAFT}>Draft</option>
            <option value={ReleaseStatus.PUBLISHED}>Published</option>
          </Select>
        </Field>

        <Field label="Release date" htmlFor="releaseDate" error={errors.releaseDate?.message}>
          <Input id="releaseDate" type="date" {...register("releaseDate")} />
        </Field>
      </div>

      <Field label="Cover URL" htmlFor="coverUrl" error={errors.coverUrl?.message}>
        <Input id="coverUrl" type="url" placeholder="https://…" {...register("coverUrl")} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Textarea id="description" {...register("description")} />
      </Field>

      {formError ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy || noArtists}>
          {busy ? "Saving…" : release ? "Save changes" : "Create release"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => router.push("/admin/releases")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
