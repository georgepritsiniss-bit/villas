import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage your bookings and favorites.",
};

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-soft md:p-10">
        <div className="mb-8 text-center">
          <span className="chip">Welcome back</span>
          <h1 className="mt-3 text-3xl">Sign in to your account</h1>
          <p className="mt-2 text-sm text-brand-700">
            Manage your bookings and favorite villas.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
