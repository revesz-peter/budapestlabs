import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

const metaByLocale: Record<string, { title: string; description: string }> = {
  hu: {
    title: "Budapest Labs — Weboldal 6 óra alatt",
    description:
      "Professzionális, mobilbarát weboldalak kisvállalkozásoknak — 6 órán belül elkészítve. Starter csomagtól a Pro-ig.",
  },
  en: {
    title: "Budapest Labs — Your Website in 6 Hours",
    description:
      "Professional, mobile-friendly websites for small businesses — delivered within 6 hours. From Starter to Pro plans.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] ?? metaByLocale.hu;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL("https://budapestlabs.com"),
    alternates: {
      canonical: locale === "hu" ? "/" : `/${locale}`,
      languages: {
        hu: "/",
        en: "/en",
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: "https://budapestlabs.com",
      siteName: "Budapest Labs",
      locale: locale === "hu" ? "hu_HU" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
