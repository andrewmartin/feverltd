"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Artist } from "@prisma/client";
import { artistSchema, type ArtistInput } from "@/lib/cms";
import { adminKeys } from "@/lib/admin-queries";
import { createArtist, updateArtist } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Field, FormError } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import { InfoIcon } from "lucide-react";

export function ArtistForm({ artist }: { artist?: Artist }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArtistInput>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: artist?.name ?? "",
      slug: artist?.slug ?? "",
      bio: artist?.bio ?? "",
      imageUrl: artist?.imageUrl ?? "",
      website: artist?.website ?? "",
      location: artist?.location ?? "",
      genre: artist?.genre ?? "",
      alumni: artist?.alumni ?? false,
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
        toast.error(result.error);
        return;
      }
      toast.success(artist ? "Artist updated" : "Artist created");
      queryClient.invalidateQueries({ queryKey: adminKeys.artists });
      router.push("/admin/artists");
      router.refresh();
    });
  }

  const busy = pending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
      <Field label="Name" htmlFor="name" required error={errors.name?.message}>
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

      <div className="grid grid-cols-2 gap-5 max-[560px]:grid-cols-1">
        <Field
          label="Based"
          htmlFor="location"
          error={errors.location?.message}
          hint="Where they're from, e.g. “Birmingham, AL”."
        >
          <Input id="location" autoComplete="off" {...register("location")} />
        </Field>

        <Field
          label="Sound"
          htmlFor="genre"
          error={errors.genre?.message}
          hint="Genre, e.g. “Post-hardcore”."
        >
          <Input id="genre" autoComplete="off" {...register("genre")} />
        </Field>
      </div>

      <Field label="Bio" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={5} {...register("bio")} />
      </Field>

      <Field label="Image" htmlFor="imageUrl" error={errors.imageUrl?.message}>
        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImagePicker
              value={field.value ?? undefined}
              onChange={field.onChange}
              disabled={busy}
            />
          )}
        />
      </Field>

      <Field label="Website" htmlFor="website" error={errors.website?.message}>
        <Input id="website" type="url" placeholder="https://…" {...register("website")} />
      </Field>

      <Controller
        control={control}
        name="alumni"
        render={({ field }) => (
          <div className="group/field flex items-start gap-3 rounded-md border border-input p-4 has-data-checked:border-primary/50">
            <Checkbox
              id="alumni"
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={busy}
              className="mt-0.5"
            />
            <span className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5">
                <label htmlFor="alumni" className="text-sm font-medium leading-none">
                  Alumni
                </label>
                <Tooltip>
                  <TooltipTrigger
                    render={<button type="button" />}
                    aria-label="What does Alumni mean?"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <InfoIcon className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Tick this for a band that used to be signed to Fever but has
                    since left. Their artist page shows an “Alumni” badge so
                    visitors know they’re no longer active on the label — they stay
                    listed and all their releases keep working.
                  </TooltipContent>
                </Tooltip>
              </span>
              <span className="text-xs text-muted-foreground">
                Formerly signed but no longer on Fever. Shown with an “Alumni” badge.
              </span>
            </span>
          </div>
        )}
      />

      <FormError message={formError} />

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
