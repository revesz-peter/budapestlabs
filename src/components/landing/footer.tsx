import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border px-6 pt-16 pb-8 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div>
          <div className="grid gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <p className="text-lg font-bold tracking-tight">
                Budapest Labs
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("footer.description")}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-4 text-sm font-medium text-foreground/60">
                {t("footer.navigation")}
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="#process"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.process")}
                </a>
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
                <a
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.privacy")}
                </a>
                <a
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.terms")}
                </a>
                <a
                  href="/imprint"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.imprint")}
                </a>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-4 text-sm font-medium text-foreground/60">
                {t("contact.label")}
              </p>
              <a
                href="mailto:budapestlabs@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                budapestlabs@gmail.com
              </a>
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
