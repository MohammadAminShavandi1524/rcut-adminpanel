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
      className={cn(
        "group relative mb-1 flex h-12 items-center gap-2.5 rounded-lg border px-3.5",
        "text-[15px] font-medium",
        "transition-[background-color,border-color,color] duration-300",
        active
          ? "border-border bg-secondary-bg text-foreground"
          : "text-muted-foreground hover:border-border hover:bg-secondary-bg/60 hover:text-foreground border-transparent",
      )}
    >
      <span
        className={cn(
          "bg-custom-primary absolute inset-y-2 start-0 w-[3px] rounded-e-full",
          "origin-center transition-transform duration-300",
          active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-60",
        )}
      />

      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center transition-colors duration-300",
          active
            ? "text-custom-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <Icon size={19} strokeWidth={1.8} />
      </span>

      <span className="min-w-0 truncate">{title}</span>
    </Link>
  );
};

export default SidebarItem;
