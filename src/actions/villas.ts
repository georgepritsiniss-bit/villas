"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isCurrentUserAdmin } from "@/lib/auth";
import { VILLA_IMAGES_BUCKET } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const VillaSchema = z.object({
  title: z.string().trim().min(2, "Title is too short").max(120),
  description: z.string().trim().min(20, "Description is too short").max(8000),
  location: z.string().trim().min(2, "Location is required").max(120),
  pricePerNight: z.coerce.number().int().min(1, "Price must be at least $1"),
  guests: z.coerce.number().int().min(1, "Must host at least 1 guest").max(50),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, "Please upload at least one image"),
  isPublished: z.boolean().default(true),
});

type SaveResult = { ok: true; id: string; slug: string } | { ok: false; error: string };

async function requireAdmin() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    throw new Error("Forbidden: admin only");
  }
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const supabase = await createClient();
  const baseSlug = slugify(base) || "villa";
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    let query = supabase.from("villas").select("id").eq("slug", candidate).limit(1);
    if (ignoreId) {
      query = query.neq("id", ignoreId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
    candidate = `${baseSlug}-${counter++}`;
  }
}

function parsePayload(formData: FormData) {
  return VillaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
    pricePerNight: formData.get("pricePerNight"),
    guests: formData.get("guests"),
    bedrooms: formData.get("bedrooms") ?? 0,
    bathrooms: formData.get("bathrooms") ?? 0,
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    images: JSON.parse((formData.get("images") as string) || "[]"),
    isPublished: formData.get("isPublished") === "true",
  });
}

export async function createVillaAction(formData: FormData): Promise<SaveResult> {
  await requireAdmin();
  const parsed = parsePayload(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const slug = await uniqueSlug(parsed.data.title);

  const { data, error } = await supabase
    .from("villas")
    .insert({
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      price_per_night: parsed.data.pricePerNight,
      guests: parsed.data.guests,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      amenities: parsed.data.amenities,
      images: parsed.data.images,
      is_published: parsed.data.isPublished,
    })
    .select("id, slug")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create villa." };
  }

  revalidatePath("/villas");
  revalidatePath("/");
  revalidatePath("/admin/villas");
  redirect("/admin/villas");
}

export async function updateVillaAction(
  villaId: string,
  formData: FormData,
): Promise<SaveResult> {
  await requireAdmin();
  const parsed = parsePayload(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const slug = await uniqueSlug(parsed.data.title, villaId);

  const { error } = await supabase
    .from("villas")
    .update({
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      location: parsed.data.location,
      price_per_night: parsed.data.pricePerNight,
      guests: parsed.data.guests,
      bedrooms: parsed.data.bedrooms,
      bathrooms: parsed.data.bathrooms,
      amenities: parsed.data.amenities,
      images: parsed.data.images,
      is_published: parsed.data.isPublished,
      updated_at: new Date().toISOString(),
    })
    .eq("id", villaId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/villas");
  revalidatePath(`/villas/${slug}`);
  revalidatePath("/admin/villas");
  revalidatePath("/");
  redirect("/admin/villas");
}

export async function deleteVillaAction(villaId: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: villa, error: lookupError } = await supabase
    .from("villas")
    .select("images")
    .eq("id", villaId)
    .maybeSingle();
  if (lookupError) {
    return { ok: false, error: lookupError.message };
  }

  const { error } = await supabase.from("villas").delete().eq("id", villaId);
  if (error) {
    return { ok: false, error: error.message };
  }

  // Best-effort cleanup of storage objects.
  try {
    if (villa?.images?.length) {
      const admin = createAdminClient();
      const paths = villa.images
        .map((url) => extractStoragePath(url))
        .filter((path): path is string => Boolean(path));
      if (paths.length > 0) {
        await admin.storage.from(VILLA_IMAGES_BUCKET).remove(paths);
      }
    }
  } catch (cleanupError) {
    console.warn("Image cleanup failed", cleanupError);
  }

  revalidatePath("/villas");
  revalidatePath("/admin/villas");
  revalidatePath("/");
  return { ok: true };
}

function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${VILLA_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
