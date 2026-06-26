"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { PostHogProvider } from "./posthog-provider";

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
