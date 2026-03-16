# Design System

Monochrome, theme-aware design system built on Tailwind CSS v4, shadcn/ui, and Framer Motion. Scandinavian minimalism — clean, not flashy.

---

## Color System

All colors use **semantic Tailwind tokens**. Never hardcode `text-white`, `bg-black`, etc.

### Semantic Tokens

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `oklch(0.985 0 0)` | `oklch(0 0 0)` | Page background |
| `foreground` | `oklch(0.09 0 0)` | `oklch(0.97 0 0)` | Primary text |
| `muted-foreground` | `oklch(0.45 0 0)` | `oklch(0.55 0 0)` | Secondary text |
| `border` | `foreground/10` | `foreground/10` | Default borders |
| `input` | `foreground/10` | `foreground/10` | Input borders |

### Opacity Scale

Use `foreground` with opacity for layered depth:

| Class | Usage |
|-------|-------|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, descriptions |
| `text-foreground/60` | Feature list items, labels |
| `text-foreground/30` | Icons, tertiary elements |
| `bg-foreground/5` | Subtle surface tint |
| `bg-foreground/[0.02]` | Hover states on list items |
| `border-foreground/15` | Emphasized borders |
| `border-foreground/20` | Strong borders (buttons, active states) |

### Accent Colors

Minimal, reserved for specific uses only:

| Color | Hex | Usage |
|-------|-----|-------|
| Violet | `rgba(167, 139, 250, 0.4)` | Gradient border on popular pricing card |
| Indigo | `rgba(129, 140, 248, 0.15)` | Gradient border midpoint |
| Blue | `#2563eb`, `#3b82f6` | Hero mesh gradient background |
| Teal | `#0d9488`, `#06b6d4` | Hero mesh gradient background |

No other color accents. No glow effects, text shimmer, or heavy visual effects.

---

## Typography

**Font:** Inter (via `@theme inline { --font-sans: "Inter" }`)

### Scale

| Element | Classes |
|---------|---------|
| Hero H1 | `text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight` |
| Section H2 | `text-3xl md:text-4xl font-bold` |
| Large H2 | `text-4xl md:text-5xl lg:text-6xl font-bold` |
| Card H3 | `text-xl font-semibold` |
| Section label | `text-sm font-medium uppercase tracking-widest text-muted-foreground` |
| Body | `text-base` or `text-lg text-muted-foreground` |
| Small | `text-sm` |
| Tiny | `text-xs` |

### Weight Scale
400 (body), 500 (medium), 600 (semibold), 700 (bold)

---

## Glass Card System

Three CSS utility classes in `globals.css`. Theme-aware — scoped under `.dark` and `:root:not(.dark)`. No `@apply`, no `backdrop-blur`.

### `.glass` — Static card
```css
/* Dark */
border-radius: 1rem;
border: 1px solid rgba(255, 255, 255, 0.08);
background: rgba(255, 255, 255, 0.04);

/* Light */
border: 1px solid rgba(0, 0, 0, 0.06);
background: rgba(0, 0, 0, 0.02);
```

### `.glass-hover` — Interactive card
Same base as `.glass` + transition on hover:
```css
/* Dark hover */
background: rgba(255, 255, 255, 0.07);
border-color: rgba(255, 255, 255, 0.15);

/* Light hover */
background: rgba(0, 0, 0, 0.04);
border-color: rgba(0, 0, 0, 0.1);
```

### `.glass-active` — Highlighted card (e.g. popular plan)
```css
/* Dark */
border: 1px solid rgba(255, 255, 255, 0.15);
background: rgba(255, 255, 255, 0.06);

/* Light */
border: 1px solid rgba(0, 0, 0, 0.1);
background: rgba(0, 0, 0, 0.03);
```

### Gradient Border (popular pricing card only)
```css
.gradient-border::before {
  background: linear-gradient(
    180deg,
    rgba(167, 139, 250, 0.4) 0%,
    rgba(129, 140, 248, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%  /* rgba(0,0,0,0.05) in light */
  );
  /* Uses mask-composite for border-only effect */
}
```
Combined with: `shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)]`

---

## Layout

### Section Container
```tsx
<section className="px-6 py-24 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    {/* Content */}
  </div>
</section>
```

### Section Header
```tsx
<div className="mb-16 text-center">
  <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
    Label
  </p>
  <h2 className="text-3xl font-bold md:text-4xl">Title</h2>
  <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
    Subtitle text.
  </p>
</div>
```

### Spacing Reference

