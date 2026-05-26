import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/types";

/**
 * Service-role Supabase client.
 *
 * Only call this from trusted server contexts (server actions, route
 * handlers, server components). It bypasses Row Level Security so it
 * MUST NEVER be exposed to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables.",
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
