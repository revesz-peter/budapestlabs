# Design Guide

General design principles and patterns for building sites with Tailwind CSS v4, shadcn/ui, next-themes, and Framer Motion. Not project-specific — these apply to every client site built from the pipeline.

---

## Color System

### Always use semantic tokens

Never hardcode colors like `text-white`, `bg-black`, `text-gray-500`. These break when the theme switches. Use the semantic CSS variable tokens that shadcn/ui provides:

| Token | Purpose |
|-------|---------|
| `background` | Page background |
| `foreground` | Primary text |
| `card` / `card-foreground` | Card surfaces and text |
| `popover` / `popover-foreground` | Dropdowns, tooltips |
| `primary` / `primary-foreground` | CTAs, key actions |
| `secondary` / `secondary-foreground` | Less prominent actions |
| `muted` / `muted-foreground` | Subdued surfaces, secondary text |
| `accent` / `accent-foreground` | Highlights, hover states |
| `destructive` / `destructive-foreground` | Errors, delete actions |
| `border` | Default borders |
| `input` | Input field borders |
| `ring` | Focus rings |

### Opacity layering

Use `foreground` with Tailwind opacity modifiers for depth instead of introducing new colors:

| Class | Usage |
|-------|-------|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, descriptions |
| `text-foreground/60` | Tertiary text, labels |
| `text-foreground/30` | Icons, decorative elements |
| `bg-foreground/5` | Subtle surface tint (cards, inputs) |
| `bg-foreground/[0.02]` | Very subtle hover states |
| `border-foreground/10` | Default borders |
| `border-foreground/20` | Emphasized borders |

This approach keeps things monochrome and theme-safe — the exact same classes work in light and dark mode.

### OKLCH color format

All theme CSS variables use OKLCH: `oklch(lightness chroma hue)`.

- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.4 (vivid)
- **Hue**: 0–360 degrees (red=27, orange=70, yellow=100, green=145, blue=260, purple=300)

Monochrome themes set chroma to 0. Colored themes increase chroma on specific tokens (primary, accent, destructive) while keeping surfaces neutral.

### Accent color restraint

Pick 1–2 accent colors max. Use them only for:
- Primary CTA buttons
- Hero background gradients
- One highlighted element (e.g., popular pricing card border)
- Chart/data visualization

Everything else stays monochrome via semantic tokens. More accents = more visual noise = cheaper-looking result.

---

## Theme System

### How themes work

Themes are CSS files with `:root` (light) and `.dark` (dark) variable blocks. They live in `templates/themes/`. To apply a theme, copy its variable blocks into the project's `globals.css`, replacing the existing ones.

The `@theme inline` block, `@layer base`, glass card classes, and all other CSS stays untouched — only the variable values change.

### Dark/light mode

- Managed by `next-themes` with `attribute="class"` strategy
- `<html>` gets `class="dark"` when dark mode is active
- `<html>` needs `suppressHydrationWarning` (required by next-themes)
- Theme-dependent CSS must be scoped: `.dark .class` and `:root:not(.dark) .class`
- Default theme should match the brand — luxury/creative sites often default to dark, service businesses to light

### Theme-aware CSS gotchas

- Glass card classes (`.glass`, `.glass-hover`, `.glass-active`) are plain CSS scoped by `.dark` / `:root:not(.dark)`. Do NOT use `@apply` with them — Tailwind v4 doesn't support `@apply` with custom utility classes that reference each other.
- Selection colors, gradient borders, and other decorative CSS also need `.dark` / `:root:not(.dark)` scoping.
- `backdrop-blur` is only visible when there's content behind the element. On solid backgrounds it does nothing — use opacity-based depth instead.

---

## Typography

### Scale

| Element | Classes |
|---------|---------|
| Hero H1 | `text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl` |
| Section H2 | `text-3xl font-bold md:text-4xl` |
| Large H2 | `text-4xl font-bold md:text-5xl lg:text-6xl` |
| Card H3 | `text-xl font-semibold` |
| Section label | `text-sm font-medium uppercase tracking-widest text-muted-foreground` |
| Body | `text-base` or `text-lg text-muted-foreground` |
| Small | `text-sm` |
| Tiny | `text-xs` |

### Weight scale

400 (body), 500 (medium/labels), 600 (semibold/card titles), 700 (bold/headings)

### Font loading

