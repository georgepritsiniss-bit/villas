import { PenLine, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { DeleteVillaButton } from "@/components/delete-villa-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin · Villas" };
export const dynamic = "force-dynamic";

async function getVillas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}

export default async function AdminVillasPage() {
  const villas = await getVillas();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl">Villas</h1>
          <p className="mt-1 text-sm text-brand-700">
            Manage the properties shown to your guests.
          </p>
        </div>
        <Button href="/admin/villas/new" size="sm">
          <Plus size={14} /> Add villa
        </Button>
      </div>

      {villas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-200 bg-white/60 p-12 text-center">
          <h2 className="text-xl">No villas yet</h2>
          <p className="mt-2 text-sm text-brand-700">
            Add your first villa to start accepting bookings.
          </p>
          <Button href="/admin/villas/new" className="mt-4" size="sm">
            <Plus size={14} /> Add villa
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3">
          {villas.map((villa) => (
            <li
              key={villa.id}
              className="grid items-center gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-soft md:grid-cols-[100px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-100">
                {villa.images?.[0] ? (
                  <Image
                    src={villa.images[0]}
                    alt={villa.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg">{villa.title}</h3>
                  {villa.is_published ? (
                    <Badge tone="success">Published</Badge>
                  ) : (
                    <Badge tone="warning">Draft</Badge>
                  )}
                </div>
                <p className="text-sm text-brand-600">
                  {villa.location} · Up to {villa.guests} guests ·{" "}
                  {formatCurrency(villa.price_per_night)}/night
                </p>
                <p className="mt-1 text-xs text-brand-500">
                  Updated {formatDate(villa.updated_at)}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/villas/${villa.slug}`}
                  className="text-sm font-medium text-brand-700 hover:text-brand-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </Link>
                <Button
                  href={`/admin/villas/${villa.id}/edit`}
                  variant="outline"
                  size="sm"
                >
                  <PenLine size={14} /> Edit
                </Button>
                <DeleteVillaButton villaId={villa.id} title={villa.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
