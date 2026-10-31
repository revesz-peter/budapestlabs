# Budapest Labs

## What this is

Landing page for Budapest Labs — a service delivering professional websites for Hungarian small businesses in days (1-2 days Starter, 3-5 days Business, 1-2 weeks Custom). Single-page marketing site, trilingual (Hungarian default, English and German toggles).

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build (always run after changes to verify; also runs the message sync check)
- `bun run lint` — ESLint (flat config in `eslint.config.mjs`) + message sync check
- `bun run check:messages` — verify en/hu/de message files have identical keys
- `bun run generate:legal-pdfs` — regenerate privacy/terms/imprint PDFs from message files

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, `@theme inline`, `@custom-variant` — NOT v3 syntax)
- ShadCN-style UI primitives in `src/components/ui/` (button, card, input, textarea, label)
- Framer Motion for scroll animations
- next-intl for i18n (HU/EN/DE, proxy-based locale detection); pages are statically rendered via `generateStaticParams` + `setRequestLocale` — every page component must call `setRequestLocale(locale)` before using translations
- next-themes for dark/light mode (class-based toggling on `<html>`)
- Inter is self-hosted via `next/font` (exposed as `--font-inter`, consumed by `--font-sans` in `globals.css`) — do not add a Google Fonts `<link>`
- Bun as package manager

## Important conventions

### Tailwind v4
- Do NOT use `@apply` with custom utility classes that reference each other — Tailwind v4 doesn't support this
- Theme uses `@theme inline` block, not `tailwind.config.js`

### Translations
- All user-facing text lives in `src/messages/en.json`, `src/messages/hu.json`, and `src/messages/de.json`
- Components use `useTranslations("sectionName")` from next-intl
- All three files must stay in sync — same keys, same structure (`bun run check:messages` enforces this; it also runs as part of `build` and `lint`)
- **No tech jargon in translations.** The target audience is small business owners, not developers. Say "secure hosting" not "Vercel + SSL + CDN". Say "latest & future-proof" not "Next.js + React".
- **Tone: brief, human, upfront.** Short sentences, no filler, no numbered mega-lists. Copy should read like a person wrote it, not a template.
- **No em-dashes or en-dashes anywhere in user-facing copy** (messages, titles, meta descriptions). Use periods, commas, or colons; plain hyphens for ranges (1-2 days). The comparison icon matcher in `comparison.tsx` keys off these strings, so keep them hyphenated.

### Design system
- **Dark/light mode** via `next-themes` with class strategy (`<html class="dark">`)
  - Default theme: light. Toggle in navbar (Sun/Moon icon) next to language switcher.
  - `globals.css` has `:root` (light) and `.dark` (dark) CSS variable blocks
  - Other theme-dependent CSS (selection) scoped by `.dark` / `:root:not(.dark)`
- **Dark mode**: Black background (`oklch(0 0 0)`), white text (`oklch(0.97 0 0)`), subtle white-alpha card panels
- **Light mode**: Near-white background (`oklch(0.985 0 0)`), near-black text (`oklch(0.09 0 0)`), subtle black-alpha card panels
- Scandinavian minimalism — clean, not flashy — applies to both modes
- **Accent colors**:
  - Violet — Popular badge on Business pricing card only
  - Blue (`#2563eb`) + Teal (`#0d9488`) — accent reference only (hero uses Pexels video, not mesh gradient)
  - These are the only non-monochrome colors on the site. Step number circles, cards, and all other elements stay monochrome.
- **Hero background**: Pexels video background in `hero.tsx` (not mesh gradient)
- **Animated shader backgrounds**: 16 WebGL/CSS components live in the separate templates repo at `labs/templates/shaders/` (aurora, waves, sea, noise, desert-sand, cosmic-waves, accretion, singularity, mesh-gradient, flickering-grid, liquid-noir, marble-ink, silk-flow, dark-smoke, molten-amber, shader-canvas). Copy into client projects as needed. See `templates/pipeline/CUSTOMIZATION.md` in that repo.
- Do NOT add glow effects, text shimmer, or heavy visual effects — user explicitly removed these
- Framer Motion animations use `whileInView` with `once: true`
- **Color classes**: Use semantic Tailwind tokens (`text-foreground`, `text-muted-foreground`, `bg-foreground/5`, `border-border`) — do NOT hardcode `text-white`, `bg-black`, `text-white/60` etc. These break in the opposite theme.

### Theme toggle
- Component: `src/components/landing/theme-toggle.tsx` (Sun/Moon icon button)
- Placed in navbar between language switcher and CTA
- Uses `useTheme()` from `next-themes`, guards against hydration mismatch with `mounted` state
- `layout.tsx` wraps content in `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`
- `<html>` has `suppressHydrationWarning` (required by next-themes)

