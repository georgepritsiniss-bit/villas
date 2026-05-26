import { ArrowRight, Compass, KeyRound, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { VillaCard } from "@/components/villa-card";
import { createClient } from "@/lib/supabase/server";
import type { Villa } from "@/lib/types";

export const revalidate = 60;

async function getFeaturedVillas(): Promise<Villa[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Failed to load featured villas", error);
    return [];
  }
  return data ?? [];
}

const features = [
  {
    icon: ShieldCheck,
    title: "Verified hosts",
    description:
      "Every villa is personally inspected and reviewed by our local concierge team.",
  },
  {
    icon: KeyRound,
    title: "Transparent pricing",
    description:
      "No hidden fees, no surprise charges. What you see is exactly what you pay.",
  },
  {
    icon: Sparkles,
    title: "Concierge service",
    description:
      "From private chefs to airport transfers, we make every stay effortless.",
  },
  {
    icon: Compass,
    title: "Local expertise",
    description:
      "Get insider tips and itineraries from people who actually live there.",
  },
];

export default async function HomePage() {
  const villas = await getFeaturedVillas();

  return (
    <>
      <Hero />

      <section className="container py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">Featured stays</span>
            <h2 className="mt-3 text-3xl md:text-4xl">Handpicked villas, this season</h2>
            <p className="mt-2 max-w-xl text-sm text-brand-700">
              A small selection of the homes our guests are loving right now.
            </p>
          </div>
          <Link
            href="/villas"
            className="text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            View all villas →
          </Link>
        </div>

        {villas.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-brand-200 bg-white/60 p-10 text-center">
            <p className="text-sm text-brand-700">
              No villas yet. Run the SQL seed file or add one from the admin
              dashboard to see featured properties here.
            </p>
            <Button href="/admin/villas/new" className="mt-4" size="sm">
              Add the first villa
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {villas.map((villa) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="container grid gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="chip">Why Maison Azure</span>
            <h2 className="mt-3 text-3xl md:text-4xl">A better way to villa.</h2>
            <p className="mt-3 max-w-md text-sm text-brand-700">
              We blend the comfort of a five-star hotel with the privacy of your
              own home. Every detail is taken care of so you can focus on what
              matters: time with the people you love.
            </p>
            <Button href="/villas" className="mt-6">
              Start exploring <ArrowRight size={16} />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-brand-100 bg-sand-50/50 p-6"
              >
                <feature.icon size={24} className="text-brand-700" />
                <h3 className="mt-3 text-lg">{feature.title}</h3>
                <p className="mt-1 text-sm text-brand-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-8 py-14 text-white md:px-14 md:py-20">
          <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-sand-300 blur-3xl" />
            <div className="absolute -bottom-32 -right-10 h-80 w-80 rounded-full bg-brand-400 blur-3xl" />
          </div>
          <div className="max-w-2xl">
            <h2 className="text-white text-3xl md:text-4xl">
              Your next escape is one click away.
            </h2>
            <p className="mt-3 text-white/80">
              Create a free account to save favorites, request bookings, and
              receive curated villa recommendations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/signup" size="lg" variant="secondary">
                Create free account
              </Button>
              <Button
                href="/villas"
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                Browse villas
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
