export interface CreateCategoryPayload {
  name: string;
}

export const createCategory = async (payload: CreateCategoryPayload) => {
  const response = await fetch("/api/shop/category", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name: payload.name.trim(),
      parent_id: null,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw data;
  }

  return data;
};