### Business model & messaging priorities

**Subscription-first pricing (near-zero entry, monthly is the engine):** Starter 0 Ft (€0) up front + 19 900 Ft/mo (€49); Business 59 900 Ft (€149) + 29 900 Ft/mo (€75); Custom from 199 000 Ft (€499) + from 49 900 Ft/mo (€125). Build fee due at approval; monthly starts at go-live; 12-month minimum, then cancel anytime. **Monthly fee = development cost + operation for the contracted period.** Domain registration and paid extras are discussed and written into the contract (domain yearly fee at cost). **Honesty rule:** prices on the page are estimates; exact prices are fixed in the contract. The monthly fee must be disclosed everywhere a price appears.

The landing page sells on these pillars, in order:
1. **Premium quality, fast** — custom design, days not weeks (hero headline)
2. **Pay only when happy** — build fee due at approval, walk away before that and pay nothing
3. **Cheap to get in** — 0 Ft up front on Starter, nothing due until approval
4. **Zero effort** — we design, build, and run it; small changes included monthly

Infrastructure credibility is carried by the hero stack strip (tech wordmarks + "Built with" label) and the content section's anonymous founder background (3x founding engineer; platform on 3,000+ enterprise sites for Nvidia, Datadog, CrowdStrike; US healthcare and edtech). These are the sanctioned places for tech/brand names in customer-facing copy; everywhere else keep the no-jargon rule and describe benefits, not tools.

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale layout, metadata, next/font Inter, generateStaticParams
│   │   ├── page.tsx             # Main page, assembles all sections + JSON-LD structured data
│   │   ├── opengraph-image.tsx  # Generated OG image (per-locale tagline)
│   │   ├── privacy/page.tsx     # Privacy Policy (minimal layout)
│   │   ├── terms/page.tsx       # Terms of Service (minimal layout)
│   │   └── imprint/page.tsx     # Imprint (minimal layout)
│   ├── api/contact/route.ts     # Contact form → Resend email (zod-validated, honeypot, HTML-escaped)
│   ├── robots.ts                # robots.txt
│   ├── sitemap.ts               # sitemap.xml with hreflang alternates
│   └── globals.css              # Tailwind v4 config, theme variables
├── components/
│   ├── landing/              # navbar, hero, content-section, stats, comparison, pricing, faq, contact, footer, theme-toggle
│   └── ui/                   # button, card, input, textarea, label
├── i18n/
│   ├── routing.ts            # Locale config (hu, en, de)
│   ├── request.ts            # Server request config
│   └── navigation.ts         # Navigation helpers
├── messages/
│   ├── en.json               # English translations
│   ├── hu.json               # Hungarian translations (default locale)
│   └── de.json               # German translations
├── proxy.ts                  # Locale detection (renamed from middleware.ts in Next.js 16)
└── lib/utils.ts              # cn() helper
scripts/check-messages.mjs    # Fails if message files drift out of sync
scripts/generate-legal-pdfs.mjs  # Regenerates public/legal PDFs from messages
```

## Section order on page

The landing page is built from **Tailark blocks** (tailark.com, shadcn-style marketing blocks) adapted to next-intl. Supporting primitives live in `src/components/logo.tsx`, `src/components/ui/card.tsx`, and `src/components/motion-primitives/` (text-effect, animated-group; they import from framer-motion, not motion/react).

1. Navbar — fixed pill on scroll, language switcher (HU/EN/DE), theme toggle, contact CTA
2. Hero — Pexels video background, TextEffect headline/subtitle (2 lines), CTA pair, stack strip (12 tech wordmarks + "Built with" / localized label)
3. Content — quality pitch + anonymous founder background
4. Stats — 3 static numbers (7+ years, ≤24h response, 100% satisfaction)
5. Comparison — 10-row table (delivery, price, effort, quality, tech, performance, mobile, SEO, security, warranty, booking)
6. Pricing — 3 cards: build fee + monthly in description, 12-month term in section subtitle, Popular badge on Business
7. FAQ — process, cost, pay, monthly, term, speed, language, tech, partner (SUSA STUDIO card inline)
8. Contact — form + Cal.com link in subtitle
9. Footer — nav anchors + legal links

Styling: Tailark look (`bg-card`, `text-4xl font-medium lg:text-5xl` headings, `py-16 md:py-32`).

## Client delivery pipeline

Client templates, themes, and shader components live in the separate **`labs/templates`** repo (`pipeline/`, `themes/`, `shaders/`). This landing repo does not include them.

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Committing without being asked
