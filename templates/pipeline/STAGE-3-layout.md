# Stage 3 — Layout & Page Sections

## 3.1 Root layout

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "@/app/globals.css";

const metaByLocale: Record<string, { title: string; description: string }> = {
  hu: {
    title: "{{BUSINESS_NAME}} — {{HU_TAGLINE}}",
    description: "{{HU_META_DESCRIPTION}}",
  },
  en: {
    title: "{{BUSINESS_NAME}} — {{EN_TAGLINE}}",
    description: "{{EN_META_DESCRIPTION}}",
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
    metadataBase: new URL("https://{{DOMAIN}}"),
    alternates: {
      canonical: locale === "hu" ? "/" : `/${locale}`,
      languages: { hu: "/", en: "/en" },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: "https://{{DOMAIN}}",
      siteName: "{{BUSINESS_NAME}}",
      locale: locale === "hu" ? "hu_HU" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
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
        {/* Update font URL to match the chosen theme — check the theme file's comment header for recommended fonts. See CUSTOMIZATION.md "Font customization" for pairing suggestions. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* For dark-first themes (dark-matter, doom-64, cyberpunk, elegant-luxury), change defaultTheme to "dark" */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Replace all `{{PLACEHOLDERS}}` with client values.

## 3.2 Main page

Create `src/app/[locale]/page.tsx`. Import and assemble the sections listed in the Visual Direction (STAGE-2 Step 4). Build each section component in `src/components/landing/` using the design patterns from STAGE-2 and component references from CUSTOMIZATION.md.

> **Important:** Create skeleton translation files (`src/messages/en.json` and `src/messages/hu.json`) with at least `nav`, `hero`, and `footer` keys before building section components — otherwise builds will fail on missing translations. Full translations are completed in Stage 4, but components need basic keys to compile.

**Reference while building sections:**
- Design patterns (spacing, cards, buttons, animations) → STAGE-2 sections 2.6–2.9
- Reusable components (hero variants, pricing, FAQ, testimonials, forms, maps) → CUSTOMIZATION.md
- Translation patterns (`t.raw()` for arrays like menu items, room amenities) → RULES.md "Translation structure"

Example:

```tsx
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Services } from "@/components/landing/services";
import { Contact } from "@/components/landing/contact";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div className="border-t border-border" />
      <About />
      <div className="border-t border-border" />
      <Services />
      <div className="border-t border-border" />
      <Contact />
      <Footer />
    </main>
  );
}
```

Sections are separated by `border-t border-border` dividers. Swap the imports to match the sections from the Visual Direction.

## 3.3 Navbar

Create `src/components/landing/navbar.tsx`:

Key features:
- Fixed position, scroll-aware (transparent → blurred background on scroll)
- Business name as text logo (left)
- Desktop nav links (center, hidden on mobile)
- Language switcher (HU/EN pill toggle), theme toggle, CTA button (right)
- Mobile hamburger menu with slide-down panel

Full component:

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/landing/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// Adapt navLinks to match the sections from the Visual Direction
const navLinks = [
  { key: "about", href: "#about" },
  { key: "services", href: "#services" },
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
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo — replace with client business name or Image component */}
        <a href="#" className="text-lg font-bold tracking-tight">
          {{BUSINESS_NAME}}
        </a>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center rounded-full border border-border bg-foreground/5 p-1">
            <button
              onClick={() => switchLocale("hu")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                locale === "hu"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              HU
            </button>
            <button
              onClick={() => switchLocale("en")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                locale === "en"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              EN
            </button>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* CTA */}
          <Button
            asChild
            className="hidden rounded-full bg-foreground px-6 text-background hover:bg-foreground/90 md:inline-flex"
          >
            <a href="#contact">{t("cta")}</a>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted-foreground hover:text-foreground md:hidden"
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
        <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {t(link.key)}
              </a>
            ))}
            <Button
              asChild
              className="mt-2 rounded-full bg-foreground text-background hover:bg-foreground/90"
            >
              <a href="#contact" onClick={() => setMobileOpen(false)}>
                {t("cta")}
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
```

Adapt `navLinks` to match the sections from the Visual Direction. Replace `{{BUSINESS_NAME}}` with the client's name (or use an `Image` component for a logo).

## 3.4 Theme toggle

Create `src/components/landing/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-foreground/5 transition-colors hover:bg-foreground/10"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-muted-foreground" />
      ) : (
        <Moon className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
```

The `mounted` guard prevents hydration mismatch.

## 3.5 Footer

Create `src/components/landing/footer.tsx`:

Layout: 4-column grid on desktop, stacked on mobile.

```
| Brand + description + socials | Navigation links | Legal links | Contact info |
```

- Brand column: business name, short description, social media icons
- Navigation: links to page sections (adapt to match Visual Direction)
- Legal: links to /privacy, /terms, /imprint
- Contact: email with Mail icon

Footer uses `useTranslations()` (no namespace — accesses root keys).

Bottom bar: `© {year} {{BUSINESS_NAME}}. All rights reserved.`

Below the copyright line, add a subtle "Made by" credit:

```tsx
<p className="mt-2 text-center text-xs text-foreground/20">
  Made by{" "}
  <a
    href="https://budapestlabs.com"
    target="_blank"
    rel="noopener noreferrer"
    className="transition-colors hover:text-foreground/40"
  >
    Budapest Labs
  </a>
</p>
```

This goes in every client site footer — it's our portfolio backlink.

## 3.6 Multi-page sites

> Skip this section for Landing sites. Only applies to Multi-page sites (determined in Stage 0).

### Page routing

Multi-page sites have separate pages instead of anchor sections. The homepage is shorter (hero + a few highlight sections + CTA), with dedicated pages for content-heavy sections.

Example homepage for a modeling agency:

```tsx
export default function HomePage() {
  return (
    <main>
      <Hero />           {/* Full-viewport video or image */}
      <FeaturedModels />  {/* Curated grid, links to /models */}
      <About />           {/* Brief agency intro */}
      <Press />           {/* Publication logos strip */}
      <Contact />         {/* CTA + brief contact info */}
      <Footer />
    </main>
  );
}
```

Separate pages:
- `/models` — full grid with category filtering
- `/models/[slug]` — individual profile with hero, bio, measurements, gallery
- `/about` — full about page (optional, can stay on homepage)
- `/contact` — full contact page (optional)

### Listing page (grid)

The listing page shows all items in a filterable grid:

```tsx
// src/app/[locale]/models/page.tsx
import { items } from "@/data";
import { PortfolioGrid } from "@/components/models/grid";

export default function ModelsPage() {
  return (
    <main className="pt-20">
      <PortfolioGrid items={items} />
    </main>
  );
}
```

See CUSTOMIZATION.md "Portfolio / Model grid" for the grid component.

### Detail page (profile)

Dynamic route with `generateStaticParams` for SSG:

```tsx
// src/app/[locale]/models/[slug]/page.tsx
import { items } from "@/data";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return items.map((item) => ({ slug: item.slug }));
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = items.find((i) => i.slug === slug);
  if (!item) notFound();

  return (
    <main className="pt-20">
      {/* Build profile layout: hero image, name, bio, gallery, back link */}
    </main>
  );
}
```

### Navigation: Sidebar variant

For sites that use a sidebar instead of the standard top navbar (like Ford Models), replace `navbar.tsx` with a sidebar navigation component. See CUSTOMIZATION.md "Navigation variants → Sidebar navigation" for the full component.

Key differences from top navbar:
- Hamburger opens a left slide-out panel (300px wide), not a slide-down mobile menu
- Works the same on desktop and mobile
- Dark overlay on the rest of the page when open
- Menu items are larger (uppercase, bold, 1.2-1.6rem)
- Logo stays in a fixed top bar, hamburger triggers the sidebar
- For multi-page sites, use actual routes (`/models`, `/about`) instead of anchor links (`#models`, `#about`)
