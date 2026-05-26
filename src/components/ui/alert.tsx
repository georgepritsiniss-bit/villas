import * as React from "react";

import { cn } from "@/lib/utils";

const tones = {
  info: "bg-brand-50 text-brand-800 ring-brand-100",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  warning: "bg-amber-50 text-amber-800 ring-amber-100",
  danger: "bg-red-50 text-red-800 ring-red-100",
} as const;

export function Alert({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: keyof typeof tones;
  title?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl px-4 py-3 text-sm ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {title ? <div className="mb-1 font-semibold">{title}</div> : null}
      {children ? <div className="leading-relaxed">{children}</div> : null}
    </div>
  );
}
