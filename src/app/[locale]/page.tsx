import { setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { AiIntegration } from "@/components/landing/ai-integration";
import { Process } from "@/components/landing/process";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

async function JsonLd({ locale }: { locale: string }) {
  const messages = (await import(`@/messages/${locale}.json`)).default;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Budapest Labs",
    url: "https://budapestlabs.com",
    email: "hello@budapestlabs.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@budapestlabs.com",
      contactType: "customer service",
      availableLanguage: ["Hungarian", "English", "German"],
    },
    description: messages.footer.description,
    areaServed: ["HU", "DE", "AT", "CH"],
    serviceType: [
      "Custom Software Development",
      "AI Integration",
      "Business Process Automation",
      "Web Development",
      "AI Training",
    ],
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Budapest Labs",
    url: "https://budapestlabs.com",
    email: "hello@budapestlabs.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@budapestlabs.com",
      contactType: "customer service",
      availableLanguage: ["Hungarian", "English", "German"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Budapest",
      addressCountry: "HU",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
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
    </>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <JsonLd locale={locale} />
      <Navbar />
      <Hero />
      <Services />
      <AiIntegration />
      <Process />
      <Contact />
      <Footer />
    </main>
  );
}
