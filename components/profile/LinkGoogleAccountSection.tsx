"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { oauthCallbackUrl } from "@/lib/auth/oauth-callback";

export function LinkGoogleAccountSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLinkGoogle = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await authClient.linkSocial({
        provider: "google",
        callbackURL: oauthCallbackUrl("/profile"),
      });
    } catch (err) {
      console.error("Link Google error:", err);
      setError("Could not start Google linking. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-6">
      <h3 className="mb-2 text-headline-md font-semibold text-on-surface">
        Sign-in methods
      </h3>
      <p className="mb-4 text-body-sm text-on-surface-variant">
        Connect Google to sign in with Google next time. You must already be
        signed in with email and password to link it.
      </p>

      <button
        type="button"
        onClick={handleLinkGoogle}
        disabled={isLoading}
        className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-70"
      >
        {isLoading ? "Opening Google..." : "Connect Google account"}
      </button>

      {error ? (
        <p className="mt-3 text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
