const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  account_not_linked:
    "This Google email already has an email and password account. Sign in with your password on the sign-in page, then connect Google from Profile. Or sign up with Google using a different email.",
  access_denied: "Google sign-in was cancelled.",
  oauth_error: "Google sign-in failed. Please try again.",
};

export function resolveOAuthErrorMessage(
  errorCode: string | null,
  fallback = "Google sign-in did not create a session. Please try again.",
): string {
  if (!errorCode) return fallback;

  return OAUTH_ERROR_MESSAGES[errorCode] ?? fallback;
}
