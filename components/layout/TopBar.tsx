"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useTheme } from "@/components/providers/ThemeProvider";

type TopBarProps = {
  showSearch?: boolean;
  title?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  onMenuClick?: () => void;
};

export function TopBar({
  showSearch = true,
  title,
  pageTitle,
  pageSubtitle,
  onMenuClick,
}: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const mobileTitle = pageTitle ?? title ?? "CareerPath";

  return (
    <header className="sticky top-0 z-20 flex min-h-16 w-full items-center justify-between gap-4 border-b border-outline-variant/80 bg-surface/90 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary md:hidden"
            aria-label="Open menu"
          >
            <MaterialIcon name="menu" />
          </button>
        ) : null}

        {pageTitle ? (
          <div className="min-w-0">
            <h1 className="truncate text-headline-md font-bold text-on-surface md:text-display-lg-mobile">
              {pageTitle}
            </h1>
            {pageSubtitle ? (
              <p className="hidden truncate text-body-sm text-on-surface-variant sm:block">
                {pageSubtitle}
              </p>
            ) : null}
          </div>
        ) : (
          <h1 className="text-headline-md font-semibold text-on-surface md:hidden">
            {mobileTitle}
          </h1>
        )}
      </div>

      {showSearch ? (
        <div className="ml-auto hidden max-w-md flex-1 md:flex">
          <div className="relative w-full">
            <MaterialIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </div>
        </div>
      ) : (
        <div className="hidden flex-1 md:block" />
      )}

      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        {showSearch ? (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary md:hidden"
            aria-label="Search"
          >
            <MaterialIcon name="search" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          <MaterialIcon
            name={theme === "light" ? "dark_mode" : "light_mode"}
            className="size-5"
          />
        </button>

        <Link
          href="/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-secondary"
          aria-label="Go to profile"
        >
          <MaterialIcon name="person" />
        </Link>
      </div>
    </header>
  );
}
