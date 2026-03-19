# Stage 2 — Design System

## 2.1 Creative direction

Before writing any code, stop and imagine the finished site from the visitor's perspective. Every design decision — theme, font, hero type, animation level, default color mode — flows from this.

### Step 0: Generate design system via UI/UX skill

Before making any manual design decisions, run the UI/UX Pro Max skill to get an industry-specific recommendation. If the client provided a reference site (CLIENT.md Section 8), fetch it first with `WebFetch`, extract its design characteristics (colors, fonts, layout, tone), and include those keywords in the skill search so the generated design system is influenced by the reference.

```bash
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<industry keywords from CLIENT.md Section 1 & 2>" \
  --design-system -p "<ProjectName>"
```

Example for a Budapest bakery:

```bash
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "bakery cafe warm pastry" --design-system -p "PetiPekség"
```

Example if client provided a reference site with serif fonts and earthy tones:

```bash
# First: WebFetch the reference URL, extract design traits
# Then: include extracted traits in the skill search
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "bakery cafe warm serif earthy natural" --design-system -p "PetiPekség"
# Also search for matching fonts specifically:
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "serif warm traditional bakery" --domain typography
```

The skill outputs:

- **Landing pattern** — recommended page structure and section order
- **Style** — UI style (Glassmorphism, Minimalism, etc.) with effects
- **Colors** — primary, secondary, CTA, background, text hex values
- **Typography** — heading + body font pairing with Google Fonts URLs
- **Anti-patterns** — what to avoid for this industry
- **Decision rules** — conditional logic (e.g., if luxury → liquid glass)

**Use this output as your starting point for Steps 1–4 below.** Cross-reference the skill's recommendation with the client's questionnaire answers — the client's preferences override the skill when they conflict.

#### Minimal input scenario

Often the client provides only an industry, a business name, and maybe a color preference — no reference site, no mood selection, no font preference. This is fine. The skill handles it:

```bash
# Just industry + name — skill fills in everything
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "dental clinic" --design-system -p "MosolyDent"

# If client said "I like blue" — add it as a keyword
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "dental clinic blue" --design-system -p "MosolyDent"
```

With minimal input, the skill becomes the primary design decision-maker:

- **No reference site?** → Skip Step 2, rely on skill's industry reasoning
- **No mood selection?** → Skill infers mood from industry (dental → "trust, calm, clean")
- **No font preference?** → Skill picks the best pairing for the industry
- **No color preference?** → Skill provides a full palette based on industry norms
- **Client said "I like green"?** → Run `python3 .../search.py "dental green" --domain color` to find palettes that incorporate green while staying appropriate for the industry

The Visual Direction (Step 4) is still written in full — the skill fills every section that the client left blank. The agent only needs to validate that the skill's choices make sense for this specific business (Step 1 — "who is the visitor?").

You can also run targeted searches for specific design domains:

```bash
# Find fonts for a specific mood
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "elegant serif warm" --domain typography

# Find color palette for an industry
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "dental clinic trust" --domain color

# Get UX guidelines for a page type
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "contact form" --domain ux

# Check style options
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "glassmorphism" --domain style
```

---

### Step 1: Understand the visitor

Ask yourself: **Who is coming to this site, and what are they trying to do?**

- A **dentist's** visitor wants to check services, find the phone number, and book. They're probably anxious. The site should feel calm, clean, and trustworthy. Get out of their way.
- A **tattoo artist's** visitor wants to browse art and feel the artist's vibe. They're excited. The site should feel bold, visual, and atmospheric.
- A **restaurant's** visitor wants to see the menu, check prices, and maybe reserve a table. They're hungry. The site should feel warm, appetizing, and easy to scan.
- A **model agency's** visitor is a client or scout evaluating talent. They're professional but visually driven. The site should feel premium, editorial, and image-forward.
- A **candle maker's** visitor wants to feel the craft and story. They're browsing, not rushing. The site should feel handmade, warm, and inviting.

**Write one sentence describing what the visitor should feel when the page loads.** This is your creative direction. Every choice below should serve it.

### Step 2: Analyze reference site (if provided)

