# Budapest Labs

Marketing site for [Budapest Labs](https://budapestlabs.com): professional websites for Hungarian and DACH small businesses. Trilingual (HU default, EN, DE), subscription-first pricing.

## Commands

```bash
bun run dev                  # Dev server (Turbopack)
bun run build                # Production build + message sync check
bun run lint                 # ESLint + message sync
bun run check:messages       # Verify en/hu/de keys match
bun run generate:legal-pdfs  # Regenerate public/legal PDFs from messages
```

## Tech stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, ShadCN UI + Radix UI
- next-intl (HU/EN/DE), next-themes (light default)
- Framer Motion, Resend (contact form)
- Bun, Vercel

## Page sections (in order)

Navbar → Hero → Content → Stats → Comparison → Pricing → FAQ → Contact → Footer

Legal pages: `/privacy`, `/terms`, `/imprint` (per locale).

## Project layout

```
src/
├── app/[locale]/       # Landing + legal pages, opengraph-image
├── app/api/contact/    # Contact form API (Resend)
├── components/landing/ # Section components
├── components/ui/      # button, card, input, textarea, label
├── messages/           # en.json, hu.json, de.json
└── i18n/               # Locale routing
scripts/
├── check-messages.mjs
└── generate-legal-pdfs.mjs
```

## Client delivery (separate repo)

Templates, themes, and shader components live in **`/Users/mac/labs/templates`** (`pipeline/`, `themes/`, `shaders/`). Not part of this repo.

## Environment

Contact form requires in production:

- `RESEND_API_KEY`
- Verified sender domain for `hello@budapestlabs.com` (see `src/app/api/contact/route.ts`)
