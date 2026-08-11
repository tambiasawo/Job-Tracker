import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";
import {
  APPLICATIONS_PAGE_SIZE,
  type Application,
  type PaginatedApplications,
} from "@/lib/applications";

async function loadApplications(
  page = 1,
  limit = APPLICATIONS_PAGE_SIZE,
): Promise<{
  applications: Application[];
  loadError: string | null;
  page: number;
  limit: number;
  total: number;
}> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const response = await fetch(
    `${protocol}://${host}/api/applications?page=${page}&limit=${limit}`, {
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
      page,
      limit,
      total: 0,
    };
  }

  const data = (await response.json()) as PaginatedApplications;

  return {
    applications: data.items,
    loadError: null,
    page: data.page,
    limit: data.limit,
    total: data.total,
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const {
    applications: initialApplications,
    loadError,
    page: initialPage,
    limit: initialLimit,
    total: initialTotal,
  } = await loadApplications();

  return (
    <Suspense fallback={null}>
      <ApplicationsPage
        initialApplications={initialApplications}
        loadError={loadError}
        initialPage={initialPage}
        initialLimit={initialLimit}
        initialTotal={initialTotal}
      />
    </Suspense>
  );
}