| Context | Class |
|---------|-------|
| Page horizontal padding | `px-6 md:px-8 lg:px-16` |
| Section vertical padding | `py-24` |
| Max content width | `max-w-6xl mx-auto` |
| Section dividers | `border-t border-border` |
| Card padding | `p-6` or `p-8` |
| Grid gaps | `gap-6` |
| Form field spacing | `space-y-2` (within), `gap-6` (grid) |

---

## Components

### Buttons

All buttons use `rounded-full`. ShadCN `Button` component.

**Primary (solid):**
```tsx
<Button className="rounded-full bg-foreground px-8 text-base text-background hover:bg-foreground/90">
```

**Secondary (ghost/outline):**
```tsx
<Button variant="ghost" className="rounded-full border border-foreground/20 text-base text-foreground hover:bg-foreground/5">
```

**Non-popular pricing:**
```tsx
<Button className="w-full rounded-full border border-foreground/20 bg-transparent text-foreground hover:bg-foreground/5">
```

### Badge

**Hero badge (pill):**
```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
```

**Popular badge (solid):**
```tsx
<Badge className="border-transparent bg-foreground text-background">
```

### Navbar

```tsx
{/* Container — transparent by default, glass on scroll */}
<nav className="fixed top-0 z-50 w-full transition-all duration-300">
  {/* Scrolled: border-b border-border bg-background/80 backdrop-blur-xl */}
  {/* Default: bg-transparent */}
</nav>

{/* Nav link */}
<a className="text-sm text-muted-foreground transition-colors hover:text-foreground">

{/* Language switcher */}
<div className="rounded-full border border-border bg-foreground/5 p-1">
  {/* Active */}  <button className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
  {/* Inactive */} <button className="rounded-full px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
</div>
```

### Form Fields

```tsx
<Label className="text-sm text-foreground/60">

<Input className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0" />

<Textarea className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0" />

<select className="rounded-xl border border-border bg-foreground/5 text-foreground focus:border-foreground/30 focus:outline-none">
```

### FAQ Accordion

```tsx
<AccordionItem className="border-border">
  <AccordionTrigger className="text-left text-foreground hover:text-foreground/80 hover:no-underline">
  <AccordionContent className="text-muted-foreground">
```

### Icons

**Lucide React** throughout.

| Size | Class | Usage |
|------|-------|-------|
| Inline | `h-3.5 w-3.5` | Inside text, delivery info |
| Small | `h-4 w-4` | Checkmarks, list icons |
| Standard | `h-5 w-5` | Standalone icons, addons |
| Feature | `h-6 w-6` | Step icons, feature highlights |

Default color: `text-foreground/30` with `group-hover:text-foreground/50`

---

## Animation Patterns

**Framer Motion** only. No CSS animations except pulse/spin for loading states.

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

**Rules:**
- Always `once: true` on viewport
- Duration: 0.3s–0.6s
- Easing: `easeOut` only
- No bouncing, spring physics, or flashy effects
- Stagger: 0.06s–0.15s

---

## Responsive Breakpoints

Tailwind defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

| Pattern | Breakpoints |
|---------|-------------|
| Pricing grid | 1 col → 3 col (`lg:grid-cols-3`) |
| Step grid | 1 col → 2 col → 4 col (`md:grid-cols-2 lg:grid-cols-4`) |
| Section headings | `text-3xl` → `md:text-4xl` |
| Navbar | Hamburger → inline links at `md` |

---

## Visual Effects

### Noise Grain Overlay
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

### Text Selection
- Dark: `rgba(255, 255, 255, 0.15)` background
- Light: `rgba(0, 0, 0, 0.1)` background

### Smooth Scrolling
```css
html { scroll-behavior: smooth; }
```

---

## Rules

| Don't | Do Instead |
|-------|------------|
| Hardcode `text-white`, `bg-black` | Use `text-foreground`, `bg-background` |
| Use `@apply` with glass classes | Use plain CSS scoped by `.dark` / `:root:not(.dark)` |
| Add accent colors freely | Monochrome only, violet reserved for pricing border |
| Use solid background cards | Use `.glass`, `.glass-hover`, `.glass-active` |
| Use sharp corners on panels | `rounded-2xl` for panels, `rounded-full` for buttons |
| Add heavy shadows | Use borders for elevation |
| Add glow, shimmer, or flashy effects | Keep it clean and minimal |
| Use multiple font families | Inter only |
| Use `backdrop-blur` in glass classes | Opacity-based depth only (no blur) |
