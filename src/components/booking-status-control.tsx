"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateBookingStatusAction } from "@/actions/bookings";
import type { BookingStatus } from "@/lib/types";

export function BookingStatusControl({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as BookingStatus;
    setError(null);
    startTransition(async () => {
      const result = await updateBookingStatusAction(bookingId, value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        defaultValue={status}
        onChange={onChange}
        disabled={isPending}
        className="rounded-lg border border-brand-200 bg-white px-2 py-1.5 text-xs font-medium text-brand-800 focus:border-brand-500 focus:outline-none"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
