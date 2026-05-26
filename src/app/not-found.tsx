import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="chip">404</span>
      <h1 className="text-3xl">We couldn&apos;t find that page.</h1>
      <p className="max-w-md text-sm text-brand-700">
        The villa or page you&apos;re looking for might have been moved or removed.
      </p>
      <div className="mt-2 flex gap-2">
        <Button href="/villas">Browse villas</Button>
        <Button href="/" variant="outline">
          Go home
        </Button>
      </div>
    </div>
  );
}
