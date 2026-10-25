"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import {
  ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  value?: File;
  onChange: (value?: File) => void;
  error?: string;
  progress: number;
  isUploading: boolean;
  disabled?: boolean;
}

const ProductImageUploadField = ({
  value,
  onChange,
  error,
  progress,
  isUploading,
  disabled = false,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    null,
  );

  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);

    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file?: File) => {
    if (!file || disabled) return;

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setFileError(
        "فرمت مجاز JPG PNG یا WEBP است.",
      );
      return;
    }

    if (
      !file.size ||
      file.size > 5 * 1024 * 1024
    ) {
      setFileError(
        "حداکثر حجم مجاز ۵ مگابایت است.",
      );
      return;
    }

    setFileError("");
    onChange(file);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const clear = () => {
    if (!disabled) {
      onChange(undefined);
      setFileError("");
    }
  };

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <label className="text-foreground text-sm font-semibold">
          تصویر محصول
        </label>

        {(fileError || error) && (
          <span className="text-destructive text-xs">
            {fileError || error}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
      />

      <div className="3xl:grid-cols-[250px_minmax(0,1fr)] grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        {/* Image Preview */}
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="انتخاب تصویر محصول"
          onClick={() => {
            if (!disabled) {
              inputRef.current?.click();
            }
          }}
          onKeyDown={(event) => {
            if (
              !disabled &&
              (event.key === "Enter" ||
                event.key === " ")
            ) {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          className={cn(
            "border-border bg-secondary-bg/30 hover:border-custom-primary/70 relative aspect-square w-full max-w-[280px] cursor-pointer overflow-hidden rounded-xl border border-dashed transition-colors",
            disabled &&
              "cursor-not-allowed opacity-60",
          )}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="پیش نمایش تصویر محصول"
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <UploadCloud
                className="text-custom-primary size-9"
                strokeWidth={1.5}
              />

              <span className="text-foreground text-sm font-medium">
                انتخاب یا رها کردن تصویر
              </span>

              <span className="text-muted-foreground text-xs">
                کادر پیشنمایش مربعی
              </span>
            </div>
          )}

          {value && !disabled && (
            <button
              type="button"
              aria-label="حذف تصویر"
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

        {/* Image Information */}
        <div className="border-border bg-secondary-bg/25 flex min-h-[180px] min-w-0 flex-col rounded-xl border p-4 h-full justify-center items-center">
         
          <h3 className="text-foreground mt-1 text-sm font-semibold">
            راهنمای تصویر محصول
          </h3>

          <p className="text-muted-foreground mt-2 text-xs leading-6">
            تصاویر محصولات به صورت مربعی نمایش داده
            میشوند. پیشنمایش بدون برش تصویر است.
          </p>

          <p className="text-muted-foreground mt-3 text-xs">
            فرمت: JPG PNG WEBP — حداکثر حجم:
            ۵ مگابایت
          </p>

          {value && (
            <p className="text-foreground mt-3 truncate text-xs">
              {value.name} (
              {(value.size / 1024 / 1024).toFixed(2)}
              {" "}MB)
            </p>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="text-muted-foreground mb-2 flex justify-between text-xs">
                <span>
                  {progress === 100
                    ? "در حال نهاییسازی آپلود..."
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

export default ProductImageUploadField;