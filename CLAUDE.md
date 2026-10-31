# Budapest Labs

## What this is

Landing page for Budapest Labs: a software and AI studio for Hungarian businesses. Services: Claude integrations (connecting invoicing, webshop, CRM to the AI assistant), custom business software, automation and AI agents, websites and webshops, AI training, AI assessment. Quote-based, no prices on the page. Single-page marketing site, trilingual (Hungarian default, English and German toggles).

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build (always run after changes to verify; also runs the message sync check)
- `bun run lint` — ESLint (flat config in `eslint.config.mjs`) + message sync check
- `bun run check:messages` — verify en/hu/de message files have identical keys
- `bun run generate:legal-pdfs` — regenerate privacy/terms/imprint PDFs from message files

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (uses `@import "tailwindcss"`, `@theme inline`, `@custom-variant` — NOT v3 syntax)
- `components/landing/feature-card.tsx`: the pastel card shared by Szolgáltatások and the AI examples (pass `inButton` when it's inside a button).
- ShadCN-style UI primitives in `src/components/ui/` (button, input, textarea, label, badge, flow-line)
- Framer Motion for scroll animations
- next-intl for i18n (HU/EN/DE; Hungarian is always the default at `/`, browser-language detection is off in `routing.ts`); pages are statically rendered via `generateStaticParams` + `setRequestLocale` — every page component must call `setRequestLocale(locale)` before using translations
- next-themes for dark/light mode (class-based toggling on `<html>`)
- Inter is the only font, self-hosted via `next/font` (`--font-inter` → `--font-sans` in `globals.css`) — do not add a Google Fonts `<link>` or a second typeface
- Bun as package manager

## Important conventions

### Tailwind v4
- Do NOT use `@apply` with custom utility classes that reference each other — Tailwind v4 doesn't support this
- Theme uses `@theme inline` block, not `tailwind.config.js`

### Translations
- All user-facing text lives in `src/messages/en.json`, `src/messages/hu.json`, and `src/messages/de.json`
- Components use `useTranslations("sectionName")` from next-intl
- All three files must stay in sync — same keys, same structure (`bun run check:messages` enforces this; it also runs as part of `build` and `lint`)
- **No tech jargon in translations.** The target audience is business owners, not developers. Say "secure hosting" not "Vercel + SSL + CDN", "connect" not "API" or "MCP". Name only Claude as the AI (never "Claude and/or ChatGPT"). Other product names customers already know are fine in moderation: the systems we connect (Billingo, Számlázz.hu, Shoprenter, UNAS, Shopify, MiniCRM, Slack, ...).
- **Tone: brief, human, upfront.** Short sentences, no filler, no numbered mega-lists. Copy should read like a person wrote it, not a template.
- **No em-dashes or en-dashes anywhere in user-facing copy** (messages, titles, meta descriptions). Use periods, commas, or colons; plain hyphens for ranges (1-2 days). 

### Design system
- **Dark/light mode** via `next-themes` with class strategy (`<html class="dark">`)
  - Default theme: light. Toggle in navbar (Sun/Moon icon) next to language switcher.
  - `globals.css` has `:root` (light) and `.dark` (dark) CSS variable blocks
  - Other theme-dependent CSS (selection) scoped by `.dark` / `:root:not(.dark)`
- **Palette** (earthy, approachable, premium): light mode is linen (`oklch(0.968 0.013 80)`) with espresso ink; dark mode is espresso night (`oklch(0.2 0.014 50)`). Buttons and text stay ink/linen.
- **Earth tones**: `clay`, `ochre`, `olive`, `moss`, `sand`, `stone` tokens (deep muted versions in dark mode) for card tints, icon tiles, step cards. `brand` (terracotta) leads, `brand-2` (olive) supports: eyebrows, highlighter, flow lines, focus rings, CTA arrow discs.
- **Type**: Inter only. Each h1/h2 can carry one `<em>` phrase in the message files (rendered with `t.rich(key, rich)` from `section-header.tsx`): upright, terracotta in h2, ochre highlighter in the hero h1.
- **Glass**: `glass` utility (paper-like frosted panel) for the hero chat and diagram card. The scrolled navbar pill is `bg-background/50` + `backdrop-blur-lg` + border (the original look; keep it).
- **Animations** (each a different technique, all respect reduced motion; ask before adding more):
  - `motion-primitives/contours.tsx`: topographic contour lines that draw in and turn very slowly (hero with ochre "sun", AI panel, contact). Hero contours have scroll parallax. In-view is watched on the whole SVG (rings cropped by a section's overflow-hidden never "intersect" on their own, which left them undrawn on phones).
  - Hero headline: words rise from a mask; the `<em>` phrase gets an ochre highlighter sweep. Chat card unfolds (rotateX); a safety note card (`hero.chat.noteTitle` / `noteBody`) settles onto its edge.
  - `motion-primitives/roll-text.tsx`: text roll on hover for CTAs (needs `group/roll` on the button); CTA arrow disc turns -45°.
  - Section titles slide up from a mask (in-view is observed on the mask wrapper, not the clipped title) with a drawn eyebrow line.
  - Services: sand curtain wipes up to uncover each card; on hover (minimal: cards aren't clickable, so no lift and no colour change) icons stay still, and only a short accent line in the card's own colour grows under the title (never terracotta); the AI automation cards use the same `FeatureCard` but are clickable: hover = small lift + peek turn, click = flip; illustrations animate slightly on hover.
  - AI diagram: `ui/flow-line.tsx` lines draw in once, then a soft gradient pulse and a data dot travel along each (staggered); the hub ripples slowly. The dot stays at opacity 0 until its SMIL animation is started from JS after the line draws, otherwise it flashes at the SVG origin.
  - Process: plain 4-card grid, cards just rise in. Keep it simple: no progress lines, no sticky/scroll-linked stacking (both were removed on request).
  - Navbar: reading-progress line, underline-draw hover links.
- **Hungarian copy**: abbreviation compounds take a hyphen (AI-asszisztens, AI-integráció, AI-ügynök, AI-oktatás, Claude-integráció, Claude-workshop). Short headings (card, step, promise titles, eyebrows) go through `keepHyphens()` from `lib/utils.ts` so they never wrap after "AI-"; headings use `text-balance`, paragraphs `text-pretty`. "Claude" takes no article in Hungarian copy ("összekötjük Claude-ot", "Claude-dal", not "a Claude-ot"). Speak to the real KKV concerns: data safety, mistakes (show sources, human approval), job fears, "start small with an assessment". Formal "Ön".
- **Hover-only effects** use the `can-hover` variant (`@custom-variant` in `globals.css`: hover + fine pointer). Always give touch screens a visible fallback. When screenshot-testing touch with Playwright, take the screenshot via CDP `Page.captureScreenshot`: element screenshots reset emulated hover/pointer media.
- **Voice agent** (`ai.automations.items.voice`): built on ElevenLabs Agents, named in the tools chips (ElevenLabs, Claude, Twilio, Google Naptár). Verified Oct 2026 in ElevenLabs docs: Hungarian supported by Flash v2.5 and Eleven v3 (not Multilingual v2); Claude selectable as the agent LLM; native Twilio + SIP trunking. Some LLMs are unavailable with EU data residency, so check before promising EU-only hosting for voice.
- **Tool names**: the AI automation cards' `tools` badges name the tools each job runs on (user asked for this detail). Keep them to tools we can actually deliver; the hero has no scrolling tool strip. Chat demo sources stay generic ("A számlázójából").
- **Hero**: contour-map backdrop, audience badge, "AI, ami ismeri a cégét." headline + CTAs + 3 trust ticks left, live-typing glass chat (cycles `hero.chat.items`) with safety note right. The old particle video lives in `hero-video.tsx`, currently unused: keep it, don't delete.
- **Animated shader backgrounds**: 16 WebGL/CSS components live in the separate templates repo at `labs/templates/shaders/`. Copy into client projects as needed. See `templates/pipeline/CUSTOMIZATION.md` in that repo.
- Framer Motion animations use `whileInView` with `once: true`
- **Color classes**: Use semantic Tailwind tokens (`text-foreground`, `text-muted-foreground`, `bg-foreground/5`, `border-border`, `text-brand`) — do NOT hardcode `text-white`, `bg-black`, `text-white/60` etc. These break in the opposite theme.

### Theme toggle
- Component: `src/components/landing/theme-toggle.tsx` (Sun/Moon icon button)
- Placed in navbar between language switcher and CTA
- Uses `useTheme()` from `next-themes`, guards against hydration mismatch with `mounted` state
- `layout.tsx` wraps content in `<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>`
- `<html>` has `suppressHydrationWarning` (required by next-themes)

### Business model & messaging priorities

**Quote-based, no prices on the page.** Every project gets an individual quote after a free assessment, with a fixed price per phase in writing. Ongoing operation is a monthly fee agreed in the contract. Never add price figures, packages, or "from X Ft" to the page, metadata, OG image, or JSON-LD.

The landing page sells on these pillars, in order:
1. **AI that does the work** — Claude automating concrete jobs (documents, inbox, customer service, phone, leads, content, reports), not just a chat over company data. Research (Oct 2026): business AI use is ~77% automation (Anthropic Economic Index); SMBs mostly use it for content, customer communication and admin; "ask your data" is one capability, not the pitch
2. **One team, idea to operation** — software, automation, websites, training (services section)
3. **Safe by default** — read-only access, data stays in their systems and the EU, DPA, revocable access
4. **No surprises** — free assessment, written plan, fixed price per phase, weekly results, documentation, monthly operation

Don't show partner badges (Claude Partner Network, OpenAI) until actually accepted. Don't invent clients, testimonials, or case studies; the chat demo answers are labelled as examples.

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale layout, metadata, next/font Inter, generateStaticParams
│   │   ├── page.tsx             # Main page, assembles all sections + JSON-LD (Organization, ProfessionalService; no FAQPage since there is no FAQ section)
│   │   ├── opengraph-image.tsx  # Generated OG image (per-locale tagline)
│   │   ├── privacy/page.tsx     # Privacy Policy (minimal layout)
│   │   ├── terms/page.tsx       # Terms of Service (minimal layout)
│   │   └── imprint/page.tsx     # Imprint (minimal layout)
│   ├── api/contact/route.ts     # Contact form → Resend email (zod-validated, honeypot, HTML-escaped)
│   ├── robots.ts                # robots.txt
│   ├── sitemap.ts               # sitemap.xml with hreflang alternates
│   └── globals.css              # Tailwind v4 config, theme variables
├── components/
│   ├── landing/              # navbar, hero, hero-video (unused), services, ai-integration, process, contact, footer, section-header, theme-toggle
│   └── ui/                   # button, input, textarea, label, badge, flow-line
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

The landing page is built from **Tailark blocks** (tailark.com, shadcn-style marketing blocks) adapted to next-intl. Supporting primitives live in `src/components/logo.tsx`, `src/components/ui/`, and `src/components/motion-primitives/` (contours, roll-text; they import from framer-motion, not motion/react).

1. Navbar — translucent pill on scroll (50% background, blur), links (services, AI, process), language switcher, theme toggle, contact CTA
2. Hero — contour map, headline with highlighted phrase, CTA pair, trust ticks, live glass chat with safety note
3. Services (`#services`) — earthy bento, 6 cards (ai, software, automation, web, training, audit); `serviceKeys` also feeds the contact form's interest select
4. AI integration (`#ai`) — rounded sand panel: "Claude dolgozik a háttérben." header + Cal.com demo CTA, flow-line diagram (invoices/email/phone/webshop → Claude → done work), then `ai-automations.tsx` ("Amit levesz a válláról"): 8 separate flip cards in a 1/2/4-column grid (`ai.automations.items`: invoices, chase, inbox, reports, support, voice [Új], leads, content; each has title, `short`, `example`, 4 `tools`). Picked Oct 2026 to mirror Anthropic's Claude for Small Business workflows (Invoice Chaser, Morning Brief, Lead Triager, Customer Service Triage, Content Strategist) and connectors that exist (HubSpot, Canva, Google Workspace, Microsoft 365, Slack, Stripe, Shopify); Billingo has a public API with NAV reporting and a community MCP server, Számlázz.hu only a paid per-document API. Front = the shared `FeatureCard` (same component as Szolgáltatások: single pastel tint, icon tile, accent line, optional wordless illustration top-right; badge sits next to the title); each job has its own small span-only illustration in `ai-automations.tsx`. Back = espresso with the example and tool badges. Flips on click/tap/Enter (`aria-pressed`); a mouse hover only lifts the card and turns it -10° as a hint (`can-hover`), it does not flip. Card heights h-80/lg:h-[22rem] are measured against the longest German example: re-measure all 3 locales if copy grows. User preferred this over tabs, explorer and scroll-spy layouts. No promise cards or safety line.
5. Process (`#process`) — 4 step cards. Currently hidden (commented out in `page.tsx`, removed from navbar and footer); keep the component
6. Contact — form (interest select) + Cal.com link in subtitle
7. Footer — nav anchors + legal links

Styling: `text-4xl font-medium tracking-tight lg:text-5xl` headings with a glass eyebrow pill via `SectionHeader`, `py-16 md:py-32`, generous radii (`rounded-3xl`, buttons `rounded-full`).

## Client delivery pipeline

Client templates, themes, and shader components live in the separate **`labs/templates`** repo (`pipeline/`, `themes/`, `shaders/`). This landing repo does not include them.

## Things to avoid

- Adding new visual effects without asking — user is particular about keeping it clean
- Tech jargon in customer-facing copy
- Over-engineering or adding features not requested
- Creating new files when editing existing ones would work
- Committing without being asked
