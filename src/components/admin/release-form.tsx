"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ReleaseStatus } from "@prisma/client";
import { releaseSchema, type ReleaseInput } from "@/lib/cms";
import { adminKeys, type ArtistOption } from "@/lib/admin-queries";
import { createRelease, updateRelease } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormError } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";

type ReleaseFormRecord = {
  id: string;
  title: string;
  slug: string;
  catalogNo: string | null;
  description: string | null;
  coverUrl: string | null;
  buyUrl: string | null;
  releaseDate: Date | string | null;
  status: ReleaseStatus;
  artists: { id: string }[];
};

type ReleaseFormProps = {
  artists: ArtistOption[];
  /** Present when editing. */
  release?: ReleaseFormRecord;
};

/** Format a Date to the yyyy-MM-dd value an <input type="date"> expects. */
function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function ReleaseForm({ artists, release }: ReleaseFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReleaseInput>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      title: release?.title ?? "",
      slug: release?.slug ?? "",
      catalogNo: release?.catalogNo ?? "",
      description: release?.description ?? "",
      coverUrl: release?.coverUrl ?? "",
      buyUrl: release?.buyUrl ?? "",
      releaseDate: toDateInput(release?.releaseDate),
      status: release?.status ?? ReleaseStatus.DRAFT,
      artistIds: release?.artists.map((a) => a.id) ?? [],
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
        toast.error(result.error);
        return;
      }
      toast.success(release ? "Release updated" : "Release created");
      queryClient.invalidateQueries({ queryKey: adminKeys.releases });
      router.push("/admin/releases");
      router.refresh();
    });
  }

  const busy = pending || isSubmitting;
  const noArtists = artists.length === 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
      {noArtists ? (
        <p className="border-border bg-muted/30 text-muted-foreground rounded-md border px-3 py-2 text-sm">
          You need at least one artist before creating a release.{" "}
          <Link href="/admin/artists/new" className="text-primary underline">
            Add an artist
          </Link>
          .
        </p>
      ) : null}

      <Field
        label="Title"
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input id="title" autoComplete="off" {...register("title")} />
      </Field>

      <Field
        label="Artists"
        htmlFor="artistIds"
        required
        error={errors.artistIds?.message}
        hint="Credit at least one artist."
      >
        <Controller
          control={control}
          name="artistIds"
          render={({ field }) => (
            <MultiSelect
              id="artistIds"
              options={artists.map((a) => ({ value: a.id, label: a.name }))}
              value={field.value ?? []}
              onValueChange={field.onChange}
              placeholder="Search artists…"
              emptyText="No artists found."
              disabled={noArtists}
            />
          )}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Slug"
          htmlFor="slug"
          error={errors.slug?.message}
          hint="Optional — from title if blank."
        >
          <Input
            id="slug"
            placeholder="auto-generated"
            autoComplete="off"
            {...register("slug")}
          />
        </Field>

        <Field
          label="Catalog no."
          htmlFor="catalogNo"
          error={errors.catalogNo?.message}
        >
          <Input
            id="catalogNo"
            placeholder="FEV-001"
            autoComplete="off"
            {...register("catalogNo")}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Status" htmlFor="status" error={errors.status?.message}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReleaseStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={ReleaseStatus.PUBLISHED}>
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field
          label="Release date"
          htmlFor="releaseDate"
          error={errors.releaseDate?.message}
        >
          <Input id="releaseDate" type="date" {...register("releaseDate")} />
        </Field>
      </div>

      <Field label="Cover image" htmlFor="coverUrl" error={errors.coverUrl?.message}>
        <Controller
          control={control}
          name="coverUrl"
          render={({ field }) => (
            <ImagePicker
              value={field.value ?? undefined}
              onChange={field.onChange}
              disabled={busy}
            />
          )}
        />
      </Field>

      <Field
        label="Buy link"
        htmlFor="buyUrl"
        error={errors.buyUrl?.message}
        hint="Optional — shown as a “Buy” button on the release page."
      >
        <Input
          id="buyUrl"
          type="url"
          placeholder="https://…"
          autoComplete="off"
          {...register("buyUrl")}
        />
      </Field>

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={5} {...register("description")} />
      </Field>

      <FormError message={formError} />

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
