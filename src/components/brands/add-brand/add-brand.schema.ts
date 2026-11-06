import { z } from "zod";

export const addBrandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام برند الزامی است.")
    .max(500, "نام برند طولانی است."),

  description: z.string().trim().min(1, "توضیحات برند الزامی است."),

  image: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "تصویر برند الزامی است.",
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

export type AddBrandValues = z.infer<typeof addBrandSchema>;
