import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

interface RouteContext {
  params: Promise<{
    catalog_id: string;
  }>;
}

async function getCatalogId(context: RouteContext) {
  const { catalog_id } = await context.params;
  const id = Number(catalog_id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function invalidIdResponse() {
  return NextResponse.json(
    { detail: "شناسه کاتالوگ معتبر نیست." },
    { status: 400 },
  );
}

function handleApiError(error: unknown) {
  const apiError = error as {
    body?: unknown;
    status?: number;
  };

  let detail: unknown =
    apiError.body ?? "Internal Server Error";

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
  const id = await getCatalogId(context);

  if (id === null) return invalidIdResponse();

  try {
    const data = await serverApi(`/catalog/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  const id = await getCatalogId(context);

  if (id === null) return invalidIdResponse();

  try {
    const data = await serverApi(`/catalog/${id}`, {
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

export async function PUT(
  request: Request,
  context: RouteContext,
) {
  const id = await getCatalogId(context);

  if (id === null) return invalidIdResponse();

  const body = await request.json().catch(() => null);

  if (
    body === null ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return NextResponse.json(
      { detail: "اطلاعات ویرایش کاتالوگ معتبر نیست." },
      { status: 400 },
    );
  }

  try {
    const data = await serverApi(`/catalog/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return NextResponse.json(data ?? { success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}