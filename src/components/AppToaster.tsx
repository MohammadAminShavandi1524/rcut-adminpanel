"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      dir="rtl"
      closeButton
      expand
      toastOptions={{
        classNames: {
          toast:
            "!bg-background !text-foreground !border !border-border !shadow-xl !rounded-xl",

          title: "font-semibold !text-foreground",

          description: "!text-muted-foreground",

          actionButton: "!bg-primary !text-primary-foreground",

          cancelButton: "!bg-secondary !text-secondary-foreground",

          closeButton:
            "!bg-background !border !border-border !text-muted-foreground hover:!text-foreground",

          success: "!border-l-4 !border-l-success",

          error: "!border-l-4 !border-l-destructive",

          warning: "!border-l-4 !border-l-warning",

          info: "!border-l-4 !border-l-info",
        },
      }}
    />
  );
}
