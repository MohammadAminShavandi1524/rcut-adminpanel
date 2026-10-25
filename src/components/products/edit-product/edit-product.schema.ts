import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const editProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام محصول الزامی است.")
    .max(500, "نام محصول طولانی است."),

  description: z.string().trim().min(1, "توضیحات محصول الزامی است."),

  image: z
    .custom<File | undefined>(
      (value) =>
        value === undefined ||
        (typeof File !== "undefined" && value instanceof File),
      "تصویر انتخاب شده معتبر نیست.",
    )
    .refine(
      (file) => !file || (file.size > 0 && file.size <= MAX_FILE_SIZE),
      "حداکثر حجم تصویر ۵ مگابایت است.",
    )
    .refine(
      (file) => !file || ALLOWED_TYPES.includes(file.type),
      "فرمت مجاز JPG PNG یا WEBP است.",
    ),

  new: z.boolean(),

  top_seller: z.boolean(),
});

export type EditProductValues = z.infer<typeof editProductSchema>;
