"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useProductsTableAnimation = (
  tableRef: RefObject<HTMLElement | null>,
) => {
  useGSAP(
    () => {
      if (!tableRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      gsap.fromTo(
        tableRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    },
    {
      scope: tableRef,
    },
  );
};
