import { z } from "zod";

export const MAX_CATALOG_COVER_SIZE = 5 * 1024 * 1024;


export const CATALOG_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const addCatalogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "عنوان کاتالوگ الزامی است.")
    .max(500, "عنوان کاتالوگ طولانی است."),

  description: z
    .string()
    .trim()
    .min(1, "توضیحات کاتالوگ الزامی است."),

  cover: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" &&
        value instanceof File,
      "تصویر کاور الزامی است.",
    )
    .refine(
      (file) =>
        !!file &&
        file.size > 0 &&
        file.size <= MAX_CATALOG_COVER_SIZE,
      "حداکثر حجم تصویر کاور ۵ مگابایت است.",
    )
    .refine(
      (file) => !!file && CATALOG_IMAGE_TYPES.includes(file.type),
      "فرمت تصویر باید JPG، PNG یا WEBP باشد.",
    ),

  file: z
    .custom<File>(
      (value) =>
        typeof File !== "undefined" &&
        value instanceof File,
      "فایل PDF کاتالوگ الزامی است.",
    )
    .refine(
      (file) => !!file && file.size > 0,
      "فایل PDF نباید خالی باشد.",
    )
    .refine(
      (file) =>
        !!file &&
        file.name.toLowerCase().endsWith(".pdf") &&
        (file.type === "application/pdf" || file.type === ""),
      "فقط فایل PDF معتبر است.",
    ),
});

export type AddCatalogValues = z.infer<typeof addCatalogSchema>;