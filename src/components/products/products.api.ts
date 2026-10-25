export interface ProductCategory {
  id: number;
  name: string;
  index: number;
  child_count: number;
  parent: {
    id: number;
    name: string;
  } | null;
  created: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: ProductCategory;
  new: boolean;
  top_seller: boolean;
  created: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/shop/product", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : "دریافت محصولات ناموفق بود.",
    );
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

export const deleteProduct = async (id: number) => {
  const response = await fetch(`/api/shop/product/${id}`, {
    method: "DELETE",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string" ? data.detail : "حذف محصول ناموفق بود.",
    );
  }

  return data;
};
