import { VillaForm } from "@/components/villa-form";

export const metadata = { title: "Admin · New villa" };

export default function NewVillaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Add a new villa</h1>
        <p className="mt-1 text-sm text-brand-700">
          Fill in the details below. You can save and publish it instantly, or
          keep it as a draft.
        </p>
      </div>
      <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-soft md:p-8">
        <VillaForm />
      </div>
    </div>
  );
}
