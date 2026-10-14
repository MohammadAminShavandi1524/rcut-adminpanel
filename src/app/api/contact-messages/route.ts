import { NextResponse } from "next/server";

import { serverApi } from "@/lib/server-api";

export async function GET() {
  try {
    const data = await serverApi("/support/contact", {
      method: "GET",
    });

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
