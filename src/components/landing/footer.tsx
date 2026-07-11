import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border px-6 pt-16 pb-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div>
          <div className="grid gap-12 md:grid-cols-3">
            {/* Brand */}
            <div className="md:col-span-1">
              <p className="text-lg font-bold tracking-tight">
                Budapest Labs
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("footer.description")}
              </p>
              <a
                href={`mailto:${t("footer.email")}`}
                className="mt-3 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("footer.email")}
              </a>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-4 text-sm font-medium text-foreground/60">
                {t("footer.navigation")}
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.pricing")}
                </a>
                <a
                  href="#faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.faq")}
                </a>
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.contact")}
                </a>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <p className="mb-4 text-sm font-medium text-foreground/60">
                {t("footer.legal")}
              </p>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.privacy")}
                </Link>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.terms")}
                </Link>
                <Link
                  href="/imprint"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.imprint")}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
