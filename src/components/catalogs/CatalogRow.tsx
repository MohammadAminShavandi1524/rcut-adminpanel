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

import type { Catalog } from "./catalogs.api";
import { CATALOG_TABLE_COLUMNS } from "./catalogs-table-layout";
import { useCatalogRowAnimation } from "./useCatalogRowAnimation";
import CatalogDetailsModal from "./CatalogDetailsModal";

interface Props {
  catalog: Catalog;
  animationIndex: number;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: number) => Promise<void>;
  onOrder: (
    id: number,
    action: "increase" | "decrease",
  ) => Promise<void>;
}

const CatalogRow = ({
  catalog,
  animationIndex,
  isFirst,
  isLast,
  onDelete,
  onOrder,
}: Props) => {
  const toast = useCustomToast();
  const router = useRouter();

  const rowRef = useRef<HTMLElement>(null);

  const [busy, setBusy] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useCatalogRowAnimation(rowRef, animationIndex);

  const date = new Date(catalog.created);

  const createdDate = Number.isNaN(date.getTime())
    ? catalog.created
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
      await onOrder(catalog.id, action);
    } catch (error) {
      console.error("CATALOG ORDER ERROR:", error);
      toast.error("تغییر ترتیب کاتالوگ ناموفق بود.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await onDelete(catalog.id);
    } catch (error) {
      console.error("DELETE CATALOG ERROR:", error);
      toast.error("حذف کاتالوگ ناموفق بود.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <article
        ref={rowRef}
        className={cn(
          "group/catalog border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 3xl:min-h-[96px] relative grid min-h-[76px] min-w-0 items-center gap-2 rounded-lg border px-3 py-2 transition-[background-color,border-color] duration-300 xl:min-h-[84px] 2xl:min-h-[90px]",
          CATALOG_TABLE_COLUMNS,
        )}
      >
        <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/catalog:scale-y-100" />

        {/* Order */}
        <div className="text-muted-foreground min-w-0 text-[12px] font-medium xl:text-[13px] 2xl:text-sm">
          {catalog.index.toLocaleString("fa-IR")}
        </div>

        {/* Title */}
        <div className="min-w-0 pe-1 xl:pe-2">
          <span
            title={catalog.title}
            className="text-foreground 3xl:text-[15px] line-clamp-2 text-[12px] font-medium xl:text-[13px] 2xl:text-sm"
          >
            {catalog.title}
          </span>
        </div>

        {/* Description */}
        <div className="min-w-0 pe-1">
          <p className="text-muted-foreground 3xl:text-[14px] line-clamp-2 text-justify text-[11px] leading-6 xl:text-[12px] 2xl:text-[13px]">
            {catalog.description}
          </p>
        </div>

        {/* Cover */}
        <div className="flex min-w-0 items-center">
          {catalog.cover ? (
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              aria-label={`مشاهده جزئیات ${catalog.title}`}
              className="group/image border-border bg-secondary-bg 3xl:h-[70px] 3xl:w-[55px] relative block h-12 w-10 shrink-0 cursor-pointer overflow-hidden rounded-md border xl:h-14 xl:w-11 2xl:h-16 2xl:w-12"
            >
              <img
                src={catalog.cover}
                alt={catalog.title}
                loading="lazy"
                className="size-full object-contain"
              />

              <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
                <Eye
                  className="size-5 text-white"
                  strokeWidth={1.8}
                />
              </span>
            </button>
          ) : (
            <div className="border-border bg-secondary-bg 3xl:h-[70px] 3xl:w-[55px] flex h-12 w-10 shrink-0 items-center justify-center rounded-md border xl:h-14 xl:w-11 2xl:h-16 2xl:w-12">
              <ImageIcon
                className="text-muted-foreground size-5"
                strokeWidth={1.6}
              />
            </div>
          )}
        </div>

        {/* Date - visible from 1536px */}
        <div className="hidden min-w-0 2xl:block">
          <span className="text-muted-foreground 3xl:text-sm block truncate text-[11px] 2xl:text-[13px]">
            {createdDate}
          </span>
        </div>

        {/* Actions */}
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
            intent="secondary"
            variant="outline"
            disabled={busy}
            onClick={() => setDetailsOpen(true)}
            leftSection={
              <Eye className="size-3 xl:size-4" strokeWidth={1.7} />
            }
            className={buttonClass}
          >
            جزئیات
          </CustomButton>

          <CustomButton
            type="button"
            intent="info"
            variant="soft"
            disabled={busy}
            onClick={() => {
              router.push(`/catalogs/edit/${catalog.id}`);
            }}
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

      <CatalogDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        catalog={catalog}
      />
    </>
  );
};

export default CatalogRow;