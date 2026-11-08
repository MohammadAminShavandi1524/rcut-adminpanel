"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  BookOpen,
  LoaderCircle,
  Plus,
  Search,
} from "lucide-react";

import HeaderLayout from "@/components/Layout/HeaderLayout";

import { cn } from "@/lib/utils";

import { CustomButton } from "@/components/ui/custom-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  getCatalogs,
  deleteCatalog,
  increaseCatalogIndex,
  decreaseCatalogIndex,
  type Catalog,
} from "./catalogs.api";

import {
  CATALOG_TABLE_COLUMNS,
  CATALOG_TABLE_MIN_WIDTH,
} from "./catalogs-table-layout";

import CatalogRow from "./CatalogRow";
import { useCatalogsAnimation } from "./useCatalogsAnimation";

const CatalogsPage = () => {
  const router = useRouter();
  const toast = useCustomToast();

  const pageRef = useRef<HTMLDivElement>(null);
  const orderingRef = useRef(false);

  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useCatalogsAnimation(pageRef);

  const refreshCatalogs = useCallback(async () => {
    const data = await getCatalogs();

    if (!Array.isArray(data)) {
      throw new Error("ساختار اطلاعات کاتالوگ‌ها معتبر نیست.");
    }

    setCatalogs(
      [...data].sort((a, b) => a.index - b.index),
    );

    setError(false);
  }, []);

  const loadCatalogs = useCallback(async () => {
    setLoading(true);

    try {
      await refreshCatalogs();
    } catch (err) {
      console.error("GET CATALOGS ERROR:", err);
      setCatalogs([]);
      setError(true);
      toast.error("دریافت کاتالوگ‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }, [refreshCatalogs, toast]);

  useEffect(() => {
    void loadCatalogs();
  }, [loadCatalogs]);

  const filteredCatalogs = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase("fa");

    if (!normalized) return catalogs;

    return catalogs.filter((catalog) =>
      `${catalog.title} ${catalog.description}`
        .toLocaleLowerCase("fa")
        .includes(normalized),
    );
  }, [catalogs, search]);

  const handleDelete = async (id: number) => {
    await deleteCatalog(id);

    setCatalogs((previous) =>
      previous.filter((catalog) => catalog.id !== id),
    );

    toast.success("کاتالوگ با موفقیت حذف شد.");

    try {
      await refreshCatalogs();
    } catch (err) {
      console.error("REFRESH CATALOGS ERROR:", err);
      toast.error("بروزرسانی لیست کاتالوگ‌ها ناموفق بود.");
    }
  };

  const handleOrder = async (
    id: number,
    action: "increase" | "decrease",
  ) => {
    if (orderingRef.current) return;

    orderingRef.current = true;

    try {
      if (action === "increase") {
        await increaseCatalogIndex(id);
      } else {
        await decreaseCatalogIndex(id);
      }

      await refreshCatalogs();
    } finally {
      orderingRef.current = false;
    }
  };

  return (
    <div
      ref={pageRef}
      dir="rtl"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
    >
      <HeaderLayout
        title="مدیریت کاتالوگ‌ها"
        descrption="مشاهده، مرتب‌سازی و مدیریت کاتالوگ‌های فروشگاه آرکات"
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <section className="catalogs-panel border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border">
          <div className="border-border 3xl:p-5 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b p-3 xl:p-4 2xl:p-4.5">
            <div className="catalogs-search 3xl:max-w-[520px] relative w-full max-w-[300px] min-w-0 xl:max-w-[400px] 2xl:max-w-[460px]">
              <Search
                strokeWidth={1.8}
                className="text-muted-foreground 3xl:start-4 3xl:size-[19px] pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 xl:start-3.5 xl:size-[17px]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                dir="rtl"
                placeholder="جستجوی کاتالوگ..."
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-custom-primary focus:ring-custom-primary/10 3xl:h-12 3xl:ps-11 3xl:pe-4 3xl:text-[15px] h-10 w-full rounded-lg border ps-10 pe-3 text-[12px] transition-[border-color,box-shadow] duration-300 outline-none focus:ring-2 xl:h-11 xl:text-[14px] 2xl:h-11.5"
              />
            </div>

            <CustomButton
              type="button"
              intent="primary"
              variant="solid"
              onClick={() => router.push("/catalogs/add")}
              className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-11 3xl:px-5 3xl:text-sm h-9 shrink-0 px-3 text-[12px] xl:h-10 xl:text-[13px]"
              leftSection={<Plus className="size-4" />}
            >
              افزودن کاتالوگ
            </CustomButton>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            {loading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center gap-3">
                <LoaderCircle
                  className="text-custom-primary size-5 animate-spin"
                  strokeWidth={1.7}
                />

                <span className="text-muted-foreground text-sm">
                  در حال دریافت کاتالوگ‌ها...
                </span>
              </div>
            ) : error ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4">
                <p className="text-muted-foreground text-sm">
                  دریافت کاتالوگ‌ها امکان‌پذیر نیست.
                </p>

                <CustomButton
                  type="button"
                  intent="secondary"
                  variant="outline"
                  onClick={() => void loadCatalogs()}
                  className="h-9 px-3 text-[12px] xl:text-[13px]"
                >
                  تلاش مجدد
                </CustomButton>
              </div>
            ) : (
              <div className="min-h-0 min-w-0 flex-1 overflow-x-auto xl:overflow-x-hidden">
                <div
                  className={cn(
                    "flex h-full min-h-0 w-full flex-col",
                    CATALOG_TABLE_MIN_WIDTH,
                  )}
                >
                  {/* Table Header */}
                  <div className="catalogs-table-header border-border bg-card-secondary 3xl:px-5 shrink-0 border-b px-3 xl:px-4 2xl:px-4.5">
                    <div
                      className={cn(
                        "text-muted-foreground 3xl:h-13 3xl:text-sm grid h-10 items-center gap-2 px-3 text-[11px] font-semibold xl:text-[12px] 2xl:text-[13px]",
                        CATALOG_TABLE_COLUMNS,
                      )}
                    >
                      <div>ترتیب</div>
                      <div>عنوان کاتالوگ</div>
                      <div>توضیحات</div>
                      <div>کاور</div>
                      <div className="hidden 2xl:block">
                        تاریخ ثبت
                      </div>
                      <div className="text-center">عملیات</div>
                    </div>
                  </div>

                  {filteredCatalogs.length > 0 ? (
                    <ScrollArea
                      data-lenis-prevent
                      dir="rtl"
                      className="min-h-0 min-w-0 flex-1"
                      scrollBarClassName="me-1.75"
                    >
                      <div className="3xl:space-y-2.5 3xl:p-5 space-y-2.5 p-3 xl:space-y-2 xl:p-4 2xl:p-4.5">
                        {filteredCatalogs.map((catalog, index) => (
                          <CatalogRow
                            key={catalog.id}
                            catalog={catalog}
                            animationIndex={index}
                            isFirst={catalogs[0]?.id === catalog.id}
                            isLast={
                              catalogs[catalogs.length - 1]?.id ===
                              catalog.id
                            }
                            onDelete={handleDelete}
                            onOrder={handleOrder}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                      <div className="border-border bg-secondary-bg 3xl:size-14 flex size-10 items-center justify-center rounded-xl border xl:size-11 2xl:size-12">
                        <BookOpen
                          className="text-muted-foreground 3xl:size-6 size-[18px] xl:size-5"
                          strokeWidth={1.6}
                        />
                      </div>

                      <h3 className="text-foreground 3xl:text-base text-[13px] font-semibold xl:text-sm">
                        کاتالوگی یافت نشد
                      </h3>

                      <p className="text-muted-foreground text-[12px] xl:text-[13px] 2xl:text-sm">
                        {search.trim()
                          ? "هیچ کاتالوگی با عبارت جستجو شده مطابقت ندارد."
                          : "هنوز کاتالوگی در فروشگاه ثبت نشده است."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CatalogsPage;