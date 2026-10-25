import type { Product } from "../products.api";

export { uploadProductImage } from "../add-product/add-product.api";

export interface UpdateProductPayload {
  name: string;
  description: string;
  image: string | null;
  category_id: number;
  new: boolean;
  top_seller: boolean;
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

export const getProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`/api/shop/product/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "دریافت اطلاعات محصول ناموفق بود."));
  }

  if (
    !data ||
    typeof data !== "object" ||
    typeof data.id !== "number" ||
    !data.category
  ) {
    throw new Error("اطلاعات دریافتی محصول معتبر نیست.");
  }

  return data as Product;
};

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload,
) => {
  const response = await fetch(`/api/shop/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "ویرایش محصول ناموفق بود."));
  }

  return data;
};
