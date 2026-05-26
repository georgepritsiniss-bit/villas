"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { VILLA_IMAGES_BUCKET } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export function VillaImageUpload({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);

    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}`);
        }
        if (file.size > MAX_BYTES) {
          throw new Error(`${file.name} is over 8MB.`);
        }

        const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const filename = `${crypto.randomUUID()}.${ext}`;
        const path = `villas/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from(VILLA_IMAGES_BUCKET)
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from(VILLA_IMAGES_BUCKET)
          .getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  function removeAt(index: number) {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl border border-brand-100 bg-brand-50"
          >
            <Image
              src={url}
              alt={`Villa image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
            <button
              type="button"
              aria-label="Remove image"
              className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
              onClick={() => removeAt(index)}
            >
              <X size={14} />
            </button>
            {index === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 rounded-full bg-brand-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Cover
              </span>
            ) : null}
          </div>
        ))}
        <label
          className="grid aspect-square cursor-pointer place-items-center rounded-xl border border-dashed border-brand-300 bg-white text-sm font-medium text-brand-700 transition hover:bg-brand-50"
        >
          {isUploading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Uploading…
            </span>
          ) : (
            <span className="inline-flex flex-col items-center gap-1">
              <ImagePlus size={20} />
              Add photos
            </span>
          )}
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            multiple
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <p className="text-xs text-brand-500">
        Up to 8MB per image. JPG, PNG, WEBP or AVIF. The first photo is the cover.
      </p>
    </div>
  );
}
