"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useAddProductAnimation = (
  formRef: RefObject<HTMLFormElement | null>,
) => {
  useGSAP(
    () => {
      if (!formRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .fromTo(
          formRef.current,
          {
            opacity: 0,
            y: 14,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            clearProps: "opacity,transform",
          },
        )
        .fromTo(
          ".add-product-info",
          {
            opacity: 0,
            x: 16,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            clearProps: "opacity,transform",
          },
          "-=0.25",
        )
        .fromTo(
          ".add-product-field",
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.065,
            clearProps: "opacity,transform",
          },
          "-=0.25",
        )
        .fromTo(
          ".add-product-submit",
          {
            opacity: 0,
            y: 8,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            clearProps: "opacity,transform",
          },
          "-=0.2",
        );
    },
    {
      scope: formRef,
    },
  );
};
