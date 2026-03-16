# Stage 5 — Content & SEO

## 5.1 Translation file structure

Both `src/messages/en.json` and `src/messages/hu.json` must have identical keys. Structure:

```json
{
  "nav": {
    "about": "About",
    "services": "Services",
    "contact": "Contact",
    "cta": "Get Started"
  },
  "hero": {
    "badge": "{{SHORT_TAGLINE}}",
    "title": "{{HERO_HEADLINE}}",
    "subtitle": "{{HERO_SUBTITLE}}",
    "cta": "Get Started",
    "trust": {
      "item1": "{{TRUST_SIGNAL_1}}",
      "item2": "{{TRUST_SIGNAL_2}}",
      "item3": "{{TRUST_SIGNAL_3}}"
    }
  },
  "about": {
    "label": "About Us",
    "title": "{{ABOUT_TITLE}}",
    "subtitle": "{{ABOUT_SUBTITLE}}",
    "cards": {
      "card1": { "title": "...", "description": "..." },
      "card2": { "title": "...", "description": "..." },
      "card3": { "title": "...", "description": "..." }
    }
  },
  "services": {
    "label": "Services",
    "title": "{{SERVICES_TITLE}}",
    "subtitle": "{{SERVICES_SUBTITLE}}",
    "items": {
      "s1": { "title": "...", "description": "..." },
      "s2": { "title": "...", "description": "..." },
      "s3": { "title": "...", "description": "..." }
    }
  },
  "contact": {
    "label": "Contact",
    "title": "{{CONTACT_TITLE}}",
    "subtitle": "{{CONTACT_SUBTITLE}}",
    "form": {
      "name": "Name",
      "namePlaceholder": "Your name",
      "email": "Email",
      "emailPlaceholder": "you@example.com",
      "phone": "Phone",
      "phonePlaceholder": "+36 ...",
      "message": "Message",
      "messagePlaceholder": "How can we help?",
      "submit": "Send Message",
      "success": "Thank you! We'll get back to you soon."
    }
  },
  "footer": {
    "description": "{{FOOTER_DESCRIPTION}}",
    "navigation": "Navigation",
    "legal": "Legal",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "imprint": "Imprint",
    "rights": "All rights reserved."
  },
  "legal": {
    "back": "Back to home",
    "privacy": { ... },
    "terms": { ... },
    "imprint": { ... }
  }
}
```

## 5.2 Translation rules

- **Both files must stay in sync** — same keys, same structure, always
- **No tech jargon** — the target audience is everyday people, not developers
- Use `useTranslations("sectionName")` in components to scope translations
- For arrays (like features lists), use `t.raw("key")` to get the array
- Hungarian uses formal "Ön" (not "te") for addressing the visitor
- Hungarian punctuation: use standard quotes, not „ " (causes JSON parse errors)

## 5.3 SEO metadata

Metadata is generated in `layout.tsx` via `generateMetadata()`. Includes:

- `title` and `description` per locale
- `metadataBase` pointing to the production domain
- `alternates` with `canonical` and `languages` for HU/EN
- `openGraph` metadata (title, description, url, siteName, locale, type)
- `twitter` card metadata
- `robots: { index: true, follow: true }`

For legal pages, each has its own `generateMetadata()`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "hu"
      ? "Adatvédelmi nyilatkozat — {{BUSINESS_NAME}}"
      : "Privacy Policy — {{BUSINESS_NAME}}",
  };
}
```

## 5.4 Favicon

Create an SVG favicon at `src/app/icon.svg`. Options:

1. Use a Lucide icon — export as SVG with white stroke, 32x32 viewBox
2. Use the client's logo mark if available
3. Simple text initial in a circle

Example (FlaskConical from Lucide):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
  <path d="M8.5 2h7"/><path d="M7 16h10"/>
</svg>
```

## 5.5 Robots and sitemap

Next.js 16 auto-generates these from `app/robots.txt` and `app/sitemap.xml` route files if present. For basic sites, the defaults are sufficient.

