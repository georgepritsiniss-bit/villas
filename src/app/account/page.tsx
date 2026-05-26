import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CancelBookingButton } from "@/components/cancel-booking-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus, BookingWithVilla } from "@/lib/types";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My bookings",
  description: "View and manage your villa booking requests.",
};

const STATUS_TONES: Record<BookingStatus, "default" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
};

async function getMyBookings(userId: string): Promise<BookingWithVilla[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*, villa:villas(id, title, slug, location, images)`,
    )
    .eq("user_id", userId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Failed to load bookings", error);
    return [];
  }
  return (data ?? []) as unknown as BookingWithVilla[];
}

export default async function AccountPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/account");
  const bookings = await getMyBookings(profile.id);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip">My account</span>
          <h1 className="mt-3 text-3xl md:text-4xl">
            Hello{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-2 text-sm text-brand-700">
            Track your villa booking requests below.
          </p>
        </div>
        <Button href="/villas" variant="outline" size="sm">
          Browse more villas
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/60 p-12 text-center">
          <h2 className="text-xl text-brand-900">No bookings yet</h2>
          <p className="mt-2 text-sm text-brand-700">
            Discover beautiful villas and request your first stay.
          </p>
          <Button href="/villas" className="mt-4">
            Browse villas
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4">
          {bookings.map((booking) => {
            const cover = booking.villa?.images?.[0] ?? "/placeholder-villa.svg";
            const nights = nightsBetween(booking.start_date, booking.end_date);
            return (
              <li
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft"
              >
                <div className="grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-center">
                  <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
                    <Image
                      src={cover}
                      alt={booking.villa?.title ?? "Villa"}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-5 py-4 md:py-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={STATUS_TONES[booking.status]}>
                        {booking.status}
                      </Badge>
                      <span className="text-xs text-brand-600">
                        Requested {formatDate(booking.created_at)}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg">
                      <Link
                        href={`/villas/${booking.villa?.slug ?? ""}`}
                        className="hover:text-brand-700"
                      >
                        {booking.villa?.title ?? "Unknown villa"}
                      </Link>
                    </h3>
                    <p className="text-sm text-brand-600">
                      {booking.villa?.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-brand-800">
                      <span>
                        <strong>{formatDate(booking.start_date)}</strong> →{" "}
                        <strong>{formatDate(booking.end_date)}</strong>
                      </span>
                      <span>
                        {nights} {nights === 1 ? "night" : "nights"} · {booking.guests}{" "}
                        {booking.guests === 1 ? "guest" : "guests"}
                      </span>
                      <span>Total {formatCurrency(booking.total_price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-5 pb-5 md:px-6 md:pb-0">
                    {booking.status !== "cancelled" ? (
                      <CancelBookingButton bookingId={booking.id} />
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
