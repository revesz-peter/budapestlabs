"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const navLinks = [
  { key: "howItWorks", href: "#how-it-works" },
  { key: "pricing", href: "#pricing" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [onScroll]);

  function switchLocale(newLocale: "hu" | "en") {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="text-lg font-bold tracking-tight">
          Budapest Labs
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => switchLocale("hu")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                locale === "hu"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              HU
            </button>
            <button
              onClick={() => switchLocale("en")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                locale === "en"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              )}
            >
              EN
            </button>
          </div>

          {/* CTA */}
          <Button
            asChild
            className="hidden rounded-full bg-white px-6 text-black hover:bg-white/90 md:inline-flex"
          >
            <a href="#contact">{t("getStarted")}</a>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/60 hover:text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-white/10 bg-black/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                {t(link.key)}
              </a>
            ))}
            <Button
              asChild
              className="mt-2 rounded-full bg-white text-black hover:bg-white/90"
            >
              <a href="#contact" onClick={() => setMobileOpen(false)}>
                {t("getStarted")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
