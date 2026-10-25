"use client";

import { useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import { addProductSchema, type AddProductValues } from "./add-product.schema";

import { createProduct, uploadProductImage } from "./add-product.api";

import ProductCategorySelect from "./ProductCategorySelect";
import ProductImageUploadField from "./ProductImageUploadField";

import { useAddProductAnimation } from "./useAddProductAnimation";

const AddProductForm = () => {
  const toast = useCustomToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  useAddProductAnimation(formRef);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddProductValues>({
    resolver: zodResolver(addProductSchema),

    defaultValues: {
      name: "",
      description: "",
      category_id: 0,
      image: undefined,
    },
  });

  const onSubmit = async (values: AddProductValues) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      const imageUrl = await uploadProductImage(
        values.image,
        setUploadProgress,
      );

      setIsUploading(false);

      await createProduct({
        name: values.name.trim(),
        description: values.description.trim(),
        image: imageUrl,
        category_id: values.category_id,
      });

      reset({
        name: "",
        description: "",
        category_id: 0,
        image: undefined,
      });

      setUploadProgress(0);

      toast.success("محصول با موفقیت ثبت شد.");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "ثبت محصول ناموفق بود.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="border-border bg-background 3xl:grid-cols-[0.36fr_minmax(0,1fr)] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border lg:grid lg:grid-cols-[0.26fr_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[0.32fr_minmax(0,1fr)] 2xl:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      {/* Information */}
      <aside className="add-product-info border-border bg-secondary-bg 3xl:p-7 border-b p-4 lg:border-e lg:border-b-0 xl:p-5 2xl:p-6">
        <h2 className="text-foreground 3xl:text-xl text-base font-semibold xl:text-lg">
          افزودن محصول جدید
        </h2>

        <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-xs leading-6 xl:text-[13px]">
          ابتدا دسته بندی نهایی را انتخاب کنید سپس نام و توضیحات محصول و تصویر
          آن را وارد کنید. پس از آپلود تصویر محصول در فروشگاه ثبت میشود.
        </p>
      </aside>

      {/* Fields */}
      <div className="bg-background 3xl:p-8 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 xl:p-5 2xl:p-6">
        <ScrollArea
          data-lenis-prevent
          dir="rtl"
          className="3xl:pe-5 min-h-0 min-w-0 flex-1 overflow-hidden pe-3 xl:pe-4"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-8 flex min-w-0 flex-col gap-5 pb-5 xl:gap-6 xl:pb-6">
            {/* Category */}
            <div className="add-product-field min-w-0">
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => (
                  <ProductCategorySelect
                    field={field}
                    error={errors.category_id}
                  />
                )}
              />
            </div>

            {/* Name */}
            <div className="add-product-field min-w-0">
              <FormField
                label="نام محصول"
                placeholder="نام محصول را وارد کنید"
                register={register("name")}
                error={errors.name}
                as="input"
                lang="fa"
                dir="rtl"
              />
            </div>

            {/* Description */}
            <div className="add-product-field min-w-0">
              <FormField
                label="توضیحات محصول"
                placeholder="توضیحات محصول را وارد کنید"
                register={register("description")}
                error={errors.description}
                as="textarea"
                lang="fa"
                dir="rtl"
              />
            </div>

            {/* Image */}
            <div className="add-product-field min-w-0">
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <ProductImageUploadField
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.image?.message}
                    progress={uploadProgress}
                    isUploading={isUploading}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Submit */}
        <div className="add-product-submit border-border bg-background 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:mt-5 xl:pt-5">
          <CustomButton
            type="submit"
            variant="solid"
            intent="primary"
            loading={isSubmitting}
            loadingContent={
              <>
                <LoaderCircle className="size-4 animate-spin" />

                <span>
                  {isUploading
                    ? "در حال آپلود تصویر..."
                    : "در حال ثبت محصول..."}
                </span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 h-10 min-w-[160px] px-4 text-xs xl:h-11 xl:min-w-[180px] xl:text-sm"
          >
            ثبت محصول
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
