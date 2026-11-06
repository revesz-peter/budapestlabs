import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/landing/navbar";
import { Projects } from "@/components/landing/projects";
import { Footer } from "@/components/landing/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects.meta" });
  const url = locale === "hu" ? "/projects" : `/${locale}/projects`;

  // alternates and openGraph replace the layout's whole object, so they are spelled out here
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: url,
      languages: { hu: "/projects", en: "/en/projects", de: "/de/projects" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "Budapest Labs",
      locale: locale === "hu" ? "hu_HU" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [`/${locale}/opengraph-image`],
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Navbar />
      <Projects />
      <Footer />
    </main>
  );
}
