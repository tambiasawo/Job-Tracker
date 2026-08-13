import { auth } from "@/lib/auth/server";

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // OAuth callback must run middleware so verifier exchange can set cookies.
    "/auth/callback",
    // Protected routes requiring authentication
    "/",
    "/profile",
  ],
};
