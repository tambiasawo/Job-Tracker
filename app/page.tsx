import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardLoadingShell } from "@/components/layout/DashboardLoadingShell";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";
import {
  APPLICATIONS_PAGE_SIZE,
  type Application,
  type PaginatedApplications,
} from "@/lib/applications";
import { getAuthBearerToken } from "@/lib/api/get-auth-token";
import { getApiBaseUrl } from "@/lib/api/config";
import {
  getBackendUnavailableMessage,
  isBackendFetchError,
} from "@/lib/api/backend-fetch";

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
  const token = await getAuthBearerToken();

  if (!token) {
    redirect("/auth/sign-in");
  }

  let response: Response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}/applications/?limit=${limit}&page=${page}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    return {
      applications: [],
      loadError: isBackendFetchError(error)
        ? getBackendUnavailableMessage()
        : "Something went wrong. Try again.",
      page,
      limit,
      total: 0,
    };
  }

  if (response.status === 401 || response.status === 403) {
    redirect("/auth/sign-in");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      detail?: string;
    } | null;

    return {
      applications: [],
      loadError:
        body?.message ?? body?.detail ?? "Failed to load applications.",
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

async function loadSearchResults(q: string): Promise<{
  applications: Application[];
  loadError: string | null;
  total: number;
}> {
  const token = await getAuthBearerToken();

  if (!token) {
    redirect("/auth/sign-in");
  }

  let response: Response;

  try {
    response = await fetch(
      `${getApiBaseUrl()}/applications/search?q=${encodeURIComponent(q)}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    return {
      applications: [],
      loadError: isBackendFetchError(error)
        ? getBackendUnavailableMessage()
        : "Something went wrong. Try again.",
      total: 0,
    };
  }

  if (response.status === 401 || response.status === 403) {
    redirect("/auth/sign-in");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
      detail?: string;
    } | null;

    return {
      applications: [],
      loadError:
        body?.message ?? body?.detail ?? "Failed to search applications.",
      total: 0,
    };
  }

  const data = (await response.json()) as { items: Application[]; total: number };

  return {
    applications: data.items,
    loadError: null,
    total: data.total,
  };
}

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { q: rawQuery } = await searchParams;
  const searchQuery = rawQuery?.trim() ?? "";

  if (searchQuery) {
    const {
      applications: initialApplications,
      loadError,
      total: initialTotal,
    } = await loadSearchResults(searchQuery);

    return (
      <Suspense fallback={<DashboardLoadingShell />}>
        <ApplicationsPage
          initialApplications={initialApplications}
          loadError={loadError}
          initialPage={1}
          initialLimit={APPLICATIONS_PAGE_SIZE}
          initialTotal={initialTotal}
          initialSearchQuery={searchQuery}
          isSearchActive
        />
      </Suspense>
    );
  }

  const {
    applications: initialApplications,
    loadError,
    page: initialPage,
    limit: initialLimit,
    total: initialTotal,
  } = await loadApplications();

  return (
    <Suspense fallback={<DashboardLoadingShell />}>
      <ApplicationsPage
        key="list"
        initialApplications={initialApplications}
        loadError={loadError}
        initialPage={initialPage}
        initialLimit={initialLimit}
        initialTotal={initialTotal}
        initialSearchQuery=""
        isSearchActive={false}
      />
    </Suspense>
  );
}
