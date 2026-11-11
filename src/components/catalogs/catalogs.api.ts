export interface Catalog {
  id: number;
  title: string;
  description: string;
  image: string | null;
  brand_id: number;
  cover: string;
  file: string;
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
    const detail = data?.detail;

    throw new Error(
      typeof detail === "string"
        ? detail
        : typeof detail?.detail === "string"
          ? detail.detail
          : "درخواست با خطا مواجه شد.",
    );
  }

  return data as T;
}

export async function getCatalogs(): Promise<Catalog[]> {
  return apiRequest<Catalog[]>("/api/catalog");
}

export async function getCatalog(id: number): Promise<Catalog> {
  return apiRequest<Catalog>(`/api/catalog/${id}`);
}

export async function deleteCatalog(id: number) {
  return apiRequest(`/api/catalog/${id}`, {
    method: "DELETE",
  });
}

export async function increaseCatalogIndex(id: number) {
  return apiRequest(`/api/catalog/increase/${id}`, {
    method: "PATCH",
  });
}

export async function decreaseCatalogIndex(id: number) {
  return apiRequest(`/api/catalog/decrease/${id}`, {
    method: "PATCH",
  });
}
