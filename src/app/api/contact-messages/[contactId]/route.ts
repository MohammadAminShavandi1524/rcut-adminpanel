import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    contactId: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { contactId } = await params;

    const data = await serverApi(
      `/support/contact/${encodeURIComponent(contactId)}`,
      {
        method: "GET",
      },
    );

    return NextResponse.json(data);
  } catch (error: unknown) {
    const apiError = error as {
      body?: unknown;
      status?: number;
    };

    return NextResponse.json(
      {
        error: apiError.body ?? "Internal Server Error",
      },
      {
        status: apiError.status ?? 500,
      },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { contactId } = await params;

    const data = await serverApi(
      `/support/contact/${encodeURIComponent(contactId)}`,
      {
        method: "DELETE",
      },
    );

    return NextResponse.json(
      data ?? {
        success: true,
      },
    );
  } catch (error: unknown) {
    const apiError = error as {
      body?: unknown;
      status?: number;
    };

    return NextResponse.json(
      {
        error: apiError.body ?? "Internal Server Error",
      },
      {
        status: apiError.status ?? 500,
      },
    );
  }
}
