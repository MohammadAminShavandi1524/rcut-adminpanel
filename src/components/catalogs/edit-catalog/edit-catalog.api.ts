import type { Catalog } from "../catalogs.api";

export { uploadCatalogMedia } from "../add-catalog/add-catalog.api";

export interface UpdateCatalogPayload {
  title: string;
  description: string;
  brand_id: number;
  cover: string | null;
  image: string | null;
  file: string | null;
}

function getErrorMessage(data: unknown, fallback: string): string {
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

function getPositiveId(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getCatalogBrandId(data: Record<string, unknown>): number {
  const directId = getPositiveId(data.brand_id);

  if (directId !== null) {
    return directId;
  }

  const brand = data.brand;

  const brandId = getPositiveId(brand);

  if (brandId !== null) {
    return brandId;
  }

  if (brand && typeof brand === "object" && !Array.isArray(brand)) {
    const brandObject = brand as Record<string, unknown>;

    return (
      getPositiveId(brandObject.id) ?? getPositiveId(brandObject.brand_id) ?? 0
    );
  }

  return 0;
}

export const getCatalogForEdit = async (id: number): Promise<Catalog> => {
  const response = await fetch(`/api/catalog/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "دریافت اطلاعات کاتالوگ ناموفق بود."),
    );
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("ساختار اطلاعات دریافتی کاتالوگ معتبر نیست.");
  }

  const catalogData = data as Record<string, unknown>;

  const catalogId = getPositiveId(catalogData.id);

  if (catalogId === null || typeof catalogData.title !== "string") {
    throw new Error("اطلاعات اصلی کاتالوگ معتبر نیست.");
  }

  const brandId = getCatalogBrandId(catalogData);

  return {
    ...catalogData,
    id: catalogId,
    title: catalogData.title,
    description:
      typeof catalogData.description === "string"
        ? catalogData.description
        : "",
    brand_id: brandId,
    image: typeof catalogData.image === "string" ? catalogData.image : null,
    cover: typeof catalogData.cover === "string" ? catalogData.cover : "",
    file: typeof catalogData.file === "string" ? catalogData.file : "",
    index: typeof catalogData.index === "number" ? catalogData.index : 0,
    created: typeof catalogData.created === "string" ? catalogData.created : "",
  };
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
    throw new Error(getErrorMessage(data, "ویرایش کاتالوگ ناموفق بود."));
  }

  return data;
};
