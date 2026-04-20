"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { env } from "~/env";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme='light' enableSystem disableTransitionOnChange>
            <ConvexProvider client={convex}>
                {children}
            </ConvexProvider>
        </ThemeProvider>
    );
}
