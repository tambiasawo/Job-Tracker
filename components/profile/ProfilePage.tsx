"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { DeleteAccountSection } from "@/components/profile/DeleteAccountSection";
import { LinkGoogleAccountSection } from "@/components/profile/LinkGoogleAccountSection";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { OverviewCard } from "@/components/profile/OverviewCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { authClient } from "@/lib/auth/client";
import {
  Application,
  INITIAL_APPLICATIONS,
} from "@/lib/applications";
import { useProfile } from "@/lib/profile/useProfile";

function countStatus(applications: Application[], status: string) {
  return applications.filter((app) => app.status === status).length;
}

export function ProfilePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const userId = session?.user.id;
  const { profile, updateProfile } = useProfile(userId);

  const stats = useMemo(
    () => ({
      total: INITIAL_APPLICATIONS.length,
      interviews: countStatus(INITIAL_APPLICATIONS, "Interviewing"),
      offers: countStatus(INITIAL_APPLICATIONS, "Offer"),
    }),
    [],
  );

  const userName = session?.user.name ?? "";
  const userEmail = session?.user.email ?? "";

  return (
    <div className="min-h-screen bg-background text-on-background antialiased selection:bg-secondary-container selection:text-on-secondary">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="md:ml-64">
        <TopBar
          showSearch={false}
          pageTitle="Profile"
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main className="mx-auto min-h-screen max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-8">
            <section className="relative flex flex-col items-start gap-6 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-6 md:flex-row md:items-center">
              <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-bl-full bg-gradient-to-br from-secondary/10 to-transparent sm:h-64 sm:w-64" />

              <div className="z-10 flex-1">
                {isSessionPending ? (
                  <div className="space-y-3">
                    <div className="h-8 w-48 animate-pulse rounded bg-outline-variant/40" />
                    <div className="h-5 w-56 animate-pulse rounded bg-outline-variant/30" />
                  </div>
                ) : (
                  <>
                    <h2 className="mb-1 text-display-lg-mobile font-bold tracking-tight text-on-surface sm:text-display-lg">
                      {userName || "User"}
                    </h2>
                    {userEmail ? (
                      <p className="mb-4 text-body-md text-on-surface-variant">
                        {userEmail}
                      </p>
                    ) : null}
                    {(profile.location || profile.title) && (
                      <div className="flex flex-wrap gap-2">
                        {profile.location ? (
                          <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-label-caps font-semibold uppercase tracking-wider text-secondary">
                            <MaterialIcon
                              name="location_on"
                              className="text-[14px]"
                            />
                            {profile.location}
                          </span>
                        ) : null}
                        {profile.title ? (
                          <span className="flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1 text-label-caps font-semibold uppercase tracking-wider text-on-surface-variant">
                            <MaterialIcon name="work" className="text-[14px]" />
                            {profile.title}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="z-10 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full rounded-xl border border-outline-variant px-4 py-2.5 text-body-sm text-on-surface transition-colors hover:bg-surface-container-low md:w-auto"
                >
                  Edit Profile
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-headline-md font-semibold text-on-surface">
                    <MaterialIcon name="info" className="text-secondary" />
                    Professional Bio
                  </h3>
                  {profile.bio ? (
                    <p className="text-body-sm leading-relaxed text-on-surface-variant">
                      {profile.bio}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="lg:col-span-2">
                <OverviewCard stats={stats} />
              </div>
            </div>

            <DeleteAccountSection userId={userId} />

            <LinkGoogleAccountSection />
          </div>
        </main>
      </div>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={updateProfile}
        initialProfile={profile}
        userName={userName}
        userEmail={userEmail}
      />
    </div>
  );
}
