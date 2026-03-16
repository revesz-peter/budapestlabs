# Stage 2 — Design System

## 2.1 Creative direction

Before writing any code, stop and imagine the finished site from the visitor's perspective. Every design decision — theme, font, hero type, animation level, default color mode — flows from this.

### Step 1: Understand the visitor

Ask yourself: **Who is coming to this site, and what are they trying to do?**

- A **dentist's** visitor wants to check services, find the phone number, and book. They're probably anxious. The site should feel calm, clean, and trustworthy. Get out of their way.
- A **tattoo artist's** visitor wants to browse art and feel the artist's vibe. They're excited. The site should feel bold, visual, and atmospheric.
- A **restaurant's** visitor wants to see the menu, check prices, and maybe reserve a table. They're hungry. The site should feel warm, appetizing, and easy to scan.
- A **model agency's** visitor is a client or scout evaluating talent. They're professional but visually driven. The site should feel premium, editorial, and image-forward.
- A **candle maker's** visitor wants to feel the craft and story. They're browsing, not rushing. The site should feel handmade, warm, and inviting.

**Write one sentence describing what the visitor should feel when the page loads.** This is your creative direction. Every choice below should serve it.

### Step 2: Set the visual intensity

Not every site needs the same level of design. Match the visual intensity to the business:

| Intensity | When to use | What it means |
| --- | --- | --- |
| **Minimal** | Dentist, lawyer, plumber, accountant, cleaning co. | No animated hero. Mesh gradient or plain background. Inter font. Monochrome or blue theme. Default light mode. Fast, clean, zero friction. |
| **Warm** | Restaurant, bakery, cafe, family business, B&B | Typography and color do the work. Warm theme (amber, caffeine, studio-ghibli). Consider a serif heading font. Food/interior hero image. Subtle scroll animations only. |
| **Visual** | Photographer, architect, model agency, interior designer | Full-bleed image hero. Gallery is the star. Dark mode default likely. Let the work speak — keep chrome minimal. |
| **Atmospheric** | Tattoo artist, nightclub, wine bar, premium brand | Animated shader hero (AccretionShaders, AuroraShaders). Bold theme (cyberpunk, doom-64, dark-matter). Dark mode default. The site itself is part of the brand experience. |
| **Storytelling** | Candle maker, craft brewery, artisan brand, pottery | NoiseShaders or WavesShaders. Earthy theme (studio-ghibli, caffeine). Story section is as important as products. Handwritten accent font optional. |

Most sites are **Minimal** or **Warm**. Only go higher when the business genuinely benefits from it. Over-designing a plumber's site doesn't make it better — it makes it slower and harder to use.

### Step 3: Make the design decisions

Based on the creative direction and intensity level, decide:

1. **Theme** — Which CSS theme file? (See CLIENT.md archetype → theme table)
2. **Font** — Single font or heading/body pairing? (See CUSTOMIZATION.md)
3. **Default color mode** — Light (most businesses) or dark (luxury, nightlife, creative, photography)?
4. **Hero type** — Mesh gradient (safe default), full-bleed image (visual businesses), animated shader (atmospheric/creative), or minimal text-only?
5. **Animation level** — Standard scroll fade-ins only (minimal/warm), or additional shader backgrounds and section dividers (atmospheric/storytelling)?
6. **Section selection** — Which optional sections does this business need? FAQ? Pricing? Testimonials? Gallery? Don't add sections the business doesn't need.

**Write these decisions down as a comment at the top of `page.tsx` before building.** This prevents drift — when you're deep in code, you can check back against the original intent.

```tsx
// Creative direction: [one sentence]
// Intensity: minimal | warm | visual | atmospheric | storytelling
// Theme: [theme-name] | Font: [font] | Mode: light | dark
// Hero: mesh-gradient | image | shader ([which]) | minimal
// Optional sections: [list]
```

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
