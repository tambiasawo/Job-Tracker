import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { OAuthCallbackHandler } from "@/components/auth/OAuthCallbackHandler";

export default function AuthCallbackPage() {
  return (
    <AuthShell
      title="Signing you in"
      subtitle="Completing Google sign-in and opening your dashboard."
    >
      <Suspense
        fallback={
          <p className="text-body-sm text-on-surface-variant">
            Finishing Google sign-in...
          </p>
        }
      >
        <OAuthCallbackHandler />
      </Suspense>
    </AuthShell>
  );
}
