import { NextRequest, NextResponse } from "next/server";
import { getAuthBearerToken } from "@/lib/api/get-auth-token";
import { getApiBaseUrl } from "@/lib/api/config";
import {
  getBackendUnavailableMessage,
  isBackendFetchError,
} from "@/lib/api/backend-fetch";

export const dynamic = "force-dynamic";

function normalizeDateApplied(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return "";
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthBearerToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const apiBaseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}/applications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        detail?: string;
        message?: string;
      } | null;

      const message =
        response.status === 401 || response.status === 403
          ? "Unauthorized"
          : (errorBody?.detail ??
            errorBody?.message ??
            "Failed to delete application.");

      return NextResponse.json({ message }, { status: response.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        message: isBackendFetchError(error)
          ? getBackendUnavailableMessage()
          : "Something went wrong. Try again",
      },
      { status: 503 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthBearerToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const apiBaseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${apiBaseUrl}/applications/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        detail?: string | { msg: string }[];
        message?: string;
      } | null;

      const message =
        response.status === 401 || response.status === 403
          ? "Unauthorized"
          : typeof errorBody?.detail === "string"
            ? errorBody.detail
            : Array.isArray(errorBody?.detail)
              ? errorBody.detail.map((item) => item.msg).join(", ")
              : (errorBody?.message ?? "Failed to update application.");

      return NextResponse.json({ message }, { status: response.status });
    }

    const updated = (await response.json()) as Record<string, unknown>;

    return NextResponse.json({
      id: updated.id,
      job_title: updated.job_title,
      company_name: updated.company_name,
      industry: updated.industry,
      status: updated.status,
      date_applied: normalizeDateApplied(updated.date_applied),
      job_url: updated.job_url ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: isBackendFetchError(error)
          ? getBackendUnavailableMessage()
          : "Something went wrong. Try again",
      },
      { status: 503 },
    );
  }
}
