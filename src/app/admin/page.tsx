import { CalendarClock, Home, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Dashboard" };

async function getStats() {
  const supabase = await createClient();

  const [{ count: villasCount }, { count: bookingsCount }, { count: pendingCount }, recent] =
    await Promise.all([
      supabase.from("villas").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id, start_date, end_date, status, total_price, villa:villas(title, slug)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    villas: villasCount ?? 0,
    bookings: bookingsCount ?? 0,
    pending: pendingCount ?? 0,
    recent: (recent.data ?? []) as unknown as Array<{
      id: string;
      start_date: string;
      end_date: string;
      status: string;
      total_price: number;
      villa: { title: string; slug: string } | null;
    }>,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: "Villas", value: stats.villas, icon: Home, href: "/admin/villas" },
    { label: "Total bookings", value: stats.bookings, icon: CalendarClock, href: "/admin/bookings" },
    { label: "Pending review", value: stats.pending, icon: Users, href: "/admin/bookings?status=pending" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="chip">Admin</span>
          <h1 className="mt-3 text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-brand-700">
            A snapshot of your villas and incoming bookings.
          </p>
        </div>
        <Button href="/admin/villas/new" size="sm">
          Add villa
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-brand-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                {card.label}
              </span>
              <card.icon size={16} className="text-brand-500" />
            </div>
            <div className="mt-3 text-3xl font-semibold text-brand-900">
              {card.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white shadow-soft">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="text-lg">Latest bookings</h2>
        </div>
        {stats.recent.length === 0 ? (
          <div className="p-8 text-center text-sm text-brand-600">
            No bookings yet.
          </div>
        ) : (
          <ul className="divide-y divide-brand-100">
            {stats.recent.map((booking) => (
              <li
                key={booking.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm"
              >
                <div>
                  <div className="font-medium text-brand-900">
                    {booking.villa?.title ?? "Unknown villa"}
                  </div>
                  <div className="text-xs text-brand-600">
                    {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="capitalize text-brand-700">{booking.status}</span>
                  <span className="font-semibold text-brand-900">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
