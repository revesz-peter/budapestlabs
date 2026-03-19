# Budapest Labs

## What this is

Landing page for Budapest Labs — a service delivering professional websites for Hungarian small businesses in ≤6 hours. Single-page marketing site with bilingual support (Hungarian default, English toggle).

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build (always run after changes to verify)
- `bun run lint` — lint

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, `@theme inline`, `@custom-variant` — NOT v3 syntax)
- ShadCN UI + Radix UI + Magic UI components in `src/components/ui/`
- Framer Motion for scroll animations
- next-intl for i18n (HU/EN, proxy-based locale detection)
- next-themes for dark/light mode (class-based toggling on `<html>`)
- Bun as package manager

## Important conventions

### Tailwind v4
- Do NOT use `@apply` with custom utility classes that reference each other — Tailwind v4 doesn't support this
- Card classes (`.glass`, `.glass-hover`, `.glass-active`) are plain CSS in `globals.css` — border + fill only, no backdrop-filter. Scoped under `.dark` and `:root:not(.dark)` for theme-aware styling.
- Theme uses `@theme inline` block, not `tailwind.config.js`

### Translations
- All user-facing text lives in `src/messages/en.json` and `src/messages/hu.json`
- Components use `useTranslations("sectionName")` from next-intl
- Both files must stay in sync — same keys, same structure
- **No tech jargon in translations.** The target audience is small business owners, not developers. Say "secure hosting" not "Vercel + SSL + CDN". Say "latest & future-proof" not "Next.js + React".

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
- **Animated shader backgrounds**: 10 WebGL/CSS components in `src/components/ui/` (aurora, waves, sea, noise, desert-sand, cosmic-waves, accretion, singularity, mesh-gradient, flickering-grid). These use `react-shaders` and are available for client sites — see `templates/pipeline/CUSTOMIZATION.md` "Animated backgrounds" for guidance.
- Do NOT add glow effects, text shimmer, or heavy visual effects — user explicitly removed these
- Framer Motion animations use `whileInView` with `once: true`
- **Color classes**: Use semantic Tailwind tokens (`text-foreground`, `text-muted-foreground`, `bg-foreground/5`, `border-border`) — do NOT hardcode `text-white`, `bg-black`, `text-white/60` etc. These break in the opposite theme.

### Theme toggle
- Component: `src/components/landing/theme-toggle.tsx` (Sun/Moon icon button)
- Placed in navbar between language switcher and CTA
- Uses `useTheme()` from `next-themes`, guards against hydration mismatch with `mounted` state
- `layout.tsx` wraps content in `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`
- `<html>` has `suppressHydrationWarning` (required by next-themes)

### Messaging priorities

The landing page sells on four pillars equally:
1. **Pay after delivery** — 15% deposit, rest after satisfaction guaranteed
2. **Speed** — ≤6 hours delivery, sub-second page loads
3. **Security & reliability** — encrypted, enterprise infrastructure, 99.99% uptime
4. **Simplicity** — fill one form, we handle everything

When referencing infrastructure credibility, use well-known brands: Apple, Netflix, Spotify, Airbnb, Porsche (these companies use the same technology). Do NOT name-drop Next.js, React, Vercel, etc. in customer-facing copy.

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx        # Locale layout, metadata, Google Fonts
│   │   ├── page.tsx          # Main page, assembles all sections
│   │   ├── privacy/page.tsx  # Privacy Policy (minimal layout)
│   │   ├── terms/page.tsx    # Terms of Service (minimal layout)
│   │   └── imprint/page.tsx  # Imprint (minimal layout)
│   └── globals.css           # Tailwind v4 config, glass classes, gradient border
├── components/
│   ├── landing/              # 11 section components + theme-toggle (navbar, hero, stats, how-it-works, comparison, pricing, addons, testimonials, faq, contact, footer, theme-toggle)
│   └── ui/                   # ShadCN + Magic UI + animated shader backgrounds (button, badge, accordion, mesh-gradient, flickering-grid, aurora, waves, sea, noise, desert-sand, cosmic-waves, accretion, singularity, etc.)
├── i18n/
│   ├── routing.ts            # Locale config (hu, en)
│   ├── request.ts            # Server request config
│   └── navigation.ts         # Navigation helpers
├── messages/
│   ├── en.json               # English translations
│   └── hu.json               # Hungarian translations
├── proxy.ts                  # Locale detection (renamed from middleware.ts in Next.js 16)
└── lib/utils.ts              # cn() helper
```

## Section order on page

1. Navbar — fixed, scroll-aware, language switcher, theme toggle, mobile menu
2. Hero — badge, headline, subtitle, CTA + free consultation (cal.com), trust signals, animated mesh gradient background
3. Stats — animated counters (50+ sites, ≤6h, 100% satisfaction)
4. Process (How It Works) — 4 steps with staggered card animation
5. Comparison — 10-row table (delivery, price, quality, tech, security, performance, mobile, SEO, booking, effort)
6. Pricing — 3 plans, Business highlighted as popular
7. Add-ons — 5 optional extras
8. ~~Testimonials~~ — commented out until real testimonials available
9. FAQ — 9 accordion items (process, payment, revisions, custom features, technology, SEO, hosting/maintenance, content intake, payment methods)
10. Contact — form (name, email, phone, business, plan, message)
11. Footer — brand, navigation, legal, contact

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Using `@apply` with custom card classes (.glass, .glass-hover, .glass-active)
- Committing without being asked
