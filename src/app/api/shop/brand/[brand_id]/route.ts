import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    brand_id: string;
  }>;
}

async function getBrandId(context: RouteContext) {
  const { brand_id } = await context.params;
  const id = Number(brand_id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function invalidIdResponse() {
  return NextResponse.json(
    { detail: "شناسه برند معتبر نیست." },
    { status: 400 },
  );
}

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

  return NextResponse.json(
    { detail },
    { status: apiError.status ?? 500 },
  );
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const brandId = await getBrandId(context);

  if (brandId === null) return invalidIdResponse();

  try {
    const data = await serverApi(`/shop/brand/${brandId}`, {
      method: "GET",
      cache: "no-store",
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  context: RouteContext,
) {
  const brandId = await getBrandId(context);

  if (brandId === null) return invalidIdResponse();

  const body = await request.json().catch(() => null);

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.description !== "string" ||
    !body.description.trim() ||
    !(
      body.image === null ||
      (
        typeof body.image === "string" &&
        /^https?:\/\/.+/.test(body.image)
      )
    )
  ) {
    return NextResponse.json(
      { detail: "اطلاعات ویرایش برند معتبر نیست." },
      { status: 400 },
    );
  }

  try {
    const data = await serverApi(`/shop/brand/${brandId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: body.name.trim(),
        description: body.description.trim(),
        image: body.image,
      }),
      cache: "no-store",
    });

    return NextResponse.json(data ?? { success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const brandId = await getBrandId(context);

  if (brandId === null) return invalidIdResponse();

  try {
    const data = await serverApi(`/shop/brand/${brandId}`, {
      method: "DELETE",
      cache: "no-store",
    });

    return data === null
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}