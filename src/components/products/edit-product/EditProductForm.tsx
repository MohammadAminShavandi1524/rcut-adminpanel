"use client";

import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  editProductSchema,
  type EditProductValues,
} from "./edit-product.schema";

import {
  getProduct,
  updateProduct,
  uploadProductImage,
} from "./edit-product.api";

import type { Product } from "../products.api";

import EditProductImageField from "./EditProductImageField";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
  productId: number;
}

const EditProductForm = ({ productId }: EditProductFormProps) => {
  const toast = useCustomToast();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),

    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      new: false,
      top_seller: false,
    },
  });

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getProduct(productId);

        if (!active) return;

        setProduct(data);

        reset({
          name: data.name,
          description: data.description,
          image: undefined,
          new: data.new,
          top_seller: data.top_seller,
        });
      } catch (error) {
        if (!active) return;

        console.error("GET PRODUCT ERROR:", error);

        setLoadError(true);

        toast.error(
          error instanceof Error
            ? error.message
            : "دریافت اطلاعات محصول ناموفق بود.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [productId, reset, toast]);

  const onSubmit = async (values: EditProductValues) => {
    if (!product) return;

    try {
      setUploadProgress(0);

      let imageUrl: string | null = null;

      if (values.image) {
        setIsUploading(true);

        imageUrl = await uploadProductImage(values.image, setUploadProgress);

        setIsUploading(false);
      }

      await updateProduct(product.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        image: imageUrl,
        category_id: product.category.id,
        new: values.new,
        top_seller: values.top_seller,
      });

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              name: values.name.trim(),
              description: values.description.trim(),
              image: imageUrl ?? prev.image,
              new: values.new,
              top_seller: values.top_seller,
            }
          : prev,
      );

      reset({
        name: values.name.trim(),
        description: values.description.trim(),
        image: undefined,
        new: values.new,
        top_seller: values.top_seller,
      });

      setUploadProgress(0);

      toast.success("محصول با موفقیت ویرایش شد.");

      router.replace("/products");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "ویرایش محصول ناموفق بود.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="border-border bg-background flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border">
        <LoaderCircle
          className="text-custom-primary size-6 animate-spin"
          strokeWidth={1.7}
        />

        <p className="text-muted-foreground text-sm">
          در حال دریافت اطلاعات محصول...
        </p>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="border-border bg-background flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border px-4">
        <h2 className="text-foreground text-sm font-semibold">
          دریافت اطلاعات محصول ناموفق بود.
        </h2>

        <p className="text-muted-foreground text-center text-xs">
          اطلاعات این محصول قابل نمایش نیست.
        </p>
      </div>
    );
  }

  const categoryLabel = product.category.parent
    ? `${product.category.parent.name} / ${product.category.name}`
    : product.category.name;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="border-border bg-background 3xl:grid-cols-[0.36fr_minmax(0,1fr)] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border lg:grid lg:grid-cols-[0.26fr_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[0.32fr_minmax(0,1fr)] 2xl:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      {/* Information */}
      <aside className="border-border bg-secondary-bg 3xl:p-7 border-b p-4 lg:border-e lg:border-b-0 xl:p-5 2xl:p-6">
        <h2 className="text-foreground 3xl:text-xl text-base font-semibold xl:text-lg">
          ویرایش محصول
        </h2>

        <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-xs leading-6 xl:text-[13px]">
          نام، توضیحات و وضعیت محصول را در صورت نیاز ویرایش کنید. برای تغییر
          تصویر، تصویر جدیدی انتخاب کنید. در صورتی که تصویر را تغییر ندهید،
          تصویر فعلی حفظ میشود. دسته بندی محصول قابل تغییر نیست.
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
            {/* Category - Read Only */}
            <div className="flex min-w-0 flex-col gap-2 sm:gap-3">
              <div className="flex items-center justify-between gap-1 px-1.5">
                <label className="text-foreground text-sm font-semibold">
                  دسته بندی محصول
                </label>
              </div>

              <div
                className="border-foreground/8 bg-secondary-bg text-muted-foreground flex h-11 w-full items-center rounded-lg border px-3 text-sm sm:h-12 sm:px-4 sm:text-base"
                title={categoryLabel}
              >
                <span className="min-w-0 truncate">{categoryLabel}</span>
              </div>
            </div>

            {/* Name */}
            <FormField
              label="نام محصول"
              placeholder="نام محصول را وارد کنید"
              register={register("name")}
              error={errors.name}
              as="input"
              lang="fa"
              dir="rtl"
            />

            {/* Description */}
            <FormField
              label="توضیحات محصول"
              placeholder="توضیحات محصول را وارد کنید"
              register={register("description")}
              error={errors.description}
              as="textarea"
              lang="fa"
              dir="rtl"
            />

            {/* Status */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="px-1.5">
                <label className="text-foreground text-sm font-semibold">
                  وضعیت محصول
                </label>
              </div>

              <div className="border-foreground/8 bg-secondary-bg flex min-h-12 flex-wrap items-center gap-x-8 gap-y-3 rounded-lg border px-4 py-3">
                <label className="text-foreground inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register("new")}
                    className="accent-custom-primary size-4 cursor-pointer"
                  />

                  <span>جدید</span>
                </label>

                <label className="text-foreground inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register("top_seller")}
                    className="accent-custom-primary size-4 cursor-pointer"
                  />

                  <span>پرفروش</span>
                </label>
              </div>
            </div>

            {/* Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <EditProductImageField
                  currentImage={product.image}
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
        </ScrollArea>

        {/* Submit */}
        <div className="border-border bg-background 3xl:pt-6 mt-4 flex shrink-0 justify-end border-t pt-4 xl:mt-5 xl:pt-5">
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
                    : "در حال ویرایش محصول..."}
                </span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 h-10 min-w-[160px] px-4 text-xs xl:h-11 xl:min-w-[180px] xl:text-sm"
          >
            ثبت تغییرات
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default EditProductForm;
