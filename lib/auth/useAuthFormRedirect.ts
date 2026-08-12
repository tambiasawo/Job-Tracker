"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthActionState } from "@/lib/auth/action-state";

export function useAuthFormRedirect(state: AuthActionState) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!state?.redirectTo) return;

    setIsRedirecting(true);
    router.push(state.redirectTo);
  }, [state, router]);

  return isRedirecting;
}
