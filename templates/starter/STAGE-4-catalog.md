# Stage 4 — Catalog Archetype

> **Archetype:** Catalog — "I have items with prices, visitors browse the list then visit or order."
> **Examples:** Restaurant, cafe, bar, bakery, spa, nail salon, barber, catering, food truck, wine bar, gym, car wash, dog groomer, print shop, bike rental.
> **Sections:** Hero (full-bleed image or mesh gradient) → Menu/Catalog → Gallery (optional) → About → Contact
> **Nav links:** menu, gallery, contact (optionally: about)

## 4.1 Section structure

Same base pattern as all archetypes — see STAGE-4-service.md section 4.1.

## 4.2 Hero section

> **Optional:** For upscale restaurants or bars, consider `AuroraShaders` (dark mode, low intensity) or `NoiseShaders` behind the hero for atmosphere. Casual eateries should stick with `MeshGradientBackground` or a food photo hero. See CUSTOMIZATION.md "Animated backgrounds" for the full catalog and code snippets.

Catalog sites work well with either a full-bleed image hero (a great food shot, spa interior, etc.) or a mesh gradient. Choose based on available imagery.

**Full-bleed image hero:** See STAGE-4-showcase.md section 4.2 for the component code.

**Mesh gradient hero:** See STAGE-4-service.md section 4.2 for the component code.

CTA should point to the menu/catalog section:
```tsx
<a href="#menu">{t("cta")}</a>        {/* "Kínálatunk" / "Our Menu" */}
<a href="#contact">{t("ctaSecondary")}</a>  {/* "Foglaljon asztalt" / "Reserve a Table" */}
```

## 4.3 Menu / Catalog section

> **Naming:** The section id `menu`, translation namespace `menu`, and nav link key are all customizable. For non-restaurant businesses (nail salons, spas, gyms, print shops), rename to `services`, `prices`, `kinalat`, or whatever fits. Update all three together: section `id`, `useTranslations()` namespace, and `navLinks` entry.

The core section. Displays categorized items with names, descriptions, prices, and optional tags (dietary indicators, badges).

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function Menu() {
  const t = useTranslations("menu");

  // Categories and items are translation-driven
  const categoryKeys = ["starters", "mains", "desserts", "drinks"] as const;

  return (
    <section id="menu" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
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

        {/* Categories */}
        <div className="space-y-16">
          {categoryKeys.map((catKey) => {
            const items = t.raw(`categories.${catKey}.items`) as Array<{
              name: string;
              description: string;
              price: string;
              tags?: string[];
            }>;

            return (
              <motion.div
                key={catKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <h3 className="mb-8 text-center text-xl font-semibold">
                  {t(`categories.${catKey}.title`)}
                </h3>

                <div className="space-y-6">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <span className="shrink-0 font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Optional note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          {t("note")}
        </p>
      </div>
    </section>
  );
}
```

**Translation structure for menu:**
```json
{
  "menu": {
    "label": "Kínálatunk",
    "title": "Étlapunk",
    "subtitle": "Szezonális alapanyagokból, szeretettel készítve.",
    "note": "Az árak az ÁFÁ-t tartalmazzák. Allergén információkért kérjük, kérdezze személyzetünket.",
    "categories": {
      "starters": {
        "title": "Előételek",
        "items": [
          {
            "name": "Mangalica tepertős pogácsa",
            "description": "Házi készítésű, frissen sült",
            "price": "1 890 Ft",
            "tags": []
          },
          {
            "name": "Grillezett padlizsán krém",
            "description": "Feta sajttal és friss kenyérrel",
            "price": "2 490 Ft",
            "tags": ["vegetáriánus"]
          }
        ]
      }
    }
  }
}
```

**Common tags:**
- Dietary: `vegetáriánus` / `vegetarian`, `vegán` / `vegan`, `gluténmentes` / `gluten-free`
- Badges: `Ajánlatunk` / `Our pick`, `Új` / `New`, `Szezonális` / `Seasonal`

**Layout note:** Use `max-w-4xl` (not `max-w-6xl`) for the menu section — menus read better in a narrower column.

## 4.4 Gallery section (optional)

For food/space photography. Use the same gallery component from STAGE-4-showcase.md section 4.3, but typically without category filtering — just a simple grid.

Simpler variant without filters:

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
>
  {images.map((img) => (
    <motion.div
      key={img.src}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className="relative aspect-[4/3] overflow-hidden rounded-xl"
    >
      <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="..." />
    </motion.div>
  ))}
</motion.div>
```

## 4.5 About section

Brief intro — same as STAGE-4-service.md section 4.3. For restaurants, focus on the story: the chef, the philosophy, the ingredients. Keep it to 2-3 differentiator cards or a single text block.

## 4.6 Contact section

Extended contact section for Catalog businesses. Includes opening hours display and optional map.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, MapPin, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

export function Contact() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="contact" className="px-6 py-24 md:px-8 lg:px-16">
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

        <div className="grid gap-12 md:grid-cols-2">
          {/* Left: Info + Opening hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Address */}
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t("address.label")}</h3>
                <p className="text-sm text-muted-foreground">{t("address.value")}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="font-medium">{t("phone.label")}</h3>
                <p className="text-sm text-muted-foreground">{t("phone.value")}</p>
              </div>
            </div>

            {/* Opening hours */}
            <div className="flex items-start gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <h3 className="mb-2 font-medium">{t("hours.label")}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{t("hours.monFri")}</p>
                  <p>{t("hours.sat")}</p>
                  <p>{t("hours.sun")}</p>
                </div>
              </div>
            </div>

            {/* Optional: Google Maps embed */}
            {/* <div className="overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=PLACE_ID_HERE"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location map"
              />
            </div> */}
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            {submitted ? (
              <div className="glass flex items-center justify-center p-12">
                <p className="text-center text-lg">{t("form.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass space-y-6 p-8">
                <div className="space-y-2">
                  <Label>{t("form.name")}</Label>
                  <Input
                    required
                    placeholder={t("form.namePlaceholder")}
                    className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.email")}</Label>
                  <Input
                    type="email"
                    required
                    placeholder={t("form.emailPlaceholder")}
                    className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.phone")}</Label>
                  <Input
                    type="tel"
                    placeholder={t("form.phonePlaceholder")}
                    className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.message")}</Label>
                  <Textarea
                    required
                    rows={4}
                    placeholder={t("form.messagePlaceholder")}
                    className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {t("form.submit")}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

**Translation keys for contact info:**
```json
{
  "contact": {
    "address": { "label": "Cím", "value": "1075 Budapest, Kazinczy utca 12." },
    "phone": { "label": "Telefon", "value": "+36 1 234 5678" },
    "hours": {
      "label": "Nyitvatartás",
      "monFri": "Hétfő - Péntek: 11:00 - 22:00",
      "sat": "Szombat: 12:00 - 23:00",
      "sun": "Vasárnap: 12:00 - 20:00"
    }
  }
}
```

**Google Maps embed:**
1. Go to Google Maps, search for the business address
2. Click "Share" → "Embed a map" → copy the iframe src URL
3. Replace `PLACE_ID_HERE` in the template with the `pb=` parameter value
4. Style the container with `rounded-xl overflow-hidden`

## 4.7 Content rules

- All text from translations
- Menu items use `t.raw()` to get arrays from JSON
- Images stored in `public/images/` (gallery subfolder for food/space photos)
- Opening hours are part of the contact translation block, not a separate component
- Prices include currency symbol in the translation string (e.g., "2 490 Ft" or "12.90 EUR")
- Dietary tags are stored as string arrays in the menu item objects
