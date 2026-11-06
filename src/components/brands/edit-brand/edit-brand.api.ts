import type { Brand } from "../brands.api";

export { uploadBrandImage } from "../add-brand/add-brand.api";

export interface UpdateBrandPayload {
  name: string;
  description: string;
  image: string | null;
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

  return fallback;
}

export const getBrand = async (id: number): Promise<Brand> => {
  const response = await fetch(`/api/shop/brand/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "دریافت اطلاعات برند ناموفق بود."),
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    typeof data.id !== "number"
  ) {
    throw new Error("اطلاعات دریافتی برند معتبر نیست.");
  }

  return data as Brand;
};

export const updateBrand = async (
  id: number,
  payload: UpdateBrandPayload,
) => {
  const response = await fetch(`/api/shop/brand/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "ویرایش برند ناموفق بود."),
    );
  }

  return data;
};