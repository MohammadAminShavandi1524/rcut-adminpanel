"use client";

import { useEffect, useState } from "react";

import { CustomSelect } from "@/components/ui/custom-select";

import { getProductBrands, type ProductBrand } from "./product-brands.api";

interface ProductBrandSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  disabled?: boolean;
}

const ProductBrandSelect = ({
  value,
  onChange,
  error,
  disabled = false,
}: ProductBrandSelectProps) => {
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

        console.error("GET PRODUCT BRANDS ERROR:", error);

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

  const options = [
    {
      label: "بدون برند",
      value: "",
    },
    ...brands.map((brand) => ({
      label: brand.name,
      value: String(brand.id),
    })),
  ];

  const getPlaceholder = () => {
    if (loading) return "در حال دریافت برندها...";
    if (fetchError) return "خطا در دریافت برندها";

    return "بدون برند";
  };

  return (
    <div className="min-w-0">
      <CustomSelect
        label="برند محصول (اختیاری)"
        placeholder={getPlaceholder()}
        value={value === null ? "" : String(value)}
        onChange={(selectedValue) => {
          onChange(selectedValue === "" ? null : Number(selectedValue));
        }}
        options={options}
        disabled={disabled || loading || fetchError}
        error={error ? { type: "manual", message: error } : undefined}
      />

      {!loading && !fetchError && brands.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs leading-5">
          هنوز برندی ثبت نشده است. محصول را می‌توانید بدون برند ذخیره کنید.
        </p>
      )}

      {!loading && fetchError && (
        <p className="text-destructive mt-2 px-1 text-xs leading-5">
          دریافت برندها ناموفق بود. صفحه را دوباره بارگذاری کنید.
        </p>
      )}
    </div>
  );
};

export default ProductBrandSelect;
