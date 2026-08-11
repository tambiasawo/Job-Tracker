import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";
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
  const { data: session } = await auth.getSession();
  const token = session?.session.token;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
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
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Try again" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { data: session } = await auth.getSession();
  const token = session?.session.token;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
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
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Try again" },
      { status: 500 },
    );
  }
}
