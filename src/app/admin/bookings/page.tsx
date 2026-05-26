import Link from "next/link";

import { BookingStatusControl } from "@/components/booking-status-control";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types";
import { formatCurrency, formatDate, nightsBetween } from "@/lib/utils";

export const metadata = { title: "Admin · Bookings" };
export const dynamic = "force-dynamic";

const STATUS_TONES: Record<BookingStatus, "default" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "success",
  cancelled: "danger",
};

type SearchParams = { status?: string };

type AdminBookingRow = {
  id: string;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  villa_id: string;
  villas: { id: string; title: string; slug: string; location: string } | null;
};

async function getBookings(status?: BookingStatus | null) {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select(
      `id, start_date, end_date, guests, total_price, status, notes, created_at, villa_id, user_id,
       villas(id, title, slug, location)`,
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to load admin bookings", error);
    return { rows: [] as AdminBookingRow[], profiles: new Map<string, { email: string | null; full_name: string | null }>() };
  }

  const rows = (data ?? []) as unknown as (AdminBookingRow & { user_id: string })[];

  const userIds = Array.from(
    new Set(
      rows
        .map((row) => (row as unknown as { user_id?: string }).user_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const profileMap = new Map<string, { email: string | null; full_name: string | null }>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);
    for (const profile of profiles ?? []) {
      profileMap.set(profile.id, {
        email: profile.email,
        full_name: profile.full_name,
      });
    }
  }

  return { rows, profiles: profileMap };
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status } = await searchParams;
  const filter: BookingStatus | null =
    status === "pending" || status === "confirmed" || status === "cancelled"
      ? status
      : null;

  const { rows, profiles } = await getBookings(filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Bookings</h1>
          <p className="mt-1 text-sm text-brand-700">
            Review and approve booking requests.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {(
            [
              { value: null, label: "All" },
              { value: "pending" as const, label: "Pending" },
              { value: "confirmed" as const, label: "Confirmed" },
              { value: "cancelled" as const, label: "Cancelled" },
            ] satisfies { value: BookingStatus | null; label: string }[]
          ).map((option) => {
            const isActive = (option.value ?? null) === filter;
            const href = option.value
              ? `/admin/bookings?status=${option.value}`
              : "/admin/bookings";
            return (
              <Link
                key={option.label}
                href={href}
                className={
                  isActive
                    ? "rounded-full bg-brand-700 px-3 py-1.5 text-white"
                    : "rounded-full border border-brand-200 bg-white px-3 py-1.5 text-brand-700 hover:bg-brand-50"
                }
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/60 p-12 text-center">
          <p className="text-sm text-brand-700">
            No bookings here yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs font-semibold uppercase tracking-wider text-brand-700">
              <tr>
                <th className="px-4 py-3">Villa</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Dates</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {rows.map((row) => {
                const profile = profiles.get(
                  (row as unknown as { user_id: string }).user_id,
                );
                const nights = nightsBetween(row.start_date, row.end_date);
                return (
                  <tr key={row.id} className="align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-brand-900">
                        {row.villas?.title ?? "Unknown villa"}
                      </div>
                      <div className="text-xs text-brand-600">
                        {row.villas?.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-800">
                      <div className="font-medium">
                        {profile?.full_name ?? "Guest"}
                      </div>
                      <div className="text-xs text-brand-600">
                        {profile?.email ?? "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-800">
                      {formatDate(row.start_date)} →{" "}
                      {formatDate(row.end_date)}
                      <div className="text-xs text-brand-600">
                        {nights} {nights === 1 ? "night" : "nights"} ·{" "}
                        {row.guests} guests
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-900">
                      {formatCurrency(row.total_price)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONES[row.status]}>{row.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <BookingStatusControl
                        bookingId={row.id}
                        status={row.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
