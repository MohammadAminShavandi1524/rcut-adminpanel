"use client";

import { Search, Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { CustomSelect } from "@/components/ui/custom-select";

import type { ProductCategory } from "./products.api";

interface ProductsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  categoryId: number | null;
  onCategoryChange: (value: number | null) => void;

  onlyNew: boolean;
  onOnlyNewChange: (value: boolean) => void;

  onlyTopSeller: boolean;
  onOnlyTopSellerChange: (value: boolean) => void;

  categories: ProductCategory[];
}

const ProductsFilters = ({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  onlyNew,
  onOnlyNewChange,
  onlyTopSeller,
  onOnlyTopSellerChange,
  categories,
}: ProductsFiltersProps) => {
  const categoryOptions = [
    {
      label: "همه دسته بندی‌ها",
      value: "",
    },
    ...categories.map((category) => ({
      label: category.parent
        ? `${category.parent.name} / ${category.name}`
        : category.name,
      value: String(category.id),
    })),
  ];

  return (
    <div
      dir="rtl"
      className="border-border 3xl:p-5 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b p-3 xl:p-4 2xl:p-4.5"
    >
      {/* Search - Right */}
      <div className="3xl:max-w-[520px] relative w-full min-w-0 xl:max-w-[400px] xl:flex-1 2xl:max-w-[460px]">
        <Search
          strokeWidth={1.8}
          className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
        />

        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          dir="rtl"
          placeholder="جستجوی محصول..."
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-10 w-full rounded-lg border ps-10 pe-3 text-[12px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:text-[14px] 2xl:h-11.5"
        />
      </div>

      {/* Filters - Left */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 xl:gap-2.5 2xl:gap-3">
        {/* Category */}
        <div className="3xl:w-[250px] w-[190px] min-w-0 xl:w-[200px] 2xl:w-[220px]">
          <CustomSelect
            value={categoryId === null ? "" : String(categoryId)}
            onChange={(value) =>
              onCategoryChange(value === "" ? null : Number(value))
            }
            options={categoryOptions}
            placeholder="همه دسته بندی‌ها"
            triggerClassName="border-border bg-background 3xl:h-12 3xl:text-[15px] h-10 rounded-lg px-3 text-[12px] xl:h-11 xl:text-[13px] 2xl:h-11.5 2xl:text-[14px]"
            dropdownClassName="z-50"
          />
        </div>

        {/* Only New */}
        <label
          className={cn(
            "border-border bg-background text-muted-foreground 3xl:h-12 3xl:px-4 3xl:text-sm inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[12px] transition-[background-color,border-color,color] duration-200 select-none xl:h-11 xl:text-[13px] 2xl:h-11.5",
            onlyNew &&
              "border-custom-primary/40 bg-custom-primary/8 text-custom-primary",
          )}
        >
          <input
            type="checkbox"
            checked={onlyNew}
            onChange={(event) => onOnlyNewChange(event.target.checked)}
            className="sr-only"
          />

          <span
            className={cn(
              "border-border bg-background flex size-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors xl:size-[18px]",
              onlyNew && "border-custom-primary bg-custom-primary",
            )}
          >
            {onlyNew && (
              <Check className="size-3 text-white" strokeWidth={2.5} />
            )}
          </span>

          <span>فقط جدید</span>
        </label>

        {/* Only Top Seller */}
        <label
          className={cn(
            "border-border bg-background text-muted-foreground 3xl:h-12 3xl:px-4 3xl:text-sm inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-[12px] transition-[background-color,border-color,color] duration-200 select-none xl:h-11 xl:text-[13px] 2xl:h-11.5",
            onlyTopSeller &&
              "border-custom-primary/40 bg-custom-primary/8 text-custom-primary",
          )}
        >
          <input
            type="checkbox"
            checked={onlyTopSeller}
            onChange={(event) => onOnlyTopSellerChange(event.target.checked)}
            className="sr-only"
          />

          <span
            className={cn(
              "border-border bg-background flex size-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors xl:size-[18px]",
              onlyTopSeller && "border-custom-primary bg-custom-primary",
            )}
          >
            {onlyTopSeller && (
              <Check className="size-3 text-white" strokeWidth={2.5} />
            )}
          </span>

          <span>فقط پرفروش</span>
        </label>
      </div>
    </div>
  );
};

export default ProductsFilters;
