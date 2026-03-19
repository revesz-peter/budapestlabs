# Budapest Labs

Professional website delivery service for small businesses. Clients get a production-ready, multi-locale website deployed on Vercel's edge network — typically within 6 hours of receiving content.

## Business Model

- **Target market:** Hungarian + DACH-region small businesses (restaurants, salons, hotels, photographers, brands, etc.)
- **Pricing:** 3 tiers (Starter €450, Business €950, Custom €1,990) — 10% deposit, rest after delivery
- **Delivery:** Starter ≤6h, Business 1–2 days, Custom 3–5 days
- **Differentiation:** Speed, pay-after-delivery model, enterprise-grade stack at SMB prices
- **Client archetypes:** Service, Showcase, Catalog, Brand, Accommodation — each gets a tailored page structure

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.1 |
| UI Library | React | 19 |
| Language | TypeScript (strict) | 5 |
| Styling | Tailwind CSS v4 (`@theme inline`, not v3) | 4 |
| Components | ShadCN UI + Radix UI | latest |
| Animations | Framer Motion | 12.36 |
| Shader Backgrounds | react-shaders (WebGL) | 0.0.4 |
| i18n | next-intl (proxy-based routing) | latest |
| Theming | next-themes (class strategy) | 0.4.6 |
| Icons | lucide-react | 0.577 |
| Package Manager | Bun | latest |
| Deployment | Vercel (edge network) | — |

## Architecture

```
src/
├── app/
│   ├── globals.css              # Tailwind v4 config, OKLCH variables, glass classes
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale-aware metadata, OG tags, Inter font, ThemeProvider
│   │   ├── page.tsx             # Section assembly + JSON-LD schemas (Organization, ProfessionalService, FAQPage)
│   │   ├── privacy/page.tsx     # Legal pages
│   │   ├── terms/page.tsx
│   │   └── imprint/page.tsx
│   ├── sitemap.ts               # Dynamic sitemap with hreflang alternates for all locales
│   └── robots.ts
├── components/
│   ├── landing/                 # 12 section components (navbar → footer)
│   └── ui/                      # ShadCN primitives + 10 animated WebGL backgrounds
├── i18n/
│   ├── routing.ts               # Locales: ["hu", "en", "de"], default: "hu"
│   ├── request.ts               # Server-side locale resolution
│   └── navigation.ts            # Locale-aware Link, redirect, usePathname
├── messages/
│   ├── hu.json                  # Hungarian (default)
│   ├── en.json                  # English
│   └── de.json                  # German
├── proxy.ts                     # Middleware — locale detection (Next.js 16 convention)
└── lib/utils.ts                 # cn() — clsx + tailwind-merge

templates/
├── pipeline/
│   ├── README.md                # Pipeline overview and entry point
│   ├── CLIENT.md                # Client intake questionnaire (bilingual HU/EN)
│   ├── CUSTOMIZATION.md         # Colors, fonts, hero variants, components, shaders
│   ├── RULES.md                 # Agent build rules and gotchas
│   └── STAGE-0 → STAGE-6.md    # 7-stage build pipeline (init → deploy)
└── themes/
    └── README.md                # Theme presets catalog
```

## Page Sections (in order)

1. **Navbar** — Fixed, scroll-aware glass morphism, language switcher (HU/EN/DE), theme toggle
2. **Hero** — Animated mesh gradient background, staggered entrance, dual CTA (action + cal.com consultation)
3. **Stats** — Animated counters (8+ years, ≤6h delivery, 100% satisfaction, 98/100 Lighthouse, 0.3s load, 99.99% uptime)
4. **Process** — 4-step cards with staggered scroll animation
5. **Comparison** — 10-row feature table (us vs DIY vs agency) with icon matching
6. **Pricing** — 3 plans, Business highlighted with violet gradient border + glow
7. **Add-ons** — Branding (included) + multi-language support
8. **FAQ** — 9 accordion items, drives FAQPage JSON-LD schema
9. **Contact** — Form (name, email, phone, business, plan, message)
10. **Footer** — Brand, nav, legal links, social placeholders

## Design System

### Color Architecture (OKLCH)

```css
/* Light mode (default) */
--background: oklch(0.985 0 0);    /* near-white */
--foreground: oklch(0.09 0 0);     /* near-black */
--card:       oklch(0.97 0 0);

/* Dark mode */
--background: oklch(0 0 0);        /* pure black */
--foreground: oklch(0.97 0 0);     /* near-white */
--card:       oklch(0.05 0 0);
```

**Accent colors (the ONLY non-monochrome elements on the site):**
- Violet `rgba(167, 139, 250)` — pricing card gradient border
- Blue `#2563eb` + Teal `#0d9488` — hero mesh gradient orbs

