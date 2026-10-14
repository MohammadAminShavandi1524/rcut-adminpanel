"use client";

import { useEffect, useMemo, useRef } from "react";
import { LogIn } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { FormField } from "@/components/FormField";

import { login } from "./auth.api";
import { createLoginSchema, type LoginFormValues } from "./login.schema";

gsap.registerPlugin(useGSAP);

export default function LoginForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

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

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".login-card",
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
        },
      );

      timeline.fromTo(
        ".login-heading",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.4",
      );

      timeline.fromTo(
        ".login-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.65,
          transformOrigin: "right center",
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".login-field",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".login-submit",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.15",
      );

      timeline.fromTo(
        ".login-footer",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.45,
        },
        "-=0.15",
      );
    },
    {
      scope: containerRef,
    },
  );

  useEffect(() => {
    if (!errorRef.current) return;

    if (errors.root?.message) {
      gsap.fromTo(
        errorRef.current,
        {
          height: 0,
          opacity: 0,
          y: -6,
          marginTop: 0,
        },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          marginTop: 20,
          duration: 0.4,
          ease: "power3.out",
        },
      );

      return;
    }

    gsap.to(errorRef.current, {
      height: 0,
      opacity: 0,
      y: -6,
      marginTop: 0,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }, [errors.root?.message]);

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="relative z-10 w-full max-w-[430px]"
    >
      <div className="login-card border-border bg-background overflow-hidden rounded-lg border p-8 shadow-[0_8px_30px_rgba(0,0,0,0.035)]">
        {/* Heading */}
        <div className="login-heading relative mb-8 pb-6">
          <h1 className="text-foreground text-[24px] leading-[1.3] font-semibold">
            ورود به پنل مدیریت
          </h1>

          <div className="login-line bg-border absolute inset-x-0 bottom-0 h-px" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
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

          <div className="login-field">
            <FormField
              label="رمز عبور"
              type="password"
              autoComplete="current-password"
              placeholder="رمز عبور خود را وارد کنید"
              register={register("password")}
              error={errors.password}
            />
          </div>

          {/* Server Error */}
          <div ref={errorRef} className="h-0 overflow-hidden opacity-0">
            {errors.root?.message && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/5 border px-4 py-3 rounded-lg"
              >
                <p className="text-destructive text-[13px] leading-5">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="login-submit pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground flex h-[50px] w-full items-center justify-center gap-2 rounded-md px-4 text-[15px] font-medium transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
            >
              <LogIn size={18} strokeWidth={1.8} />

              {isSubmitting ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer border-border mt-7 border-t pt-5">
          <p className="text-muted-foreground text-center text-xs leading-5">
            دسترسی به این بخش فقط برای کاربران مجاز امکان‌پذیر است.
          </p>
        </div>
      </div>
    </div>
  );
}
