"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInWithEmail } from "@/app/auth/actions";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { newUserDashboardUrl } from "@/lib/auth/onboarding";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track your applications and manage your job search."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-secondary hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <GoogleSignInButton
            callbackURL="/"
            newUserCallbackURL={newUserDashboardUrl()}
          />
        </div>

        <AuthDivider />

        <form action={formAction} className="flex flex-col gap-4">
          <AuthField
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <AuthField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />

          {state?.error ? (
            <div
              className="rounded-lg border border-error/20 bg-error-container px-3 py-2 text-body-sm text-error"
              role="alert"
            >
              {state.error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-body-sm font-semibold text-on-primary transition-all hover:bg-primary/90 disabled:opacity-70"
          >
            {isPending ? (
              "Signing in..."
            ) : (
              <>
                Sign in
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </>
            )}
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
