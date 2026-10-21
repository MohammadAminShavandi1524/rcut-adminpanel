export interface CategoryParent {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  index: number;
  child_count: number;
  parent: CategoryParent | null;
  created: string;
}

export interface CategoryPayload {
  name: string;
  parent_id: number | null;
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
    throw data;
  }

  return data as T;
}

export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/api/shop/category");
}

export async function getCategory(id: number): Promise<Category> {
  return apiRequest<Category>(`/api/shop/category/${id}`);
}

export async function createCategory(payload: CategoryPayload) {
  return apiRequest("/api/shop/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  id: number,
  payload: CategoryPayload,
) {
  return apiRequest(`/api/shop/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: number) {
  return apiRequest(`/api/shop/category/${id}`, {
    method: "DELETE",
  });
}

export async function increaseCategoryIndex(id: number) {
  return apiRequest(`/api/shop/category/increase/${id}`, {
    method: "PATCH",
  });
}

export async function decreaseCategoryIndex(id: number) {
  return apiRequest(`/api/shop/category/decrease/${id}`, {
    method: "PATCH",
  });
}