Load fonts via Google Fonts `<link>` in `layout.tsx`, then set `--font-sans` in the `@theme inline` block. Don't use `next/font` — it adds complexity for no real benefit on small sites.

For most sites, a single font family (Inter, Outfit, DM Sans, Nunito) is enough. Use heading/body pairings (e.g., Playfair Display + Inter) only when the brand clearly calls for it.

---

## Layout

### Section container

Every section follows this structure:

```tsx
<section id="section-name" className="px-6 py-24 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>
```

### Section header

Consistent pattern across all sections — label, title, subtitle:

```tsx
<div className="mb-16 text-center">
  <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
    {t("label")}
  </p>
  <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
  <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
    {t("subtitle")}
  </p>
</div>
```

### Spacing reference

| Context | Class |
|---------|-------|
| Page horizontal padding | `px-6 md:px-8 lg:px-16` |
| Section vertical padding | `py-24` |
| Max content width | `max-w-6xl mx-auto` |
| Section dividers | `border-t border-border` (or animated shader strip) |
| Card padding | `p-6` or `p-8` |
| Grid gaps | `gap-6` or `gap-8` |
| Form field spacing | `space-y-2` (within field), `gap-6` (grid of fields) |

### Responsive breakpoints

Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

General patterns:
- Single column → multi-column at `md` or `lg`
- Navbar: hamburger → inline links at `md`
- Hero text: scale up at each breakpoint (`text-5xl sm:text-6xl md:text-7xl`)
- Always test on 375px width (iPhone SE) as the minimum

---

## Glass Card System

Three CSS utility classes defined in `globals.css`. Theme-aware — scoped under `.dark` and `:root:not(.dark)`. No `@apply`, no `backdrop-blur`.

### `.glass` — Static card

```css
/* Dark: */ border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
/* Light: */ border: 1px solid rgba(0,0,0,0.06); background: rgba(0,0,0,0.02);
```

### `.glass-hover` — Interactive card

Same base + transition on hover:

```css
/* Dark hover: */ background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15);
/* Light hover: */ background: rgba(0,0,0,0.04); border-color: rgba(0,0,0,0.1);
```

### `.glass-active` — Highlighted card

Slightly more visible than `.glass` — used for emphasized items (popular plan, featured item):

```css
/* Dark: */ border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06);
/* Light: */ border: 1px solid rgba(0,0,0,0.1); background: rgba(0,0,0,0.03);
```

### Gradient border (optional, for one highlighted element)

```css
.gradient-border::before {
  background: linear-gradient(180deg, accent-color 0%, accent-color/15 50%, transparent 100%);
  /* Uses mask-composite for border-only effect */
}
```

---

## Component Patterns

### Buttons

All buttons use `rounded-full` and the shadcn `Button` component.

```tsx
{/* Primary (solid) */}
<Button className="rounded-full bg-foreground px-8 text-background hover:bg-foreground/90">

{/* Secondary (outline) */}
<Button variant="ghost" className="rounded-full border border-foreground/20 text-foreground hover:bg-foreground/5">
```

### Badges

```tsx
{/* Pill badge */}
<span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">

{/* Solid badge */}
<Badge className="border-transparent bg-foreground text-background">
```

### Scroll-aware navbar

Fixed position. Transparent by default, glass background on scroll. Use `requestAnimationFrame` throttling for the scroll listener — never raw `onscroll`.

```tsx
<nav className={cn(
  "fixed top-0 z-50 w-full transition-all duration-300",
  scrolled ? "border-b border-border bg-background/80 backdrop-blur-xl" : "bg-transparent"
)}>
```

`backdrop-blur` is appropriate here because the navbar overlaps real page content on scroll.

### Form fields

```tsx
<Input className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0" />
```

Consistent styling: `rounded-xl`, `bg-foreground/5` fill, no focus ring (use border color change instead).

### Icons

Lucide React throughout.

| Size | Class | Usage |
|------|-------|-------|
| Inline | `h-3.5 w-3.5` | Inside text |
| Small | `h-4 w-4` | Checkmarks, list icons |
| Standard | `h-5 w-5` | Standalone icons |
| Feature | `h-6 w-6` | Step icons, highlights |

Default color: `text-foreground/30` or `text-muted-foreground`

---

## Animation Patterns

Framer Motion only. No CSS animations except `pulse`/`spin` for loading states.

### Scroll-triggered (most sections)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

