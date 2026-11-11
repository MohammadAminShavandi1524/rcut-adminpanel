"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import { FileText, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  CATALOG_IMAGE_TYPES,
  MAX_CATALOG_COVER_SIZE,
} from "./add-catalog.schema";

import type { CatalogMediaKind } from "./add-catalog.api";

interface Props {
  kind: CatalogMediaKind;
  value?: File;
  onChange: (value?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  disabled?: boolean;
}

const CatalogUploadField = ({
  kind,
  value,
  onChange,
  error,
  progress,
  isUploading,
  disabled = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [fileError, setFileError] = useState("");

  const isCover = kind === "cover";
  const isBanner = kind === "image";
  const isImage = kind !== "pdf";

  const label = isCover
    ? "تصویر کاور کاتالوگ"
    : isBanner
      ? "تصویر بنر کاتالوگ"
      : "فایل PDF کاتالوگ";

  useEffect(() => {
    if (!isImage || !value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [isImage, value]);

  const handleFile = (file?: File) => {
    if (!file || disabled) return;

    if (isImage) {
      if (!CATALOG_IMAGE_TYPES.includes(file.type)) {
        setFileError("فرمت مجاز JPG، PNG یا WEBP است.");
        return;
      }

      if (file.size === 0 || file.size > MAX_CATALOG_COVER_SIZE) {
        setFileError("حداکثر حجم تصویر ۵ مگابایت است.");
        return;
      }
    } else {
      if (
        !file.name.toLowerCase().endsWith(".pdf") ||
        !["application/pdf", ""].includes(file.type)
      ) {
        setFileError("فقط فایل PDF مجاز است.");
        return;
      }

      if (file.size === 0) {
        setFileError("فایل PDF نباید خالی باشد.");
        return;
      }
    }

    setFileError("");
    onChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  };

  const clear = () => {
    if (disabled) return;

    onChange(undefined);
    setFileError("");
  };

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <label className="text-foreground text-sm font-semibold">{label}</label>

        {(fileError || error) && (
          <span className="text-destructive text-xs">{fileError || error}</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={
          isImage ? "image/jpeg,image/png,image/webp" : ".pdf,application/pdf"
        }
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
      />

      <div className="3xl:grid-cols-[250px_minmax(0,1fr)] grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`انتخاب ${label}`}
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={handleKeyDown}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            "border-border bg-secondary-bg/30 hover:border-custom-primary/70 relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors",
            isCover
              ? "aspect-[3/4] max-w-[280px]"
              : isBanner
                ? "aspect-[1280/772] max-w-[360px]"
                : "aspect-[4/3] max-h-[230px] max-w-[280px]",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={`پیش‌نمایش ${label}`}
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-4 text-center">
              {isImage ? (
                <UploadCloud
                  className="text-custom-primary size-9"
                  strokeWidth={1.5}
                />
              ) : (
                <FileText
                  className="text-custom-primary size-10"
                  strokeWidth={1.5}
                />
              )}

              <span className="text-foreground text-sm font-medium">
                {value && !isImage
                  ? "فایل PDF انتخاب شد"
                  : "انتخاب یا رها کردن فایل"}
              </span>

              <span className="text-muted-foreground max-w-full truncate text-xs">
                {value && !isImage
                  ? value.name
                  : isCover
                    ? "تصویر کاور کاتالوگ"
                    : isBanner
                      ? "تصویر بنر افقی"
                      : "فایل با فرمت PDF"}
              </span>
            </div>
          )}

          {value && !disabled && (
            <button
              type="button"
              aria-label={`حذف ${label}`}
              onClick={(event) => {
                event.stopPropagation();
                clear();
              }}
              className="border-border bg-background text-foreground hover:text-destructive absolute end-2 top-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="border-border bg-secondary-bg/25 flex h-full min-h-[180px] min-w-0 flex-col items-center justify-center rounded-xl border p-4 text-center">
          <h3 className="text-foreground text-sm font-semibold">
            {isCover
              ? "راهنمای تصویر کاور"
              : isBanner
                ? "راهنمای تصویر بنر"
                : "راهنمای فایل PDF"}
          </h3>

          <p className="text-muted-foreground mt-2 text-xs leading-6">
            {isCover
              ? "بهتر است تصویر کاور متناسب با صفحه اول PDF باشد."
              : isBanner
                ? "تصویر بنر بهتر است افقی و با نسبت تقریبی ۱۲۸۰ در ۷۷۲ باشد. پیش‌نمایش بدون برش نمایش داده می‌شود."
                : "نسخه کامل کاتالوگ را به صورت PDF بارگذاری کنید."}
          </p>

          <p className="text-muted-foreground mt-3 text-xs">
            {isImage
              ? "فرمت: JPG، PNG، WEBP — حداکثر ۵ مگابایت"
              : "فرمت مجاز: PDF"}
          </p>

          {value && (
            <p
              className="text-foreground mt-3 w-full truncate text-xs"
              title={value.name}
            >
              {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}

          {isUploading && (
            <div className="mt-4 w-full max-w-[260px]">
              <div className="text-muted-foreground mb-2 flex justify-between text-xs">
                <span>
                  {progress === 100
                    ? "در حال نهایی‌سازی آپلود..."
                    : "در حال آپلود..."}
                </span>

                <span>{progress}%</span>
              </div>

              <div className="bg-border h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-custom-primary h-full transition-[width]"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogUploadField;
