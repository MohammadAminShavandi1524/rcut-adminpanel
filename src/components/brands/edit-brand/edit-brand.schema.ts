import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const editBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام برند الزامی است.")
    .max(500, "نام برند طولانی است."),

  description: z
    .string()
    .trim()
    .min(1, "توضیحات برند الزامی است."),

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
});

export type EditBrandValues = z.infer<typeof editBrandSchema>;