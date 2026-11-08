export interface ProductBrand {
  id: number;
  name: string;
  description: string;
  image: string;
  index: number;
  created: string;
}

export async function getProductBrands(): Promise<ProductBrand[]> {
  const response = await fetch("/api/shop/brand", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === "string"
        ? data.detail
        : "دریافت برندها ناموفق بود.",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("ساختار اطلاعات برندها معتبر نیست.");
  }

  return (data as ProductBrand[]).sort(
    (a, b) => a.index - b.index || a.name.localeCompare(b.name, "fa"),
  );
}
