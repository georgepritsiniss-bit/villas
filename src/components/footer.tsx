import Link from "next/link";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-white font-display text-lg">
              M
            </span>
            <span className="font-display text-xl text-brand-900">
              {SITE_NAME}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-700">
            {SITE_TAGLINE}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-brand-800">
            <li>
              <Link className="hover:text-brand-600" href="/villas">
                All villas
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-600" href="/about">
                About us
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-600" href="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
            Account
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-brand-800">
            <li>
              <Link className="hover:text-brand-600" href="/login">
                Log in
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-600" href="/signup">
                Create account
              </Link>
            </li>
            <li>
              <Link className="hover:text-brand-600" href="/account">
                My bookings
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-100">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-brand-600 md:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Built with Next.js, Tailwind & Supabase.</p>
        </div>
      </div>
    </footer>
  );
}
