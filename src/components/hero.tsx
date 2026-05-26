import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=2000&q=80"
          alt="Cliffside villa overlooking the sea"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/70 via-brand-950/55 to-brand-950/80" />
      </div>

      <div className="container relative flex min-h-[640px] flex-col justify-end gap-8 py-20 text-white md:min-h-[720px]">
        <div className="max-w-3xl animate-fade-in">
          <span className="chip bg-white/10 text-white ring-white/20">
            Boutique villas · Verified hosts
          </span>
          <h1 className="mt-4 font-display text-4xl leading-tight text-white md:text-6xl">
            Find your private slice of paradise.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
            Curated luxury villas in the world&apos;s most beautiful destinations.
            Transparent pricing, instant booking requests, zero compromise.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/villas" size="lg" variant="primary">
              Browse villas <ArrowRight size={16} />
            </Button>
            <Button href="/about" size="lg" variant="outline" className="bg-white/5 text-white hover:bg-white/15">
              How it works
            </Button>
          </div>
        </div>

        <form
          action="/villas"
          className="grid w-full max-w-3xl grid-cols-1 gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur ring-1 ring-white/20 md:grid-cols-[1fr_1fr_auto]"
        >
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-4 text-brand-900">
            <Search size={16} className="text-brand-500" />
            <input
              name="q"
              placeholder="Search villas or destinations"
              className="h-12 w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/95 px-4 text-brand-900">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              Guests
            </span>
            <input
              name="guests"
              type="number"
              min={1}
              placeholder="2"
              className="h-12 w-16 bg-transparent text-sm outline-none"
            />
          </div>
          <Link
            href="/villas"
            className="grid h-12 place-items-center rounded-xl bg-brand-700 px-6 text-sm font-semibold text-white transition hover:bg-brand-800"
          >
            <span className="inline-flex items-center gap-2">
              Search <ArrowRight size={16} />
            </span>
          </Link>
        </form>
      </div>
    </section>
  );
}
