export default function Loading() {
  return (
    <div className="container py-12 md:py-16">
      <div className="h-8 w-48 animate-pulse rounded-full bg-brand-100" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded-full bg-brand-100" />
      <div className="mt-8 h-24 animate-pulse rounded-2xl bg-white/70 ring-1 ring-brand-100" />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-[4/3] animate-pulse rounded-2xl bg-white/80 ring-1 ring-brand-100"
          />
        ))}
      </div>
    </div>
  );
}
