"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const cover = images[0] ?? "/placeholder-villa.svg";
  const rest = images.slice(1, 5);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (event.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + images.length) % images.length,
        );
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length]);

  return (
    <>
      <div className="grid h-[420px] gap-2 overflow-hidden rounded-2xl md:h-[520px] md:grid-cols-4 md:grid-rows-2">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="relative col-span-2 row-span-2 overflow-hidden bg-brand-100"
        >
          <Image
            src={cover}
            alt={`${title} cover`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 hover:scale-105"
            priority
          />
        </button>
        {Array.from({ length: 4 }).map((_, idx) => {
          const img = rest[idx];
          if (!img) {
            return (
              <div
                key={`empty-${idx}`}
                className="hidden bg-brand-100 md:block"
                aria-hidden
              />
            );
          }
          return (
            <button
              key={img + idx}
              type="button"
              onClick={() => setLightboxIndex(idx + 1)}
              className="relative hidden overflow-hidden bg-brand-100 md:block"
            >
              <Image
                src={img}
                alt={`${title} photo ${idx + 2}`}
                fill
                sizes="25vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
              {idx === 3 && images.length > 5 ? (
                <span className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-semibold text-white">
                  +{images.length - 5} more
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {lightboxIndex !== null ? (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={18} />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + images.length) % images.length,
              );
            }}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
          >
            <ChevronRight />
          </button>
          <div
            className={cn(
              "relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} photo ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
