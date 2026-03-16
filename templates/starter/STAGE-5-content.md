# Stage 5 — Content & SEO

## 5.1 Translation file structure

Both `src/messages/en.json` and `src/messages/hu.json` must have identical keys. Structure:

```json
{
  "nav": {
    "about": "About",
    "services": "Services",
    "contact": "Contact",
    "contact": "Contact"
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
- If client has no images, use high-quality stock photos or leave sections text-only
