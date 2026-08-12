"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

function noop() {}

export function DashboardLoadingShell() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar mobileOpen={false} onClose={noop} />

      <div className="md:ml-64">
        <TopBar
          showSearch={false}
          pageTitle="My Applications"
          pageSubtitle="Loading your dashboard..."
          onMenuClick={noop}
        />

        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-7xl animate-pulse">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-10 w-full max-w-md rounded-lg bg-surface-container-low" />
              <div className="h-11 w-full rounded-xl bg-surface-container-low sm:w-44" />
            </div>

            <div className="mb-6 flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 w-24 rounded-full bg-surface-container-low"
                />
              ))}
            </div>

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl border border-outline-variant bg-surface-container-lowest"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
