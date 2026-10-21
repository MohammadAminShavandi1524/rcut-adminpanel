"use client";

import { useRef } from "react";

import { FolderPlus, LoaderCircle } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormField } from "@/components/FormField";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  addCategorySchema,
  type AddCategoryFormValues,
} from "./add-category.schema";

import { createCategory } from "./add-category.api";

import { useAddCategoryAnimation } from "./useAddCategoryAnimation";

const AddCategoryForm = () => {
  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  useAddCategoryAnimation(formRef);

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isSubmitting },
  } = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),

    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: AddCategoryFormValues) => {
    try {
      await createCategory({
        name: data.name.trim(),
      });

      reset();

      toast.success("دسته‌بندی با موفقیت ایجاد شد.");
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);

      toast.error("خطا در ایجاد دسته‌بندی. دوباره تلاش کنید.");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="border-border bg-background 3xl:grid-cols-[0.36fr_1fr] grid min-h-0 min-w-0 flex-1 grid-cols-[0.26fr_1fr] grid-rows-[minmax(0,1fr)] overflow-hidden rounded-xl border xl:grid-cols-[0.32fr_1fr] 2xl:grid-cols-[0.34fr_1fr]"
    >
      {/* Information */}
      <div className="add-category-info border-border bg-secondary-bg 3xl:p-7 relative flex min-h-0 min-w-0 flex-col overflow-hidden border-e p-4 xl:p-5 2xl:p-6">
        <div>
          <div className="">
            <h2 className="text-foreground 3xl:text-xl text-[16px] font-semibold xl:text-[18px] 2xl:text-[19px]">
              افزودن دسته‌بندی اصلی
            </h2>

            <p className="text-muted-foreground 3xl:mt-3 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-[12px] leading-5 xl:mt-2.5 xl:text-[13px] xl:leading-6">
              در این بخش می‌توانید دسته‌بندی‌های اصلی محصولات فروشگاه را ایجاد
              کنید. برای ثبت دسته‌بندی، نام آن را وارد کرده و روی دکمه ثبت کلیک
              کنید.
            </p>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="add-category-fields bg-background 3xl:p-8 flex min-h-0 min-w-0 flex-col overflow-hidden p-4 xl:p-5 2xl:p-6">
        <div className="min-h-0 min-w-0 flex-1">
          <div className="3xl:gap-6 grid min-w-0 grid-cols-1 gap-3 xl:gap-4 2xl:gap-5">
            <FormField
              label="نام دسته‌بندی"
              placeholder="نام دسته‌بندی را وارد کنید"
              register={register("name")}
              error={errors.name}
              as="input"
              lang="fa"
              dir="rtl"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="add-category-submit border-border bg-background 3xl:mt-5 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:pt-4 2xl:mt-5 2xl:pt-5">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
            loadingContent={
              <>
                <LoaderCircle
                  className="3xl:size-4 size-4 animate-spin xl:size-[15px]"
                  strokeWidth={1.8}
                />

                <span>در حال ثبت...</span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 3xl:min-w-[190px] 3xl:px-6 3xl:text-sm h-10 min-w-[150px] px-3 text-[12px] xl:h-10.5 xl:min-w-[165px] xl:px-4 xl:text-[13px] 2xl:h-11 2xl:min-w-[175px]"
          >
            ثبت دسته‌بندی
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default AddCategoryForm;
