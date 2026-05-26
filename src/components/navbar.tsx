import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";
import { getCurrentProfile, isCurrentUserAdmin } from "@/lib/auth";
import { MobileMenu } from "@/components/mobile-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/villas", label: "Villas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export async function Navbar() {
  const profile = await getCurrentProfile();
  const isAdmin = await isCurrentUserAdmin();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100/60 bg-sand-50/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-white font-display text-lg">
            M
          </span>
          <span className="font-display text-xl tracking-tight text-brand-900 group-hover:text-brand-700 transition">
            {SITE_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-50"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin ? (
            <Link
              href="/admin"
              className="rounded-full px-4 py-2 text-sm font-medium text-sand-500 transition hover:bg-sand-100"
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {profile ? (
            <>
              <Button href="/account" variant="ghost" size="sm">
                My bookings
              </Button>
              <form action="/auth/signout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/signup" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>

        <MobileMenu isAuthenticated={Boolean(profile)} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
