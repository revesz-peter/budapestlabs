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
- ShadCN UI + Radix UI components in `src/components/ui/`
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
  - Other theme-dependent CSS (gradient-border, step-number-bg, selection) also scoped by `.dark` / `:root:not(.dark)`
- **Dark mode**: Black background (`oklch(0 0 0)`), white text (`oklch(0.97 0 0)`), subtle white-alpha card panels
- **Light mode**: Near-white background (`oklch(0.985 0 0)`), near-black text (`oklch(0.09 0 0)`), subtle black-alpha card panels
- Scandinavian minimalism — clean, not flashy — applies to both modes
- Subtle violet accents (`rgba(167, 139, 250, x)`) only for: gradient borders on popular pricing card, dot grid background — same in both modes
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
1. **Pay after delivery** — 50/50 split, satisfaction guaranteed
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
│   └── globals.css           # Tailwind v4 config, glass classes, dot grid, gradient border
├── components/
│   ├── landing/              # 11 section components + theme-toggle (navbar, hero, stats, how-it-works, comparison, pricing, addons, testimonials, faq, contact, footer, theme-toggle)
│   └── ui/                   # ShadCN components (button, badge, accordion, etc.)
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
2. Hero — badge, headline, subtitle, CTA + demo booking (cal.com), trust signals
3. Stats — animated counters (50+ sites, ≤6h, 100% satisfaction)
4. How It Works — 4 steps with staggered card animation
5. Comparison — 10-row table (delivery, price, quality, tech, security, speed, mobile, SEO, booking, effort)
6. Pricing — 3 plans, Business highlighted as popular
7. Add-ons — 5 optional extras
8. Testimonials — 3 client quotes
9. FAQ — 8 accordion items (sales-focused: guarantees, pay-after, revisions, custom features, security, speed, maintenance, payment)
10. Contact — form (name, email, phone, business, plan, message)
11. Footer — brand, navigation, legal, contact

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Using `@apply` with custom card classes (.glass, .glass-hover, .glass-active)
- Committing without being asked