### Staggered children

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
>
  <motion.div variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }} />
</motion.div>
```

### Page load (hero only)

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
```

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Rules

- Always `once: true` on viewport — animations should not replay
- Duration: 0.3s–0.6s
- Easing: `easeOut` only — no bouncing, no spring physics
- Stagger: 0.06s–0.15s between children
- Hero animates on load (`animate`), everything else on scroll (`whileInView`)

---

## Animated Shader Backgrounds

10 WebGL/CSS animated background components. Powerful for creative and premium sites — use them as hero backgrounds, section dividers, or behind content at low opacity.

| Component | Visual | Compute |
|-----------|--------|---------|
| `MeshGradientBackground` | Drifting color orbs | Very Low |
| `AuroraShaders` | Northern lights curtains | Medium |
| `WavesShaders` | Flowing plasma layers | Low |
| `CosmicWavesShaders` | Starfield + wave ripples | Medium |
| `NoiseShaders` | Fractal terrain / organic | Low |
| `FlickeringGrid` | Digital noise grid | Very Low |
| `AccretionShaders` | Cosmic vortex / energy | Medium |
| `SingularityShaders` | Black hole pull effect | Medium |
| `SeaShaders` | Photorealistic ocean | **High** |
| `DesertSandShaders` | Sand dunes flyover | **Very High** |

### Usage pattern

```tsx
<section className="relative overflow-hidden">
  <div className="absolute inset-0 opacity-30">
    <AuroraShaders speed={0.3} intensity={0.5} />
  </div>
  <div className="relative z-10">
    {/* Section content */}
  </div>
</section>
```

### Section divider strip

Replace `<div className="border-t border-border" />` with an animated strip:

```tsx
<div className="relative h-48 overflow-hidden">
  <div className="absolute inset-0 opacity-40">
    <WavesShaders speed={0.3} />
  </div>
  <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
</div>
```

### Performance rules

- `SeaShaders` and `DesertSandShaders` are GPU-heavy — hero only, never multiple on one page
- Low/Very Low compute shaders can be stacked (e.g., hero + one section divider)
- Always use `opacity-30` to `opacity-50` when placing behind content for readability
- Max 2 shader backgrounds per page total
- On mobile, reduce `speed` props by ~50% for battery life
- Consider lazy-rendering: only mount the component when the section enters the viewport

### Color matching

| Component | How to adjust |
|-----------|--------------|
| `MeshGradientBackground` | `colors` prop — array of 4 hex values |
| `AuroraShaders` | `vibrancy` + `colorShift` props |
| `WavesShaders` | `colorVariation` prop |
| `AccretionShaders` | `colorShift` prop |
| `CosmicWavesShaders` | `colorShift` prop |
| Others | Wrap container with CSS `filter: hue-rotate(Xdeg)` |

---

## Visual Effects

### Noise grain overlay

Subtle film grain texture over the entire page. Adds tactile quality without being visible on its own:

```css
body::before {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  /* SVG fractalNoise texture */
}
```

### Text selection

Theme-aware selection colors:
- Dark: `rgba(255, 255, 255, 0.15)`
- Light: `rgba(0, 0, 0, 0.1)`

### Smooth scrolling

```css
html { scroll-behavior: smooth; }
```

---

## Do's and Don'ts

| Don't | Do Instead |
|-------|------------|
| Hardcode `text-white`, `bg-black` | Use `text-foreground`, `bg-background` |
| Use `@apply` with custom card classes | Use plain CSS scoped by `.dark` / `:root:not(.dark)` |
| Scatter accent colors everywhere | 1–2 accents max, monochrome for everything else |
| Use solid opaque card backgrounds | Use `.glass`, `.glass-hover`, `.glass-active` |
| Add heavy drop shadows for elevation | Use borders and subtle opacity differences |
| Add glow, shimmer, or flashy effects | Keep it clean — let content breathe |
| Use `backdrop-blur` on solid backgrounds | Only blur when element overlaps real content (navbar on scroll) |
| Animate with CSS keyframes | Use Framer Motion with `whileInView` + `once: true` |
| Use spring/bounce easing | Use `easeOut` only, 0.3–0.6s duration |
| Lazy-load hero images | Use `priority` on hero `<Image>` for instant load |
| Mix multiple font families casually | One font for most sites; pairings only when the brand demands it |
| Forget mobile testing | Always test at 375px width minimum |