Check CLIENT.md Section 8 ("Referencia / Reference"). If the client provided a reference URL:

1. **Fetch the site** using `WebFetch` with the provided URL.
2. **Analyze and document** the following:
   - **Color palette** — dominant colors, accent colors, background tones (note hex/oklch values if visible)
   - **Typography** — heading and body fonts, sizes, weights, any distinctive type choices
   - **Layout patterns** — hero style (image, gradient, text-only), grid structure, section flow
   - **Spacing & density** — tight and packed vs airy and spacious, card-heavy vs text-forward
   - **Visual tone** — minimal, bold, playful, corporate, editorial, luxurious, handmade, etc.
   - **Interactive elements** — scroll animations, hover effects, transitions, parallax
   - **What the client specifically liked** (from the "Mi tetszik benne?" / "What do you like about it?" notes in CLIENT.md)
3. **Map findings to our system.** For each observation, note which Budapest Labs design lever it maps to:
   - Color palette → theme preset (from `templates/themes/`)
   - Typography → font pairing (see CUSTOMIZATION.md)
   - Hero style → mesh gradient / full-bleed image / animated shader / minimal
   - Visual tone → intensity level (minimal / warm / visual / atmospheric / storytelling)
   - Spacing → section padding and max-width adjustments
4. **Write a Reference Analysis block** in the creative direction comment at the top of `page.tsx`:

```tsx
// Reference: [URL]
// Client liked: [what they noted]
// Extracted: [tone] tone, [font] typography, [color] palette, [hero] hero style
// Mapped to: theme=[theme], font=[font], mode=[light|dark], intensity=[level]
```

If no reference URL was provided, skip this step entirely.

**Important:** The reference site is inspiration, not a spec. Extract the *feeling* and *design principles*, not pixel-perfect details. Our stack and design system are different — the goal is to capture what made the client respond to that site and translate it into our tools.

### Step 3: Set the visual intensity

Not every site needs the same level of design. Match the visual intensity to the business:

| Intensity | When to use | What it means |
| --- | --- | --- |
| **Minimal** | Dentist, lawyer, plumber, accountant, cleaning co. | No animated hero. Mesh gradient or plain background. Inter font. Monochrome or blue theme. Default light mode. Fast, clean, zero friction. |
| **Warm** | Restaurant, bakery, cafe, family business, B&B | Typography and color do the work. Warm theme (amber, caffeine, studio-ghibli). Consider a serif heading font. Food/interior hero image. Subtle scroll animations only. |
| **Visual** | Photographer, architect, model agency, interior designer | Full-bleed image hero. Gallery is the star. Dark mode default likely. Let the work speak — keep chrome minimal. |
| **Atmospheric** | Tattoo artist, nightclub, wine bar, premium brand | Animated shader hero (AccretionShaders, AuroraShaders). Bold theme (cyberpunk, doom-64, dark-matter). Dark mode default. The site itself is part of the brand experience. |
| **Storytelling** | Candle maker, craft brewery, artisan brand, pottery | NoiseShaders or WavesShaders. Earthy theme (studio-ghibli, caffeine). Story section is as important as products. Handwritten accent font optional. |

Most sites are **Minimal** or **Warm**. Only go higher when the business genuinely benefits from it. Over-designing a plumber's site doesn't make it better — it makes it slower and harder to use.

> **Skill cross-reference:** Compare your intensity choice with the skill's recommended style and anti-patterns. If the skill says "avoid dark mode for family restaurant" and you were considering dark mode — trust the skill's 161-industry dataset over gut feel.

### Step 4: Write the Visual Direction

Combine the skill's design system output (Step 0), the visitor analysis (Step 1), reference site analysis (Step 2), and intensity level (Step 3) into a detailed Visual Direction. Write this as a comment block at the top of `page.tsx`. This is the single source of truth for every design decision in the build.

**Run these skill searches to fill in any gaps:**

```bash
# Full design system for the industry
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<industry + mood>" --design-system -p "<Name>"
# Targeted color refinement
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<industry>" --domain color
# Font pairing options
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<mood keywords>" --domain typography
# UX guidelines for key page types
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<page type>" --domain ux
# Anti-patterns to avoid
python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py \
  "<industry>" --domain style
```

