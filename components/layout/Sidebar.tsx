"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { authClient } from "@/lib/auth/client";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const isApplications = pathname === "/";
  const isProfile = pathname === "/profile";

  const userName = session?.user.name ?? "";
  const userEmail = session?.user.email ?? "";

  async function handleLogout() {
    await authClient.signOut();
    onClose?.();
    router.push("/auth/sign-in");
  }

  const navContent = (
    <>
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
            <MaterialIcon name="work_history" className="text-xl" />
          </div>
          <div>
            <div className="text-headline-md font-semibold leading-tight tracking-tight text-primary">
              CareerPath
            </div>
            <p className="text-body-sm text-on-surface-variant">Job Tracker</p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low md:hidden"
            aria-label="Close menu"
          >
            <MaterialIcon name="close" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
            isApplications
              ? "bg-secondary/10 font-bold text-secondary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
          }`}
        >
          <MaterialIcon name="work" filled={isApplications} />
          <span className="text-body-md">Applications</span>
        </Link>

        <Link
          href="/profile"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 active:scale-[0.98] ${
            isProfile
              ? "bg-secondary/10 font-bold text-secondary shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
          }`}
        >
          <MaterialIcon name="person" filled={isProfile} />
          <span className="text-body-md">Profile</span>
        </Link>
      </div>

      <div className="mt-auto space-y-4 pt-6">
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/50 p-3">
          {isPending ? (
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-outline-variant/40" />
              <div className="h-3 w-32 animate-pulse rounded bg-outline-variant/30" />
            </div>
          ) : (
            <div className="min-w-0 flex flex-col">
              <span className="truncate text-body-sm font-semibold text-primary">
                {userName || "User"}
              </span>
              {userEmail ? (
                <span className="truncate text-xs text-on-surface-variant">
                  {userEmail}
                </span>
              ) : null}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant py-2.5 text-body-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <MaterialIcon name="logout" className="text-[18px]" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      <nav className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 md:flex">
        {navContent}
      </nav>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu backdrop"
          className="fixed inset-0 z-40 bg-primary/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      ) : null}

      <nav
        className={`fixed left-0 top-0 z-50 flex h-screen w-[min(100vw-3rem,18rem)] flex-col border-r border-outline-variant bg-surface-container-lowest px-4 py-6 shadow-2xl transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </nav>
    </>
  );
}
