# Stage 4 — Showcase Archetype

> **Archetype:** Showcase — "I show my work, visitors browse visually then reach out."
> **Examples:** Photographer, model agency, architect, interior designer, tattoo artist, makeup artist, graphic designer, videographer, florist, cake decorator, construction co, furniture workshop, jeweler.
> **Sections:** Hero (full-bleed image) → Gallery → About → Team (optional) → Contact
> **Nav links:** gallery, about, contact (optionally: team)

## 4.1 Section structure

Same base pattern as all archetypes. Every section uses:

```tsx
<section id="section-name" className="px-6 py-24 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    {/* Header */}
    <div className="mb-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {t("label")}
      </p>
      <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        {t("subtitle")}
      </p>
    </div>
    {/* Content */}
  </div>
</section>
```

## 4.2 Hero section — Full-bleed image

> **Animated backgrounds for creative sites:** Showcase clients (photographers, designers, artists) benefit greatly from animated shader backgrounds instead of — or in addition to — static images. Consider `WavesShaders` for a calm/artistic feel, `AuroraShaders` for ethereal/luxury, or `NoiseShaders` for organic/nature. You can also use shaders as section dividers between Gallery and About, or at low opacity behind the gallery grid for depth. See CUSTOMIZATION.md "Animated backgrounds" for the full catalog, code snippets, and performance notes.

Showcase sites use a hero image instead of a mesh gradient. The image fills the screen with a text overlay.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-background/60" />

      {/* --- ALTERNATIVE: Shader hero instead of image ---
      Replace the <Image> and overlay above with:

      <div className="absolute inset-0">
        <WavesShaders speed={0.4} intensity={0.6} />
      </div>
      <div className="absolute inset-0 bg-background/40" />

      Import: import { WavesShaders } from "@/components/ui/waves";
      See CUSTOMIZATION.md "Animated backgrounds" for all available shaders.
      --- */}

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {t("title")}
          </h1>
        </motion.div>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
        >
          <Button
            asChild
            className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/90"
          >
            <a href="#gallery">{t("cta")}</a>
          </Button>
          <Button
            asChild
            className="rounded-full border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5"
          >
            <a href="#contact">{t("ctaSecondary")}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

**Image notes:**
- Store hero image in `public/images/hero.jpg`
- Use Next.js `<Image>` with `fill` + `object-cover` + `priority`
- The overlay (`bg-background/60`) ensures text is readable in both light and dark mode
- Adjust overlay opacity based on the image — darker images need less overlay

## 4.3 Gallery section

The core section for Showcase sites. A responsive image grid with optional category filtering.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Define images in the component or pull from translations
const galleryImages = [
  { src: "/images/gallery/01.jpg", alt: "Description", category: "category1" },
  { src: "/images/gallery/02.jpg", alt: "Description", category: "category2" },
  // ... more images
];

export function Gallery() {
  const t = useTranslations("gallery");
  const [activeCategory, setActiveCategory] = useState("all");

  // Get categories from translations
  const categories = ["all", "category1", "category2", "category3"];

  const filtered =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <section id="gallery" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((img, i) => (
            <motion.div
              key={img.src}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Gallery variations:**
- **Grid (default):** `grid-cols-2 lg:grid-cols-3` — uniform, clean
- **Masonry:** Use `columns-2 lg:columns-3` with `break-inside-avoid` on children — varied heights
- **Fullscreen lightbox:** Add click-to-expand with a modal overlay (requires additional state management). Essential for photographers — use a `Dialog` component or a dedicated lightbox library like `yet-another-react-lightbox`.

**Image sizing:**
- `aspect-[4/3]` for landscape (default)
- `aspect-square` for uniform grid
- Remove `aspect-*` for masonry layout (natural height)

## 4.4 Team / Roster section (optional)

For agencies and studios that want to showcase people. Grid of cards with photo, name, role, and optional bio.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export function Team() {
  const t = useTranslations("team");

  const memberKeys = ["m1", "m2", "m3", "m4", "m5"] as const;

  return (
    <section id="team" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Team grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {memberKeys.map((key) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="text-center"
            >
              <div className="relative mx-auto mb-4 aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-xl">
                <Image
                  src={`/images/team/${key}.jpg`}
                  alt={t(`members.${key}.name`)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                />
              </div>
              <h3 className="text-lg font-semibold">{t(`members.${key}.name`)}</h3>
              <p className="text-sm text-muted-foreground">{t(`members.${key}.role`)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

**Adapting the Team section:**

- **Model agencies:** Add stats (height, measurements) below the role. Use `t(`members.${key}.stats`)`.
- **Agencies with bios:** Add a `bio` translation key and a `<p>` below the role.
- **Social links:** Add `instagram`, `linkedin` keys to each member's translation block and render icon links below the role.

## 4.5 About section

Streamlined for Showcase — shorter than Service archetype. 1-2 paragraphs + optional differentiator cards.

Use the same pattern as STAGE-4-service.md section 4.3, but with fewer cards (2 instead of 3) or a single paragraph with an image alongside.

## 4.6 Contact section

Same as STAGE-4-service.md section 4.5. Form with Name, Email, Phone, Message. Optionally add a "Project type" dropdown for photographers/agencies.

## 4.7 Content rules

- All text from translations (`useTranslations`)
- Image alt text should be descriptive for SEO
- Gallery images stored in `public/images/gallery/`
- Team photos stored in `public/images/team/`
- Hero image stored in `public/images/hero.jpg`
- If client has no images yet, use colored placeholder divs (`bg-foreground/5`) — never ship with broken `<Image>` src
