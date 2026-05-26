"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/villas", label: "Villas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileMenu({
  isAuthenticated,
  isAdmin,
}: {
  isAuthenticated: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-brand-200 bg-white text-brand-800"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-30 origin-top transform border-b border-brand-100 bg-sand-50 shadow-soft transition",
          open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0",
        )}
      >
        <div className="container flex flex-col gap-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-base font-medium text-sand-500 hover:bg-sand-100"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>
          ) : null}
          <div className="my-2 h-px bg-brand-100" />
          {isAuthenticated ? (
            <>
              <Link
                href="/account"
                className="rounded-lg px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                My bookings
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="w-full rounded-lg px-3 py-2 text-left text-base font-medium text-brand-900 hover:bg-brand-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-base font-medium text-brand-900 hover:bg-brand-50"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-brand-700 px-3 py-2 text-center text-base font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
