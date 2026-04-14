import Container from "./_components/container";
import Navbar from "./_components/navbar";
import Hero from "./_components/hero";
import Features from "./_components/features";
import Why from "./_components/why";
import Pricing from "./_components/pricing";
import FAQ from "./_components/faq";
import FooterCTA from "./_components/footer-cta";
import Footer from "./_components/footer";


export default function Page() {

  return (
    <div className="min-h-screen relative overflow-x-hidden">

      <Container>
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Why />
          <Pricing />
          <FAQ />
          <FooterCTA />
          <Footer />
        </main>
      </Container>


    </div>
  );
}
