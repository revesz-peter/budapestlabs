import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { Addons } from "@/components/landing/addons";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <div className="border-t border-border" />
      <HowItWorks />
      <div className="border-t border-border" />
      <Comparison />
      <div className="border-t border-border" />
      <Pricing />
      <div className="border-t border-border" />
      <Addons />
      <div className="border-t border-border" />
      <Testimonials />
      <div className="border-t border-border" />
      <FAQ />
      <div className="border-t border-border" />
      <Contact />
      <Footer />
    </main>
  );
}
