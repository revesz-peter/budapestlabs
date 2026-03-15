import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold tracking-tight">Budapest Labs</p>
            <p className="mt-3 text-sm text-white/40">
              {t("footer.description")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-sm font-medium text-white/60">
              {t("footer.navigation")}
            </p>
            <nav className="flex flex-col gap-2">
              <a
                href="#how-it-works"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("nav.howItWorks")}
              </a>
              <a
                href="#pricing"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("nav.pricing")}
              </a>
              <a
                href="#faq"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("nav.faq")}
              </a>
              <a
                href="#contact"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("nav.contact")}
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <p className="mb-4 text-sm font-medium text-white/60">
              {t("footer.legal")}
            </p>
            <nav className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("footer.privacy")}
              </a>
              <a
                href="#"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("footer.terms")}
              </a>
              <a
                href="#"
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {t("footer.imprint")}
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-center text-xs text-white/30">
            &copy; {year} Budapest Labs. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
