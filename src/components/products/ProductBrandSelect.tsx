"use client";

import { useEffect, useState } from "react";

import { CustomSelect } from "@/components/ui/custom-select";

import { getProductBrands, type ProductBrand } from "./product-brands.api";

interface ProductBrandSelectProps {
  value: number | null;
  onChange: (value: number | null) => void;
  error?: string;
  disabled?: boolean;
  allowNoBrand?: boolean;
}

const NO_BRAND_VALUE = "none";

const ProductBrandSelect = ({
  value,
  onChange,
  error,
  disabled = false,
  allowNoBrand = true,
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
    ...(allowNoBrand ? [{ label: "بدون برند", value: NO_BRAND_VALUE }] : []),
    ...brands.map((brand) => ({
      label: brand.name,
      value: String(brand.id),
    })),
  ];

  const getPlaceholder = () => {
    if (loading) return "در حال دریافت برندها...";
    if (fetchError) return "خطا در دریافت برندها";

    return allowNoBrand ? "بدون برند" : "انتخاب برند";
  };

  return (
    <div className="min-w-0">
      <CustomSelect
        label={allowNoBrand ? "برند محصول (اختیاری)" : "برند محصول"}
        placeholder={getPlaceholder()}
        value={value === null ? NO_BRAND_VALUE : String(value)}
        onChange={(selectedValue) => {
          if (selectedValue === NO_BRAND_VALUE) {
            if (allowNoBrand) {
              onChange(null);
            }

            return;
          }

          const brandId = Number(selectedValue);

          if (Number.isSafeInteger(brandId) && brandId > 0) {
            onChange(brandId);
          }
        }}
        options={options}
        disabled={disabled || loading || fetchError}
        error={error ? { type: "manual", message: error } : undefined}
      />

      {!loading && !fetchError && brands.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs leading-5">
          {allowNoBrand
            ? "هنوز برندی ثبت نشده است. محصول را می‌توانید بدون برند ذخیره کنید."
            : "برندی برای انتخاب وجود ندارد."}
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
