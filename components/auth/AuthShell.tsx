import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex flex-col items-center gap-3 text-center transition-opacity hover:opacity-80"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
            <MaterialIcon name="work_history" className="text-xl" />
          </div>
          <div>
            <div className="text-headline-md font-semibold leading-tight text-primary">
              CareerPath
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Job application tracker
            </p>
          </div>
        </Link>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-lg sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-display-lg-mobile font-bold text-primary sm:text-headline-md">
              {title}
            </h1>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              {subtitle}
            </p>
          </div>

          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-body-sm text-on-surface-variant">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
