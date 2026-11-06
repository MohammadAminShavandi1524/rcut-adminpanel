"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useBrandsAnimation = (
  pageRef: RefObject<HTMLDivElement | null>,
) => {
  useGSAP(
    () => {
      if (!pageRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      timeline
        .fromTo(
          ".brands-panel",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            clearProps: "opacity,transform",
          },
        )
        .fromTo(
          ".brands-search",
          { opacity: 0, x: 18 },
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            clearProps: "opacity,transform",
          },
          "-=0.35",
        )
        .fromTo(
          ".brands-table-header",
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            clearProps: "opacity,transform",
          },
          "-=0.25",
        );
    },
    { scope: pageRef },
  );
};