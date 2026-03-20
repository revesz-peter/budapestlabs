# Budapest Labs — Build Pipeline

This directory contains everything an AI agent needs to build a complete website from scratch for a Budapest Labs client.

## What does the pipeline deliver?

- 3–5 pages, structure depends on business type
- Mobile responsive design
- SEO optimized
- Contact form
- Bilingual (Hungarian + English)
- Secure hosting included (1 year)
- Dark/light mode toggle
- Delivery: ≤6 hours (Landing), 8–12 hours (Multi-page)

## Site types

The pipeline supports two modes:

- **Landing** (default) — Single-page site with anchor-scroll sections. 3-5 sections on one page. Best for: service businesses, restaurants, salons, most small businesses. Delivery: ≤6 hours.
- **Multi-page** — Multiple distinct pages with their own routes. Includes dynamic routes for portfolios, model profiles, property listings, etc. Best for: agencies, studios, portfolios, real estate, accommodation with many rooms. Delivery: 8-12 hours.

The site type is decided in Stage 0 based on the client questionnaire. Both types share the same stack, design system, and deployment process.

## Build stages

Follow these files in order:

0. **[STAGE-0-init.md](STAGE-0-init.md)** — Parse the brief, create project folder in `/Users/mac/labs/`, git init + first commit
1. **[STAGE-1-setup.md](STAGE-1-setup.md)** — Dependencies, config files, folder structure

> **If the client provided an existing website URL:** Before starting Stage 2, fetch the site and extract: business name, services/products, contact info (phone, email, address), opening hours, social media links, all image URLs (logo, gallery, hero photos), brand colors, and navigation structure. Use this data to pre-fill the CLIENT.md answers. Download usable images (logo, gallery photos) into a `public/images/` folder. The creative direction (Stage 2.1) is still done fresh — existing site design is NOT carried over.

2. **[STAGE-2-design-system.md](STAGE-2-design-system.md)** — Theme, colors, typography, CSS, glass cards
3. **[STAGE-3-layout.md](STAGE-3-layout.md)** — Layout, page sections, navbar, footer, i18n routing
4. **[STAGE-4-content.md](STAGE-4-content.md)** — Translation files, SEO metadata, favicon
5. **[STAGE-5-legal.md](STAGE-5-legal.md)** — Privacy, Terms, Imprint pages
6. **[STAGE-6-deploy.md](STAGE-6-deploy.md)** — Build verification, testing, deployment

## Reference files (read anytime)

- **[CLIENT.md](CLIENT.md)** — Client questionnaire
- **[RULES.md](RULES.md)** — Critical constraints, gotchas, do's and don'ts
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** — Colors, fonts, hero variants, component references, maps, stock photos

## Agent execution rules

These rules apply to any AI agent running the pipeline:

1. **Never skip stages.** Execute every stage in order (0→6). Each stage exists for a reason — skipping any stage (especially Stage 2 creative direction) produces inferior results.
2. **Never skip steps within a stage.** If Stage 2 says "Step 0: run UI/UX skill", run it. If Stage 0 says "determine site type", determine it. Every step matters.
3. **Do not ask permission for individual file edits.** The pipeline is pre-approved — write files freely without asking "can I edit this file?" for each one. Only pause to ask if you can **proceed to the next stage** once the current stage is complete.
4. **Stage gate: ask before advancing.** After completing each stage, briefly report what was done and ask: "Stage N complete. Proceed to Stage N+1?" Wait for confirmation before continuing.
5. **Use the UI/UX skill.** Stage 2 Step 0 is mandatory. Always run the design system generator before making creative decisions. The skill output informs typography, colors, layout pattern, and style — do not guess these.
6. **Follow the pipeline output, not your defaults.** If the UI/UX skill recommends Playfair Display + Source Serif 4, use those — don't fall back to Geist Sans because it's the Next.js default.
7. **Template runs use lorem ipsum.** When the brief says "template" or "demo", use placeholder content but still follow every stage. The pipeline process is what's being tested, not the content.
8. **WebGL/shader backgrounds:** Import directly (not via `next/dynamic`) when the page is already `"use client"`. Use `next/dynamic` with `ssr: false` only from server components. For home page links, use `<a>` instead of `<Link>` to force full page reload (WebGL contexts don't survive client-side navigation).

## Before you start

The agent needs from the client a completed **[CLIENT.md](CLIENT.md)** questionnaire. At minimum:

- Business name and type
- Business description / what they do
- Contact info (email, phone, address)
- Logo (or we create a text logo)
- Photos (or we use stock photos — see CUSTOMIZATION.md)
- Color preferences (or we suggest based on industry)
- Social media links (if any)

## Customization per client

Each client site follows the same stack and design system but with:
- Their sections (determined by skill + Visual Direction)
- Their business name, logo, colors
- Their content (text, images)
- Their theme (from `templates/themes/` collection)
- Their contact form fields
- Their SEO metadata
- Their legal info (privacy, terms, imprint)
