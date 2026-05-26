"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteVillaAction } from "@/actions/villas";
import { Button } from "@/components/ui/button";

export function DeleteVillaButton({
  villaId,
  title,
}: {
  villaId: string;
  title: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onClick() {
    if (!confirm(`Delete "${title}"? This will remove the villa and its images.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteVillaAction(villaId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="danger"
        size="sm"
        type="button"
        onClick={onClick}
        disabled={isPending}
      >
        <Trash2 size={14} /> {isPending ? "Deleting…" : "Delete"}
      </Button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
