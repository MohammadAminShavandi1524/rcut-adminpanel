"use client";

import { useEffect, useState } from "react";

import type { ControllerRenderProps, FieldError } from "react-hook-form";

import { CustomSelect } from "@/components/ui/custom-select";

import { getLeafCategories, type Category } from "./add-product.api";

import type { AddProductValues } from "./add-product.schema";

interface ProductCategorySelectProps {
  field: ControllerRenderProps<AddProductValues, "category_id">;
  error?: FieldError;
  onAvailabilityChange?: (hasCategories: boolean) => void;
}

const ProductCategorySelect = ({
  field,
  error,
  onAvailabilityChange,
}: ProductCategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const data = await getLeafCategories();

        if (!active) return;

        setCategories(data);
        setFetchError(false);

        onAvailabilityChange?.(data.length > 0);
      } catch (error) {
        if (!active) return;

        console.error("GET PRODUCT CATEGORIES ERROR:", error);

        setCategories([]);
        setFetchError(true);

        onAvailabilityChange?.(false);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      active = false;
    };
  }, [onAvailabilityChange]);

  const sortedCategories = [...categories].sort(
    (a, b) =>
      (a.parent?.name ?? "").localeCompare(b.parent?.name ?? "", "fa") ||
      a.index - b.index,
  );

  const options = sortedCategories.map((category) => ({
    label: category.parent
      ? `${category.parent.name} / ${category.name}`
      : category.name,
    value: String(category.id),
  }));

  const getPlaceholder = () => {
    if (loading) {
      return "در حال دریافت دسته بندی‌ها...";
    }

    if (fetchError) {
      return "خطا در دریافت دسته بندی‌ها";
    }

    if (categories.length === 0) {
      return "دسته بندی وجود ندارد";
    }

    return "انتخاب دسته بندی";
  };

  return (
    <div className="min-w-0">
      <CustomSelect
        label="دسته بندی محصول"
        placeholder={getPlaceholder()}
        value={field.value ? String(field.value) : ""}
        onChange={(value) => field.onChange(Number(value))}
        options={options}
        disabled={loading || fetchError || categories.length === 0}
        error={error}
      />

      {!loading && !fetchError && categories.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs leading-5">
          ابتدا یک دسته بندی نهایی ایجاد کنید.
        </p>
      )}

      {!loading && fetchError && (
        <p className="text-destructive mt-2 px-1 text-xs leading-5">
          دریافت دسته بندی‌ها ناموفق بود. صفحه را دوباره بارگذاری کنید.
        </p>
      )}
    </div>
  );
};

export default ProductCategorySelect;
