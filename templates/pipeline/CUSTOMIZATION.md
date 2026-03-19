# Customization Guide

How to adapt the template for each client. Every client site uses the same stack but with different content, colors, and branding.

---

## Quick reference — What to change per client

| What | Where | Example |
|------|-------|---------|
| Business name | `layout.tsx` metadata, navbar, footer, legal pages | "Bella Beauty Salon" |
| Domain | `layout.tsx` metadataBase, robots.ts | "bellasalon.hu" |
| Colors | `globals.css` CSS variables | See color section below |
| Font | `layout.tsx` Google Fonts link, `globals.css` `--font-sans` | "Playfair Display" |
| Logo | `navbar.tsx` (text → image), `icon.svg` | Client's logo |
| Content | `en.json`, `hu.json` | All page text |
| Pages | `page.tsx` section imports | Add/remove sections |
| Hero gradient | `hero.tsx` MeshGradient `colors` prop | `["#ec4899", "#f43f5e"]` |
| Social links | `footer.tsx` href values | Real URLs |
| Contact email | `footer.tsx`, legal pages | "info@bellasalon.hu" |

---

## Color customization

> **Quick start:** Instead of browsing presets manually, run the UI/UX skill to search 161 industry-specific palettes:
> ```bash
> python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<industry>" --domain color
> ```
> Then map the skill's hex values to the CSS variable format below.

### Understanding the color system

Colors are CSS variables using OKLCH format: `oklch(lightness chroma hue)`.

- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.4 (vivid)
- **Hue**: 0-360 degrees (red=27, orange=70, yellow=100, green=145, blue=260, purple=300)

For the monochromatic theme (what we use), chroma is always 0 — pure grays.

### Changing the base theme

**Light mode** — edit `:root` block in `globals.css`:
```css
--background: oklch(0.985 0 0);  /* near-white page bg */
--foreground: oklch(0.09 0 0);   /* near-black text */
```

**Dark mode** — edit `.dark` block:
```css
--background: oklch(0 0 0);      /* pure black */
--foreground: oklch(0.97 0 0);   /* near-white text */
```

### Adding a brand color

To add a colored accent (e.g., for a salon that wants pink):

1. Keep the monochromatic base
2. Add accent to specific elements:
   - Hero gradient colors
   - CTA button background
   - Gradient border on featured card
   - Step number backgrounds

Example — pink accent:
```css
/* In globals.css, replace violet accent references */
/* rgba(167, 139, 250, x) → rgba(236, 72, 153, x) */
```

In hero:
```tsx
<MeshGradientBackground
  colors={["#ec4899", "#f43f5e", "#fb7185", "#fda4af"]}
/>
```

---

## Font customization

> **Quick start:** Search 1,900+ font combinations with the UI/UX skill:
> ```bash
> python3 ~/.claude/plugins/marketplaces/ui-ux-pro-max-skill/src/ui-ux-pro-max/scripts/search.py "<mood keywords>" --domain typography
> ```

### Changing the font

