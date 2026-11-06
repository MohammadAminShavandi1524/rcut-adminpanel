"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  ImageIcon,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  CustomButton,
  CustomHoldButton,
} from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";
import { BRAND_TABLE_COLUMNS } from "./brands-table-layout";
import { useBrandRowAnimation } from "./useBrandRowAnimation";
import type { Brand } from "./brands.api";

interface BrandRowProps {
  brand: Brand;
  animationIndex: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: number) => Promise<void>;
  onOrder: (
    id: number,
    action: "increase" | "decrease",
  ) => Promise<void>;
}

const BrandRow = ({
  brand,
  animationIndex,
  isFirst,
  isLast,
  onDelete,
  onOrder,
}: BrandRowProps) => {
  const toast = useCustomToast();
  const router = useRouter();
  const rowRef = useRef<HTMLElement>(null);
  const [busy, setBusy] = useState(false);

  useBrandRowAnimation(rowRef, animationIndex);

  const date = new Date(brand.created);

  const createdDate = Number.isNaN(date.getTime())
    ? brand.created
    : new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);

  const buttonClass =
    "3xl:h-10 3xl:px-3.5 3xl:text-sm h-8 px-2 text-[10px] xl:h-9 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:text-[13px]";

  const orderButtonClass =
    "border-border text-muted-foreground hover:border-custom-primary/45 hover:bg-custom-primary/6 hover:text-custom-primary 3xl:size-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 xl:size-9 2xl:size-9.5";

  const handleOrder = async (
    action: "increase" | "decrease",
  ) => {
    if (busy) return;

    setBusy(true);

    try {
      await onOrder(brand.id, action);
    } catch (error) {
      console.error("BRAND ORDER ERROR:", error);
      toast.error("خطا در تغییر ترتیب برند.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await onDelete(brand.id);
    } catch (error) {
      console.error("DELETE BRAND ERROR:", error);
      toast.error("حذف برند ناموفق بود.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      ref={rowRef}
      className={cn(
        "group/brand border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 3xl:min-h-[96px] relative grid min-h-[76px] min-w-0 items-center gap-2 rounded-lg border px-3 py-2 transition-[background-color,border-color] duration-300 xl:min-h-[84px] 2xl:min-h-[90px]",
        BRAND_TABLE_COLUMNS,
      )}
    >
      <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/brand:scale-y-100" />

      <div className="text-muted-foreground text-[12px] font-medium xl:text-[13px] 2xl:text-sm">
        {brand.index.toLocaleString("fa-IR")}
      </div>

      <div className="min-w-0 pe-2 xl:pe-4">
        <span
          title={brand.name}
          className="text-foreground 3xl:text-[15px] block truncate text-[12px] font-medium xl:text-[13px] 2xl:text-sm"
        >
          {brand.name}
        </span>
      </div>

      <div className="min-w-0 pe-2">
        <p
          title={brand.description}
          className="text-muted-foreground 3xl:text-[14px] line-clamp-2 text-justify text-[11px] leading-6 xl:text-[12px] 2xl:text-[13px]"
        >
          {brand.description}
        </p>
      </div>

      <div className="flex min-w-0 items-center">
        {brand.image ? (
          <a
            href={brand.image}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`مشاهده تصویر ${brand.name}`}
            className="group/image border-border bg-secondary-bg 3xl:size-[70px] relative block size-12 shrink-0 overflow-hidden rounded-lg border xl:size-14 2xl:size-16"
          >
            <img
              src={brand.image}
              alt={brand.name}
              loading="lazy"
              className="size-full object-contain"
            />

            <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
              <Eye className="size-5 text-white" strokeWidth={1.8} />
            </span>
          </a>
        ) : (
          <div className="border-border bg-secondary-bg 3xl:size-[70px] flex size-12 shrink-0 items-center justify-center rounded-lg border xl:size-14 2xl:size-16">
            <ImageIcon
              className="text-muted-foreground size-5"
              strokeWidth={1.6}
            />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <span className="text-muted-foreground 3xl:text-sm block truncate text-[11px] xl:text-[12px] 2xl:text-[13px]">
          {createdDate}
        </span>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-1 xl:gap-1.5 2xl:gap-2">
        <button
          type="button"
          disabled={busy || isFirst}
          onClick={() => void handleOrder("decrease")}
          aria-label="انتقال به بالا"
          className={orderButtonClass}
        >
          <ChevronUp
            className="3xl:size-[19px] size-[15px] xl:size-[17px]"
            strokeWidth={1.8}
          />
        </button>

        <button
          type="button"
          disabled={busy || isLast}
          onClick={() => void handleOrder("increase")}
          aria-label="انتقال به پایین"
          className={orderButtonClass}
        >
          <ChevronDown
            className="3xl:size-[19px] size-[15px] xl:size-[17px]"
            strokeWidth={1.8}
          />
        </button>

        <CustomButton
          type="button"
          intent="info"
          variant="soft"
          disabled={busy}
          onClick={() => router.push(`/brands/edit/${brand.id}`)}
          leftSection={
            <Edit className="size-3 xl:size-4" strokeWidth={1.7} />
          }
          className={buttonClass}
        >
          ویرایش
        </CustomButton>

        <CustomHoldButton
          type="button"
          intent="destructive"
          variant="soft"
          duration={1200}
          disabled={busy}
          onComplete={handleDelete}
          leftSection={
            <Trash className="size-3 xl:size-4" strokeWidth={1.7} />
          }
          className={buttonClass}
        >
          حذف
        </CustomHoldButton>
      </div>
    </article>
  );
};

export default BrandRow;