**Write the Visual Direction in this format:**

```tsx
/*
 * ═══════════════════════════════════════════════════════
 * VISUAL DIRECTION — [Business Name]
 * Generated: [date]
 * ═══════════════════════════════════════════════════════
 *
 * 1. CREATIVE DIRECTION
 *    Visitor: [who they are, what they need, how they feel]
 *    Feeling: [one sentence — what should the page feel like]
 *    Intensity: [minimal|warm|visual|atmospheric|storytelling]
 *    Site type: [Landing|Multi-page]
 *
 * 2. STYLE & PATTERN
 *    UI Style: [from skill — e.g., "Flat Design with subtle glassmorphism"]
 *    Landing Pattern: [from skill — e.g., "Hero + Features + CTA"]
 *    Section Order: [specific to this project — agent builds these in Stage 3]
 *      1. Hero — [type: mesh gradient / full-bleed image / shader]
 *      2. [section] — [brief purpose]
 *      3. [section] — [brief purpose]
 *      ...
 *    Component refs: [note any CUSTOMIZATION.md components to reuse]
 *    Effects: [from skill — e.g., "Subtle hover 200ms, scroll fade-in"]
 *
 * 3. COLOR PALETTE
 *    Source: [skill recommendation / client preference / theme file]
 *    Primary:    [hex] — [where it's used]
 *    Secondary:  [hex] — [where it's used]
 *    CTA:        [hex] — [where it's used]
 *    Background: [hex] light / [hex] dark
 *    Text:       [hex] light / [hex] dark
 *    Accent:     [hex] — [where it's used, if any]
 *    Theme file: [which templates/themes/ file to base on, or "custom"]
 *    Dark mode:  [default | available | not recommended]
 *
 * 4. TYPOGRAPHY
 *    Source: [skill recommendation / client preference]
 *    Heading: [font name] ([weight]) — [mood descriptor]
 *    Body:    [font name] ([weight]) — [mood descriptor]
 *    Google Fonts: [import URL]
 *    Special: [any accent font, monospace for pricing, etc.]
 *
 * 5. INDUSTRY-SPECIFIC RULES (from skill)
 *    Must-have: [e.g., "trust signals above fold", "menu scannable in 5s"]
 *    Decision rules: [e.g., "if warm → amber palette", "if food → hero image required"]
 *    Anti-patterns: [e.g., "avoid dark mode for family restaurant"]
 *    Severity: [HIGH/MEDIUM for each anti-pattern]
 *
 * 6. UX GUIDELINES (from skill)
 *    [3-5 most relevant UX rules for this specific business]
 *    e.g., "Contact info must be visible without scrolling"
 *    e.g., "Menu prices must be scannable, avoid hover-to-reveal"
 *    e.g., "Gallery should lazy-load, max 12 visible initially"
 *
 * 7. REFERENCE SITE (if provided)
 *    URL: [reference URL]
 *    Extracted: [design traits found — colors, fonts, layout, tone, spacing]
 *    Fed into skill: [keywords added to skill search based on reference]
 *    Borrowing: [specific elements we're taking from the reference]
 *    Adapted: [how we're translating those into our system]
 *    Skipping: [elements from reference that don't fit our stack/client]
 *
 * 8. CLIENT OVERRIDES
 *    [anything the client specified that overrides skill defaults]
 *    e.g., "Client wants green — overrides skill's recommended blue"
 *    e.g., "Client has no photos — use mesh gradient hero instead of image"
 *
 * ═══════════════════════════════════════════════════════
 */
```

**Every design decision in the build should trace back to this document.** If you're choosing a border-radius, spacing, animation, or color — check the Visual Direction first. If something isn't covered, add it.

**Priority order for conflicts:**

