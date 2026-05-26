export default function Loading() {
  return (
    <div className="container py-10 md:py-14">
      <div className="h-6 w-32 animate-pulse rounded-full bg-brand-100" />
      <div className="mt-3 h-10 w-2/3 animate-pulse rounded-full bg-brand-100" />
      <div className="mt-6 h-[420px] animate-pulse rounded-2xl bg-white/70 md:h-[520px]" />
      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-4 w-1/3 animate-pulse rounded-full bg-brand-100" />
          <div className="h-4 w-full animate-pulse rounded-full bg-brand-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-brand-100" />
        </div>
        <div className="h-[400px] animate-pulse rounded-2xl bg-white/70" />
      </div>
    </div>
  );
}
