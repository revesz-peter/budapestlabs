import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { Addons } from "@/components/landing/addons";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="border-t border-white/10" />
      <HowItWorks />
      <div className="border-t border-white/10" />
      <Pricing />
      <div className="border-t border-white/10" />
      <Addons />
      <div className="border-t border-white/10" />
      <FAQ />
      <div className="border-t border-white/10" />
      <Contact />
      <Footer />
    </main>
  );
}
