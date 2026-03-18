import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Comparison } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { Addons } from "@/components/landing/addons";
// import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

async function JsonLd({ locale }: { locale: string }) {
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const faqItems = messages.faq.items;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Budapest Labs",
    url: "https://budapestlabs.com",
    email: "info@budapestlabs.com",
    description: messages.footer.description,
    areaServed: ["HU", "DE", "AT", "CH"],
    serviceType: "Web Development",
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Budapest Labs",
    url: "https://budapestlabs.com",
    email: "info@budapestlabs.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Budapest",
      addressCountry: "HU",
    },
    priceRange: "€450–€1990",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Object.values(faqItems as Record<string, { question: string; answer: string }>).map(
      (item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main>
      <JsonLd locale={locale} />
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
      {/* TODO: Add <Testimonials /> back when real testimonials are available */}
      <FAQ />
      <div className="border-t border-border" />
      <Contact />
      <Footer />
    </main>
  );
}