Optional `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://{{DOMAIN}}/sitemap.xml",
  };
}
```

## 5.6 Images

- Use Next.js `<Image>` component for all images (auto-optimization)
- Store client images in `public/images/`
- Use descriptive alt text for accessibility and SEO
- If client has no images, use high-quality stock photos (see CUSTOMIZATION.md) or leave sections text-only

## 5.7 Archetype-specific translation keys

Each archetype adds its own sections to the translation files. The base keys (`nav`, `hero`, `about`, `contact`, `footer`, `legal`) are shared across all archetypes. Add the archetype-specific keys below.

### Showcase archetype — additional keys

```json
{
  "gallery": {
    "label": "Galéria",
    "title": "Munkáim",
    "subtitle": "Válogatás az eddigi munkáimból.",
    "categories": {
      "all": "Összes",
      "category1": "Esküvő",
      "category2": "Portré",
      "category3": "Üzleti"
    }
  },
  "team": {
    "label": "Csapatunk",
    "title": "Ismerd meg a csapatot",
    "subtitle": "",
    "members": {
      "m1": { "name": "Név", "role": "Pozíció" }
    }
  }
}
```

### Catalog archetype — additional keys

```json
{
  "menu": {
    "label": "Kínálatunk",
    "title": "Étlapunk",
    "subtitle": "Szezonális alapanyagokból, szeretettel készítve.",
    "note": "Az árak az ÁFÁ-t tartalmazzák.",
    "categories": {
      "starters": {
        "title": "Előételek",
        "items": [
          { "name": "Tétel neve", "description": "Leírás", "price": "2 490 Ft", "tags": [] }
        ]
      }
    }
  }
}
```

Menu items use `t.raw("categories.starters.items")` to get the array.

### Brand archetype — additional keys

```json
{
  "collections": {
    "label": "Kollekciók",
    "title": "Fedezze fel termékeink",
    "subtitle": "Kézzel készített, fenntartható anyagokból.",
    "shopLink": "https://...",
    "shopCta": "Vásárlás",
    "items": {
      "c1": { "title": "Kollekció neve", "description": "Leírás", "link": "https://..." }
    }
  },
  "story": {
    "label": "Történetünk",
    "title": "A márka mögött",
    "block1": "Szöveg...",
    "block2": "Szöveg...",
    "quote": "Idézet...",
    "imageAlt": "Kép leírása"
  }
}
```

### Accommodation archetype — additional keys

```json
{
  "rooms": {
    "label": "Szobáink",
    "title": "Szálláslehetőségek",
    "subtitle": "Válassza ki az Önnek megfelelő szobát.",
    "perNight": "éjszaka",
    "bookCta": "Foglalás",
    "bookingNote": "Online foglalás a",
    "bookingLink": "https://...",
    "amenityLabels": {
      "wifi": "Wi-Fi",
      "parking": "Parkoló",
      "breakfast": "Reggeli",
      "ac": "Légkondicionáló",
      "bath": "Fürdőkád",
      "tv": "TV",
      "view": "Panoráma"
    },
    "items": {
      "r1": {
        "name": "Standard szoba",
        "description": "Kényelmes szoba két főre.",
        "capacity": "2 fő",
        "price": "18 000 Ft",
        "amenities": ["wifi", "parking", "breakfast", "tv"]
      }
    }
  },
  "location": {
    "label": "Helyszín",
    "title": "Hol találhat meg",
    "subtitle": "Leírás...",
    "mapTitle": "Térkép",
    "attractionsTitle": "Látnivalók a közelben",
    "attractions": {
      "a1": { "name": "Látnivaló neve", "distance": "5 perc autóval" }
    },
    "gettingThereTitle": "Megközelítés",
    "byCar": "Budapestről az M7-es autópályán kb. 1 óra 30 perc."
  }
}
```

Room amenities use `t.raw("items.r1.amenities")` to get the string array.
