"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

interface ScrollAreaProps
  extends React.ComponentProps<typeof ScrollAreaPrimitive.Root> {
  scrollBarClassName?: string;
  viewportClassName?: string;
  lockWheel?: boolean;
}

function ScrollArea({
  className,
  children,
  scrollBarClassName,
  viewportClassName,
  lockWheel = false,
  ...props
}: ScrollAreaProps) {
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!lockWheel) return;

    event.stopPropagation();
  };

  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        onWheel={handleWheel}
        className={cn(
          "focus-visible:ring-ring size-full overscroll-y-contain rounded-[inherit] outline-none focus-visible:ring-2",
          viewportClassName,
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>

      <ScrollBar className={scrollBarClassName} />

      <ScrollAreaPrimitive.Corner className="bg-secondary" />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "bg-secondary flex touch-none p-0.5 select-none",
        "transition-colors duration-200",
        orientation === "vertical" && "h-full w-2.5",
        orientation === "horizontal" && "h-2.5 flex-col",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-scrollbar hover:bg-scrollbar-hover relative flex-1 transition-colors duration-200"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };