"use client";

import Link from "next/link";

import { CheckSquare2, Edit, Eye, Package, Square, Trash } from "lucide-react";

import { cn } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import { customButtonVariants } from "@/components/ui/custom-button/custom-button-variants";

import { PRODUCT_TABLE_COLUMNS } from "./products-table-layout";

import type { Product } from "./products.api";

interface ProductRowProps {
  product: Product;
  onDelete: (id: number) => void | Promise<void>;
}

const ProductRow = ({ product, onDelete }: ProductRowProps) => {
  const categoryLabel = product.category
    ? product.category.parent
      ? `${product.category.parent.name} / ${product.category.name}`
      : product.category.name
    : "-";

  const getCreatedDate = () => {
    if (!product.created) return "-";

    const date = new Date(product.created);

    if (Number.isNaN(date.getTime())) {
      return product.created;
    }

    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const buttonClass =
    "3xl:h-10 3xl:px-3.5 3xl:text-sm h-8 min-w-0 flex-1 gap-1 px-2 text-[10px] xl:h-9 xl:gap-1.5 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:text-[13px]";

  return (
    <article
      className={cn(
        "group/product border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 3xl:min-h-[96px] relative grid min-h-[76px] min-w-0 items-center gap-2 rounded-lg border px-3 py-2 transition-[background-color,border-color] duration-300 xl:min-h-[84px] 2xl:min-h-[90px]",
        PRODUCT_TABLE_COLUMNS,
      )}
    >
      {/* Hover Indicator */}
      <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/product:scale-y-100" />

      {/* Name */}
      <div className="min-w-0 pe-2 xl:pe-4">
        <span
          lang="fa"
          title={product.name}
          className="text-foreground 3xl:text-[15px] block truncate text-[12px] font-medium xl:text-[13px] 2xl:text-sm"
        >
          {product.name}
        </span>
      </div>

      {/* Category */}
      <div className="min-w-0 pe-2 xl:pe-4">
        <span
          title={categoryLabel}
          className="text-muted-foreground 3xl:text-[15px] block truncate text-[12px] xl:text-[13px] 2xl:text-sm"
        >
          {categoryLabel}
        </span>
      </div>

      {/* Image */}
      <div className="flex min-w-0 items-center">
        {product.image ? (
          <a
            href={product.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`مشاهده تصویر ${product.name}`}
            className="group/image border-border bg-secondary-bg 3xl:size-[70px] relative block size-12 shrink-0 overflow-hidden rounded-lg border xl:size-14 2xl:size-16"
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="size-full object-contain"
            />

            <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
              <Eye className="size-5 text-white" strokeWidth={1.8} />
            </span>
          </a>
        ) : (
          <div className="border-border bg-secondary-bg 3xl:size-[70px] flex size-12 shrink-0 items-center justify-center rounded-lg border xl:size-14 2xl:size-16">
            <Package
              className="text-muted-foreground size-5"
              strokeWidth={1.6}
            />
          </div>
        )}
      </div>

      {/* Read-only Status */}
      <div className="flex min-w-0 flex-col gap-2 xl:gap-2.5">
        {[
          { label: "جدید", checked: product.new },
          { label: "پرفروش", checked: product.top_seller },
        ].map(({ label, checked }) => (
          <div
            key={label}
            className="text-foreground flex items-center gap-2 text-[12px] font-medium xl:text-[13px] 2xl:text-sm"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-[4px] border xl:size-[17px]",
                checked
                  ? "border-custom-primary bg-custom-primary"
                  : "border-foreground/20 bg-secondary-bg",
              )}
            >
              {checked && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="size-3 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5L10 17L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Created */}
      <div className="min-w-0">
        <span className="text-muted-foreground 3xl:text-sm block truncate text-[11px] xl:text-[12px] 2xl:text-[13px]">
          {getCreatedDate()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex min-w-0 items-center justify-center gap-1 xl:gap-1.5 2xl:gap-2">
        <Link
          href={`/products/edit/${product.id}`}
          className={cn(
            customButtonVariants({
              intent: "info",
              variant: "soft",
            }),
            buttonClass,
          )}
        >
          <Edit className="size-3 shrink-0 xl:size-4" strokeWidth={1.7} />
          <span>ویرایش</span>
        </Link>

        <CustomHoldButton
          type="button"
          intent="destructive"
          variant="soft"
          duration={1200}
          onComplete={() => onDelete(product.id)}
          className={buttonClass}
          leftSection={
            <Trash className="size-3 shrink-0 xl:size-4" strokeWidth={1.7} />
          }
        >
          حذف
        </CustomHoldButton>
      </div>
    </article>
  );
};

export default ProductRow;
