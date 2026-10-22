"use client";

import { useMemo, useRef, useState } from "react";

import { Eye, EyeOff, LogIn } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/FormField";

import { login } from "./auth.api";
import { createLoginSchema, type LoginFormValues } from "./login.schema";
import { useLoginAnimation } from "./useLoginAnimation";

export default function LoginForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(() => createLoginSchema(), []);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useLoginAnimation(containerRef, errorRef, errors.root?.message);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      clearErrors("root");

      await login(data);

      window.location.href = "/";
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError("root", {
        type: "server",
        message: "ایمیل یا رمز عبور اشتباه است.",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="relative z-10 w-full max-w-[430px]"
    >
      <div className="login-card border-border bg-background s:p-5 3xl:p-8 overflow-hidden rounded-lg border p-4 shadow-[0_8px_30px_rgba(0,0,0,0.035)] lg:p-6 xl:p-7">
        {/* Heading */}
        <div className="login-heading 3xl:mb-8 3xl:pb-6 relative mb-6 pb-5 lg:mb-7 lg:pb-5">
          <h1 className="text-foreground s:text-[20px] 3xl:text-[24px] 3xl:leading-[1.3] text-[19px] leading-[1.5] font-semibold lg:text-[21px] xl:text-[22px]">
            ورود به پنل مدیریت
          </h1>

          <div className="login-line bg-border absolute inset-x-0 bottom-0 h-px" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="3xl:space-y-5 space-y-4 lg:space-y-4.5"
        >
          {/* Email */}
          <div className="login-field">
            <FormField
              label="ایمیل"
              type="email"
              autoComplete="email"
              placeholder="ایمیل خود را وارد کنید"
              register={register("email")}
              error={errors.email}
            />
          </div>

          {/* Password */}
          <div className="login-field relative">
            <FormField
              label="رمز عبور"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="رمز عبور خود را وارد کنید"
              register={register("password")}
              error={errors.password}
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              aria-label={
                showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
              }
              aria-pressed={showPassword}
              className="text-muted-foreground hover:text-foreground absolute bottom-2 left-3 flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              ) : (
                <Eye
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>

          {/* Server Error */}
          <div ref={errorRef} className="h-0 overflow-hidden opacity-0">
            {errors.root?.message && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/5 rounded-lg border px-3 py-2.5 lg:px-4 lg:py-3"
              >
                <p className="text-destructive 3xl:text-[13px] text-justify text-[12px] leading-5">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="login-submit 3xl:pt-2 pt-1 lg:pt-1.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground s:h-11.5 3xl:h-[50px] 3xl:text-[15px] flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-[13px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 lg:h-12 lg:px-4 lg:text-[14px]"
            >
              <LogIn
                className="3xl:size-[18px] size-[16px] lg:size-[17px]"
                strokeWidth={1.8}
              />

              {isSubmitting ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer border-border 3xl:mt-7 3xl:pt-5 mt-5 border-t pt-4 lg:mt-6 lg:pt-4.5">
          <p className="text-muted-foreground s:text-[11px] 3xl:text-xs text-center text-[10px] leading-5">
            دسترسی به این بخش فقط برای کاربران مجاز امکان‌پذیر است.
          </p>
        </div>
      </div>
    </div>
  );
}