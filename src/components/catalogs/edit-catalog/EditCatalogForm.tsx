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

import type { Catalog } from "../catalogs.api";

import {
  editCatalogSchema,
  type EditCatalogValues,
} from "./edit-catalog.schema";

import {
  getCatalogForEdit,
  updateCatalog,
  uploadCatalogMedia,
} from "./edit-catalog.api";

import EditCatalogMediaField from "./EditCatalogMediaField";

interface EditCatalogFormProps {
  catalogId: number;
}

const EditCatalogForm = ({
  catalogId,
}: EditCatalogFormProps) => {
  const toast = useCustomToast();
  const router = useRouter();

  const [catalog, setCatalog] = useState<Catalog | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [uploadingKind, setUploadingKind] = useState<
    "cover" | "pdf" | null
  >(null);

  const [coverProgress, setCoverProgress] = useState(0);
  const [pdfProgress, setPdfProgress] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditCatalogValues>({
    resolver: zodResolver(editCatalogSchema),

    defaultValues: {
      title: "",
      description: "",
      cover: undefined,
      file: undefined,
    },
  });

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const data = await getCatalogForEdit(catalogId);

        if (!active) return;

        setCatalog(data);

        reset({
          title: data.title,
          description: data.description,
          cover: undefined,
          file: undefined,
        });
      } catch (error) {
        if (!active) return;

        console.error("GET CATALOG ERROR:", error);

        setLoadError(true);

        toast.error(
          error instanceof Error
            ? error.message
            : "دریافت اطلاعات کاتالوگ ناموفق بود.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadCatalog();

    return () => {
      active = false;
    };
  }, [catalogId, reset, toast]);

  const onSubmit = async (values: EditCatalogValues) => {
    if (!catalog) return;

    try {
      setCoverProgress(0);
      setPdfProgress(0);

      // Unchanged media must be sent as null.
      let coverUrl: string | null = null;
      let pdfUrl: string | null = null;

      // Upload only when a new cover has been selected.
      if (values.cover) {
        setUploadingKind("cover");

        coverUrl = await uploadCatalogMedia(
          values.cover,
          "cover",
          setCoverProgress,
        );
      }

      // Upload only when a new PDF has been selected.
      if (values.file) {
        setUploadingKind("pdf");

        pdfUrl = await uploadCatalogMedia(
          values.file,
          "pdf",
          setPdfProgress,
        );
      }

      setUploadingKind(null);

      await updateCatalog(catalog.id, {
        title: values.title.trim(),
        description: values.description.trim(),
        cover: coverUrl,
        file: pdfUrl,
      });

      setCatalog((previous) =>
        previous
          ? {
              ...previous,
              title: values.title.trim(),
              description: values.description.trim(),
              cover: coverUrl ?? previous.cover,
              file: pdfUrl ?? previous.file,
            }
          : previous,
      );

      reset({
        title: values.title.trim(),
        description: values.description.trim(),
        cover: undefined,
        file: undefined,
      });

      setCoverProgress(0);
      setPdfProgress(0);

      toast.success("کاتالوگ با موفقیت ویرایش شد.");

      router.replace("/catalogs");
    } catch (error) {
      console.error("UPDATE CATALOG ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "ویرایش کاتالوگ ناموفق بود.",
      );
    } finally {
      setUploadingKind(null);
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
          در حال دریافت اطلاعات کاتالوگ...
        </p>
      </div>
    );
  }

  if (loadError || !catalog) {
    return (
      <div className="border-border bg-background flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border px-4">
        <h2 className="text-foreground text-sm font-semibold">
          دریافت اطلاعات کاتالوگ ناموفق بود.
        </h2>

        <p className="text-muted-foreground text-center text-xs">
          اطلاعات این کاتالوگ قابل نمایش نیست.
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
          ویرایش کاتالوگ
        </h2>

        <p className="text-muted-foreground 3xl:text-sm 3xl:leading-7 mt-2 text-justify text-xs leading-6 xl:text-[13px]">
          عنوان و توضیحات کاتالوگ را در صورت نیاز تغییر دهید.
          برای جایگزینی کاور یا فایل PDF، فایل جدید انتخاب کنید.
          اگر کاور یا PDF را تغییر ندهید، نسخه فعلی آن حفظ
          خواهد شد. نیازی نیست برای ویرایش متن، فایل‌ها را
          دوباره آپلود کنید.
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
            {/* Title */}
            <FormField
              label="عنوان کاتالوگ"
              placeholder="عنوان کاتالوگ را وارد کنید"
              register={register("title")}
              error={errors.title}
              as="input"
              lang="fa"
              dir="rtl"
            />

            {/* Description */}
            <FormField
              label="توضیحات کاتالوگ"
              placeholder="توضیحات کاتالوگ را وارد کنید"
              register={register("description")}
              error={errors.description}
              as="textarea"
              lang="fa"
              dir="rtl"
            />

            {/* Cover */}
            <Controller
              control={control}
              name="cover"
              render={({ field }) => (
                <EditCatalogMediaField
                  kind="cover"
                  currentUrl={catalog.cover}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.cover?.message}
                  progress={coverProgress}
                  isUploading={uploadingKind === "cover"}
                  disabled={isSubmitting}
                />
              )}
            />

            {/* PDF */}
            <Controller
              control={control}
              name="file"
              render={({ field }) => (
                <EditCatalogMediaField
                  kind="pdf"
                  currentUrl={catalog.file}
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
                  {uploadingKind === "cover"
                    ? "در حال آپلود کاور..."
                    : uploadingKind === "pdf"
                      ? "در حال آپلود PDF..."
                      : "در حال ویرایش کاتالوگ..."}
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

export default EditCatalogForm;