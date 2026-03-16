# Stage 4 — Brand Archetype

> **Archetype:** Brand — "I am a brand with a story, visitors discover then buy or follow."
> **Examples:** Clothing brand, cosmetics, artisan goods, pottery, candle maker, leather goods, sustainable fashion, local food brand, craft brewery, wine label, artist selling prints, music studio.
> **Sections:** Hero (full-bleed image) → Collections/Products → Story → Contact
> **Nav links:** collections, story, contact

## 4.1 Section structure

Same base pattern as all archetypes — see STAGE-4-service.md section 4.1.

## 4.2 Hero section — Full-bleed brand image

> **Animated backgrounds for brand sites:** Bold brands can use `AccretionShaders` or `CosmicWavesShaders` for an energetic hero, `WavesShaders` for editorial calm, or `NoiseShaders` for artisan/organic brands. You can also use a subtle shader behind the Story section or as a section divider between Collections and Story. See CUSTOMIZATION.md "Animated backgrounds" for the full catalog, code snippets, and performance notes.

Brand sites need a hero that communicates identity, not services. Full-bleed image with minimal text overlay.

Use the same full-bleed image hero from STAGE-4-showcase.md section 4.2, with these adjustments:

- Headline should be the brand name or a tagline, not a value proposition
- Subtitle should evoke feeling, not explain what the business does
- CTA points to collections or shop: `{t("cta")}` → "Fedezze fel" / "Discover"
- Consider using a larger hero image aspect ratio — let the image breathe

```tsx
{/* Example brand hero CTAs */}
<Button asChild className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/90">
  <a href="#collections">{t("cta")}</a>  {/* "Fedezze fel" / "Discover" */}
</Button>
<Button asChild className="rounded-full border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5">
  <a href="#story">{t("ctaSecondary")}</a>  {/* "A történetünk" / "Our Story" */}
</Button>
```

## 4.3 Collections / Products section

Image grid showcasing product categories or collections. Each item links to an external shop or detail.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function Collections() {
  const t = useTranslations("collections");

  const collectionKeys = ["c1", "c2", "c3", "c4"] as const;

  return (
    <section id="collections" className="px-6 py-24 md:px-8 lg:px-16">
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

        {/* Collections grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {collectionKeys.map((key) => (
            <motion.a
              key={key}
              href={t(`items.${key}.link`)}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={`/images/collections/${key}.jpg`}
                  alt={t(`items.${key}.title`)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {t(`items.${key}.title`)}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* External shop link */}
        <div className="mt-12 text-center">
          <a
            href={t("shopLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-transparent px-8 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            {t("shopCta")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
```

**Translation structure:**
```json
{
  "collections": {
    "label": "Kollekciók",
    "title": "Fedezze fel termékeink",
    "subtitle": "Kézzel készített, fenntartható anyagokból.",
    "shopLink": "https://instagram.com/yourbrand",
    "shopCta": "Vásárlás az Instagram Shopon",
    "items": {
      "c1": {
        "title": "Őszi kollekció",
        "description": "Természetes anyagok, földszínek",
        "link": "https://shop.example.com/fall"
      }
    }
  }
}
```

**Note on external links:**
- If client has a Shopify/Etsy/Instagram shop, collection items link there
- If no external shop, remove the `href` and make cards non-clickable (just display)
- The bottom "Shop" CTA links to the main shop URL
- Always use `target="_blank" rel="noopener noreferrer"` for external links

**Important:** The gradient overlay on collection cards uses hardcoded `from-black/60` and `text-white` — this is intentional because the overlay sits on an image, not on the page background. Semantic tokens don't apply here.

## 4.4 Story section

Full-width brand narrative. Not a 3-card differentiator grid — this is flowing storytelling with optional interspersed images.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";

export function Story() {
  const t = useTranslations("story");

  return (
    <section id="story" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
        </div>

        {/* Narrative blocks */}
        <div className="space-y-16">
          {/* Block 1: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-lg leading-relaxed text-foreground/80">
              {t("block1")}
            </p>
          </motion.div>

          {/* Block 2: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative aspect-[16/9] overflow-hidden rounded-xl"
          >
            <Image
              src="/images/story.jpg"
              alt={t("imageAlt")}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </motion.div>

          {/* Block 3: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="text-lg leading-relaxed text-foreground/80">
              {t("block2")}
            </p>
          </motion.div>

          {/* Block 4: Quote or highlight */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="border-l-2 border-foreground/20 pl-6"
          >
            <p className="text-xl font-medium italic leading-relaxed">
              {t("quote")}
            </p>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
```

**Adapting the narrative:**
- The structure (text → image → text → quote) is a starting point — adapt based on client content
- Some brands want alternating text/image rows — use `grid md:grid-cols-2` for side-by-side layout
- The quote block works great for a founder's statement or brand philosophy
- Use `max-w-4xl` (not `max-w-6xl`) — stories read better in a narrower column

## 4.5 Contact section

Same as STAGE-4-service.md section 4.5. For brand sites, consider:

- Adding a "Subject" or "Inquiry type" dropdown (Wholesale, Press, Collaboration, General)
- Adding social media links prominently — for fashion/lifestyle brands, Instagram is often more important than the contact form. Add icon links (Lucide `Instagram`, `Facebook`, `Youtube`) above or beside the form.
- The form should feel inviting, not transactional

## 4.6 Content rules

- All text from translations
- Brand story text can be longer than other archetypes — that's OK
- Collection images stored in `public/images/collections/`
- Use `aspect-[4/5]` for collection cards (portrait orientation suits fashion/product photography)
- External links always open in new tab
- If the brand has a strong visual identity (specific colors, typography), honor it — this archetype is the most likely to need custom fonts and colors beyond the defaults
