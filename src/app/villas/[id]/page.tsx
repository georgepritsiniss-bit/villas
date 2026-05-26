import { BedDouble, Bath, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AvailabilityCalendar } from "@/components/availability-calendar";
import { BookingForm } from "@/components/booking-form";
import { ImageGallery } from "@/components/image-gallery";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Booking, Villa } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const revalidate = 60;

async function getVilla(slug: string): Promise<Villa | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    console.error("Failed to load villa", error);
    return null;
  }
  return data;
}

async function getBlockedDates(
  villaId: string,
): Promise<Pick<Booking, "start_date" | "end_date">[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("villa_availability")
    .select("start_date,end_date")
    .eq("villa_id", villaId)
    .gte("end_date", today);
  if (error) {
    console.error("Failed to load availability", error);
    return [];
  }
  return data ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const villa = await getVilla(id);
  if (!villa) return { title: "Villa not found" };
  return {
    title: villa.title,
    description: villa.description.slice(0, 160),
    openGraph: {
      title: villa.title,
      description: villa.description.slice(0, 160),
      images: villa.images?.[0] ? [{ url: villa.images[0] }] : undefined,
    },
  };
}

export default async function VillaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const villa = await getVilla(id);
  if (!villa) notFound();

  const [bookings, user] = await Promise.all([
    getBlockedDates(villa.id),
    getCurrentUser(),
  ]);

  return (
    <article className="container py-10 md:py-14">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <Badge tone="sand">{villa.location}</Badge>
          <h1 className="mt-3 text-3xl md:text-4xl">{villa.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-brand-700">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} /> {villa.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users size={14} /> Up to {villa.guests} guests
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BedDouble size={14} /> {villa.bedrooms}{" "}
              {villa.bedrooms === 1 ? "bedroom" : "bedrooms"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bath size={14} /> {villa.bathrooms}{" "}
              {villa.bathrooms === 1 ? "bathroom" : "bathrooms"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-brand-900">
            {formatCurrency(villa.price_per_night)}
            <span className="text-base font-normal text-brand-600"> / night</span>
          </div>
        </div>
      </header>

      <ImageGallery images={villa.images} title={villa.title} />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <section>
            <h2 className="text-2xl">About this villa</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-brand-800">
              {villa.description}
            </p>
          </section>

          {villa.amenities.length > 0 ? (
            <section>
              <h2 className="text-2xl">What this place offers</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {villa.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-brand-900"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section id="calendar">
            <h2 className="text-2xl">Availability</h2>
            <p className="mt-2 text-sm text-brand-700">
              Days highlighted in red are already booked or pending confirmation.
            </p>
            <div className="mt-4 max-w-md">
              <AvailabilityCalendar
                blockedRanges={bookings.map((b) => ({
                  start: b.start_date,
                  end: b.end_date,
                }))}
              />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingForm
            villaId={villa.id}
            villaSlug={villa.slug}
            pricePerNight={villa.price_per_night}
            maxGuests={villa.guests}
            isAuthenticated={Boolean(user)}
          />
        </aside>
      </div>
    </article>
  );
}
