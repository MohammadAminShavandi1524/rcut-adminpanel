"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { CustomButton, CustomHoldButton } from "@/components/ui/custom-button";

import { useCustomToast } from "@/components/ui/custom-toast";

import {
  deleteCategory,
  increaseCategoryIndex,
  decreaseCategoryIndex,
  type Category,
} from "./categories.api";

import { useCategoryRowAnimation } from "./useCategoryRowAnimation";
import { useCategoryChildrenAnimation } from "./useCategoryChildrenAnimation";

interface CategoryRowProps {
  category: Category;
  level: number;
  animationIndex: number;
  childrenByParent: Map<number, Category[]>;
  expandedIds: Set<number>;
  onToggle: (id: number) => void;
  matchesCategory: (category: Category) => boolean;
  searchActive: boolean;
  refreshCategories: () => Promise<void>;
}

const CategoryRow = ({
  category,
  level,
  animationIndex,
  childrenByParent,
  expandedIds,
  onToggle,
  matchesCategory,
  searchActive,
  refreshCategories,
}: CategoryRowProps) => {
  const router = useRouter();
  const toast = useCustomToast();

  const rowRef = useRef<HTMLElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  const [busy, setBusy] = useState(false);

  useCategoryRowAnimation(rowRef, animationIndex);

  const children = childrenByParent.get(category.id) ?? [];

  const hasChildren = category.child_count > 0;
  const canAddChild = level < 3;

  const isExpanded = expandedIds.has(category.id) || searchActive;

  const isFirstCategory = category.index === 1;

  const siblings = childrenByParent.get(category.parent?.id ?? 0) ?? [];

  const isLastCategory =
    siblings.length > 0 &&
    category.index === Math.max(...siblings.map((item) => item.index));

  useCategoryChildrenAnimation(
    childrenRef,
    hasChildren && isExpanded && level < 3,
  );

  const handleDelete = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await deleteCategory(category.id);
      await refreshCategories();
      toast.success("دسته‌بندی با موفقیت حذف شد.");
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);
      toast.error("خطا در حذف دسته‌بندی.");
    } finally {
      setBusy(false);
    }
  };

  const handleOrder = async (action: "increase" | "decrease") => {
    if (
      busy ||
      (action === "decrease" && isFirstCategory) ||
      (action === "increase" && isLastCategory)
    ) {
      return;
    }

    setBusy(true);

    try {
      if (action === "increase") {
        await increaseCategoryIndex(category.id);
      } else {
        await decreaseCategoryIndex(category.id);
      }

      await refreshCategories();
    } catch (error) {
      console.error("CATEGORY ORDER ERROR:", error);
      toast.error("خطا در تغییر ترتیب دسته‌بندی.");
    } finally {
      setBusy(false);
    }
  };

  const buttonClass =
    "h-8 px-2 text-[10px] xl:h-9 xl:px-3 xl:text-[12px] 2xl:h-9.5 2xl:text-[13px] 3xl:h-10 3xl:px-3.5 3xl:text-sm";

  return (
    <div className="min-w-0">
      <article
        ref={rowRef}
        className="group/category border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative rounded-lg border transition-[background-color,border-color] duration-300"
      >
        {/* Hover Indicator */}
        <span className="bg-custom-primary absolute inset-y-2 start-0 w-[3px] origin-center scale-y-0 rounded-e-full transition-transform duration-300 group-hover/category:scale-y-100" />

        <div className="3xl:grid-cols-[70px_minmax(0,1fr)_minmax(0,540px)] 3xl:gap-5 3xl:px-5 3xl:py-4 grid grid-cols-[42px_minmax(0,1fr)_minmax(0,370px)] items-center gap-2 px-3 py-3 xl:grid-cols-[52px_minmax(0,1fr)_minmax(0,490px)] xl:gap-3 xl:px-4 2xl:grid-cols-[60px_minmax(0,1fr)_minmax(0,520px)] 2xl:gap-4">
          {/* Index */}
          <div className="text-muted-foreground text-[12px] font-medium xl:text-[13px] 2xl:text-sm">
            {category.index.toLocaleString("fa-IR")}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <p className="text-foreground 3xl:text-[15px] text-justify text-[12px] leading-6 font-medium [overflow-wrap:anywhere] xl:text-[13px] 2xl:text-sm">
              {category.name}
            </p>
          </div>

          {/* Actions */}
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 xl:gap-1.5 2xl:gap-2">
            {/* View Children */}
            {hasChildren && level < 3 && (
              <CustomButton
                type="button"
                variant="outline"
                intent="secondary"
                disabled={busy || searchActive}
                onClick={() => onToggle(category.id)}
                leftSection={
                  isExpanded ? (
                    <EyeOff className="size-3 xl:size-4" strokeWidth={1.8} />
                  ) : (
                    <Eye className="size-3 xl:size-4" strokeWidth={1.8} />
                  )
                }
                className={buttonClass}
              >
                {isExpanded ? "بستن" : "مشاهده"}
              </CustomButton>
            )}

            {/* Order */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={busy || isFirstCategory}
                onClick={() => handleOrder("decrease")}
                aria-label="انتقال به بالا"
                className="border-border text-muted-foreground hover:border-custom-primary/45 hover:bg-custom-primary/6 hover:text-custom-primary 3xl:size-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 xl:size-9 2xl:size-9.5"
              >
                <ChevronUp
                  className="3xl:size-[19px] size-[15px] xl:size-[17px]"
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                disabled={busy || isLastCategory}
                onClick={() => handleOrder("increase")}
                aria-label="انتقال به پایین"
                className="border-border text-muted-foreground hover:border-custom-primary/45 hover:bg-custom-primary/6 hover:text-custom-primary 3xl:size-10 flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50 xl:size-9 2xl:size-9.5"
              >
                <ChevronDown
                  className="3xl:size-[19px] size-[15px] xl:size-[17px]"
                  strokeWidth={1.8}
                />
              </button>
            </div>

            {/* Add Child */}
            {canAddChild && (
              <CustomButton
                type="button"
                variant="outline"
                intent="secondary"
                disabled={busy}
                onClick={() => router.push(`/categories/${category.id}/add`)}
                leftSection={
                  <Plus className="size-3 xl:size-4" strokeWidth={1.8} />
                }
                className={buttonClass}
              >
                زیردسته
              </CustomButton>
            )}

            {/* Edit */}
            <CustomButton
              type="button"
              variant="outline"
              intent="secondary"
              disabled={busy}
              onClick={() => router.push(`/categories/${category.id}/edit`)}
              leftSection={
                <Pencil className="size-3 xl:size-4" strokeWidth={1.8} />
              }
              className={buttonClass}
            >
              ویرایش
            </CustomButton>

            {/* Delete */}
            <CustomHoldButton
              type="button"
              intent="destructive"
              variant="soft"
              duration={800}
              disabled={busy}
              onComplete={handleDelete}
              leftSection={
                <Trash2 className="size-3 xl:size-4" strokeWidth={1.8} />
              }
              className={buttonClass}
            >
              حذف
            </CustomHoldButton>
          </div>
        </div>
      </article>

      {/* Nested Rows */}
      {hasChildren && isExpanded && level < 3 && (
        <div
          ref={childrenRef}
          className="border-border 3xl:ms-8 3xl:ps-5 ms-4 mt-2 space-y-2 border-s ps-3 xl:ms-5 xl:ps-4 2xl:ms-6"
        >
          {children
            .filter((child) => (searchActive ? matchesCategory(child) : true))
            .map((child, index) => (
              <CategoryRow
                key={child.id}
                category={child}
                level={level + 1}
                animationIndex={index}
                childrenByParent={childrenByParent}
                expandedIds={expandedIds}
                onToggle={onToggle}
                matchesCategory={matchesCategory}
                searchActive={searchActive}
                refreshCategories={refreshCategories}
              />
            ))}

          {children.length === 0 && (
            <p className="text-muted-foreground py-3 text-sm">
              اطلاعات زیردسته‌بندی‌ها در پاسخ فعلی موجود نیست.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryRow;
