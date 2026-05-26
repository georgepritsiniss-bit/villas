"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export function AdminNav({
  links,
}: {
  links: { href: string; label: string; icon: LucideIcon }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-1 overflow-x-auto md:flex-col">
      {links.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition md:flex-none",
              isActive
                ? "bg-brand-700 text-white shadow-sm"
                : "text-brand-800 hover:bg-brand-50",
            )}
          >
            <link.icon size={16} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
