# Budapest Labs

## What this is

Landing page for Budapest Labs — a service delivering professional websites for Hungarian small businesses in days (1-2 days Starter, 3-5 days Business, 1-2 weeks Custom). Single-page marketing site, trilingual (Hungarian default, English and German toggles).

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build (always run after changes to verify; also runs the message sync check)
- `bun run lint` — ESLint (flat config in `eslint.config.mjs`) + message sync check
- `bun run check:messages` — verify en/hu/de message files have identical keys

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, `@theme inline`, `@custom-variant` — NOT v3 syntax)
- ShadCN UI + Radix UI + Magic UI components in `src/components/ui/`
- Framer Motion for scroll animations
- next-intl for i18n (HU/EN/DE, proxy-based locale detection); pages are statically rendered via `generateStaticParams` + `setRequestLocale` — every page component must call `setRequestLocale(locale)` before using translations
- next-themes for dark/light mode (class-based toggling on `<html>`)
- Inter is self-hosted via `next/font` (exposed as `--font-inter`, consumed by `--font-sans` in `globals.css`) — do not add a Google Fonts `<link>`
- Bun as package manager

## Important conventions

### Tailwind v4
- Do NOT use `@apply` with custom utility classes that reference each other — Tailwind v4 doesn't support this
- Card classes (`.glass`, `.glass-hover`, `.glass-active`) are plain CSS in `globals.css` — border + fill only, no backdrop-filter. Scoped under `.dark` and `:root:not(.dark)` for theme-aware styling.
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
  - Glass card classes are scoped: `.dark .glass` and `:root:not(.dark) .glass`
  - Other theme-dependent CSS (gradient-border, selection) also scoped by `.dark` / `:root:not(.dark)`
- **Dark mode**: Black background (`oklch(0 0 0)`), white text (`oklch(0.97 0 0)`), subtle white-alpha card panels
- **Light mode**: Near-white background (`oklch(0.985 0 0)`), near-black text (`oklch(0.09 0 0)`), subtle black-alpha card panels
- Scandinavian minimalism — clean, not flashy — applies to both modes
- **Accent colors**:
  - Violet (`rgba(167, 139, 250, x)` / `rgba(129, 140, 248, x)`) — gradient border + glow shadow on popular pricing card. Opacity: 0.6 top, 0.25 mid, 0.25 shadow.
  - Blue (`#2563eb`) + Teal (`#0d9488`) — hero mesh gradient orbs
  - These are the only non-monochrome colors on the site. Step number circles, cards, and all other elements stay monochrome.
- **Hero background**: Animated mesh gradient (`MeshGradientBackground` from Magic UI) with slowly drifting orbs
  - Current: Blue + Teal `["#2563eb", "#0d9488", "#3b82f6", "#06b6d4"]`
  - Alt – Violet/Indigo: `["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa"]`
  - Alt – Monochrome: `["#404040", "#525252", "#6b7280", "#9ca3af"]`
- **Animated shader backgrounds**: 15 WebGL/CSS components in `src/components/ui/` (aurora, waves, sea, noise, desert-sand, cosmic-waves, accretion, singularity, mesh-gradient, flickering-grid, liquid-noir, marble-ink, silk-flow, dark-smoke, molten-amber). These use `react-shaders` and are available for client sites — see `templates/pipeline/CUSTOMIZATION.md` "Animated backgrounds" for guidance. A custom `shader-canvas.tsx` component is also available for carousel/cycling use cases where `react-shaders` has issues with mount/unmount (see mamormodels for reference implementation).
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

**Subscription-first pricing (near-zero entry, monthly is the engine):** Starter 0 Ft (€0) up front + 19 900 Ft/mo (€49); Business 49 900 Ft (€129) + 29 900 Ft/mo (€75); Custom from 149 000 Ft (€379) + from 49 900 Ft/mo (€125). Any build fee due only at delivery approval; monthly starts at go-live; 12-month minimum service term, then cancel anytime and the site stays with the client. The monthly fee covers hosting, email, security updates, small content edits, and the lifetime warranty (this funds those recurring obligations). The domain is a pass-through: registered in the client's name, its small yearly registration fee billed to them at cost (prices vary too much by name to bundle). Domain setup/consultation is included; the registration fee is not. This is disclosed in the FAQ ("domain" item) and the terms payment clause. **Honesty rule:** prices on the page are labeled as estimates; exact prices are fixed in the contract. The monthly fee must be disclosed everywhere a price appears (pricing cards, comparison table, contact form options, FAQ, terms).

The landing page sells on these pillars, in order:
1. **Premium quality, fast** — custom design, days not weeks (hero headline)
2. **Pay only when happy** — build fee due at approval, walk away before that and pay nothing
3. **Cheap to get in** — 0 Ft up front on Starter, nothing due until approval
4. **Zero effort** — we design, build, and run it; small changes included monthly

