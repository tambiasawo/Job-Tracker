import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { API_BASE_URL } from "@/lib/api/config";

const getUserSession = async () => {
  const { data: session } = await auth.getSession();
  const token = session?.session.token;
  return { token };
};

export async function GET(req: NextRequest) {
  const term = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!term) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  const { token } = await getUserSession();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/search?q=${encodeURIComponent(term)}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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
            "Failed to search applications.");

      return NextResponse.json({ message }, { status: response.status });
    }

    const data = (await response.json()) as {
      items?: unknown;
      total?: number;
    };

    if (!Array.isArray(data.items)) {
      return NextResponse.json(
        { message: "Invalid search response." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      items: data.items,
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
