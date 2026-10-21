"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import HeaderLayout from "@/components/Layout/HeaderLayout";

import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  type Category,
} from "./categories.api";

import { categorySchema, type CategoryFormValues } from "./category.schema";

import { useCategoryFormAnimation } from "./useCategoryFormAnimation";

interface CategoryFormProps {
  mode: "create" | "edit";
  categoryId: number;
}

const CategoryForm = ({ mode, categoryId }: CategoryFormProps) => {
  const router = useRouter();
  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [category, setCategory] = useState<Category | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useCategoryFormAnimation(formRef);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setLoadError(false);
      setAllowed(false);

      try {
        const categories = await getCategories();

        const selected = categories.find((item) => item.id === categoryId);

        if (!selected) {
          throw new Error("Category not found");
        }

        if (mode === "create") {
          const byId = new Map(categories.map((item) => [item.id, item]));

          let depth = 1;
          let parentId = selected.parent?.id ?? null;

          const visited = new Set<number>([selected.id]);

          while (parentId !== null) {
            if (visited.has(parentId)) break;

            visited.add(parentId);

            const parent = byId.get(parentId);

            if (!parent) break;

            depth += 1;
            parentId = parent.parent?.id ?? null;
          }

          if (active) {
            setParentCategory(selected);
            setAllowed(depth < 3);
          }
        } else {
          const detail = await getCategory(categoryId);

          if (active) {
            setCategory(detail);
            reset({ name: detail.name });
            setAllowed(true);
          }
        }
      } catch (error) {
        console.error("GET CATEGORY ERROR:", error);

        if (active) {
          setLoadError(true);
          toast.error("خطا در دریافت اطلاعات دسته بندی.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadData();

    return () => {
      active = false;
    };
  }, [categoryId, mode, reset, toast]);

  const onSubmit = async (values: CategoryFormValues) => {
    if (!allowed) return;

    try {
      if (mode === "create") {
        await createCategory({
          name: values.name.trim(),
          parent_id: categoryId,
        });

        toast.success("زیردسته بندی با موفقیت ایجاد شد.");

        router.push("/categories");
      } else {
        if (!category) return;

        await updateCategory(category.id, {
          name: values.name.trim(),
          parent_id: category.parent?.id ?? null,
        });

        toast.success("دسته بندی با موفقیت ویرایش شد.");

        router.push("/categories");
      }

      router.refresh();
    } catch (error) {
      console.error("SAVE CATEGORY ERROR:", error);
      toast.error("خطا در ذخیره دسته بندی.");
    }
  };

  const isEdit = mode === "edit";

  return (
    <div
      dir="rtl"
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
    >
      <HeaderLayout
        title={isEdit ? "ویرایش دسته بندی" : "افزودن زیردسته بندی"}
        descrption={
          isEdit
            ? "ویرایش نام دسته بندی انتخابشده"
            : "ایجاد زیردسته بندی برای دسته بندی انتخابشده"
        }
      />

      <div className="3xl:px-8 3xl:py-6 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 py-4 xl:px-5 xl:py-5 2xl:px-6">
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 min-w-0 flex-1 grid-cols-[0.26fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
        >
          {/* Information */}
          <div className="category-form-info border-border bg-secondary-bg 3xl:p-7 flex min-h-0 min-w-0 flex-col overflow-hidden border-e p-4 xl:p-5 2xl:p-6">
            <h2 className="text-foreground 3xl:text-xl text-[16px] font-semibold xl:text-[18px] 2xl:text-[19px]">
              {isEdit ? "ویرایش دسته بندی" : "ایجاد زیردسته بندی"}
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-[12px] leading-5 xl:mt-2.5 xl:text-[13px] xl:leading-6">
              {isEdit
                ? "در این بخش میتوانید نام دسته بندی انتخابشده را ویرایش کنید. دسته بندی والد بدون تغییر باقی میماند."
                : "در این بخش میتوانید برای دسته بندی انتخابشده زیردسته بندی جدید ایجاد کنید."}
            </p>
          </div>

          {/* Fields */}
          <div className="category-form-fields bg-background 3xl:p-8 flex min-h-0 min-w-0 flex-col overflow-hidden p-4 xl:p-5 2xl:p-6">
            <div className="min-h-0 min-w-0 flex-1">
              {loading ? (
                <p className="text-muted-foreground text-sm">
                  در حال دریافت اطلاعات...
                </p>
              ) : loadError ? (
                <p className="text-destructive text-sm">
                  دریافت اطلاعات دسته بندی امکانپذیر نیست.
                </p>
              ) : !allowed ? (
                <p className="text-muted-foreground text-sm">
                  امکان افزودن زیردسته برای این سطح وجود ندارد.
                </p>
              ) : (
                <div className="3xl:gap-6 grid min-w-0 grid-cols-1 gap-3 xl:gap-4 2xl:gap-5">
                  {!isEdit && (
                    <div>
                      <p className="text-muted-foreground 3xl:text-sm mb-2 text-[12px] xl:text-[13px]">
                        دسته بندی والد
                      </p>

                      <div className="border-border bg-secondary-bg text-foreground 3xl:h-12 3xl:text-sm flex h-10 items-center rounded-lg border px-3 text-[12px] xl:h-11 xl:text-[13px]">
                        {parentCategory?.name}
                      </div>
                    </div>
                  )}

                  <FormField
                    label="نام دسته بندی"
                    placeholder="نام دسته بندی را وارد کنید"
                    register={register("name")}
                    error={errors.name}
                    as="input"
                    lang="fa"
                    dir="rtl"
                  />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="category-form-submit border-border bg-background 3xl:mt-5 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
              <CustomButton
                type="submit"
                variant="solid"
                intent="primary"
                loading={isSubmitting}
                disabled={loading || !allowed || isSubmitting}
                loadingContent={
                  <>
                    <LoaderCircle
                      className="size-4 animate-spin"
                      strokeWidth={1.8}
                    />
                    <span>در حال ثبت...</span>
                  </>
                }
                className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm h-10 min-w-[150px] px-3 text-[12px] xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px]"
              >
                {isEdit ? "ذخیره تغییرات" : "ثبت زیردسته بندی"}
              </CustomButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
