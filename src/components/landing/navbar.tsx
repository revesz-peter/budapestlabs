"use client";

import { Logo } from "@/components/logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, Link as LocaleLink } from "@/i18n/navigation";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { RollText } from "@/components/motion-primitives/roll-text";
import { motion, useScroll, useSpring } from "framer-motion";

const locales = ["hu", "en", "de"] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  // thin reading-progress line along the top edge
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const menuItems = [
    // absolute, so these also work from /projects
    { name: t("services"), href: "/#services" },
    { name: t("ai"), href: "/#ai" },
    { name: t("projects"), href: "/projects" },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function switchLocale(newLocale: (typeof locales)[number]) {
    router.replace(pathname, { locale: newLocale });
  }

  const languageSwitcher = (
    <div className="flex items-center rounded-full border p-1">
      {locales.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchLocale(lang)}
          aria-current={locale === lang ? "true" : undefined}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium uppercase transition-colors",
            locale === lang
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );

  return (
    <header>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="bg-brand fixed inset-x-0 top-0 z-30 h-0.5 origin-left"
      />
      <nav
        data-state={menuState && "active"}
        className="fixed z-20 w-full px-2"
      >
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            isScrolled &&
              "bg-background/50 max-w-5xl rounded-2xl border backdrop-blur-lg lg:px-5"
          )}
        >
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full justify-between lg:w-auto">
              <LocaleLink
                href="/"
                aria-label="home"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setMenuState(false);
                }}
                className="flex items-center space-x-2"
              >
                <Logo />
              </LocaleLink>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                aria-expanded={menuState}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-6 text-sm">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <LocaleLink
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground after:bg-brand relative block duration-150 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-right after:scale-x-0 after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100"
                    >
                      <span>{item.name}</span>
                    </LocaleLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-foreground/5 dark:shadow-black/40 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <LocaleLink
                        href={item.href}
                        onClick={() => setMenuState(false)}
                        className="text-muted-foreground hover:text-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                {languageSwitcher}
                <ThemeToggle />
                <Button asChild size="sm" className="group/roll px-4">
                  <LocaleLink href="/#contact" onClick={() => setMenuState(false)}>
                    <RollText>{t("contact")}</RollText>
                  </LocaleLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
