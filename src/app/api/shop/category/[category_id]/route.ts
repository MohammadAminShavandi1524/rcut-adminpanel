import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{ category_id: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { category_id } = await params;

    const data = await serverApi(`/shop/category/${category_id}`, {
      method: "GET",
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const apiError = error as {
      body?: unknown;
      status?: number;
    };

    return NextResponse.json(
      { error: apiError.body ?? "Internal Server Error" },
      { status: apiError.status ?? 500 },
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { category_id } = await params;
    const body = await request.json();

    const data = await serverApi(`/shop/category/${category_id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    const apiError = error as {
      body?: unknown;
      status?: number;
    };

    return NextResponse.json(
      { error: apiError.body ?? "Internal Server Error" },
      { status: apiError.status ?? 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { category_id } = await params;

    const data = await serverApi(`/shop/category/${category_id}`, {
      method: "DELETE",
    });

    return NextResponse.json(data ?? { success: true });
  } catch (error: unknown) {
    const apiError = error as {
      body?: unknown;
      status?: number;
    };

    return NextResponse.json(
      { error: apiError.body ?? "Internal Server Error" },
      { status: apiError.status ?? 500 },
    );
  }
}