1. Pick a font from [Google Fonts](https://fonts.google.com)
2. Update `layout.tsx`:
```html
<link
  href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@100..900&display=swap"
  rel="stylesheet"
/>
```
3. Update `globals.css`:
```css
--font-sans: "YOUR_FONT", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

### Implementing a heading/body font pairing

To use different fonts for headings and body text:

1. Load both fonts in `layout.tsx`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@100..900&display=swap"
  rel="stylesheet"
/>
```

2. Add a `--font-heading` variable in the `@theme inline` block in `globals.css`:

```css
--font-heading: "Playfair Display", ui-serif, Georgia, serif;
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
```

3. Apply the heading font via CSS in `globals.css`:

```css
@layer base {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}
```

---

## Logo customization

### Text logo (default)

In `navbar.tsx`:
```tsx
<a href="#" className="text-lg font-bold tracking-tight">
  Client Business Name
</a>
```

### Image logo

Replace text with Next.js Image:
```tsx
import Image from "next/image";

<a href="#">
  <Image src="/images/logo.svg" alt="Business Name" width={120} height={32} />
</a>
```

Store logo in `public/images/logo.svg` (or `.png`).

For dark/light mode, either:
- Use an SVG with `currentColor` fill (adapts automatically)
- Provide two versions and switch based on theme

---

## Page customization

### Adding a section

1. Create `src/components/landing/new-section.tsx`
2. Add translations to both JSON files under a new key
3. Import and add to `page.tsx` in the desired position
4. Add a `<div className="border-t border-border" />` separator

### Removing a section

1. Remove the import and component from `page.tsx`
2. Remove the separator div above/below it
3. Optionally remove translations (not required, unused keys don't cause errors)
4. Remove any nav links pointing to it

All sites include: Navbar (top), Footer (bottom), Legal pages (privacy, terms, imprint). The Visual Direction (STAGE-2 Step 4) determines which sections to build for each project.

---

## Hero gradient customization

The `MeshGradientBackground` creates 4 animated gradient orbs. To customize:

```tsx
<MeshGradientBackground
  colors={["#COLOR1", "#COLOR2", "#COLOR3", "#COLOR4"]}
  speed={0.5}           // 0.3 = very slow, 0.5 = default, 1 = normal
  backgroundColor="transparent"
/>
```

**Tips:**
- Use 4 colors from the same family for cohesion
- Colors 1 & 3 should be the most visible (they're the largest orbs)
- Keep it subtle — hero gradient is a background, not the focal point
- Test in both light and dark mode

---

## Accent color reference

The site uses three accent colors on an otherwise monochrome base:

| Color | Hex | Where used |
|-------|-----|------------|
| Violet | `rgba(167, 139, 250, x)` | Gradient border + glow shadow on popular pricing card |
| Blue | `#2563eb` | Hero mesh gradient orbs |
| Teal | `#0d9488` | Hero mesh gradient orbs |

Everything else (cards, step circles, borders, text) stays monochrome using semantic tokens.

### Changing the pricing card accent

In `globals.css`, find `.gradient-border::before` and replace:
```css
rgba(167, 139, 250, 0.6)  /* → your accent color at 60% opacity */
rgba(129, 140, 248, 0.25) /* → your accent color at 25% opacity */
```

And in `pricing.tsx`, update the shadow color:
```tsx
shadow-[0_0_80px_-20px_rgba(139,92,246,0.25)]  /* → your accent at 25% */
```

---

## Animated backgrounds

The template includes 10 animated background components in `src/components/ui/`. These are powerful tools for giving client sites a unique, premium feel — especially for artsy, creative, and luxury businesses. Be creative with them.

### Background catalog

| Component | Import | Visual Effect | Compute | Best For |
|-----------|--------|---------------|---------|----------|
| `MeshGradientBackground` | `@/components/ui/mesh-gradient` | Drifting color orbs | Very Low | Default/safe choice, works for any business |
| `AuroraShaders` | `@/components/ui/aurora` | Northern lights curtains | Medium | Wellness, luxury, spa, accommodation |
| `WavesShaders` | `@/components/ui/waves` | Flowing plasma layers | Low | Creative studios, music, spa, calm brands |
| `CosmicWavesShaders` | `@/components/ui/cosmic-waves` | Starfield + wave ripples | Medium | Tech, education, bold agencies |
| `NoiseShaders` | `@/components/ui/noise` | Fractal terrain / organic | Low | Nature brands, artisan, organic products |
| `FlickeringGrid` | `@/components/ui/flickering-grid` | Digital noise grid | Very Low | Tech, retro, developer tools, modern |
| `AccretionShaders` | `@/components/ui/accretion` | Cosmic vortex / energy | Medium | Bold brands, tech, energy, nightlife |
| `SingularityShaders` | `@/components/ui/singularity` | Black hole pull effect | Medium | Dark/premium sites, security, enterprise |
| `SeaShaders` | `@/components/ui/sea` | Photorealistic ocean | **High** | Resort, travel, coastal accommodation |
| `DesertSandShaders` | `@/components/ui/desert-sand` | Sand dunes flyover | **Very High** | Adventure, automotive, epic feel |

### Creative usage ideas

Don't limit animated backgrounds to the hero. For artsy and creative sites, use them throughout the page:

1. **Hero full-bleed background** — Primary use. Replace `MeshGradientBackground` or the hero `<Image>` with any shader.
2. **Section divider strip** — A 150-200px animated strip between sections, replacing the plain `border-t` divider.
3. **Behind gallery section** — Low opacity shader behind a photo grid adds depth and movement.
4. **Contact section background** — Subtle animation creates an inviting atmosphere for the form area.
5. **Behind glass cards** — Shader visible through the gaps between `.glass` cards for a layered effect.

### Implementation pattern — Section background

Wrap any shader as a background for any section:

```tsx
import { AuroraShaders } from "@/components/ui/aurora";

<section className="relative overflow-hidden">
  {/* Animated background */}
  <div className="absolute inset-0 opacity-30">
    <AuroraShaders speed={0.3} intensity={0.5} />
  </div>

  {/* Section content stays above */}
  <div className="relative z-10">
    {/* Your section content */}
  </div>
</section>
```

### Implementation pattern — Section divider strip

Replace the `<div className="border-t border-border" />` between sections:

```tsx
import { WavesShaders } from "@/components/ui/waves";

<div className="relative h-48 overflow-hidden">
  <div className="absolute inset-0 opacity-40">
    <WavesShaders speed={0.3} />
  </div>
  {/* Fade edges into the page background */}
  <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
</div>
```

### Implementation pattern — Shader hero (replacing image hero)

For creative sites that want animation instead of a static photo:

```tsx
import { AccretionShaders } from "@/components/ui/accretion";

<section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
  {/* Shader background */}
  <div className="absolute inset-0">
    <AccretionShaders speed={0.4} brightness={0.6} />
  </div>
  {/* Overlay for text readability */}
  <div className="absolute inset-0 bg-background/40" />

  <div className="relative z-10 mx-auto max-w-5xl text-center">
    {/* Badge → Headline → Subtitle → CTAs */}
  </div>
</section>
```

### Performance rules

- **`SeaShaders` and `DesertSandShaders` are GPU-heavy** — use as hero background only, never multiple on one page
- **Low/Very Low compute** backgrounds (`MeshGradientBackground`, `WavesShaders`, `NoiseShaders`, `FlickeringGrid`) can be stacked (e.g., hero + section divider)
- Always use `opacity-30` to `opacity-50` when placing shaders behind content — ensures text readability
- On mobile, reduce shader `speed` props by ~50% for battery life
- Consider lazy-rendering heavy shaders: only mount the component when the section scrolls into view (use Framer Motion `whileInView` or an intersection observer)
- Never use more than 2 shader backgrounds on a single page — even low-compute ones add up

### Color matching

Adjust shader colors to match the client's brand palette:

| Component | How to adjust color |
|-----------|-------------------|
| `MeshGradientBackground` | `colors` prop — array of 4 hex values |
| `AuroraShaders` | `vibrancy` (0-1) + `colorShift` (0-1) props |
| `WavesShaders` | `colorVariation` (0-1) prop |
| `AccretionShaders` | `colorShift` (0-1) prop |
| `CosmicWavesShaders` | `colorShift` (0-1) prop |
| Others | Wrap in a div with CSS `filter: hue-rotate(Xdeg)` to shift the base palette |

---

## Hero variants

### Mesh gradient

Animated gradient orbs behind text. See the "Hero gradient customization" section above.

The `MeshGradientBackground` component goes in `src/components/ui/mesh-gradient.tsx`:

```tsx
"use client"

import { cn } from "@/lib/utils"

export interface MeshGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  colors?: string[]
  speed?: number
  backgroundColor?: string
}

export function MeshGradientBackground({
  className,
  children,
  colors = ["#7c3aed", "#2563eb", "#06b6d4", "#8b5cf6"],
  speed = 1,
  backgroundColor = "#030014",
}: MeshGradientBackgroundProps) {
  const duration1 = 60 / speed
  const duration2 = 80 / speed
  const duration3 = 90 / speed
  const duration4 = 70 / speed

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} style={{ backgroundColor }}>
      <div className="absolute inset-0">
        <div
          className="absolute h-[60%] w-[60%] rounded-full"
          style={{
            left: "-10%",
            top: "-10%",
            background: `radial-gradient(circle, ${colors[0]}40 0%, transparent 70%)`,
            filter: "blur(80px)",
            animation: `meshMove1 ${duration1}s ease-in-out infinite`,
          }}
        />
        <div
          className="absolute h-[50%] w-[50%] rounded-full"
          style={{
            right: "-5%",
            top: "10%",
            background: `radial-gradient(circle, ${colors[1]}35 0%, transparent 70%)`,
            filter: "blur(100px)",
            animation: `meshMove2 ${duration2}s ease-in-out infinite`,
          }}
        />
        <div
          className="absolute h-[55%] w-[70%] rounded-full"
          style={{
            left: "20%",
            bottom: "-15%",
            background: `radial-gradient(circle, ${colors[2]}30 0%, transparent 70%)`,
            filter: "blur(120px)",
            animation: `meshMove3 ${duration3}s ease-in-out infinite`,
          }}
        />
        <div
          className="absolute h-[40%] w-[40%] rounded-full"
          style={{
            left: "40%",
            top: "30%",
            background: `radial-gradient(circle, ${colors[3] || colors[0]}25 0%, transparent 70%)`,
            filter: "blur(90px)",
            animation: `meshMove4 ${duration4}s ease-in-out infinite`,
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {children && <div className="relative z-10 h-full w-full">{children}</div>}

      <style jsx>{`
        @keyframes meshMove1 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          25% { transform: translate(5%, 10%) scale(1.05); }
          50% { transform: translate(10%, 5%) scale(0.95); }
          75% { transform: translate(5%, -5%) scale(1.02); }
        }
        @keyframes meshMove2 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          33% { transform: translate(-10%, 8%) scale(1.08); }
          66% { transform: translate(-5%, -5%) scale(0.95); }
        }
        @keyframes meshMove3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(-8%, -10%) scale(1.1); }
        }
        @keyframes meshMove4 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          25% { transform: translate(15%, -10%) scale(0.9); }
          50% { transform: translate(-10%, 15%) scale(1.1); }
          75% { transform: translate(-15%, -5%) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
```

### Full-bleed image

Replace the mesh gradient with a full-screen background image:

```tsx
import Image from "next/image";

<section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
  {/* Background image */}
  <Image
    src="/images/hero.jpg"
    alt=""
    fill
    className="object-cover"
    priority
  />
  {/* Overlay for text readability */}
  <div className="absolute inset-0 bg-background/60" />

  <div className="relative mx-auto max-w-5xl text-center">
    {/* Title, subtitle, CTAs */}
  </div>
</section>
```

**Tips:**
- Store hero image in `public/images/hero.jpg`
- `priority` ensures the hero image loads immediately (no lazy loading)
- Adjust overlay opacity: `bg-background/60` works for most images. Lighter images may need `/70`, darker images `/40`
- The `bg-background` overlay works in both light and dark mode (white overlay in light, black in dark)
- For video hero, replace `<Image>` with a `<video autoPlay muted loop playsInline>` element

### Minimal hero (text-only with accent line)

For ultra-clean brands that don't need a background:

```tsx
<section className="flex min-h-[80vh] items-center justify-center px-6 pt-20">
  <div className="mx-auto max-w-4xl text-center">
    {/* Optional accent line */}
    <div className="mx-auto mb-8 h-px w-16 bg-foreground/20" />
    <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
      {t("title")}
    </h1>
    <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
      {t("subtitle")}
    </p>
  </div>
</section>
```

### Video hero (autoplay background)

Full-viewport video background, cinematic style. Works with Vimeo or self-hosted MP4.

```tsx
<section className="relative h-screen w-full overflow-hidden">
  {/* Video background — Vimeo */}
  <iframe
    src="https://player.vimeo.com/video/VIDEO_ID?background=1&autoplay=1&loop=1&muted=1"
    className="pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
    style={{ width: "177.77vh", height: "56.25vw", minWidth: "100%", minHeight: "100%" }}
    allow="autoplay; fullscreen"
    title="Hero video"
  />

  {/* Optional text overlay */}
  <div className="absolute inset-0 bg-background/30" />
  <div className="relative z-10 flex h-full items-end p-12">
    <h1 className="text-5xl font-bold md:text-7xl">{t("title")}</h1>
  </div>
</section>
```

For self-hosted video (MP4):

```tsx
<video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover">
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

**Tips:**
- Vimeo `background=1` removes controls, branding, and plays silently
- The `177.77vh` / `56.25vw` sizing ensures 16:9 coverage at any viewport
- For navbar invert over dark video: add `className={cn("fixed top-0 z-50", isOverHero && "invert")}` to navbar, where `isOverHero` checks `scrollY < window.innerHeight`
- Store self-hosted videos in `public/videos/`

---

## Navigation variants

### Sidebar navigation

Alternative to the default top navbar. A hamburger in the top bar opens a left slide-out panel. Best for: editorial sites, agencies, portfolios with a Ford Models / high-fashion aesthetic.

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Adapt navLinks to match the project's pages
const navLinks = [
  { key: "models", href: "/models" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

export function SidebarNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar — always visible */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4">
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-1.5"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="block h-0.5 w-6 bg-foreground" />
        </button>
        <a href="/" className="text-lg font-bold tracking-tight">
          {/* Replace with business name or Image component */}
          {{BUSINESS_NAME}}
        </a>
        <div className="w-6" /> {/* Spacer for centering */}
      </header>

      {/* Sidebar overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/50"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
              className="fixed left-0 top-0 z-[70] flex h-full w-[300px] flex-col bg-background p-8"
            >
              <button
                onClick={() => setOpen(false)}
                className="mb-12 self-start"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-xl font-bold uppercase tracking-wide text-foreground/80 transition-opacity hover:text-foreground"
                  >
                    {t(link.key)}
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

Adapt `navLinks` to match the project's pages. For multi-page sites, use actual routes (`/models`, `/about`) instead of anchor links (`#models`, `#about`). Add language switcher and theme toggle to the top bar or inside the sidebar panel as needed.

---

## Portfolio / Model grid

Responsive image grid for portfolio items, model cards, or property listings. Minimal design — image + name only.

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface GridItem {
  slug: string;
  name: string;
  thumbnailImage: string;
}

export function PortfolioGrid({
  items,
  basePath = "/models",
}: {
  items: GridItem[];
  basePath?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 px-6 py-12 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item, i) => (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.05 }}
        >
          <Link href={`${basePath}/${item.slug}`} className="group block">
            <div className="aspect-[3/4] overflow-hidden">
              <Image
                src={item.thumbnailImage}
                alt={item.name}
                width={400}
                height={533}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 text-xs font-light uppercase tracking-widest text-muted-foreground">
              {item.name}
            </h3>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
```

For a static "featured" grid on the homepage (no links, just images + names), remove the `Link` wrapper and `basePath` prop. Adjust `aspect-[3/4]` to match the image orientation (e.g., `aspect-square` for square thumbnails, `aspect-[4/3]` for landscape).

---

## Custom form fields

The default contact form has: Name, Email, Phone, Message. To add custom fields:

### Dropdown (e.g., project type, inquiry type)

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<div className="space-y-2">
  <Label>{t("form.projectType")}</Label>
  <Select>
    <SelectTrigger className="rounded-xl border-border bg-foreground/5 text-foreground focus:border-foreground/30 focus-visible:ring-0">
      <SelectValue placeholder={t("form.projectTypePlaceholder")} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="wedding">{t("form.types.wedding")}</SelectItem>
      <SelectItem value="portrait">{t("form.types.portrait")}</SelectItem>
      <SelectItem value="corporate">{t("form.types.corporate")}</SelectItem>
      <SelectItem value="other">{t("form.types.other")}</SelectItem>
    </SelectContent>
  </Select>
</div>
```

Requires: `bunx shadcn@latest add select`

### Date picker (e.g., event date, booking date)

For a simple date input without adding a calendar library:

```tsx
<div className="space-y-2">
  <Label>{t("form.date")}</Label>
  <Input
    type="date"
    className="rounded-xl border-border bg-foreground/5 text-foreground focus:border-foreground/30 focus-visible:ring-0"
  />
</div>
```

---

## Opening hours display

For businesses with physical locations:

```tsx
import { Clock } from "lucide-react";

<div className="flex items-start gap-4">
  <Clock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
  <div>
    <h3 className="mb-2 font-medium">{t("hours.label")}</h3>
    <div className="space-y-1 text-sm text-muted-foreground">
      <p>{t("hours.monFri")}</p>
      <p>{t("hours.sat")}</p>
      <p>{t("hours.sun")}</p>
    </div>
  </div>
</div>
```

Translation keys:
```json
{
  "hours": {
    "label": "Nyitvatartás",
    "monFri": "Hétfő - Péntek: 9:00 - 17:00",
    "sat": "Szombat: 10:00 - 14:00",
    "sun": "Vasárnap: Zárva"
  }
}
```

---

## Google Maps embed

For contact pages that need a map:

```tsx
<div className="overflow-hidden rounded-xl">
  <iframe
    src="https://www.google.com/maps/embed?pb=PLACE_ID_HERE"
    width="100%"
    height="300"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Location map"
  />
</div>
```

**How to get the embed URL:**
1. Go to Google Maps, search for the business address
2. Click "Share" → "Embed a map"
3. Copy the `src` URL from the iframe code
4. Paste it as the `src` value above

---

## Stock photos

When the client doesn't have professional photos:

**Free sources:**
- [Unsplash](https://unsplash.com) — high-quality, free for commercial use
- [Pexels](https://pexels.com) — similar to Unsplash, good variety
- [Pixabay](https://pixabay.com) — larger library, more varied quality

**Tips:**
- Search in the client's industry: "hair salon interior", "restaurant food", "car mechanic"
- Download the largest size available
- Use Next.js `<Image>` component — it handles optimization automatically
- Store in `public/images/` with descriptive names (`hero-salon-interior.jpg`, not `IMG_3847.jpg`)
- Always fill in the `alt` attribute with a description for accessibility and SEO
- Prefer landscape orientation for hero images, square or portrait for gallery/team cards

---

## When the client has no images

If the client hasn't provided photos yet, never leave `<Image>` with a missing or empty `src` — it breaks the build.

**Option 1 — Colored placeholder divs:**

```tsx
<div className="aspect-[4/3] rounded-xl bg-foreground/5" />
```

**Option 2 — Stock photos** (see sources above). Download and store in `public/images/`.

**Option 3 — Text-only sections.** Skip the hero image and use the minimal hero variant (see "Hero variants" above). Skip the gallery section entirely.

Always replace placeholders before the site goes live.

---

## Pricing / Packages section (optional)

Reusable pricing card grid. Add as an optional section between the core content and Contact.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("pricing");

  const planKeys = ["basic", "standard", "premium"] as const;

  return (
    <section id="pricing" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-8 md:grid-cols-3"
        >
          {planKeys.map((key) => {
            const features = t.raw(`plans.${key}.features`) as string[];
            const popular = key === "standard";

            return (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                }}
                className={cn("flex flex-col p-8", popular ? "glass-active" : "glass")}
              >
                <h3 className="text-lg font-semibold">{t(`plans.${key}.name`)}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{t(`plans.${key}.price`)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`plans.${key}.description`)}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-8 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                >
                  <a href="#contact">{t(`plans.${key}.cta`)}</a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
```

Translation keys:

```json
{
  "pricing": {
    "label": "Árak",
    "title": "Csomagjaink",
    "subtitle": "Válassza ki az Önnek megfelelő csomagot.",
    "plans": {
      "basic": {
        "name": "Alap",
        "price": "15 000 Ft",
        "description": "Leírás",
        "cta": "Választom",
        "features": ["Feature 1", "Feature 2", "Feature 3"]
      }
    }
  }
}
```

---

## FAQ section (optional)

Accordion-based FAQ section. Requires shadcn Accordion: `bunx shadcn@latest add accordion`.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const t = useTranslations("faq");

  const itemKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

  return (
    <section id="faq" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {itemKeys.map((key) => (
              <AccordionItem key={key} value={key} className="glass px-6">
                <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                  {t(`items.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {t(`items.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
```

Translation keys:

```json
{
  "faq": {
    "label": "GYIK",
    "title": "Gyakran ismételt kérdések",
    "items": {
      "q1": {
        "question": "Kérdés szövege?",
        "answer": "Válasz szövege."
      }
    }
  }
}
```

---

## Testimonials section (optional)

Card grid of client testimonials. **Only use with real testimonials** — never generate fake quotes.

```tsx
"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function Testimonials() {
  const t = useTranslations("testimonials");

  const reviewKeys = ["r1", "r2", "r3"] as const;

  return (
    <section id="testimonials" className="px-6 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 md:grid-cols-3"
        >
          {reviewKeys.map((key) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="glass p-8"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-foreground/20 text-foreground/20" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`items.${key}.text`)}
              </p>
              <div className="mt-6">
                <p className="text-sm font-medium">{t(`items.${key}.name`)}</p>
                <p className="text-xs text-muted-foreground">{t(`items.${key}.role`)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

Translation keys:

```json
{
  "testimonials": {
    "label": "Vélemények",
    "title": "Mit mondanak rólunk",
    "items": {
      "r1": {
        "text": "Vélemény szövege.",
        "name": "Név",
        "role": "Pozíció / Cég"
      }
    }
  }
}
```
