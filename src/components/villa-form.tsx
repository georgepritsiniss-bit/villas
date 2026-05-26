"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createVillaAction, updateVillaAction } from "@/actions/villas";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VillaImageUpload } from "@/components/villa-image-upload";
import { AMENITIES } from "@/lib/constants";
import type { Villa } from "@/lib/types";
import { cn } from "@/lib/utils";

export function VillaForm({ villa }: { villa?: Villa }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(villa?.images ?? []);
  const [amenities, setAmenities] = useState<string[]>(villa?.amenities ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleAmenity(amenity: string) {
    setAmenities((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    );
  }

  function onSubmit(formData: FormData) {
    setError(null);
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }
    formData.set("images", JSON.stringify(images));
    formData.set("amenities", JSON.stringify(amenities));
    startTransition(async () => {
      const result = villa
        ? await updateVillaAction(villa.id, formData)
        : await createVillaAction(formData);
      if (result && !result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={villa?.title}
            placeholder="Villa Aurora"
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={villa?.location}
            placeholder="Amalfi Coast, Italy"
            required
          />
        </div>
        <div>
          <Label htmlFor="pricePerNight">Price per night (USD)</Label>
          <Input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            min={1}
            defaultValue={villa?.price_per_night ?? ""}
            required
          />
        </div>
        <div>
          <Label htmlFor="guests">Max guests</Label>
          <Input
            id="guests"
            name="guests"
            type="number"
            min={1}
            defaultValue={villa?.guests ?? 2}
            required
          />
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={villa?.bedrooms ?? 1}
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={villa?.bathrooms ?? 1}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={villa?.description}
            placeholder="Describe the property, the location, and what makes the stay special…"
            rows={8}
            required
          />
        </div>
      </div>

      <div>
        <Label>Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((amenity) => {
            const active = amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition",
                  active
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-brand-200 bg-white text-brand-800 hover:bg-brand-50",
                )}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Photos</Label>
        <VillaImageUpload value={images} onChange={setImages} />
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-brand-800">
          <input
            type="checkbox"
            name="isPublished"
            value="true"
            defaultChecked={villa?.is_published ?? true}
            className="h-4 w-4 rounded border-brand-300 text-brand-700 focus:ring-brand-300"
          />
          Publish this villa (visible to guests)
        </label>
      </div>

      {error ? <Alert tone="danger">{error}</Alert> : null}

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/villas")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          <Save size={16} />
          {isPending ? "Saving…" : villa ? "Save changes" : "Create villa"}
        </Button>
      </div>
    </form>
  );
}
