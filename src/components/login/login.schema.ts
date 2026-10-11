import { z } from "zod";

export const createLoginSchema = () =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, "وارد کردن ایمیل الزامی است.")
      .email("فرمت ایمیل معتبر نیست."),

    password: z.string().min(1, "وارد کردن رمز عبور الزامی است."),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
