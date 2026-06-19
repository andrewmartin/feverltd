"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Artist } from "@prisma/client";
import { artistSchema, type ArtistInput } from "@/lib/cms";
import { createArtist, updateArtist } from "@/app/admin/actions";
import { Button, Field, Input, Textarea } from "@/components/admin/ui";

type ArtistFormProps = {
  /** Present when editing. */
  artist?: Artist;
};

export function ArtistForm({ artist }: ArtistFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistInput>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: artist?.name ?? "",
      slug: artist?.slug ?? "",
      bio: artist?.bio ?? "",
      imageUrl: artist?.imageUrl ?? "",
      website: artist?.website ?? "",
    },
  });

  function onSubmit(values: ArtistInput) {
    setFormError(null);
    startTransition(async () => {
      const result = artist
        ? await updateArtist(artist.id, values)
        : await createArtist(values);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      router.push("/admin/artists");
      router.refresh();
    });
  }

  const busy = pending || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-2xl flex-col gap-5">
      <Field label="Name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="off" {...register("name")} />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        error={errors.slug?.message}
        hint="Optional — generated from the name if left blank."
      >
        <Input id="slug" placeholder="auto-generated" autoComplete="off" {...register("slug")} />
      </Field>

      <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" {...register("bio")} />
      </Field>

      <Field label="Image URL" htmlFor="imageUrl" error={errors.imageUrl?.message}>
        <Input id="imageUrl" type="url" placeholder="https://…" {...register("imageUrl")} />
      </Field>

      <Field label="Website" htmlFor="website" error={errors.website?.message}>
        <Input id="website" type="url" placeholder="https://…" {...register("website")} />
      </Field>

      {formError ? (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : artist ? "Save changes" : "Create artist"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => router.push("/admin/artists")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
