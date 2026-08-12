import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { API_BASE_URL } from "@/lib/api/config";

function normalizeDateApplied(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return "";
}

const getUserSession = async () => {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  const token = session?.session.token;
  return { userId, token };
};
export async function GET(req: NextRequest) {
  const { token } = await getUserSession();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const page = req.nextUrl.searchParams.get("page") ?? "1";
  const limit = req.nextUrl.searchParams.get("limit") ?? "10";

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/?limit=${limit}&page=${page}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const message =
        response.status === 401 || response.status === 403
          ? "Unauthorized"
          : "Failed to load applications.";

      return NextResponse.json({ message }, { status: response.status });
    }

    const data = (await response.json()) as {
      items?: unknown;
      page?: number;
      limit?: number;
      total?: number;
    };

    if (!Array.isArray(data.items)) {
      return NextResponse.json(
        { message: "Invalid applications response." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      items: data.items,
      page: data.page ?? Number(page),
      limit: data.limit ?? Number(limit),
      total: data.total ?? data.items.length,
    });
  } catch (error) {
    console.error(
      error instanceof Error
        ? error.message
        : "Something went wrong. Try again",
    );

    return NextResponse.json(
      { message: "Something went wrong. Try again" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { token } = await getUserSession();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        detail?: string;
        message?: string;
      } | null;
      console.log({ response });
      const message =
        response.status === 401 || response.status === 403
          ? "Unauthorized"
          : (errorBody?.detail ??
            errorBody?.message ??
            "Failed to save application.");

      return NextResponse.json({ message }, { status: response.status });
    }

    const created = (await response.json()) as {
      id: number;
      created_at: string;
    };

    return NextResponse.json(
      {
        id: created.id,
        job_title: body.job_title,
        company_name: body.company_name,
        industry: body.industry,
        status: body.status,
        date_applied: normalizeDateApplied(body.date_applied),
        job_url: body.job_url ?? null,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Try again" },
      { status: 500 },
    );
  }
}
