import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, Noto_Serif } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./_components/provider";
import { Toaster } from "~/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://post-mate.xyz/"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "post mate",
    "social media scheduling",
    "content ideas",
    "cross-platform posting",
    "postmate",
  ],
  title: {
    default:
      "post mate - best tool for creators who want to grow on social media.",
    template: "%s | Postmate",
  },
  description:
    "Create platform-specific posts from one idea, then schedule and publish to all your accounts from one place.",
  openGraph: {
    title: "post mate - create once. post everywhere.",
    description:
      "Create platform-specific posts from one idea, then schedule and publish to all your accounts from one place.",
    url: "https://postmate-one.vercel.app//",
    siteName: "post mate",
    images: [
      {
        url: "https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtB3vjqCHGgq6FWGHUkduvRsIBiP9EKXaJ3lhQf",
        width: 1200,
        height: 630,
        alt: "post mate - create once. post everywhere.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "post mate - create once. post everywhere.",
    description:
      "Create platform-specific posts, then schedule and publish to all your accounts from one place.",
    images: [
      "https://c4qrl532oo.ufs.sh/f/s0GPcE56MbtBTSJgAXFbH1BrACYXOZGLfDva5Pd26RIseog7",
    ],
  },
  // verification: {
  //   google: ""
  // },
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
