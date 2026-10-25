"use client";

import Link from "next/link";

import { ArrowUpRight, Plus, type LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  title: string;
  count: number | null;
  href: string;
  addHref?: string;
  icon: LucideIcon;
  loading?: boolean;
}

const DashboardStatCard = ({
  title,
  count,
  href,
  addHref,
  icon: Icon,
  loading = false,
}: DashboardStatCardProps) => {
  const formattedCount =
    count === null ? "—" : new Intl.NumberFormat("fa-IR").format(count);

  return (
    <article className="group/card border-border bg-background hover:border-border-secondary hover:bg-card-secondary/30 3xl:min-h-[180px] relative flex min-h-[140px] min-w-0 flex-col overflow-hidden rounded-lg border transition-[background-color,border-color] duration-300 2xl:min-h-[160px]">
      {/* Hover Indicator */}
      <span className="bg-custom-primary pointer-events-none absolute inset-y-0 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/card:scale-y-100" />

      {/* Main Link */}
      <Link
        href={href}
        className="3xl:px-5 3xl:pt-5 3xl:pb-4 flex min-h-0 min-w-0 flex-1 flex-col px-3 pt-3 pb-2.5 2xl:px-4 2xl:pt-4 2xl:pb-3.5"
      >
        <div className="3xl:gap-4 flex items-start justify-between gap-3">
          <div className="border-border bg-card-secondary 3xl:size-11 flex size-8 shrink-0 items-center justify-center rounded-lg border 2xl:size-10">
            <Icon
              strokeWidth={1.7}
              className="text-custom-primary 3xl:size-[21px] size-4 2xl:size-5"
            />
          </div>

          <ArrowUpRight
            strokeWidth={1.7}
            className="text-muted-foreground group-hover/card:text-custom-primary 3xl:size-[18px] size-[15px] shrink-0 transition-colors duration-300"
          />
        </div>

        <div className="3xl:mt-4 3xl:gap-3 mt-2.5 flex min-w-0 items-end justify-between gap-2 2xl:mt-3">
          <h3 className="text-foreground 3xl:text-[14px] 3xl:leading-6 min-w-0 text-[12px] leading-5 font-medium 2xl:text-[13px]">
            {title}
          </h3>

          {loading ? (
            <span className="bg-card-secondary 3xl:h-8 3xl:w-12 h-7 w-10 shrink-0 animate-pulse rounded-md" />
          ) : (
            <span className="text-foreground 3xl:text-[27px] shrink-0 text-[21px] leading-none font-semibold 2xl:text-[24px]">
              {formattedCount}
            </span>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="border-border 3xl:gap-3 3xl:px-5 3xl:py-3 flex items-center justify-between gap-2 border-t px-3 py-2 2xl:px-4 2xl:py-2.5">
        <Link
          href={href}
          className="text-muted-foreground hover:text-custom-primary 3xl:gap-1.5 3xl:text-[12px] flex min-w-0 items-center gap-1 text-[11px] font-medium transition-colors duration-300"
        >
          مشاهده
          <ArrowUpRight
            strokeWidth={1.7}
            className="3xl:size-[14px] size-3 shrink-0"
          />
        </Link>

        {addHref ? (
          <Link
            href={addHref}
            className="border-border bg-card-secondary text-foreground hover:border-custom-primary/50 hover:text-custom-primary 3xl:h-8 3xl:gap-1.5 3xl:px-3 3xl:text-[12px] flex h-7 shrink-0 items-center gap-1 rounded-md border px-2 text-[11px] font-medium transition-[color,border-color] duration-300"
          >
            <Plus strokeWidth={1.8} className="3xl:size-[14px] size-[13px]" />
            افزودن
          </Link>
        ) : (
          <span className="text-muted-foreground 3xl:text-[11px] text-[10px]">
            فقط مشاهده
          </span>
        )}
      </div>
    </article>
  );
};

export default DashboardStatCard;
