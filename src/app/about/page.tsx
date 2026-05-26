import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "We help travelers discover and book exceptional private villas — with the care of a boutique hotel.",
};

const stats = [
  { value: "120+", label: "Villas worldwide" },
  { value: "32", label: "Destinations" },
  { value: "4.9★", label: "Average guest rating" },
  { value: "24/7", label: "Concierge support" },
];

export default function AboutPage() {
  return (
    <>
      <section className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="chip">About us</span>
            <h1 className="mt-3 text-4xl md:text-5xl">
              Boutique stays, lovingly curated.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-brand-800">
              We started Maison Azure because we believe a holiday rental should
              feel like coming home — only better. Every villa in our portfolio
              is personally visited and approved by our team. We work directly
              with hosts to make sure each property lives up to our promise.
            </p>
            <Button href="/villas" className="mt-6">
              Explore villas
            </Button>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1600&q=80"
              alt="Mediterranean villa with pool"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-brand-100 bg-sand-50/50 px-6 py-8 text-center"
              >
                <div className="font-display text-3xl text-brand-900">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-brand-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Hand-selected homes",
              body: "We turn down 9 out of 10 properties we visit. Only homes that meet our standards make it onto the site.",
            },
            {
              title: "Honest pricing",
              body: "The price you see is the price you pay. No surprise cleaning fees, no service mark-ups.",
            },
            {
              title: "Real humans",
              body: "Our concierge team is on call before, during, and after your trip. Travel feels easier with us.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-brand-100 bg-white p-8"
            >
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-700">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
