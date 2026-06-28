import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./_components/provider";
import { Toaster } from "~/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import {
  OG_DESCRIPTION,
  OG_IMAGE_PATH,
  OG_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  URLs,
} from "~/lib/constants";

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(URLs.site),
  applicationName: SITE_NAME,
  title: { template: `%s | ${SITE_NAME}`, default: SITE_TITLE },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon/favicon.svg?v=4", type: "image/svg+xml" }],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    type: "website",
    url: URLs.site,
    siteName: SITE_NAME,
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 600, alt: OG_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, notoSerifHeading.variable)}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <Providers>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-center" />
            <Analytics />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
