"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PostStatus } from "@prisma/client";
import type { NewsPost } from "@prisma/client";
import { newsSchema, type NewsInput } from "@/lib/cms";
import { adminKeys } from "@/lib/admin-queries";
import { createNews, updateNews } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FormError } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";

export function NewsForm({ post }: { post?: NewsPost }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewsInput>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      heroImage: post?.heroImage ?? "",
      status: post?.status ?? PostStatus.DRAFT,
      publishedAt: post?.publishedAt
        ? new Date(post.publishedAt).toISOString().slice(0, 10)
        : "",
    },
  });

  function onSubmit(values: NewsInput) {
    setFormError(null);
    startTransition(async () => {
      const result = post
        ? await updateNews(post.id, values)
        : await createNews(values);
      if (!result.ok) {
        setFormError(result.error);
        toast.error(result.error);
        return;
      }
      toast.success(post ? "Post updated" : "Post created");
      queryClient.invalidateQueries({ queryKey: adminKeys.news });
      router.push("/admin/news");
      router.refresh();
    });
  }

  const busy = pending || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
      <Field
        label="Title"
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input id="title" autoComplete="off" {...register("title")} />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        error={errors.slug?.message}
        hint="Auto-generated from the title if left blank."
      >
        <Input
          id="slug"
          placeholder="auto-generated"
          autoComplete="off"
          {...register("slug")}
        />
      </Field>

      <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt?.message}>
        <Textarea id="excerpt" rows={3} {...register("excerpt")} />
      </Field>

      <Field label="Body" htmlFor="body" error={errors.body?.message}>
        <Textarea id="body" rows={10} {...register("body")} />
      </Field>

      <Field
        label="Hero image"
        htmlFor="heroImage"
        error={errors.heroImage?.message}
      >
        <Controller
          control={control}
          name="heroImage"
          render={({ field }) => (
            <ImagePicker
              value={field.value ?? undefined}
              onChange={field.onChange}
              disabled={busy}
              aspect="video"
            />
          )}
        />
      </Field>

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
                  <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={PostStatus.PUBLISHED}>
                    Published
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field
          label="Published date"
          htmlFor="publishedAt"
          error={errors.publishedAt?.message}
        >
          <Input id="publishedAt" type="date" {...register("publishedAt")} />
        </Field>
      </div>

      <FormError message={formError} />

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={busy}
          onClick={() => router.push("/admin/news")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
