import { useTranslations } from "next-intl";
import { Github, Linkedin, Instagram, Mail } from "lucide-react";

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
              <p className="text-lg font-bold tracking-tight">Budapest Labs</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("footer.description")}
              </p>
              {/* Social icons */}
              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="text-foreground/30 transition-colors hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="text-foreground/30 transition-colors hover:text-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="text-foreground/30 transition-colors hover:text-foreground"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <p className="mb-4 text-sm font-medium text-foreground/60">
                {t("footer.navigation")}
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("nav.howItWorks")}
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
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.privacy")}
                </a>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("footer.terms")}
                </a>
                <a
                  href="#"
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
                href="mailto:info@budapestlabs.com"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                info@budapestlabs.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-xs text-foreground/30">
            &copy; {year} Budapest Labs. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
