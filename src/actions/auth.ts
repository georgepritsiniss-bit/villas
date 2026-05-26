"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils";

const EmailPassword = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  redirectTo: z.string().optional(),
});

const SignUpSchema = EmailPassword.extend({
  fullName: z.string().trim().min(2, "Please enter your name").max(120),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signInAction(formData: FormData): Promise<ActionResult> {
  const parsed = EmailPassword.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo")?.toString() || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  redirect(safeRedirect(parsed.data.redirectTo));
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const parsed = SignUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo")?.toString() || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });
  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeRedirect(parsed.data.redirectTo));
  }

  return { ok: true };
}

function safeRedirect(input?: string) {
  if (!input) return "/";
  if (!input.startsWith("/") || input.startsWith("//")) return "/";
  return input;
}
