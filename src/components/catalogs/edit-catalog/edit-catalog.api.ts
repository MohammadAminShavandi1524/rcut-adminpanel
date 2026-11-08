import type { Catalog } from "../catalogs.api";

export { uploadCatalogMedia } from "../add-catalog/add-catalog.api";

export interface UpdateCatalogPayload {
  title: string;
  description: string;
  cover: string | null;
  file: string | null;
}

function getErrorMessage(
  data: unknown,
  fallback: string,
): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const response = data as {
    detail?: unknown;
    message?: unknown;
  };

  if (typeof response.detail === "string") {
    return response.detail;
  }

  if (typeof response.message === "string") {
    return response.message;
  }

  if (
    response.detail &&
    typeof response.detail === "object" &&
    "detail" in response.detail &&
    typeof response.detail.detail === "string"
  ) {
    return response.detail.detail;
  }

  return fallback;
}

export const getCatalogForEdit = async (
  id: number,
): Promise<Catalog> => {
  const response = await fetch(`/api/catalog/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "دریافت اطلاعات کاتالوگ ناموفق بود.",
      ),
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    typeof data.id !== "number" ||
    typeof data.title !== "string" ||
    typeof data.description !== "string"
  ) {
    throw new Error("اطلاعات دریافتی کاتالوگ معتبر نیست.");
  }

  return data as Catalog;
};

export const updateCatalog = async (
  id: number,
  payload: UpdateCatalogPayload,
) => {
  const response = await fetch(`/api/catalog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "ویرایش کاتالوگ ناموفق بود."),
    );
  }

  return data;
};