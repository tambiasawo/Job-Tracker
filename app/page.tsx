import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApplicationsPage } from "@/components/applications/ApplicationsPage";
import {
  APPLICATIONS_PAGE_SIZE,
  type Application,
  type PaginatedApplications,
} from "@/lib/applications";

async function getRequestContext() {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const cookie = headersList.get("cookie") ?? "";

  return { host, protocol, cookie };
}

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
  const { host, protocol, cookie } = await getRequestContext();

  const response = await fetch(
    `${protocol}://${host}/api/applications?page=${page}&limit=${limit}`,
    {
      headers: { cookie },
      cache: "no-store",
    },
  );

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

async function loadSearchResults(q: string): Promise<{
  applications: Application[];
  loadError: string | null;
  total: number;
}> {
  const { host, protocol, cookie } = await getRequestContext();

  const response = await fetch(
    `${protocol}://${host}/api/applications/search?q=${encodeURIComponent(q)}`,
    {
      headers: { cookie },
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    redirect("/auth/sign-in");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    return {
      applications: [],
      loadError: body?.message ?? "Failed to search applications.",
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
      <Suspense fallback={null}>
        <ApplicationsPage
          key={`search-${searchQuery}`}
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
    <Suspense fallback={null}>
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
