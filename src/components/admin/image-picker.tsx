"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type ImagePickerProps = {
  /** Current image URL (blob or external). */
  value?: string;
  /** Called with the new URL after upload, or "" when cleared. */
  onChange: (url: string) => void;
  /** Disable while the parent form is submitting. */
  disabled?: boolean;
  /** Aspect of the preview box. */
  aspect?: "square" | "video";
};

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";

export function ImagePicker({
  value,
  onChange,
  disabled,
  aspect = "square",
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const hasImage = Boolean(value);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob/upload",
      });
      onChange(blob.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed",
      );
    } finally {
      setUploading(false);
      // Allow re-selecting the same file after a clear.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const busy = disabled || uploading;

  return (
    <div className="flex items-start gap-4">
      <div
        className={`bg-muted/30 text-muted-foreground relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border ${
          aspect === "square" ? "size-28" : "h-28 w-44"
        }`}
      >
        {hasImage ? (
          <Image
            src={value as string}
            alt="Selected image preview"
            fill
            sizes="176px"
            className="object-cover"
          />
        ) : (
          <ImageIcon className="size-7 opacity-50" aria-hidden />
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="size-6 animate-spin text-white" aria-hidden />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud className="size-4" aria-hidden />
            {uploading
              ? "Uploading…"
              : hasImage
                ? "Replace image"
                : "Upload image"}
          </Button>
          {hasImage && !uploading ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => onChange("")}
            >
              <X className="size-4" aria-hidden />
              Remove
            </Button>
          ) : null}
        </div>
        <p className="text-muted-foreground text-xs">
          JPG, PNG, WebP, AVIF or GIF — up to 10 MB.
        </p>
      </div>
    </div>
  );
}
