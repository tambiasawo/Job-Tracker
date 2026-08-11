import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";
import type { Application } from "@/lib/applications";

export const dynamic = "force-dynamic";

async function loadApplications(): Promise<{
  applications: Application[];
  loadError: string | null;
}> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const response = await fetch(`${protocol}://${host}/api/applications`, {
    headers: {
      cookie: headersList.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/auth/sign-in");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    return {
      applications: [],
      loadError: body?.message ?? "Failed to load applications.",
    };
  }

  const applications = (await response.json()) as Application[];

  return { applications, loadError: null };
}

export default async function Home() {
  const { applications: initialApplications, loadError } =
    await loadApplications();

  return (
    <Suspense fallback={null}>
      <ApplicationsPage
        initialApplications={initialApplications}
        loadError={loadError}
      />
    </Suspense>
  );
}
