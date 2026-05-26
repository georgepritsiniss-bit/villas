"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl">Something went wrong.</h1>
      <p className="max-w-md text-sm text-brand-700">
        An unexpected error occurred. Try refreshing the page, or come back in
        a moment.
      </p>
      {error.digest ? (
        <code className="rounded bg-brand-50 px-2 py-1 text-xs text-brand-600">
          {error.digest}
        </code>
      ) : null}
      <div className="mt-2 flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="outline">
          Go home
        </Button>
      </div>
    </div>
  );
}
