import { z } from "zod";

import {
  CATALOG_IMAGE_TYPES,
  MAX_CATALOG_COVER_SIZE,
} from "../add-catalog/add-catalog.schema";

const optionalImage = (label: string) =>
  z
    .custom<File | undefined>(
      (value) =>
        value === undefined ||
        (typeof File !== "undefined" && value instanceof File),
      `${label} انتخاب‌شده معتبر نیست.`,
    )
    .refine(
      (file) => !file || (file.size > 0 && file.size <= MAX_CATALOG_COVER_SIZE),
      `حداکثر حجم ${label} ۵ مگابایت است.`,
    )
    .refine(
      (file) => !file || CATALOG_IMAGE_TYPES.includes(file.type),
      "فرمت تصویر باید JPG، PNG یا WEBP باشد.",
    );

export const editCatalogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "عنوان کاتالوگ الزامی است.")
    .max(500, "عنوان کاتالوگ طولانی است."),

  description: z.string().trim().min(1, "توضیحات کاتالوگ الزامی است."),

  brand_id: z.number().int().positive("انتخاب برند الزامی است."),

  cover: optionalImage("تصویر کاور"),

  image: optionalImage("تصویر بنر"),

  file: z
    .custom<File | undefined>(
      (value) =>
        value === undefined ||
        (typeof File !== "undefined" && value instanceof File),
      "فایل PDF انتخاب‌شده معتبر نیست.",
    )
    .refine((file) => !file || file.size > 0, "فایل PDF نباید خالی باشد.")
    .refine(
      (file) =>
        !file ||
        (file.name.toLowerCase().endsWith(".pdf") &&
          (file.type === "application/pdf" || file.type === "")),
      "فقط فایل PDF معتبر است.",
    ),
});

export type EditCatalogValues = z.infer<typeof editCatalogSchema>;
