import { z } from "zod";

export const addProductSchema = z.object({
  category_id: z.number().int().positive("دسته بندی محصول را انتخاب کنید."),

  name: z
    .string()
    .trim()
    .min(1, "نام محصول الزامی است.")
    .max(500, "نام محصول طولانی است."),

  description: z.string().trim().min(1, "توضیحات محصول الزامی است."),

  image: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "تصویر محصول الزامی است.",
    )
    .refine(
      (file) => file.size > 0 && file.size <= 5 * 1024 * 1024,
      "حداکثر حجم تصویر ۵ مگابایت است.",
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "فرمت مجاز JPG PNG یا WEBP است.",
    ),
});

export type AddProductValues = z.infer<typeof addProductSchema>;
