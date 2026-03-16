# Starter Plan — Agent Build Guide

This directory contains everything an AI agent needs to build a complete Starter plan website from scratch for a Budapest Labs client.

## What is the Starter plan?

- 3–5 pages, structure depends on business type (archetype)
- Mobile responsive design
- SEO optimized
- Contact form
- Bilingual (Hungarian + English)
- Secure hosting included (1 year)
- Dark/light mode toggle
- Delivery: ≤6 hours

## Archetypes

Every client fits one of 5 archetypes. The archetype determines which pages to build, which hero type to use, and which STAGE-4 file to follow.

| Archetype | Pattern | STAGE-4 file |
|-----------|---------|-------------|
| **Service** | "I do things for people — they read, then contact me" | [STAGE-4-service.md](STAGE-4-service.md) |
| **Showcase** | "I show my work — they browse visually, then reach out" | [STAGE-4-showcase.md](STAGE-4-showcase.md) |
| **Catalog** | "I have items with prices — they browse, then visit/order" | [STAGE-4-catalog.md](STAGE-4-catalog.md) |
| **Brand** | "I am a brand — they discover, then buy or follow" | [STAGE-4-brand.md](STAGE-4-brand.md) |
| **Accommodation** | "I have a space — they see it, then book" | [STAGE-4-accommodation.md](STAGE-4-accommodation.md) |

The client's answer to question 2 in [CLIENT.md](CLIENT.md) determines the archetype. See the "For the agent" section at the bottom of CLIENT.md for routing details, theme recommendations, and CTA suggestions.

## Build stages

Follow these files in order:

1. **[STAGE-1-setup.md](STAGE-1-setup.md)** — Project initialization, dependencies, config files
2. **[STAGE-2-design-system.md](STAGE-2-design-system.md)** — Theme, colors, typography, CSS, glass cards
3. **[STAGE-3-layout.md](STAGE-3-layout.md)** — Navbar, footer, page structure, i18n routing
4. **STAGE-4** — Page sections (**pick the right file based on archetype above**)
5. **[STAGE-5-content.md](STAGE-5-content.md)** — Translation files, SEO metadata, favicon
6. **[STAGE-6-legal.md](STAGE-6-legal.md)** — Privacy, Terms, Imprint pages
7. **[STAGE-7-deploy.md](STAGE-7-deploy.md)** — Build verification, testing, deployment

## Reference files (read anytime)

- **[CLIENT.md](CLIENT.md)** — Unified client questionnaire + agent routing table
- **[RULES.md](RULES.md)** — Critical constraints, gotchas, do's and don'ts
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** — Colors, fonts, hero variants, CTA options, maps, stock photos
- **[MEMORY.md](MEMORY.md)** — Lessons learned, patterns to reuse, bugs to avoid

## Before you start

The agent needs from the client a completed **[CLIENT.md](CLIENT.md)** questionnaire. At minimum:

- Business name and type (determines archetype)
- Business description / what they do
- Contact info (email, phone, address)
- Logo (or we create a text logo)
- Photos (or we use stock photos — see CUSTOMIZATION.md)
- Color preferences (or we suggest based on archetype)
- Social media links (if any)

## Customization per client

Each client site follows the same stack and design system but with:
- Their archetype (determines page structure and sections)
- Their business name, logo, colors
- Their content (text, images)
- Their theme (from `templates/themes/` collection)
- Their contact form fields
- Their SEO metadata
- Their legal info (privacy, terms, imprint)
