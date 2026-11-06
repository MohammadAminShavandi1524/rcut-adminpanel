import { NextResponse } from "next/server";
import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{ brand_id: string }>;
}

export async function PATCH(
  _request: Request,
  { params }: RouteContext,
) {
  const { brand_id } = await params;
  const id = Number(brand_id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return NextResponse.json(
      { detail: "شناسه برند معتبر نیست." },
      { status: 400 },
    );
  }

  try {
    const data = await serverApi(`/shop/brand/decrease/${id}`, {
      method: "PATCH",
      cache: "no-store",
    });

    return NextResponse.json(data ?? { success: true });
  } catch (error: unknown) {
    const apiError = error as {
      status?: number;
      body?: unknown;
    };

    return NextResponse.json(
      { detail: apiError.body ?? "Internal Server Error" },
      { status: apiError.status ?? 500 },
    );
  }
}