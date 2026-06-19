import Container from "./_components/container";
import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import Features from "./_components/features";
import Pricing from "./_components/pricing";
import FAQ from "./_components/faq";
import FooterCTA from "./_components/footer-cta";
import Footer from "./_components/footer";
import SupportedPlatforms from "./_components/supported-platforms";

export default function Page() {
  return (
    <div className="bg-muted relative min-h-screen overflow-x-hidden">
      <Container>
        <Navbar />
        <main>
          <Hero />
          <Features />
          <SupportedPlatforms />
          <Pricing />
          <FAQ />
          <FooterCTA />
          <Footer />
        </main>
      </Container>
    </div>
  );
}
