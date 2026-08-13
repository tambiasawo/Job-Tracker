import { parseCookies } from "better-auth/cookies";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth/server";

export const NEON_AUTH_SESSION_TOKEN_COOKIE =
  "__Secure-neon-auth.session_token";

function decodeCookieValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function readSessionTokenFromCookies(): Promise<string | null> {
  const headerStore = await headers();
  const cookieHeader = headerStore.get("cookie") ?? "";
  const parsed = parseCookies(cookieHeader);
  const fromHeader = parsed.get(NEON_AUTH_SESSION_TOKEN_COOKIE);

  if (fromHeader) {
    return decodeCookieValue(fromHeader);
  }

  const cookieStore = await cookies();
  const fromStore = cookieStore.get(NEON_AUTH_SESSION_TOKEN_COOKIE)?.value;

  if (fromStore) {
    return decodeCookieValue(fromStore);
  }

  return null;
}

export async function getAuthBearerToken(): Promise<string | null> {
  const { data: session } = await auth.getSession({
    query: { disableCookieCache: "true" },
  });

  if (session?.session?.token) {
    return session.session.token;
  }

  return readSessionTokenFromCookies();
}

export async function hasAuthenticatedSession(): Promise<boolean> {
  if (await getAuthBearerToken()) {
    return true;
  }

  const { data: session } = await auth.getSession();
  return Boolean(session?.session);
}
