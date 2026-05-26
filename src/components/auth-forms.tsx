"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { signInAction, signUpAction } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function action(formData: FormData) {
    setError(null);
    formData.set("redirectTo", redirectTo);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (result && !result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="current-password"
        />
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-brand-700">
        New here?{" "}
        <Link
          href={`/signup${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`}
          className="font-semibold text-brand-700 hover:text-brand-900"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirect") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function action(formData: FormData) {
    setError(null);
    setSuccess(null);
    formData.set("redirectTo", redirectTo);
    startTransition(async () => {
      const result = await signUpAction(formData);
      if (result && !result.ok) {
        setError(result.error);
        return;
      }
      if (result && result.ok) {
        setSuccess(
          "Account created. Check your inbox for a confirmation link, then sign in.",
        );
      }
    });
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          required
          autoComplete="name"
          minLength={2}
        />
      </div>
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-brand-500">
          Minimum 8 characters. Use a mix of letters and numbers.
        </p>
      </div>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-sm text-brand-700">
        Already have an account?{" "}
        <Link
          href={`/login${redirectTo !== "/" ? `?redirect=${redirectTo}` : ""}`}
          className="font-semibold text-brand-700 hover:text-brand-900"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
