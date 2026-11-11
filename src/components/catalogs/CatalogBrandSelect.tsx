"use client";

import { useEffect, useState } from "react";

import { CustomSelect } from "@/components/ui/custom-select";

import {
  getProductBrands,
  type ProductBrand,
} from "@/components/products/product-brands.api";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  disabled?: boolean;
}

const CatalogBrandSelect = ({
  value,
  onChange,
  error,
  disabled = false,
}: Props) => {
  const [brands, setBrands] = useState<ProductBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let active = true;

    const loadBrands = async () => {
      try {
        setLoading(true);
        setFetchError(false);

        const data = await getProductBrands();

        if (!active) return;

        setBrands(data);
      } catch (error) {
        if (!active) return;

        console.error("GET CATALOG BRANDS ERROR:", error);

        setFetchError(true);
        setBrands([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadBrands();

    return () => {
      active = false;
    };
  }, []);

  const options = brands.map((brand) => ({
    label: brand.name,
    value: String(brand.id),
  }));

  const placeholder = loading
    ? "در حال دریافت برندها..."
    : fetchError
      ? "خطا در دریافت برندها"
      : "انتخاب برند کاتالوگ";

  return (
    <div className="min-w-0">
      <CustomSelect
        label="برند کاتالوگ"
        placeholder={placeholder}
        value={value === null ? "" : String(value)}
        onChange={(selectedValue) => {
          const brandId = Number(selectedValue);

          if (Number.isSafeInteger(brandId) && brandId > 0) {
            onChange(brandId);
          }
        }}
        options={options}
        disabled={disabled || loading || fetchError || brands.length === 0}
        error={error ? { type: "manual", message: error } : undefined}
      />

      {!loading && !fetchError && brands.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs">
          برندی برای انتخاب وجود ندارد.
        </p>
      )}

      {fetchError && (
        <p className="text-destructive mt-2 px-1 text-xs">
          دریافت برندها ناموفق بود. صفحه را دوباره بارگذاری کنید.
        </p>
      )}
    </div>
  );
};

export default CatalogBrandSelect;
