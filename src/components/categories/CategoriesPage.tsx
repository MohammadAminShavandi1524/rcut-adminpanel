"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

import HeaderLayout from "@/components/Layout/HeaderLayout";
import { CustomButton } from "@/components/ui/custom-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import { getCategories, type Category } from "./categories.api";
import CategoryRow from "./CategoryRow";
import { useCategoriesAnimation } from "./useCategoriesAnimation";

const CategoriesPage = () => {
  const router = useRouter();
  const toast = useCustomToast();

  const pageRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useCategoriesAnimation(pageRef);

  const refreshCategories = useCallback(async () => {
    const data = await getCategories();

    if (!Array.isArray(data)) {
      throw new Error("Invalid category response");
    }

    setCategories(data);
    setError(false);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await getCategories();

        if (!Array.isArray(data)) {
          throw new Error("Invalid category response");
        }

        if (active) {
          setCategories(data);
          setError(false);
        }
      } catch (err) {
        console.error("GET CATEGORIES ERROR:", err);

        if (active) {
          setError(true);
          toast.error("خطا در دریافت دسته بندیها.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [toast]);

  const childrenByParent = useMemo(() => {
    const map = new Map<number, Category[]>();

    for (const category of categories) {
      if (category.parent === null) {
        const roots = map.get(0) ?? [];
        roots.push(category);
        map.set(0, roots);
        continue;
      }

      const parentId = category.parent.id;
      const children = map.get(parentId) ?? [];

      children.push(category);
      map.set(parentId, children);
    }

    for (const children of map.values()) {
      children.sort((a, b) => a.index - b.index);
    }

    return map;
  }, [categories]);

  const mainCategories = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    const roots = categories
      .filter((category) => category.parent === null)
      .sort((a, b) => a.index - b.index);

    if (!normalized) return roots;

    const matchesTree = (
      category: Category,
      visited = new Set<number>(),
    ): boolean => {
      if (visited.has(category.id)) return false;

      const nextVisited = new Set(visited);
      nextVisited.add(category.id);

      if (category.name.toLowerCase().includes(normalized)) {
        return true;
      }

      return (childrenByParent.get(category.id) ?? []).some((child) =>
        matchesTree(child, nextVisited),
      );
    };

    return roots.filter((category) => matchesTree(category));
  }, [categories, childrenByParent, search]);

  const toggleCategory = useCallback((id: number) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const normalizedSearch = search.trim().toLowerCase();

  const matchesCategory = useCallback(
    (category: Category, visited = new Set<number>()): boolean => {
      if (!normalizedSearch) return true;
      if (visited.has(category.id)) return false;

      const next = new Set(visited);
      next.add(category.id);

      if (category.name.toLowerCase().includes(normalizedSearch)) {
        return true;
      }

      return (childrenByParent.get(category.id) ?? []).some((child) =>
        matchesCategory(child, next),
      );
    },
    [normalizedSearch, childrenByParent],
  );

  return (
    <div
      ref={pageRef}
      dir="rtl"
      className="flex min-h-0 min-w-0 flex-1 flex-col"
    >
      <HeaderLayout
        title="دسته بندیها"
        descrption="مدیریت دسته بندیها و زیردسته بندیهای محصولات فروشگاه"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col px-3 py-3 xl:px-5 xl:py-5 2xl:px-6">
        <section className="categories-panel border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
          {/* Toolbar */}
          <div className="border-border 3xl:p-5 flex shrink-0 items-center justify-between gap-3 border-b p-3 xl:p-4 2xl:p-4.5">
            <div className="categories-search 3xl:max-w-[520px] relative w-full max-w-[300px] min-w-0 xl:max-w-[400px] 2xl:max-w-[460px]">
              <Search
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir="rtl"
                placeholder="جستجوی دسته بندی..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-10 w-full rounded-lg border ps-10 pe-3 text-[12px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:text-[14px] 2xl:h-11.5"
              />
            </div>

            <CustomButton
              type="button"
              intent="primary"
              variant="solid"
              onClick={() => router.push("/categories/add")}
              className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-11 3xl:px-5 3xl:text-sm h-9 shrink-0 px-3 text-[12px] xl:h-10 xl:text-[13px]"
              leftSection={<Plus className="size-4" />}
            >
              افزودن دسته بندی
            </CustomButton>
          </div>

          {/* Table */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {/* Table Header */}
            <div className="categories-table-header border-border bg-card-secondary 3xl:ps-9 3xl:pe-11 shrink-0 border-b ps-6 pe-6 xl:ps-7 xl:pe-7">
              <div className="text-muted-foreground 3xl:h-13 3xl:grid-cols-[70px_minmax(0,1fr)_minmax(0,540px)] 3xl:gap-5 3xl:text-sm grid h-12 grid-cols-[42px_minmax(0,1fr)_minmax(0,370px)] items-center gap-2 text-[11px] font-semibold xl:grid-cols-[52px_minmax(0,1fr)_minmax(0,490px)] xl:gap-3 xl:text-[12px] 2xl:grid-cols-[60px_minmax(0,1fr)_minmax(0,520px)] 2xl:gap-4 2xl:text-[13px]">
                <div>ترتیب</div>
                <div>نام دسته‌بندی</div>
                <div className="text-center">عملیات</div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-1 items-center justify-center gap-3">
                <span className="border-custom-primary size-5 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-muted-foreground text-sm">
                  در حال دریافت دسته بندیها...
                </span>
              </div>
            ) : error ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3">
                <p className="text-muted-foreground text-sm">
                  دریافت دسته بندیها امکانپذیر نیست.
                </p>

                <CustomButton
                  type="button"
                  variant="outline"
                  intent="secondary"
                  onClick={() => {
                    setLoading(true);
                    void refreshCategories()
                      .catch((err) => {
                        console.error(err);
                        setError(true);
                        toast.error("خطا در دریافت دسته بندیها.");
                      })
                      .finally(() => setLoading(false));
                  }}
                >
                  تلاش مجدد
                </CustomButton>
              </div>
            ) : mainCategories.length > 0 ? (
              <ScrollArea
                dir="rtl"
                className="min-h-0 min-w-0 flex-1"
                scrollBarClassName="me-1.75"
              >
                <div className="3xl:space-y-2.5 3xl:p-4 3xl:pe-6 space-y-2.5 p-3 pe-5 xl:space-y-2 xl:p-3 xl:pe-4.5 2xl:p-3.5 2xl:pe-5">
                  {mainCategories.map((category, index) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      level={1}
                      animationIndex={index}
                      childrenByParent={childrenByParent}
                      expandedIds={expandedIds}
                      onToggle={toggleCategory}
                      matchesCategory={matchesCategory}
                      searchActive={Boolean(normalizedSearch)}
                      refreshCategories={refreshCategories}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <h3 className="text-foreground text-base font-semibold">
                  دسته بندیای پیدا نشد
                </h3>

                <p className="text-muted-foreground mt-2 text-justify text-sm leading-7">
                  {search.trim()
                    ? "هیچ دسته بندیای با عبارت جستجوشده مطابقت ندارد."
                    : "هنوز دسته بندیای ثبت نشده است."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CategoriesPage;
