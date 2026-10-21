import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام دسته‌بندی الزامی است.")
    .max(500, "نام دسته‌بندی نباید بیشتر از ۵۰۰ کاراکتر باشد."),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