### Glass Card System

Plain CSS classes (not `@apply`) scoped by theme:
- `.glass` — 1px border + 4% fill, no backdrop-filter
- `.glass-hover` — adds interactive hover state
- `.glass-active` — darker state for featured elements

### Theming

- `next-themes` with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`
- Toggle: Sun/Moon button in navbar
- All CSS scoped: `:root` (light) and `.dark` (dark)
- **Rule:** Use semantic tokens (`text-foreground`, `bg-background`, `border-border`) — never hardcode colors

### Animated Shader Backgrounds

10 WebGL components via `react-shaders`, categorized by GPU cost:

| Component | GPU Cost | Best For |
|-----------|----------|----------|
| FlickeringGrid | Very Low | Tech, retro |
| MeshGradient | Very Low | Default hero, service sites |
| Waves | Low | Creative, calm |
| Noise | Low | Nature, artisan |
| Aurora | Medium | Wellness, spa, luxury |
| CosmicWaves | Medium | Tech, bold agencies |
| Accretion | Medium | Bold, energetic brands |
| Singularity | Medium | Dark, premium |
| Sea | **High** | Coastal, resort (hero only) |
| DesertSand | **Very High** | Adventure (hero only) |

**Rules:** Max 2 shaders per page. GPU-heavy ones only in hero. Always use opacity overlay (30–50%) for text readability.

## Internationalization

- **Proxy-based routing** via `src/proxy.ts` (Next.js 16 convention, replaces middleware.ts)
- **Default locale:** Hungarian — served at `/`
- **Alternates:** English at `/en`, German at `/de`
- **Translation files:** `src/messages/{hu,en,de}.json` (~340 lines each)
- **Component usage:** `useTranslations("sectionName")` from next-intl
- **Convention:** Both files must stay in sync (same keys, same structure)
- **No tech jargon:** Translations target small business owners, not developers

## SEO

- **Metadata:** Locale-specific title/description, OG tags, Twitter cards
- **Canonical URLs:** `hu → /`, `en → /en`, `de → /de`
- **hreflang:** Implemented in metadata alternates + sitemap
- **Sitemap:** Dynamic, covers `/`, `/privacy`, `/terms`, `/imprint` for all locales
- **JSON-LD schemas** (server-rendered per locale):
  - `Organization` — company info, service area (HU, DE, AT, CH)
  - `ProfessionalService` — local business, price range, hours
  - `FAQPage` — auto-generated from translation file FAQ items

## Client Template System

### 5 Archetypes

Each client site is built from a base template, customized per business type:

| Archetype | Example Businesses | Key Sections | Default Hero |
|-----------|-------------------|--------------|-------------|
| Service | Salon, lawyer, electrician | About, Services, Contact | Mesh gradient |
| Showcase | Photographer, architect, designer | Gallery, About, Contact | Full-bleed image |
| Catalog | Restaurant, cafe, gym | Menu/Items, Gallery, Contact | Full-bleed image |
| Brand | Clothing, cosmetics, artisan | Collections, Story, Contact | Full-bleed image |
| Accommodation | Hotel, guesthouse, Airbnb | Rooms, Gallery, Location, Contact | Full-bleed image |

### 7-Stage Pipeline

1. **STAGE-1** — Client intake (CLIENT.md questionnaire)
2. **STAGE-2** — Design system & creative direction (includes reference site UI/UX analysis if client provides one)
3. **STAGE-3** — Layout & navigation
4. **STAGE-4** — Archetype-specific build (5 separate instruction files)
5. **STAGE-5** — Review & revision
6. **STAGE-6** — Domain, email, deployment
7. **STAGE-7** — Handoff & go-live

### Theme Presets

Pre-built color schemes in `templates/themes/`: monochrome, blue-teal, violet, rose, emerald, amber, art-deco, cyberpunk, studio-ghibli, and more. Each includes OKLCH variables for light and dark modes.

## Development

```bash
bun run dev       # Dev server with Turbopack (localhost:3000)
bun run build     # Production build — always run after changes
bun run lint      # ESLint
```

## Key Conventions

- **Tailwind v4:** Uses `@import "tailwindcss"` + `@theme inline` — NOT v3 config files
- **No `@apply`** with custom card classes (v4 limitation)
- **Framer Motion:** `whileInView` with `once: true` — animate on scroll, once only
- **No glow/shimmer effects** — Scandinavian minimalism, user explicitly removed these
- **Semantic tokens only** — `text-foreground` not `text-white`, `bg-background` not `bg-black`
- **All text in translation files** — never hardcode user-facing strings in components
