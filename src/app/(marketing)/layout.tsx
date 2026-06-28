import type { ReactNode } from "react";
import FAQ from "~/components/landing/faq";
import Footer from "~/components/landing/footer";
import FooterCTA from "~/components/landing/footer-cta";
import Pricing from "~/components/landing/pricing";
import { homePageStructuredData } from "~/lib/constants";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {homePageStructuredData.map((schema, index) => (
        <script
          key={`${schema["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="dark bg-background text-foreground min-h-dvh overflow-x-hidden">
        <main>
          <div className="relative pt-[45px] lg:pt-0">
            {children}
            <Pricing />
            <FAQ />
            <FooterCTA />
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
