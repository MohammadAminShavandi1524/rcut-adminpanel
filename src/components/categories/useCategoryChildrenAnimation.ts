"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useCategoryChildrenAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  expanded: boolean,
) => {
  useGSAP(
    () => {
      if (!expanded || !containerRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: -10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
    },
    {
      scope: containerRef,
      dependencies: [expanded],
    },
  );
};