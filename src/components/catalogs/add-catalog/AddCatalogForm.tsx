"use client";

import { useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { FormField } from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomButton } from "@/components/ui/custom-button";
import { useCustomToast } from "@/components/ui/custom-toast";

import CatalogBrandSelect from "../CatalogBrandSelect";

import { addCatalogSchema, type AddCatalogValues } from "./add-catalog.schema";

import {
  createCatalog,
  uploadCatalogMedia,
  type CatalogMediaKind,
} from "./add-catalog.api";

import CatalogUploadField from "./CatalogUploadField";

const AddCatalogForm = () => {
  const toast = useCustomToast();

  const [uploadingKind, setUploadingKind] = useState<CatalogMediaKind | null>(
    null,
  );

  const [coverProgress, setCoverProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCatalogValues>({
    resolver: zodResolver(addCatalogSchema),
    defaultValues: {
      title: "",
      description: "",
      brand_id: 0,
      cover: undefined,
      image: undefined,
      file: undefined,
    },
  });

  const onSubmit = async (values: AddCatalogValues) => {
    try {
      setCoverProgress(0);
      setImageProgress(0);
      setPdfProgress(0);

      setUploadingKind("cover");

      const coverUrl = await uploadCatalogMedia(
        values.cover,
        "cover",
        setCoverProgress,
      );

      setUploadingKind("image");

      const imageUrl = await uploadCatalogMedia(
        values.image,
        "image",
        setImageProgress,
      );

      setUploadingKind("pdf");

      const pdfUrl = await uploadCatalogMedia(
        values.file,
        "pdf",
        setPdfProgress,
      );

      setUploadingKind(null);

      await createCatalog({
        title: values.title.trim(),
        description: values.description.trim(),
        brand_id: values.brand_id,
        cover: coverUrl,
        image: imageUrl,
        file: pdfUrl,
      });

      reset({
        title: "",
        description: "",
        brand_id: 0,
        cover: undefined,
        image: undefined,
        file: undefined,
      });

      setCoverProgress(0);
      setImageProgress(0);
      setPdfProgress(0);

      toast.success("کاتالوگ با موفقیت ثبت شد.");
    } catch (error) {
      console.error("CREATE CATALOG ERROR:", error);

      toast.error(
        error instanceof Error ? error.message : "ثبت کاتالوگ ناموفق بود.",
      );
    } finally {
      setUploadingKind(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      dir="rtl"
      className="border-border bg-background 3xl:grid-cols-[0.36fr_minmax(0,1fr)] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border lg:grid lg:grid-cols-[0.26fr_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)] xl:grid-cols-[0.32fr_minmax(0,1fr)] 2xl:grid-cols-[0.34fr_minmax(0,1fr)]"
    >
      <aside className="border-border bg-secondary-bg 3xl:p-7 border-b p-4 lg:border-e lg:border-b-0 xl:p-5 2xl:p-6">
        <h2 className="text-foreground 3xl:text-xl text-base font-semibold xl:text-lg">
          افزودن کاتالوگ جدید
        </h2>

        <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-xs leading-6 xl:text-[13px]">
          عنوان، توضیحات و برند کاتالوگ را انتخاب کنید. سپس کاور، تصویر بنر و
          فایل PDF را بارگذاری کنید. تصویر بنر مستقل از کاور ذخیره می‌شود.
        </p>
      </aside>

      <div className="bg-background 3xl:p-8 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 xl:p-5 2xl:p-6">
        <ScrollArea
          data-lenis-prevent
          dir="rtl"
          className="3xl:pe-5 min-h-0 min-w-0 flex-1 overflow-hidden pe-3 xl:pe-4"
          scrollBarClassName="me-0"
        >
          <div className="3xl:gap-8 flex min-w-0 flex-col gap-5 pb-5 xl:gap-6 xl:pb-6">
            <FormField
              label="عنوان کاتالوگ"
              placeholder="عنوان کاتالوگ را وارد کنید"
              register={register("title")}
              error={errors.title}
              as="input"
              lang="fa"
              dir="rtl"
            />

            <FormField
              label="توضیحات کاتالوگ"
              placeholder="توضیحات کاتالوگ را وارد کنید"
              register={register("description")}
              error={errors.description}
              as="textarea"
              lang="fa"
              dir="rtl"
            />

            <Controller
              control={control}
              name="brand_id"
              render={({ field }) => (
                <CatalogBrandSelect
                  value={field.value || null}
                  onChange={(id) => field.onChange(id ?? 0)}
                  error={errors.brand_id?.message}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="cover"
              render={({ field }) => (
                <CatalogUploadField
                  kind="cover"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.cover?.message}
                  progress={coverProgress}
                  isUploading={uploadingKind === "cover"}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <CatalogUploadField
                  kind="image"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  progress={imageProgress}
                  isUploading={uploadingKind === "image"}
                  disabled={isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <CatalogUploadField
                  kind="pdf"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.file?.message}
                  progress={pdfProgress}
                  isUploading={uploadingKind === "pdf"}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
        </ScrollArea>

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
                  {uploadingKind === "cover"
                    ? "در حال آپلود کاور..."
                    : uploadingKind === "image"
                      ? "در حال آپلود بنر..."
                      : uploadingKind === "pdf"
                        ? "در حال آپلود PDF..."
                        : "در حال ثبت کاتالوگ..."}
                </span>
              </>
            }
            className="bg-custom-primary hover:bg-custom-primary/90 3xl:h-12 h-10 min-w-[160px] px-4 text-xs xl:h-11 xl:min-w-[180px] xl:text-sm"
          >
            ثبت کاتالوگ
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default AddCatalogForm;
