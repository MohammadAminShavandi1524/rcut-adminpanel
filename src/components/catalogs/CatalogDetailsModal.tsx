"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { createPortal } from "react-dom";

import {
  CalendarDays,
  ExternalLink,
  FileText,
  ImageIcon,
  X,
} from "lucide-react";

import { useContactMessageModalAnimation } from "@/components/contactMessages/useContactMessageModalAnimation";

import { getProductBrands } from "@/components/products/product-brands.api";

import type { Catalog } from "./catalogs.api";

interface CatalogBrand {
  id?: number;
  name?: string;
  title?: string;
}

type CatalogWithBrand = Catalog & {
  brand?: CatalogBrand | string | number | null;
  brand_id?: number | null;
};

interface Props {
  open: boolean;
  onClose: () => void;
  catalog: Catalog;
}

const getBrandInfo = (
  catalog: CatalogWithBrand,
): {
  name: string | null;
  id: number | null;
} => {
  const brand = catalog.brand;

  if (typeof brand === "string" && brand.trim()) {
    return {
      name: brand.trim(),
      id: catalog.brand_id ?? null,
    };
  }

  if (typeof brand === "object" && brand !== null) {
    const name =
      typeof brand.name === "string" && brand.name.trim()
        ? brand.name.trim()
        : typeof brand.title === "string" && brand.title.trim()
          ? brand.title.trim()
          : null;

    const id = Number(brand.id ?? catalog.brand_id);

    return {
      name,
      id: Number.isSafeInteger(id) && id > 0 ? id : null,
    };
  }

  const id = Number(
    catalog.brand_id ?? (typeof brand === "number" ? brand : null),
  );

  return {
    name: null,
    id: Number.isSafeInteger(id) && id > 0 ? id : null,
  };
};

const CatalogDetailsModal = ({ open, onClose, catalog }: Props) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const brandInfo = getBrandInfo(catalog as CatalogWithBrand);

  const [fetchedBrand, setFetchedBrand] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!open || brandInfo.name || !brandInfo.id) {
      return;
    }

    let active = true;

    const loadBrand = async () => {
      try {
        const brands = await getProductBrands();

        if (!active) return;

        const found = brands.find((brand) => Number(brand.id) === brandInfo.id);

        if (found) {
          setFetchedBrand({
            id: Number(found.id),
            name: found.name,
          });
        }
      } catch (error) {
        console.error("GET CATALOG BRAND ERROR:", error);
      }
    };

    void loadBrand();

    return () => {
      active = false;
    };
  }, [open, brandInfo.id, brandInfo.name]);

  const brandName =
    brandInfo.name ??
    (fetchedBrand?.id === brandInfo.id ? fetchedBrand.name : null) ??
    (brandInfo.id ? `شناسه برند: ${brandInfo.id}` : "برند مشخص نیست");

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useContactMessageModalAnimation(open, handleClose, backdropRef, modalRef);

  if (!open) return null;

  const created = new Date(catalog.created);

  const createdLabel = Number.isNaN(created.getTime())
    ? catalog.created
    : new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(created);

  return createPortal(
    <div
      dir="rtl"
      className="3xl:p-6 fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 lg:p-4 2xl:p-5"
      onClick={handleClose}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card 3xl:max-w-[780px] relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border shadow-2xl sm:max-h-[calc(100dvh-32px)] lg:max-w-[680px] xl:max-w-[740px]"
      >
        <div className="border-border 3xl:px-6 3xl:py-5 flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5 sm:py-4">
          <h2
            id={titleId}
            className="text-foreground 3xl:text-lg min-w-0 text-[15px] font-semibold lg:text-base"
          >
            جزئیات کاتالوگ
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="بستن"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-colors"
          >
            <X className="size-4" strokeWidth={1.8} />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="3xl:p-6 grid grid-cols-1 gap-5 p-4 sm:p-5 lg:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-muted-foreground mb-2 text-xs">تصویر کاور</p>

              <div className="border-border bg-secondary-bg/40 flex aspect-[3/4] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg border">
                {catalog.cover ? (
                  <img
                    src={catalog.cover}
                    alt={`کاور ${catalog.title}`}
                    className="size-full object-contain"
                  />
                ) : (
                  <ImageIcon
                    className="text-muted-foreground size-9"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <div className="min-w-0">
                <p className="text-muted-foreground mb-2 text-xs">
                  عنوان کاتالوگ
                </p>

                <h3 className="text-foreground text-sm leading-7 font-semibold [overflow-wrap:anywhere] sm:text-base">
                  {catalog.title}
                </h3>
              </div>

              <div className="min-w-0">
                <p className="text-muted-foreground mb-2 text-xs">
                  برند کاتالوگ
                </p>

                <p className="text-foreground text-sm font-medium">
                  {brandName}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CalendarDays
                  className="text-custom-primary size-4"
                  strokeWidth={1.8}
                />

                <span className="text-muted-foreground text-xs">
                  تاریخ ثبت: {createdLabel}
                </span>
              </div>

              <div className="border-border bg-secondary-bg/30 min-w-0 rounded-lg border p-3 sm:p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileText
                    className="text-custom-primary size-4"
                    strokeWidth={1.8}
                  />

                  <h4 className="text-foreground text-sm font-semibold">
                    فایل کاتالوگ
                  </h4>
                </div>

                {catalog.file ? (
                  <a
                    href={catalog.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-custom-primary text-custom-primary hover:bg-custom-primary inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors hover:text-white"
                  >
                    <ExternalLink className="size-4" />
                    مشاهده یا دریافت PDF
                  </a>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    فایل PDF موجود نیست.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-border 3xl:px-6 border-t px-4 py-4 sm:px-5 sm:py-5">
            <h4 className="text-foreground mb-3 text-sm font-semibold">
              تصویر بنر کاتالوگ
            </h4>

            {catalog.image ? (
              <a
                href={catalog.image}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full max-w-[640px]"
              >
                <img
                  src={catalog.image}
                  alt={`بنر ${catalog.title}`}
                  loading="lazy"
                  className="border-border bg-secondary-bg aspect-[1280/772] w-full rounded-lg border object-contain"
                />
              </a>
            ) : (
              <div className="border-border bg-secondary-bg/30 flex aspect-[1280/772] w-full max-w-[420px] flex-col items-center justify-center gap-3 rounded-lg border">
                <ImageIcon
                  className="text-muted-foreground size-8"
                  strokeWidth={1.5}
                />

                <p className="text-muted-foreground text-xs">
                  تصویری برای بنر ثبت نشده است.
                </p>
              </div>
            )}
          </div>

          <div className="border-border 3xl:px-6 border-t px-4 py-4 sm:px-5 sm:py-5">
            <h4 className="text-foreground mb-3 text-sm font-semibold">
              توضیحات کامل کاتالوگ
            </h4>

            <div className="border-border bg-secondary-bg 3xl:px-5 3xl:py-4 min-w-0 rounded-lg border px-3 py-3 sm:px-4">
              <p className="text-foreground text-justify text-[12px] leading-7 [overflow-wrap:anywhere] whitespace-pre-wrap sm:text-[13px]">
                {catalog.description || "توضیحاتی ثبت نشده است."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CatalogDetailsModal;
