"use client";

import { CalendarCheck2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { createBookingAction } from "@/actions/bookings";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, nightsBetween, todayISO } from "@/lib/utils";

export function BookingForm({
  villaId,
  villaSlug,
  pricePerNight,
  maxGuests,
  isAuthenticated,
}: {
  villaId: string;
  villaSlug: string;
  pricePerNight: number;
  maxGuests: number;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const today = todayISO();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<
    { tone: "success" | "danger"; text: string } | null
  >(null);

  const nights = useMemo(
    () => (startDate && endDate ? nightsBetween(startDate, endDate) : 0),
    [startDate, endDate],
  );
  const total = nights * pricePerNight;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!startDate || !endDate) {
      setMessage({ tone: "danger", text: "Please select check-in and check-out dates." });
      return;
    }
    if (nights <= 0) {
      setMessage({
        tone: "danger",
        text: "Check-out must be after check-in (minimum 1 night).",
      });
      return;
    }
    if (guests < 1 || guests > maxGuests) {
      setMessage({
        tone: "danger",
        text: `Guests must be between 1 and ${maxGuests}.`,
      });
      return;
    }

    setIsPending(true);
    const result = await createBookingAction({
      villaId,
      startDate,
      endDate,
      guests,
      notes: notes.trim() || null,
    });
    setIsPending(false);

    if (result.ok) {
      setMessage({
        tone: "success",
        text: "Booking request sent! Track its status in your account.",
      });
      setStartDate("");
      setEndDate("");
      setNotes("");
      router.refresh();
    } else {
      setMessage({ tone: "danger", text: result.error });
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-semibold text-brand-900">
              {formatCurrency(pricePerNight)}
            </div>
            <div className="text-xs text-brand-500">per night</div>
          </div>
        </div>
        <Alert tone="info" className="mt-4">
          You need an account to request a booking. It only takes a minute.
        </Alert>
        <div className="mt-4 flex flex-col gap-2">
          <Button
            href={`/login?redirect=/villas/${villaSlug}`}
            size="lg"
            className="w-full"
          >
            <LogIn size={16} /> Log in to book
          </Button>
          <Button
            href={`/signup?redirect=/villas/${villaSlug}`}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Create account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-soft"
    >
      <div className="flex items-baseline justify-between">
        <div>
          <div className="text-2xl font-semibold text-brand-900">
            {formatCurrency(pricePerNight)}
          </div>
          <div className="text-xs text-brand-500">per night</div>
        </div>
        <Link
          href="#calendar"
          className="text-xs font-medium text-brand-600 hover:text-brand-800"
        >
          See availability →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-brand-200 p-2">
        <div>
          <Label htmlFor="start-date">Check-in</Label>
          <Input
            id="start-date"
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="end-date">Check-out</Label>
          <Input
            id="end-date"
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          type="number"
          min={1}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
        />
        <p className="mt-1 text-xs text-brand-500">
          This villa hosts up to {maxGuests} guests.
        </p>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know? Arrival time, dietary needs…"
          rows={3}
        />
      </div>

      {nights > 0 ? (
        <div className="space-y-1 rounded-xl bg-brand-50 p-4 text-sm">
          <div className="flex justify-between text-brand-800">
            <span>
              {formatCurrency(pricePerNight)} × {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between border-t border-brand-100 pt-2 text-base font-semibold text-brand-900">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      ) : null}

      {message ? <Alert tone={message.tone}>{message.text}</Alert> : null}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isPending || nights <= 0}
      >
        <CalendarCheck2 size={16} />
        {isPending ? "Requesting…" : "Request booking"}
      </Button>
      <p className="text-center text-xs text-brand-500">
        You won&apos;t be charged yet. The host will confirm availability.
      </p>
    </form>
  );
}
