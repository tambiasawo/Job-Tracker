"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpWithEmail } from "@/app/auth/actions";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell } from "@/components/auth/AuthShell";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useAuthFormRedirect } from "@/lib/auth/useAuthFormRedirect";

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);
  const isRedirecting = useAuthFormRedirect(state);
  const isBusy = isPending || isRedirecting;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get started in under a minute. Just the essentials — you can add more later."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-secondary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" action={formAction}>
        <AuthField
          label="Full name"
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          required
        />

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
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

        <p className="text-body-sm text-on-surface-variant">
          By creating an account, you agree to use CareerPath for tracking your
          own job applications.
        </p>

        <button
          type="submit"
          disabled={isBusy}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-body-sm font-semibold text-on-primary transition-all hover:bg-primary/90 disabled:opacity-70"
        >
          {isPending ? (
            "Creating account..."
          ) : isRedirecting ? (
            "Opening dashboard..."
          ) : (
            <>
              Create account
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
