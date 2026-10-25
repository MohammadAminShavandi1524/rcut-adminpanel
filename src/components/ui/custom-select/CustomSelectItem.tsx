"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import type { CustomSelectOption } from "./types";

interface CustomSelectItemProps {
  option: CustomSelectOption;
  selected: boolean;
  onSelect: (value: string) => void;
}

const CustomSelectItem = ({
  option,
  selected,
  onSelect,
}: CustomSelectItemProps) => {
  return (
    <button
      type="button"
      role="option"
      dir="rtl"
      aria-selected={selected}
      onClick={() => onSelect(option.value)}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm",
        "transition-colors duration-200",
        selected
          ? "bg-custom-primary/[0.06] text-foreground"
          : "text-muted-foreground hover:bg-secondary-bg hover:text-foreground",
      )}
    >
      <span className="min-w-0 truncate">{option.label}</span>

      <Check
        className={cn(
          "size-4 shrink-0 transition-opacity duration-200",
          selected ? "text-custom-primary opacity-100" : "opacity-0",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
};

export default CustomSelectItem;
