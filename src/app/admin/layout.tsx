import { CalendarRange, Home, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { getCurrentProfile, isCurrentUserAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/villas", label: "Villas", icon: ListChecks },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarRange },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect("/?error=forbidden");
  }

  // Keep the DB flag in sync with `ADMIN_EMAILS` so storage RLS
  // (which checks profile.is_admin) lets uploads through.
  const profile = await getCurrentProfile();
  if (profile && !profile.is_admin) {
    try {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", profile.id);
    } catch (error) {
      console.warn("Could not promote admin profile flag", error);
    }
  }

  return (
    <div className="container grid gap-8 py-10 md:grid-cols-[220px_1fr] md:py-14">
      <aside className="space-y-2">
        <div className="rounded-2xl border border-brand-100 bg-white p-2 shadow-soft">
          <AdminNav links={links} />
        </div>
      </aside>
      <section>{children}</section>
    </div>
  );
}