Infrastructure credibility is carried by the hero stack strip (8 plain tech wordmarks, no caption or benefit lines) and the content section's anonymous founder background (3x founding engineer; platform on 3,000+ enterprise sites for Nvidia, Datadog, CrowdStrike; US healthcare and edtech). These are the sanctioned places for tech/brand names in customer-facing copy; everywhere else keep the no-jargon rule and describe benefits, not tools.

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
│   └── globals.css              # Tailwind v4 config, glass classes, gradient border
├── components/
│   ├── landing/              # Section components + theme-toggle (navbar, hero, stats, how-it-works, comparison, pricing, addons, latest-project, testimonials [unused], faq, contact, footer, theme-toggle)
│   └── ui/                   # ShadCN + Magic UI + animated shader backgrounds (button, badge, accordion, mesh-gradient, flickering-grid, aurora, waves, sea, noise, desert-sand, cosmic-waves, accretion, singularity, liquid-noir, marble-ink, silk-flow, dark-smoke, molten-amber, shader-canvas)
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
```

## Section order on page

The landing page is built from **Tailark blocks** (tailark.com, shadcn-style marketing blocks) adapted to next-intl. Supporting primitives live in `src/components/logo.tsx`, `src/components/ui/card.tsx`, and `src/components/motion-primitives/` (text-effect, animated-group; they import from framer-motion, not motion/react).

1. Navbar — Tailark HeroHeader pattern: fixed pill that shrinks + blurs on scroll, `data-state` mobile menu, language switcher (HU/EN/DE), theme toggle, contact CTA
2. Hero — Tailark hero-section-1: badge pill (price announcement → #pricing), TextEffect headline/subtitle, CTA pair, dark-mode-only background photo (`/photo-1662285064441-bedb11ca7e47.webp`, `mix-blend-overlay` + y-mask), stack strip (8 tech wordmarks hardcoded in hero.tsx: Next.js, React, TypeScript, Tailwind CSS, Vercel, Neon, Drizzle, Stripe; no caption). No screenshot panel; client work is not shown on the page.
3. Stats — Tailark stats block: heading + 3 static numbers (7+ years international projects, ≤24h average response time, 100% satisfaction)
4. Content — Tailark content block: quality pitch + anonymous founder background paragraphs (3x founding engineer, Nvidia/Datadog/CrowdStrike credibility)
5. Process (How It Works) — 4 numbered steps, Tailark features style
6. Comparison — 11-row table (delivery, price incl. monthly fee, quality, tech, security, performance, mobile, SEO, booking, effort, warranty)
7. Pricing — Tailark pricing cards (shadcn Card): build fee big, monthly fee in CardDescription (the 12-month term is stated once in the section subtitle, not per card; no info toggle), delivery time as first feature, gradient Popular badge on Business, estimates disclaimer under the grid
8. Add-ons — branding + multi-language, plus SUSA STUDIO partner block
9. ~~Testimonials~~ / ~~Latest Project~~ — components kept in `landing/` but not rendered (latest-project.tsx retained for later use; its screenshot now lives in the hero and content sections)
10. FAQ — 7 open Q&A items (cost, pay, monthly, domain, term, speed, google), two-column, sticky heading left (Tailark faqs-1 pattern), "ask us" link to contact
11. Contact — form (name, email, phone, business, plan, message) + hidden honeypot field, card-styled
12. Footer — brand, navigation, legal (no contact email until a @budapestlabs.com address exists; the gmail address stays in the imprint, privacy/terms pages, and the contact form error fallback)

Styling note: landing sections use the Tailark look (borders, `bg-card`, `text-4xl font-medium lg:text-5xl` headings, `py-16 md:py-32`). The `.glass` classes remain in `globals.css` for client-site templates but are no longer used on this landing page; the hero mesh gradient background is also no longer used.

## Client delivery pipeline

`templates/pipeline/` is the client-delivery system: [PLAYBOOK.md](templates/pipeline/PLAYBOOK.md) (flow + tier mapping), CLIENT.md (intake), CUSTOMIZATION.md (visual options), init.sh (`bun run pipeline:init`, clones the golden template). All client projects ship on the gaited-monorepo reference architecture (pnpm + Turborepo, Next.js 16, Tailwind 4 + shadcn/ui + Tailark, Neon + Drizzle, Vercel); the old STAGE-0..6 build-from-scratch docs were removed in favor of a template-repo approach. The `bl-template` golden repo still needs to be created (see PLAYBOOK.md one-time setup).

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Using `@apply` with custom card classes (.glass, .glass-hover, .glass-active)
- Committing without being asked
