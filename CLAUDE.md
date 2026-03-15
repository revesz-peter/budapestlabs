# Budapest Labs

## What this is

Landing page for Budapest Labs — a service delivering professional websites for Hungarian small businesses in ≤6 hours. Single-page marketing site with bilingual support (Hungarian default, English toggle).

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build (always run after changes to verify)
- `bun run lint` — lint

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, `@theme inline`, `@custom-variant` — NOT v3 syntax)
- ShadCN UI + Radix UI components in `src/components/ui/`
- Framer Motion for scroll animations
- next-intl for i18n (HU/EN, middleware-based locale detection)
- Bun as package manager

## Important conventions

### Tailwind v4
- Do NOT use `@apply` with custom utility classes that reference each other — Tailwind v4 doesn't support this
- Card classes (`.glass`, `.glass-hover`, `.glass-active`) are plain CSS in `globals.css` — border + fill only, no backdrop-filter (removed because it has no visible effect on a black background)
- Theme uses `@theme inline` block, not `tailwind.config.js`

### Translations
- All user-facing text lives in `src/messages/en.json` and `src/messages/hu.json`
- Components use `useTranslations("sectionName")` from next-intl
- Both files must stay in sync — same keys, same structure
- **No tech jargon in translations.** The target audience is small business owners, not developers. Say "secure hosting" not "Vercel + SSL + CDN". Say "latest & future-proof" not "Next.js + React".

### Design system
- Black background, white text, subtle card panels (border + fill, no blur)
- Scandinavian minimalism — clean, not flashy
- Subtle violet accents (`rgba(167, 139, 250, x)`) only for: gradient borders on popular pricing card, dot grid background
- Do NOT add glow effects, text shimmer, or heavy visual effects — user explicitly removed these
- Framer Motion animations use `whileInView` with `once: true`

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
│   │   └── page.tsx          # Main page, assembles all sections
│   └── globals.css           # Tailwind v4 config, glass classes, dot grid, gradient border
├── components/
│   ├── landing/              # 11 section components (navbar, hero, stats, how-it-works, comparison, pricing, addons, testimonials, faq, contact, footer)
│   └── ui/                   # ShadCN components (button, badge, accordion, etc.)
├── i18n/
│   ├── routing.ts            # Locale config (hu, en)
│   ├── request.ts            # Server request config
│   └── navigation.ts         # Navigation helpers
├── messages/
│   ├── en.json               # English translations
│   └── hu.json               # Hungarian translations
├── middleware.ts              # Locale detection
└── lib/utils.ts              # cn() helper
```

## Section order on page

1. Navbar — fixed, scroll-aware, language switcher, mobile menu
2. Hero — badge, headline, subtitle, CTA + demo booking (cal.com), trust signals
3. Stats — animated counters (50+ sites, ≤6h, 100% satisfaction)
4. How It Works — 4 steps with staggered card animation
5. Comparison — 10-row table (delivery, price, quality, tech, security, speed, mobile, SEO, booking, effort)
6. Pricing — 3 plans, Business highlighted as popular
7. Add-ons — 5 optional extras
8. Testimonials — 3 client quotes
9. FAQ — 9 accordion items (sales-focused: guarantees, pay-after, revisions, custom features, security, speed, maintenance, payment)
10. Contact — form (name, email, phone, business, plan, message)
11. Footer — brand, navigation, legal, contact

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Using `@apply` with custom card classes (.glass, .glass-hover, .glass-active)
- Committing without being asked
