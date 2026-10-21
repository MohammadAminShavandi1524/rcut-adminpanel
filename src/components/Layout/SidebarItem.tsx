import Link from "next/link";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  title: string;
  active?: boolean;
}

const SidebarItem = ({
  href,
  icon: Icon,
  title,
  active = false,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative mb-1 flex items-center rounded-lg border",
        "h-10 gap-2 px-2.5 text-[13px] font-medium",
        "xl:h-11 xl:gap-2.5 xl:px-3 xl:text-[14px]",
        "2xl:h-11.5",
        "3xl:h-12 3xl:px-3.5 3xl:text-[15px]",
        "transition-[background-color,border-color,color] duration-300",
        active
          ? "border-border bg-secondary-bg text-foreground"
          : "text-muted-foreground hover:border-border hover:bg-secondary-bg/60 hover:text-foreground border-transparent",
      )}
    >
      {/* Active Indicator */}
      <span
        className={cn(
          "bg-custom-primary absolute inset-y-2 start-0 w-[3px] rounded-e-full",
          "origin-center transition-transform duration-300",
          active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-60",
        )}
      />

      {/* Icon */}
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center transition-colors duration-300",
          "xl:size-6.5",
          "3xl:size-7",
          active
            ? "text-custom-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon
          className="3xl:size-[19px] size-[17px] xl:size-[18px]"
          strokeWidth={1.8}
        />
      </span>

      {/* Title */}
      <span className="min-w-0 truncate">{title}</span>
    </Link>
  );
};

export default SidebarItem;
