"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useAddCategoryAnimation = (
  formRef: RefObject<HTMLFormElement | null>,
) => {
  useGSAP(
    () => {
      if (!formRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          clearProps: "opacity,transform",
        },
      );

      timeline.fromTo(
        ".add-category-info",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          clearProps: "opacity,transform",
        },
        "-=0.3",
      );

      timeline.fromTo(
        ".add-category-fields",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          clearProps: "opacity,transform",
        },
        "<",
      );

      timeline.fromTo(
        ".add-category-submit",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
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
