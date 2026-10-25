"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { LoaderCircle, PackageX } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import ProductRow from "./ProductRow";
import ProductsFilters from "./ProductsFilters";

import {
  deleteProduct,
  getProducts,
  type Product,
  type ProductCategory,
} from "./products.api";

import {
  PRODUCT_TABLE_COLUMNS,
  PRODUCT_TABLE_MIN_WIDTH,
} from "./products-table-layout";

import { useProductsTableAnimation } from "./useProductsTableAnimation";
import { cn } from "@/lib/utils";

const ProductsTable = () => {
  const toast = useCustomToast();

  const tableRef = useRef<HTMLElement>(null);

  const deletingIdsRef = useRef<Set<number>>(new Set());

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");

  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyTopSeller, setOnlyTopSeller] = useState(false);

  useProductsTableAnimation(tableRef);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
      setError(false);
    } catch (err) {
      console.error("GET PRODUCTS ERROR:", err);

      setProducts([]);
      setError(true);

      toast.error("دریافت محصولات ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const categories = useMemo(() => {
    const byId = new Map<number, ProductCategory>();

    for (const product of products) {
      if (product.category) {
        byId.set(product.category.id, product.category);
      }
    }

    return [...byId.values()].sort((a, b) => {
      const parentComparison = (a.parent?.name ?? "").localeCompare(
        b.parent?.name ?? "",
        "fa",
      );

      return (
        parentComparison ||
        a.index - b.index ||
        a.name.localeCompare(b.name, "fa")
      );
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fa");

    return products.filter((product) => {
      if (categoryId !== null && product.category?.id !== categoryId) {
        return false;
      }

      if (onlyNew && !product.new) {
        return false;
      }

      if (onlyTopSeller && !product.top_seller) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = [
        product.name,
        product.description,
        product.category?.name ?? "",
        product.category?.parent?.name ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase("fa");

      return searchableText.includes(normalizedSearch);
    });
  }, [products, search, categoryId, onlyNew, onlyTopSeller]);

  const handleDelete = async (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((product) => product.id !== id));

      toast.success("محصول با موفقیت حذف شد.");
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      toast.error("حذف محصول ناموفق بود.");
    } finally {
      deletingIdsRef.current.delete(id);
    }
  };

  const hasActiveFilters =
    search.trim().length > 0 || categoryId !== null || onlyNew || onlyTopSeller;

  return (
    <section
      ref={tableRef}
      dir="rtl"
      className="border-border bg-card flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border"
    >
      {/* Filters */}
      <ProductsFilters
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        onlyNew={onlyNew}
        onOnlyNewChange={setOnlyNew}
        onlyTopSeller={onlyTopSeller}
        onOnlyTopSellerChange={setOnlyTopSeller}
        categories={categories}
      />

      {/* Table */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {loading ? (
          <div className="flex min-h-0 flex-1 items-center justify-center gap-3">
            <LoaderCircle
              className="text-custom-primary size-5 animate-spin"
              strokeWidth={1.7}
            />

            <span className="text-muted-foreground text-sm">
              در حال دریافت محصولات...
            </span>
          </div>
        ) : error ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4">
            <p className="text-muted-foreground text-sm">
              دریافت محصولات امکان‌پذیر نیست.
            </p>

            <CustomButton
              type="button"
              intent="secondary"
              variant="outline"
              onClick={() => void loadProducts()}
              className="h-9 px-3 text-[12px] xl:text-[13px]"
            >
              تلاش مجدد
            </CustomButton>
          </div>
        ) : (
          <div className="min-h-0 min-w-0 flex-1 overflow-x-auto">
            <div
              className={`flex h-full min-h-0 w-full flex-col ${PRODUCT_TABLE_MIN_WIDTH}`}
            >
              {/* Header */}
              <div className="border-border bg-card-secondary 3xl:px-5 shrink-0 border-b px-3 xl:px-4 2xl:px-4.5">
                <div
                  className={cn(
                    "text-muted-foreground 3xl:h-13 3xl:text-sm grid h-10 items-center gap-2 px-3 text-[11px] font-semibold xl:text-[12px] 2xl:text-[13px]",
                    PRODUCT_TABLE_COLUMNS,
                  )}
                >
                  <div className="min-w-0">نام محصول</div>
                  <div className="min-w-0">دسته بندی</div>
                  <div className="min-w-0">تصویر</div>
                  <div className="min-w-0">وضعیت</div>
                  <div className="min-w-0">تاریخ ثبت</div>
                  <div className="min-w-0 text-center">عملیات</div>
                </div>
              </div>

              {/* Body */}
              {filteredProducts.length > 0 ? (
                <ScrollArea
                  data-lenis-prevent
                  dir="rtl"
                  className="min-h-0 min-w-0 flex-1"
                  scrollBarClassName="me-1.75"
                >
                  <div className="3xl:space-y-2.5 3xl:p-5 space-y-2.5 p-3 xl:space-y-2 xl:p-4 2xl:p-4.5">
                    {filteredProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
                  <div className="border-border bg-secondary-bg 3xl:size-14 flex size-10 items-center justify-center rounded-xl border xl:size-11 2xl:size-12">
                    <PackageX
                      className="text-muted-foreground 3xl:size-6 size-[18px] xl:size-5"
                      strokeWidth={1.6}
                    />
                  </div>

                  <h3 className="text-foreground 3xl:text-base text-[13px] font-semibold xl:text-sm 2xl:text-[15px]">
                    محصولی یافت نشد
                  </h3>

                  <p className="text-muted-foreground text-[12px] xl:text-[13px] 2xl:text-sm">
                    {hasActiveFilters
                      ? "هیچ محصولی با جستجو و فیلترهای انتخاب شده مطابقت ندارد."
                      : "هنوز محصولی در فروشگاه ثبت نشده است."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsTable;
