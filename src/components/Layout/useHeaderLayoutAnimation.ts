"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useHeaderLayoutAnimation = (
  headerRef: RefObject<HTMLDivElement | null>,
) => {
  useGSAP(
    () => {
      if (!headerRef.current) {
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
        headerRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.35,
          clearProps: "opacity",
        },
      );

      timeline.fromTo(
        ".header-title",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          clearProps: "opacity,transform",
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".header-description",
        {
          opacity: 0,
          y: 8,
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
        ".header-control",
        {
          opacity: 0,
          x: -10,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.07,
          clearProps: "opacity,transform",
        },
        "-=0.35",
      );
    },
    {
      scope: headerRef,
    },
  );
};
