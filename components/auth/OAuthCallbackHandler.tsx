"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { resolveOAuthErrorMessage } from "@/lib/auth/oauth-errors";
import { resolveOAuthNextPath } from "@/lib/auth/oauth-callback";

type OAuthCallbackHandlerProps = {
  fallbackPath?: string;
};

/**
 * Completes the Neon Auth OAuth flow after Google redirects back.
 * See https://neon.com/docs/auth/guides/setup-oauth#handle-the-callback
 */
export function OAuthCallbackHandler({
  fallbackPath = "/",
}: OAuthCallbackHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(resolveOAuthErrorMessage(oauthError));
      return;
    }

    let cancelled = false;

    async function completeOAuthSignIn() {
      const { data, error: sessionError } = await authClient.getSession();

      if (cancelled) return;

      if (sessionError) {
        setError(sessionError.message || "Could not finish Google sign-in.");
        return;
      }

      if (data?.session) {
        router.replace(resolveOAuthNextPath(searchParams, fallbackPath));
        router.refresh();
        return;
      }

      setError(
        resolveOAuthErrorMessage(
          null,
          "Google sign-in did not create a session. Please try again.",
        ),
      );
    }

    void completeOAuthSignIn();

    return () => {
      cancelled = true;
    };
  }, [fallbackPath, router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-body-sm text-error" role="alert">
          {error}
        </p>
        <Link
          href="/auth/sign-in"
          className="text-body-sm font-semibold text-secondary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <p className="text-body-sm text-on-surface-variant">
      Finishing Google sign-in...
    </p>
  );
}
