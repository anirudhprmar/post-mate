import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Mono, Lora } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Providers } from "./_components/provider";
import { Toaster } from "~/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: "400",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://postmate.vercel.app"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "post mate",
    "social media scheduling",
    "content ideas",
    "cross-platform posting",
    "postmate"
  ],
  title: {
    default: "post mate - best tool for creators who want to grow on social media.",
    template: "%s | Postmate",
  },
  description:
    "Create platform-specific posts from one idea, then schedule and publish to all your accounts from one place.",
  openGraph: {
    title: "post mate - create once. post everywhere.",
    description:
      "Create platform-specific posts from one idea, then schedule and publish to all your accounts from one place.",
    url: "https://postmate.vercel.app/",
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
    <html lang="en" className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} ${lora.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <Providers>
            {children}
            <Toaster position="top-center" />
            <Analytics />
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
