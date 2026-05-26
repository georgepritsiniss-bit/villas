import type { Metadata } from "next";
import { Suspense } from "react";

import { SignupForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a free account to request bookings.",
};

export default function SignupPage() {
  return (
    <div className="container flex items-center justify-center py-16 md:py-24">
      <div className="w-full max-w-md rounded-3xl border border-brand-100 bg-white p-8 shadow-soft md:p-10">
        <div className="mb-8 text-center">
          <span className="chip">Join us</span>
          <h1 className="mt-3 text-3xl">Create your account</h1>
          <p className="mt-2 text-sm text-brand-700">
            It only takes a minute. No credit card required.
          </p>
        </div>
        <Suspense>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
