"use client";

import { ExternalLink, FileText, ImageIcon } from "lucide-react";

import CatalogUploadField from "../add-catalog/CatalogUploadField";

interface Props {
  kind: "cover" | "pdf";
  currentUrl: string;
  value?: File;
  onChange: (value?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  disabled?: boolean;
}

const EditCatalogMediaField = ({
  kind,
  currentUrl,
  value,
  onChange,
  error,
  progress,
  isUploading,
  disabled = false,
}: Props) => {
  const isCover = kind === "cover";

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* Current uploaded media */}
      <div className="border-border bg-secondary-bg/25 min-w-0 rounded-xl border p-4">
        <div className="mb-3 flex items-center gap-2">
          {isCover ? (
            <ImageIcon
              className="text-custom-primary size-4"
              strokeWidth={1.8}
            />
          ) : (
            <FileText
              className="text-custom-primary size-4"
              strokeWidth={1.8}
            />
          )}

          <h3 className="text-foreground text-sm font-semibold">
            {isCover ? "کاور فعلی کاتالوگ" : "فایل PDF فعلی"}
          </h3>
        </div>

        {isCover ? (
          <div className="flex flex-wrap items-start gap-4">
            <div className="border-border bg-background flex aspect-[3/4] w-28 shrink-0 items-center justify-center overflow-hidden rounded-md border sm:w-36">
              {currentUrl ? (
                <img
                  src={currentUrl}
                  alt="کاور فعلی کاتالوگ"
                  className="size-full object-contain"
                />
              ) : (
                <ImageIcon
                  className="text-muted-foreground size-8"
                  strokeWidth={1.5}
                />
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-muted-foreground text-xs leading-6">
                اگر تصویر جدیدی انتخاب نکنید، همین کاور حفظ
                می‌شود.
              </p>

              {currentUrl && (
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-custom-primary hover:text-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors"
                >
                  <ExternalLink className="size-4" />
                  مشاهده تصویر فعلی
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-muted-foreground text-xs leading-6">
              اگر فایل PDF جدیدی انتخاب نکنید، فایل فعلی حفظ
              می‌شود.
            </p>

            {currentUrl ? (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-custom-primary text-custom-primary hover:bg-custom-primary inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg border px-4 text-xs font-medium transition-colors hover:text-white"
              >
                <ExternalLink className="size-4" />
                مشاهده یا دریافت PDF فعلی
              </a>
            ) : (
              <span className="text-muted-foreground text-xs">
                فایل PDF فعلی در دسترس نیست.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Replacement media */}
      <CatalogUploadField
        kind={kind}
        value={value}
        onChange={onChange}
        error={error}
        progress={progress}
        isUploading={isUploading}
        disabled={disabled}
      />

      {value && (
        <p className="text-custom-primary px-1 text-xs">
          {isCover
            ? "کاور جدید جایگزین کاور فعلی خواهد شد."
            : "PDF جدید جایگزین فایل فعلی خواهد شد."}
        </p>
      )}
    </div>
  );
};

export default EditCatalogMediaField;