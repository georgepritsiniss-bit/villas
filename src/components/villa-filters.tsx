"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VillaFilters({ locations }: { locations: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function update(formData: FormData) {
    const next = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      const stringValue = value.toString().trim();
      if (stringValue) next.set(key, stringValue);
    }
    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    });
  }

  function reset() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const hasFilters =
    params.get("q") ||
    params.get("location") ||
    params.get("guests") ||
    params.get("min") ||
    params.get("max");

  return (
    <form
      action={update}
      className="grid gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-soft md:grid-cols-12 md:items-end"
    >
      <div className="md:col-span-4">
        <Label htmlFor="q">Search</Label>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-500"
          />
          <Input
            id="q"
            name="q"
            defaultValue={params.get("q") ?? ""}
            placeholder="Villa name or keyword"
            className="pl-9"
          />
        </div>
      </div>

      <div className="md:col-span-3">
        <Label htmlFor="location">Location</Label>
        <select
          id="location"
          name="location"
          defaultValue={params.get("location") ?? ""}
          className="field"
        >
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-1">
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          name="guests"
          type="number"
          min={1}
          defaultValue={params.get("guests") ?? ""}
          placeholder="Any"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="min">Min price</Label>
        <Input
          id="min"
          name="min"
          type="number"
          min={0}
          defaultValue={params.get("min") ?? ""}
          placeholder="$0"
        />
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="max">Max price</Label>
        <Input
          id="max"
          name="max"
          type="number"
          min={0}
          defaultValue={params.get("max") ?? ""}
          placeholder="No limit"
        />
      </div>

      <div className="flex items-center gap-2 md:col-span-12 md:justify-end">
        {hasFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            <X size={14} /> Clear
          </Button>
        ) : null}
        <Button type="submit" size="sm" disabled={isPending}>
          <SlidersHorizontal size={14} />
          {isPending ? "Applying…" : "Apply filters"}
        </Button>
      </div>
    </form>
  );
}
