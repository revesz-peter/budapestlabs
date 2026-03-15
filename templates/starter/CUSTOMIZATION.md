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

### Color palette presets

**Blue + Teal** (default — professional, tech-forward):
```tsx
colors={["#2563eb", "#0d9488", "#3b82f6", "#06b6d4"]}
```

**Violet/Indigo** (creative, elegant):
```tsx
colors={["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa"]}
```

**Monochrome** (ultra-minimal, corporate):
```tsx
colors={["#404040", "#525252", "#6b7280", "#9ca3af"]}
```

**Rose/Pink** (beauty, wellness):
```tsx
colors={["#e11d48", "#ec4899", "#f43f5e", "#fb7185"]}
```

**Emerald/Green** (health, nature, finance):
```tsx
colors={["#059669", "#10b981", "#0d9488", "#14b8a6"]}
```

**Amber/Orange** (food, energy, warmth):
```tsx
colors={["#d97706", "#f59e0b", "#ea580c", "#fb923c"]}
```

---

## Font customization

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

### Font pairing suggestions

| Business type | Heading font | Body font |
|---------------|-------------|-----------|
| Professional/corporate | Inter | Inter |
| Beauty/luxury | Playfair Display | Inter |
| Creative/agency | Space Grotesk | Inter |
| Friendly/approachable | Nunito | Nunito |
| Modern/tech | Geist | Geist |

For simplicity, most Starter sites use a single font (Inter) for everything.

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

### Common Starter pages

Most Starter clients need 3-5 of these:
- **Home/Hero** — always present
- **About** — who they are, why choose them
- **Services** — what they offer (cards or list)
- **Gallery** — photos of work (if applicable)
- **Contact** — form + info
- **Footer** — always present

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

## Glass card accent customization

The gradient border on featured cards uses violet by default. To change:

In `globals.css`, find `.gradient-border::before` and replace:
```css
rgba(167, 139, 250, 0.4)  /* → your accent color at 40% opacity */
rgba(129, 140, 248, 0.15) /* → your accent color at 15% opacity */
```

Same for step number backgrounds in `.step-number-bg` if present.
