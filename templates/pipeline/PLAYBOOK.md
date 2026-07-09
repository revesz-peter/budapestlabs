# Budapest Labs | Client Delivery Playbook

Every client project ships on the same stack as the gaited-monorepo reference
architecture (see `/Users/mac/gaited community/GAITED_ARCHITECTURE_UPDATED.md`):

- pnpm + Turborepo monorepo, TypeScript 5
- Next.js 16 / React 19, App Router, Server Actions
- Tailwind CSS 4 + shadcn/ui + Tailark blocks, tokens in `packages/ui` (`@workspace/ui`)
- Neon serverless Postgres + Neon Auth (only activated when the tier needs it)
- Drizzle ORM + drizzle-kit migrations
- Motion, next-themes, Lucide
- Vercel deploy, `neonctl env pull` for secrets

The delivery machine is a **golden template repository**, not a build-from-scratch
script. Instructions drift; code doesn't. Every fix or improvement made to the
template compounds across all future client projects.

## One-time setup (not yet done)

Create the template repo `bl-template` by stripping the gaited-monorepo down to:

- the monorepo shell (`apps/web`, `packages/ui`, `packages/*-config`, `turbo.json`)
- the `(landing)` route group with placeholder sections (hero, services, pricing,
  FAQ, contact, footer), Tailark blocks wired to `@workspace/ui` tokens
- contact form + honeypot + Resend route (copy the hardened one from budapestlabs)
- legal pages (privacy / terms / imprint) with placeholder business data
- `proxy.ts`, security headers in `next.config.ts`, sitemap/robots/OG image
- Neon Auth + Drizzle present but **dormant** (no tables migrated, auth routes
  commented out) so Starter sites carry zero database cost
- a `CLAUDE.md` inside the template with the stack's own rules and gotchas

Until `bl-template` exists, `init.sh` falls back to cloning the gaited-monorepo
and tells you what to strip.

## Per-client flow

1. **Intake.** Client fills [CLIENT.md](CLIENT.md). Minimum: business name + type,
   description, contact info, logo/photos (or stock), color preference, plan tier.
2. **Init.** `bun run pipeline:init` (wraps [init.sh](init.sh)): clones the
   template into `/Users/mac/labs/<client-slug>`, renames workspace + app,
   fresh git history.
3. **Theme.** All look-and-feel changes happen in `packages/ui` design tokens
   (CSS variables) and the fonts in the root layout. Never hardcode hex values
   in components. Backgrounds and visual options: [CUSTOMIZATION.md](CUSTOMIZATION.md).
4. **Content.** Replace placeholder copy per CLIENT.md. Copy rules:
   - Hungarian first, English second (more languages only if sold)
   - no tech jargon, no em-dashes, short sentences that sound like a person
5. **Tier activation.**
   - **Starter (0 Ft up front + 19 900 Ft/mo):** landing group only. No database, no auth.
   - **Business (49 900 Ft + 29 900 Ft/mo):** activate Neon + Drizzle for the booking system;
     migrate only the tables the feature needs.
   - **Custom (from 149 000 Ft + from 49 900 Ft/mo):** full platform per quote (auth, payments via
     Stripe, webshop, etc.).
6. **Legal.** Fill privacy/terms/imprint with the client's real business data
   (name, tax number, registration number). Hungarian law, plain language.
7. **Ship.** `pnpm build` green, Lighthouse ≥ 90 mobile, forms tested end-to-end,
   OG preview checked, deploy to Vercel, custom domain + Resend domain verified.
   Client approves the preview URL **before** anything is due (they pay setup +
   first month at approval).

## Rules that survived the old pipeline

- `params` is a Promise in Next.js 16: always `await params`.
- Locale/auth middleware lives in `proxy.ts`, not `middleware.ts`.
- `suppressHydrationWarning` on `<html>` when using next-themes; guard
  theme-dependent components with the mounted pattern.
- WebGL/shader backgrounds: import directly in client components; `next/dynamic`
  with `ssr: false` only from server components; `<a>` (not `<Link>`) for links
  leaving a WebGL page.
- Record new lessons in the **template repo's** CLAUDE.md so they apply to every
  future project, not in a side file here.
