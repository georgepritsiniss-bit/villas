"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { isCurrentUserAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/types";
import { nightsBetween } from "@/lib/utils";

const BookingSchema = z
  .object({
    villaId: z.string().uuid("Invalid villa"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
    guests: z.number().int().min(1, "At least 1 guest").max(50),
    notes: z.string().max(2000).nullable().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Check-out must be after check-in.",
    path: ["endDate"],
  });

export type CreateBookingResult =
  | { ok: true; bookingId: string }
  | { ok: false; error: string };

export async function createBookingAction(input: {
  villaId: string;
  startDate: string;
  endDate: string;
  guests: number;
  notes?: string | null;
}): Promise<CreateBookingResult> {
  const parsed = BookingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid booking data",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to book a villa." };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (parsed.data.startDate < today) {
    return { ok: false, error: "Check-in date cannot be in the past." };
  }

  const { data: villa, error: villaError } = await supabase
    .from("villas")
    .select("id, price_per_night, guests, is_published")
    .eq("id", parsed.data.villaId)
    .maybeSingle();

  if (villaError || !villa) {
    return { ok: false, error: "Villa not found." };
  }
  if (!villa.is_published) {
    return { ok: false, error: "This villa is not currently bookable." };
  }
  if (parsed.data.guests > villa.guests) {
    return {
      ok: false,
      error: `This villa hosts up to ${villa.guests} guests.`,
    };
  }

  // Conflict check: any pending/confirmed booking that overlaps the desired
  // window. Two ranges [a1, a2) and [b1, b2) overlap iff a1 < b2 AND b1 < a2.
  const { data: conflicts, error: conflictError } = await supabase
    .from("bookings")
    .select("id")
    .eq("villa_id", parsed.data.villaId)
    .in("status", ["pending", "confirmed"])
    .lt("start_date", parsed.data.endDate)
    .gt("end_date", parsed.data.startDate)
    .limit(1);

  if (conflictError) {
    console.error("Conflict check failed", conflictError);
    return { ok: false, error: "Could not verify availability. Try again." };
  }
  if (conflicts && conflicts.length > 0) {
    return {
      ok: false,
      error: "Sorry, those dates are no longer available. Try different dates.",
    };
  }

  const nights = nightsBetween(parsed.data.startDate, parsed.data.endDate);
  const totalPrice = nights * villa.price_per_night;

  const { data: created, error: insertError } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      villa_id: parsed.data.villaId,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      guests: parsed.data.guests,
      notes: parsed.data.notes ?? null,
      total_price: totalPrice,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !created) {
    console.error("Insert booking failed", insertError);
    return {
      ok: false,
      error: insertError?.message ?? "Could not create booking.",
    };
  }

  revalidatePath("/account");
  revalidatePath(`/villas/${parsed.data.villaId}`);
  revalidatePath("/admin/bookings");
  return { ok: true, bookingId: created.id };
}

export async function cancelBookingAction(bookingId: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated." };

  const { data: booking, error } = await supabase
    .from("bookings")
    .select("id, user_id, status")
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return { ok: false, error: "Booking not found." };
  }

  const isAdmin = await isCurrentUserAdmin();
  if (booking.user_id !== user.id && !isAdmin) {
    return { ok: false, error: "You don't have permission to cancel this booking." };
  }
  if (booking.status === "cancelled") {
    return { ok: false, error: "This booking is already cancelled." };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", bookingId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  revalidatePath("/account");
  revalidatePath("/admin/bookings");
  return { ok: true };
}

const StatusSchema = z.enum(["pending", "confirmed", "cancelled"]);

export async function updateBookingStatusAction(
  bookingId: string,
  status: BookingStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return { ok: false, error: "Admin only." };
  }
  const parsed = StatusSchema.safeParse(status);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status: parsed.data })
    .eq("id", bookingId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/account");
  return { ok: true };
}
