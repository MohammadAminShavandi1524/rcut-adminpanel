"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import {
  editBrandSchema,
  type EditBrandValues,
} from "./edit-brand.schema";

import {
  getBrand,
  updateBrand,
  uploadBrandImage,
} from "./edit-brand.api";

import type { Brand } from "../brands.api";

import EditBrandImageField from "./EditBrandImageField";

interface EditBrandFormProps {
  brandId: number;
}

const EditBrandForm = ({ brandId }: EditBrandFormProps) => {
  const toast = useCustomToast();
  const router = useRouter();

  const [brand, setBrand] = useState<Brand | null>(null);
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
  } = useForm<EditBrandValues>({
    resolver: zodResolver(editBrandSchema),

    defaultValues: {
      name: "",
      description: "",
      image: undefined,
    },
  });

  useEffect(() => {
    let active = true;

    const loadBrand = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getBrand(brandId);

        if (!active) return;

        setBrand(data);

        reset({
          name: data.name,
          description: data.description,
          image: undefined,
        });
      } catch (error) {
        if (!active) return;

        console.error("GET BRAND ERROR:", error);
        setLoadError(true);

        toast.error(
          error instanceof Error
            ? error.message
            : "دریافت اطلاعات برند ناموفق بود.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadBrand();

    return () => {
      active = false;
    };
  }, [brandId, reset, toast]);

  const onSubmit = async (values: EditBrandValues) => {
    if (!brand) return;

    try {
      setUploadProgress(0);

      // Unchanged image is sent as null.
      let imageUrl: string | null = null;

      if (values.image) {
        setIsUploading(true);

        imageUrl = await uploadBrandImage(
          values.image,
          setUploadProgress,
        );

        setIsUploading(false);
      }

      await updateBrand(brand.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        image: imageUrl,
      });

      setBrand((previous) =>
        previous
          ? {
              ...previous,
              name: values.name.trim(),
              description: values.description.trim(),
              image: imageUrl ?? previous.image,
            }
          : previous,
      );

      reset({
        name: values.name.trim(),
        description: values.description.trim(),
        image: undefined,
      });

      setUploadProgress(0);

      toast.success("برند با موفقیت ویرایش شد.");

      router.replace("/brands");
    } catch (error) {
      console.error("UPDATE BRAND ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "ویرایش برند ناموفق بود.",
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
          در حال دریافت اطلاعات برند...
        </p>
      </div>
    );
  }

  if (loadError || !brand) {
    return (
      <div className="border-border bg-background flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border px-4">
        <h2 className="text-foreground text-sm font-semibold">
          دریافت اطلاعات برند ناموفق بود.
        </h2>

        <p className="text-muted-foreground text-center text-xs">
          اطلاعات این برند قابل نمایش نیست.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="border-border bg-background 3xl:grid-cols-[0.36fr_minmax(0,1fr)] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border lg:grid lg:grid-cols-[0.26fr_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[0.32fr_minmax(0,1fr)] 2xl:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      {/* Information */}
      <aside className="border-border bg-secondary-bg 3xl:p-7 border-b p-4 lg:border-e lg:border-b-0 xl:p-5 2xl:p-6">
        <h2 className="text-foreground 3xl:text-xl text-base font-semibold xl:text-lg">
          ویرایش برند
        </h2>

        <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-xs leading-6 xl:text-[13px]">
          نام و توضیحات برند را در صورت نیاز ویرایش کنید.
          برای تغییر تصویر، تصویر جدیدی انتخاب کنید.
          اگر تصویر را تغییر ندهید، تصویر فعلی حفظ می‌شود.
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
            {/* Name */}
            <FormField
              label="نام برند"
              placeholder="نام برند را وارد کنید"
              register={register("name")}
              error={errors.name}
              as="input"
              lang="fa"
              dir="rtl"
            />

            {/* Description */}
            <FormField
              label="توضیحات برند"
              placeholder="توضیحات برند را وارد کنید"
              register={register("description")}
              error={errors.description}
              as="textarea"
              lang="fa"
              dir="rtl"
            />

            {/* Image */}
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <EditBrandImageField
                  currentImage={brand.image}
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
                    : "در حال ویرایش برند..."}
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

export default EditBrandForm;