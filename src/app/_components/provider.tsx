"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { PostHogProvider } from "./posthog-provider";

// Suppress the React 19 / Next 16 false-positive warning caused by next-themes' inline script
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    orig.apply(console, args);
  };
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </PostHogProvider>
  );
}
