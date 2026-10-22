"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export const useLoginAnimation = (
  containerRef: RefObject<HTMLDivElement | null>,
  errorRef: RefObject<HTMLDivElement | null>,
  errorMessage?: string,
) => {
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

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set(errorRef.current, {
        height: errorMessage ? "auto" : 0,
        opacity: errorMessage ? 1 : 0,
        y: 0,
        marginTop: errorMessage ? 16 : 0,
      });

      return;
    }

    if (errorMessage) {
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
  }, [errorRef, errorMessage]);
};
