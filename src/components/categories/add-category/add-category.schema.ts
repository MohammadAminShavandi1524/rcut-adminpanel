import { z } from "zod";

export const addCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "نام دسته‌بندی الزامی است.")
    .max(500, "نام دسته‌بندی نباید بیشتر از ۵۰۰ کاراکتر باشد."),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
