"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AddApplicationModal } from "@/components/applications/AddApplicationModal";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";
import { EditApplicationModal } from "@/components/applications/EditApplicationModal";
import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { authClient } from "@/lib/auth/client";
import { isNewUserSignup } from "@/lib/auth/onboarding";
import { useProfile } from "@/lib/profile/useProfile";
import {
  Application,
  ApplicationStatus,
  STATUS_FILTERS,
  countByStatus,
} from "@/lib/applications";
import { getFilterLabel } from "@/lib/status-styles";

type ApplicationsPageProps = {
  initialApplications: Application[];
  loadError?: string | null;
};

export function ApplicationsPage({
  initialApplications,
  loadError = null,
}: ApplicationsPageProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const showOnboarding = isNewUserSignup(searchParams);
  const { data: session } = authClient.useSession();
  const { updateProfile } = useProfile(session?.user.id);

  const [applications, setApplications] =
    useState<Application[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | "All">(
    "All",
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(showOnboarding);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    if (activeFilter === "All") return applications;
    return applications.filter((app) => app.status === activeFilter);
  }, [applications, activeFilter]);

  function handleApplicationAdded(application: Application) {
    setApplications((current) => [application, ...current]);
  }

  function handleEditApplication(
    id: number,
    updates: Pick<Application, "status" | "date_applied">,
  ) {
    setApplications((current) =>
      current.map((app) => (app.id === id ? { ...app, ...updates } : app)),
    );
  }

  function openEditModal(application: Application) {
    setEditingApplication(application);
    setIsEditModalOpen(true);
  }

  async function handleDeleteApplication(application: Application) {
    const confirmed = window.confirm(
      `Delete "${application.job_title}" at ${application.company_name}?`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        window.alert(result?.message ?? "Failed to delete application.");
        return;
      }

      setApplications((current) =>
        current.filter((app) => app.id !== application.id),
      );
    } catch {
      window.alert("Something went wrong. Try again.");
    }
  }

  function closeOnboarding() {
    setIsOnboardingOpen(false);
    router.replace("/", { scroll: false });
  }

  return (
    <div className="relative flex min-h-screen bg-surface text-on-surface">
      <div
        className={`flex min-h-screen w-full transition-all duration-300 ${
          isOnboardingOpen ? "pointer-events-none blur-[2px]" : ""
        }`}
      >
        <Sidebar
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col md:ml-64">
          <TopBar
            showSearch={false}
            pageTitle="My Applications"
            pageSubtitle="Track and manage your active job searches."
            onMenuClick={() => setMobileNavOpen(true)}
          />

          <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">
            <div className="mx-auto w-full max-w-[1280px]">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                  <MaterialIcon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
                  />
                  <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-body-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] sm:w-auto"
                >
                  <MaterialIcon name="add" className="text-[18px]" />
                  Add Application
                </button>
              </div>

              {loadError ? (
                <div
                  className="mb-6 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-body-sm text-error"
                  role="alert"
                >
                  {loadError}
                </div>
              ) : null}

              <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
                {STATUS_FILTERS.map((status) => {
                  const isActive = activeFilter === status;
                  const label = getFilterLabel(status);
                  const count = countByStatus(applications, status);

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveFilter(status)}
                      className={`shrink-0 rounded-full border px-4 py-2 text-body-sm font-medium transition-all ${
                        isActive
                          ? "border-secondary bg-secondary text-on-secondary shadow-sm"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-secondary/40 hover:bg-surface-container-low"
                      }`}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>

              <ApplicationsTable
                applications={filteredApplications}
                onEdit={openEditModal}
                onDelete={handleDeleteApplication}
              />
            </div>
          </main>
        </div>

        <AddApplicationModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdded={handleApplicationAdded}
        />

        <EditApplicationModal
          open={isEditModalOpen}
          application={editingApplication}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingApplication(null);
          }}
          onSave={handleEditApplication}
        />
      </div>

      <OnboardingModal
        open={isOnboardingOpen}
        onClose={closeOnboarding}
        onSave={({ title, location }) => updateProfile({ title, location })}
      />
    </div>
  );
}
