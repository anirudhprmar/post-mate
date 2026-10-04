import Container from "./_components/container";
import Navbar from "../components/landing/navbar";
import Hero from "../components/landing/hero";
import Features from "../components/landing/features";
import FAQ from "../components/landing/faq";
import FooterCTA from "../components/landing/footer-cta";
import Footer from "../components/landing/footer";
import SupportedPlatforms from "./_components/supported-platforms";
import WhyUs from "~/components/landing/why-us";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <Container>
        <Navbar />
        <main>
          <Hero />
          <Features />
          <SupportedPlatforms />
          <FAQ />
          <FooterCTA />
          <Footer />
        </main>
      </Container>
    </div>
  );
}
