import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
