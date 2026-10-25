"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../scroll-area";

import CustomSelectItem from "./CustomSelectItem";

import type { CustomSelectProps } from "./types";

const CustomSelect = <T extends string>({
  label,
  placeholder = "انتخاب کنید...",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className,
  labelClassName,
  triggerClassName,
  dropdownClassName,
}: CustomSelectProps<T>) => {
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  const triggerClasses = cn(
    "bg-secondary-bg text-foreground relative flex h-11 w-full items-center justify-between rounded-lg border px-3 text-sm transition-colors outline-none sm:h-12 sm:px-4 sm:text-base",
    "rtl:text-right",
    error
      ? "border-red-500 focus:border-red-500"
      : "border-foreground/8 focus:border-primary",
    triggerClassName,
  );

  return (
    <div
      dir="rtl"
      className={cn("relative flex flex-col gap-2 sm:gap-3", className)}
    >
      {/* Label */}
      {(label?.trim() || error) && (
        <div className="flex items-center justify-between gap-1 px-1.5">
          {label?.trim() && (
            <label
              className={cn(
                "text-foreground text-sm font-semibold",
                labelClassName,
              )}
            >
              {label}
            </label>
          )}

          {error && (
            <p className="pt-0.5 text-xs text-red-500">{error.message}</p>
          )}
        </div>
      )}

      {/* Select */}
      <div ref={ref} className="relative">
        {!mounted ? (
          <div
            aria-hidden="true"
            className={cn(
              triggerClasses,
              "text-muted-foreground",
              "opacity-50",
            )}
          >
            <span className="min-w-0 truncate">
              {selectedOption?.label ?? placeholder}
            </span>

            <ChevronDown
              className="text-muted-foreground ms-4 size-4 shrink-0"
              strokeWidth={1.7}
            />
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={disabled}
              aria-expanded={open && !disabled}
              aria-haspopup="listbox"
              onClick={() => {
                if (!disabled) {
                  setOpen((prev) => !prev);
                }
              }}
              className={cn(
                triggerClasses,
                "cursor-pointer",
                "disabled:cursor-not-allowed disabled:opacity-50",
                !disabled && !error && open && "border-primary",
              )}
            >
              <span
                className={cn(
                  "min-w-0 truncate",
                  selectedOption ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {selectedOption?.label ?? placeholder}
              </span>

              <ChevronDown
                className={cn(
                  "text-muted-foreground ms-4 size-4 shrink-0 transition-transform duration-200",
                  open && "rotate-180",
                )}
                strokeWidth={1.7}
              />
            </button>

            {/* Dropdown */}
            {open && !disabled && (
              <div
                role="listbox"
                className={cn(
                  "border-border bg-background absolute z-50 mt-2 w-full overflow-hidden rounded-lg border shadow-xl",
                  dropdownClassName,
                )}
              >
                <ScrollArea
                  data-lenis-prevent
                  dir="rtl"
                  className={cn("h-auto", options.length > 5 && "h-64")}
                >
                  <div className="flex flex-col p-2">
                    {options.map((option) => (
                      <CustomSelectItem
                        key={option.value}
                        option={option}
                        selected={option.value === value}
                        onSelect={(selectedValue) => {
                          onChange(selectedValue as T);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
