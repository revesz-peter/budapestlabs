import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title:
      locale === "hu"
        ? "Adatvédelmi nyilatkozat — Budapest Labs"
        : "Privacy Policy — Budapest Labs",
  };
}

export default function PrivacyPage() {
  const t = useTranslations("legal");

  const sectionKeys = [
    "collection",
    "purpose",
    "storage",
    "hosting",
    "rights",
    "contact",
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <a
        href="/"
        className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </a>

      <h1 className="text-3xl font-bold md:text-4xl">
        {t("privacy.title")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("privacy.lastUpdated")}
      </p>
      <p className="mt-6 text-foreground/70">{t("privacy.intro")}</p>

      <div className="mt-12 space-y-10">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="mb-3 text-lg font-semibold">
              {t(`privacy.sections.${key}.title`)}
            </h2>
            <p className="text-foreground/70 leading-relaxed">
              {t(`privacy.sections.${key}.content`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