1. Client questionnaire answers (they're paying for it)
2. Skill recommendations (data-driven, industry-tested)
3. Template defaults (safe fallback)

### Common mistakes

- **Over-animating service businesses.** A dentist with AccretionShaders behind the hero looks absurd. Stick to mesh gradient or no background.
- **Under-designing creative businesses.** A photographer with Inter font and a blue theme looks generic. They need their work front and center with minimal chrome.
- **Wrong default mode.** A children's education site in dark mode feels wrong. A high-end cocktail bar in light mode feels flat.
- **Adding sections nobody needs.** A plumber doesn't need a Story section. A solo photographer doesn't need a Team section. Every section should earn its place.
- **Ignoring the visitor's urgency.** Someone looking for a plumber at 10pm needs a phone number in 2 seconds. Someone browsing a pottery studio on a Sunday afternoon can linger. Design for the real scenario.

---

## 2.2 Design system defaults

The technical defaults below apply to all sites. The creative direction above determines *how* you use them — which theme to apply, which font to load, which hero variant to build, and how much animation to add.

- **Scandinavian minimalism** as the baseline — clean, spacious, not flashy
- Dark/light mode with theme toggle (default mode set by creative direction)
- Monochromatic palette with subtle accent color (theme determines which)
- No glow effects, text shimmer, or heavy visual effects unless the intensity level calls for it
- Smooth, subtle animations (Framer Motion with `whileInView`, `once: true`)
- Mobile-first responsive design

## 2.3 globals.css

This is the foundation. Copy this into `src/app/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

/* Light mode (default) */
:root {
  --radius: 0.625rem;
  --background: oklch(0.985 0 0);
  --foreground: oklch(0.09 0 0);
  --card: oklch(0.97 0 0);
  --card-foreground: oklch(0.09 0 0);
  --popover: oklch(0.97 0 0);
  --popover-foreground: oklch(0.09 0 0);
  --primary: oklch(0.09 0 0);
  --primary-foreground: oklch(0.97 0 0);
  --secondary: oklch(0.92 0 0);
  --secondary-foreground: oklch(0.09 0 0);
  --muted: oklch(0.92 0 0);
  --muted-foreground: oklch(0.45 0 0);
  --accent: oklch(0.92 0 0);
  --accent-foreground: oklch(0.09 0 0);
  --destructive: oklch(0.55 0.2 27);
  --destructive-foreground: oklch(0.97 0 0);
  --border: oklch(0.09 0 0 / 0.1);
  --input: oklch(0.09 0 0 / 0.1);
  --ring: oklch(0.09 0 0 / 0.2);
  --chart-1: oklch(0.09 0 0);
  --chart-2: oklch(0.3 0 0);
  --chart-3: oklch(0.5 0 0);
  --chart-4: oklch(0.7 0 0);
  --chart-5: oklch(0.85 0 0);
  --sidebar-background: oklch(0.97 0 0);
  --sidebar-foreground: oklch(0.09 0 0);
  --sidebar-primary: oklch(0.09 0 0);
  --sidebar-primary-foreground: oklch(0.97 0 0);
  --sidebar-accent: oklch(0.92 0 0);
  --sidebar-accent-foreground: oklch(0.09 0 0);
  --sidebar-border: oklch(0.09 0 0 / 0.1);
  --sidebar-ring: oklch(0.09 0 0 / 0.2);
}

/* Dark mode */
.dark {
  --background: oklch(0 0 0);
  --foreground: oklch(0.97 0 0);
  --card: oklch(0.05 0 0);
  --card-foreground: oklch(0.97 0 0);
  --popover: oklch(0.05 0 0);
  --popover-foreground: oklch(0.97 0 0);
  --primary: oklch(0.97 0 0);
  --primary-foreground: oklch(0.05 0 0);
  --secondary: oklch(0.15 0 0);
  --secondary-foreground: oklch(0.97 0 0);
  --muted: oklch(0.15 0 0);
  --muted-foreground: oklch(0.55 0 0);
  --accent: oklch(0.15 0 0);
  --accent-foreground: oklch(0.97 0 0);
  --destructive: oklch(0.55 0.2 27);
  --destructive-foreground: oklch(0.97 0 0);
  --border: oklch(0.97 0 0 / 0.1);
  --input: oklch(0.97 0 0 / 0.1);
  --ring: oklch(0.97 0 0 / 0.2);
  --chart-1: oklch(0.97 0 0);
  --chart-2: oklch(0.7 0 0);
  --chart-3: oklch(0.5 0 0);
  --chart-4: oklch(0.3 0 0);
  --chart-5: oklch(0.15 0 0);
  --sidebar-background: oklch(0.03 0 0);
  --sidebar-foreground: oklch(0.97 0 0);
  --sidebar-primary: oklch(0.97 0 0);
  --sidebar-primary-foreground: oklch(0.05 0 0);
  --sidebar-accent: oklch(0.15 0 0);
  --sidebar-accent-foreground: oklch(0.97 0 0);
  --sidebar-border: oklch(0.97 0 0 / 0.1);
  --sidebar-ring: oklch(0.97 0 0 / 0.2);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar-background: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-sans);
  }
}

/* Card utility classes — dark mode */
.dark .glass {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.dark .glass-hover {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.dark .glass-hover:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
}

.dark .glass-active {
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
}

/* Card utility classes — light mode */
:root:not(.dark) .glass {
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
}

:root:not(.dark) .glass-hover {
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
  transition: background 0.3s ease, border-color 0.3s ease;
}

:root:not(.dark) .glass-hover:hover {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
}

:root:not(.dark) .glass-active {
  border-radius: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
}

/* Noise grain overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Selection color — dark */
.dark ::selection {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

/* Selection color — light */
:root:not(.dark) ::selection {
  background-color: rgba(0, 0, 0, 0.1);
  color: black;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 2.4 Color rules

### ALWAYS use semantic tokens

```
text-foreground          — primary text
text-muted-foreground    — secondary/subtle text
text-foreground/60       — tertiary text
text-foreground/30       — very subtle (icons, decorative)
bg-background            — page background
bg-foreground/5          — subtle input/card backgrounds
border-border            — standard borders
border-foreground/20     — subtle button borders
```

### NEVER hardcode colors

```
WRONG: text-white, bg-black, text-gray-500, border-gray-800
RIGHT: text-foreground, bg-background, text-muted-foreground, border-border
```

Hardcoded colors break in the opposite theme.

## 2.5 Typography

- Font: **Inter** (Google Fonts, loaded in layout.tsx)
- Weights: 100–900 (variable)
- Headings: `font-bold`, sizes `text-3xl md:text-4xl` for section titles
- Hero headline: `text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[1.05] tracking-tight`
- Body: `text-lg text-muted-foreground`
- Small/labels: `text-sm text-muted-foreground` or `text-xs`
- Section labels: `text-sm font-medium uppercase tracking-widest text-muted-foreground`

## 2.6 Spacing patterns

- Section padding: `px-6 py-24 md:px-8 lg:px-16`
- Max width: `mx-auto max-w-6xl` (main content), `max-w-3xl` (legal pages), `max-w-2xl` (forms)
- Section header bottom margin: `mb-16`
- Between sections: `<div className="border-t border-border" />`

## 2.7 Card classes

Use the `.glass`, `.glass-hover`, `.glass-active` CSS classes. Do NOT use `@apply` with them — they are plain CSS.

- `.glass` — static card (contact form, success message)
- `.glass-hover` — interactive card (service cards, feature cards)
- `.glass-active` — highlighted card (featured/popular item)

## 2.8 Button patterns

```tsx
{/* Primary CTA */}
<Button className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/90">
  Label
</Button>

{/* Secondary / outline */}
<Button className="rounded-full border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5">
  Label
</Button>
```

All buttons use `rounded-full`. Primary buttons invert foreground/background.

## 2.9 Animation patterns

```tsx
{/* Fade in on scroll — use for all section content */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* content */}
</motion.div>

{/* Staggered children — use for card grids */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {/* card */}
    </motion.div>
  ))}
</motion.div>

{/* Hero entrance — use animate, not whileInView */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
>
  {/* hero content */}
</motion.div>
```

Key rules:
- Always use `once: true` on `viewport` to animate only on first appearance
- Use `whileInView` for scroll sections, `animate` for hero (loads immediately)
- Stagger delay: 0.1s between children
- Keep animations subtle — `y: 20` slide, 0.5s duration
