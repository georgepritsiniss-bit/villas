import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Villa } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function VillaCard({ villa }: { villa: Villa }) {
  const cover = villa.images?.[0] ?? "/placeholder-villa.svg";

  return (
    <Link
      href={`/villas/${villa.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
        <Image
          src={cover}
          alt={villa.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="sand">{villa.location}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg leading-snug text-brand-900 group-hover:text-brand-700 transition">
            {villa.title}
          </h3>
          <div className="text-right">
            <div className="text-base font-semibold text-brand-900">
              {formatCurrency(villa.price_per_night)}
            </div>
            <div className="text-xs text-brand-500">per night</div>
          </div>
        </div>

        <p className="line-clamp-2 text-sm text-brand-700">
          {villa.description}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-brand-600">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} /> {villa.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} /> Up to {villa.guests} guests
          </span>
        </div>
      </div>
    </Link>
  );
}
