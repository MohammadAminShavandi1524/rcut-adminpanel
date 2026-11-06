export interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
  index: number;
  created: string;
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : "درخواست با خطا مواجه شد.",
    );
  }

  return data as T;
}

export async function getBrands(): Promise<Brand[]> {
  return apiRequest<Brand[]>("/api/shop/brand");
}

export async function deleteBrand(id: number) {
  return apiRequest(`/api/shop/brand/${id}`, {
    method: "DELETE",
  });
}

export async function increaseBrandIndex(id: number) {
  return apiRequest(`/api/shop/brand/increase/${id}`, {
    method: "PATCH",
  });
}

export async function decreaseBrandIndex(id: number) {
  return apiRequest(`/api/shop/brand/decrease/${id}`, {
    method: "PATCH",
  });
}