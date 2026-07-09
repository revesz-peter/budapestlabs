import { use } from "react";
import { useTranslations, useLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
        ? "Adatvédelmi nyilatkozat | Budapest Labs"
        : "Privacy Policy | Budapest Labs",
  };
}

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: paramLocale } = use(params);
  setRequestLocale(paramLocale);
  const t = useTranslations("legal");
  const locale = useLocale();

  const sectionKeys = [
    "controller",
    "collection",
    "basis",
    "purpose",
    "storage",
    "thirdparty",
    "rights",
  ] as const;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">
            {t("privacy.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("privacy.lastUpdated")}
          </p>
        </div>
        <a
          href={`/legal/${locale}/privacy-policy.pdf`}
          download
          className="mt-1 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <Download className="h-4 w-4" />
          {t("download")}
        </a>
      </div>
      <p className="mt-6 text-foreground/70">{t("privacy.intro")}</p>

      <div className="mt-12 space-y-10">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="mb-3 text-lg font-semibold">
              {t(`privacy.sections.${key}.title`)}
            </h2>
            <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
              {t(`privacy.sections.${key}.content`)}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
