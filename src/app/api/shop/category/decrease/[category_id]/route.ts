import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{ category_id: string }>;
}

export async function PATCH(_request: Request, { params }: RouteContext) {
  try {
    const { category_id } = await params;

    const data = await serverApi(`/shop/category/decrease/${category_id}`, {
      method: "PATCH",
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
