import { notFound } from "next/navigation";

import { VillaForm } from "@/components/villa-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Edit villa" };
export const dynamic = "force-dynamic";

export default async function EditVillaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: villa, error } = await supabase
    .from("villas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !villa) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Edit villa</h1>
        <p className="mt-1 text-sm text-brand-700">
          Update the details, photos, or availability for {villa.title}.
        </p>
      </div>
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft md:p-8">
        <VillaForm villa={villa} />
      </div>
    </div>
  );
}
