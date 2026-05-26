import type { Metadata } from "next";

import { VillaCard } from "@/components/villa-card";
import { VillaFilters } from "@/components/villa-filters";
import { createClient } from "@/lib/supabase/server";
import type { Villa } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse villas",
  description: "Browse our handpicked selection of luxury villas across the world.",
};

type SearchParams = {
  q?: string;
  location?: string;
  guests?: string;
  min?: string;
  max?: string;
};

async function getVillas(params: SearchParams): Promise<Villa[]> {
  const supabase = await createClient();
  let query = supabase
    .from("villas")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (params.q) {
    const term = params.q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,location.ilike.%${term}%`,
    );
  }
  if (params.location) {
    query = query.eq("location", params.location);
  }
  if (params.guests) {
    const guests = Number(params.guests);
    if (Number.isFinite(guests) && guests > 0) {
      query = query.gte("guests", guests);
    }
  }
  if (params.min) {
    const min = Number(params.min);
    if (Number.isFinite(min) && min >= 0) {
      query = query.gte("price_per_night", min);
    }
  }
  if (params.max) {
    const max = Number(params.max);
    if (Number.isFinite(max) && max > 0) {
      query = query.lte("price_per_night", max);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load villas", error);
    return [];
  }
  return data ?? [];
}

async function getLocations(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("villas")
    .select("location")
    .eq("is_published", true);
  const unique = new Set<string>();
  for (const row of data ?? []) {
    if (row.location) unique.add(row.location);
  }
  return Array.from(unique).sort();
}

export default async function VillasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [villas, locations] = await Promise.all([getVillas(params), getLocations()]);

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">All villas</span>
          <h1 className="mt-3 text-3xl md:text-4xl">Find your perfect stay</h1>
          <p className="mt-2 max-w-xl text-sm text-brand-700">
            Browse our entire portfolio of villas. Filter by location, guests,
            and budget.
          </p>
        </div>
        <div className="text-sm text-brand-600">
          {villas.length} {villas.length === 1 ? "result" : "results"}
        </div>
      </div>

      <div className="mt-8">
        <VillaFilters locations={locations} />
      </div>

      {villas.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-brand-200 bg-white/60 p-12 text-center">
          <h3 className="text-xl text-brand-900">No villas match those filters</h3>
          <p className="mt-2 text-sm text-brand-700">
            Try widening your search — clear the filters or change the price range.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {villas.map((villa) => (
            <VillaCard key={villa.id} villa={villa} />
          ))}
        </div>
      )}
    </div>
  );
}
