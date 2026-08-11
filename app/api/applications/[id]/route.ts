import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

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
