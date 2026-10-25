import { NextResponse } from "next/server";
import { z } from "zod";

import { serverApi } from "@/lib/server-api";

const payloadSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  image: z.url(),
  category_id: z.number().int().positive(),
});

function handleApiError(error: unknown) {
  const apiError = error as {
    body?: unknown;
    status?: number;
  };

  let detail: unknown = apiError.body ?? "Internal Server Error";

  if (typeof detail === "string") {
    try {
      detail = JSON.parse(detail);
    } catch {
      // Keep original error text.
    }
  }

  return NextResponse.json({ detail }, { status: apiError.status ?? 500 });
}

export async function GET() {
  try {
    const data = await serverApi("/shop/product", {
      method: "GET",
      cache: "no-store",
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        detail: "اطلاعات محصول معتبر نیست.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  try {
    const data = await serverApi("/shop/product", {
      method: "POST",
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
