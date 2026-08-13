const OAUTH_NEXT_PARAM = "next";

export function oauthCallbackUrl(nextPath = "/"): string {
  if (typeof window === "undefined") {
    return "/auth/callback";
  }

  const url = new URL("/auth/callback", window.location.origin);

  if (nextPath && nextPath !== "/") {
    url.searchParams.set(OAUTH_NEXT_PARAM, nextPath);
  }

  return url.href;
}

export function resolveOAuthNextPath(
  searchParams: URLSearchParams,
  fallback = "/",
): string {
  const next = searchParams.get(OAUTH_NEXT_PARAM);

  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}
