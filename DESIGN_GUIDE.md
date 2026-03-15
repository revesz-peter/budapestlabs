# Budapest Labs UI/UX Design Guide

This document defines the UI/UX patterns for Budapest Labs. Use this guide when generating UI code to ensure consistency across the platform.

---

## Design Philosophy

**Monochrome clarity, Scandinavian calm.** The design favors:
- Black and white palette with no accent colors
- Glassmorphism for depth and layering
- Generous whitespace and breathing room
- Clean typography hierarchy
- Subtle, purposeful animations
- Borders and translucency over heavy containers

---

## Foundation

### Component Library
- **shadcn/ui + Radix UI**
- Import pattern: `import { Button } from "@/components/ui/button"`

### Typography
- **Primary font**: Inter — clean, geometric, Scandinavian feel
- **Weight scale**: 400 (body), 500 (medium), 600 (semibold), 700 (bold)
- **Headings**: Inter Bold or Semibold, generous tracking
- No monospace font needed for the marketing site

### Color System

The entire UI is monochrome. Depth comes from opacity, blur, and layering — not color.

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#000000` / `#0a0a0a` | Page background |
| `foreground` | `#fafafa` | Primary text |
| `muted` | `white/60` | Secondary text, descriptions |
| `muted-foreground` | `white/40` | Tertiary text, placeholders |
| `border` | `white/10` | Default borders |
| `border-strong` | `white/20` | Emphasized borders |
| `surface` | `white/5` | Glass panel backgrounds |
| `surface-hover` | `white/10` | Hover states on glass panels |
| `destructive` | `#ef4444` | Delete actions, errors (only color exception) |

### Icons
- **Lucide React** throughout
- Size convention: `h-4 w-4` (inline), `h-5 w-5` (standalone), `h-6 w-6` (feature icons)

### Animations
- **Framer Motion** for all animations
- Preferred effects: fade-in, slide-up, scale-in
- Duration: 0.3s–0.6s
- Easing: `ease-out` or `[0.25, 0.1, 0.25, 1]`
- No bouncing, no spring physics, no flashy effects
- Stagger children by 0.05s–0.1s for list reveals

---

## Glassmorphism System

Glass is the primary visual treatment for elevated surfaces. Use it instead of solid cards.

### Glass Panel (Standard)
```tsx
<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
  {/* Content */}
</div>
```

### Glass Panel (Hover Interactive)
```tsx
<div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:bg-white/10 hover:border-white/20">
  {/* Content */}
</div>
```

### Glass Panel (Highlighted / Active)
```tsx
<div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
  {/* Content */}
</div>
```

### Glass Utility Classes (in globals.css)
```css
.glass {
  @apply rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl;
}

.glass-hover {
  @apply glass transition-colors hover:bg-white/10 hover:border-white/20;
}

.glass-active {
  @apply rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl;
}
```

---

## Layout Structure

### Landing Page Layout
```tsx
<main className="min-h-screen bg-background text-foreground">
  <Navbar />
  <section>{/* Hero */}</section>
  <section>{/* How It Works */}</section>
  <section>{/* Pricing */}</section>
  <section>{/* Add-ons */}</section>
  <section>{/* FAQ */}</section>
  <section>{/* Contact */}</section>
  <Footer />
</main>
```

### Section Container
```tsx
<section className="px-6 py-24 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    {/* Section content */}
  </div>
</section>
```

---

## Content Grouping Patterns

### DO: Use Glass Panels for Feature Cards
```tsx
<div className="glass p-8">
  <Icon className="h-6 w-6 text-white/60 mb-4" />
  <h3 className="text-lg font-semibold mb-2">Title</h3>
  <p className="text-sm text-white/60">Description text.</p>
</div>
```

### DO: Use Border Dividers for Sections
```tsx
<div className="border-t border-white/10" />
```

### DO: Use divide-y for Lists
```tsx
<div className="flex flex-col divide-y divide-white/10">
  {items.map(item => (
    <div key={item.id} className="flex items-center justify-between py-4">
      {/* Item content */}
    </div>
  ))}
</div>
```

### DO: Wrap Tables with Glass Border
```tsx
<div className="rounded-xl border border-white/10 overflow-hidden">
  <Table>
    <TableHeader>...</TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>
```

### DON'T: Use Solid Cards
No solid background cards. Always use glass or transparent containers.

### DON'T: Use Color for Emphasis
No colored backgrounds, badges, or highlights. Use white opacity variations and border weight instead.

---

## Component Patterns

### Buttons

**Primary (CTA):**
```tsx
<Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-3 font-medium">
  Get Started
</Button>
```

**Secondary (Ghost):**
```tsx
<Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 rounded-full">
  Learn More
</Button>
```

**Outline:**
```tsx
<Button variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-full">
  Contact Us
</Button>
```

### Navigation

**Navbar:**
```tsx
<nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
  <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
    <Logo />
    <NavLinks />
    <div className="flex items-center gap-4">
      <LanguageSwitcher />
      <CTAButton />
    </div>
  </div>
</nav>
```

**Nav Link:**
```tsx
<a className="text-sm text-white/60 hover:text-white transition-colors">
  Link Text
</a>
```

### Language Switcher
```tsx
<div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
  <button className={cn(
    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
    isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
  )}>
    HU
  </button>
  <button className={cn(
    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
    isActive ? "bg-white text-black" : "text-white/60 hover:text-white"
  )}>
    EN
  </button>
</div>
```

### Pricing Card
```tsx
<div className={cn(
  "glass p-8 flex flex-col",
  isPopular && "glass-active ring-1 ring-white/20"
)}>
  <h3 className="text-lg font-semibold mb-1">{planName}</h3>
  <p className="text-sm text-white/40 mb-6">{description}</p>
  <p className="text-4xl font-bold mb-8">
    {price} <span className="text-base font-normal text-white/40">HUF</span>
  </p>
  <ul className="space-y-3 mb-8 flex-1">
    {features.map(f => (
      <li key={f} className="flex items-center gap-3 text-sm text-white/60">
        <Check className="h-4 w-4 text-white/40 shrink-0" />
        {f}
      </li>
    ))}
  </ul>
  <Button className="bg-white text-black hover:bg-white/90 rounded-full w-full">
    Choose Plan
  </Button>
</div>
```

### FAQ Accordion
```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="q1" className="border-white/10">
    <AccordionTrigger className="text-left text-white hover:text-white/80">
      Question text?
    </AccordionTrigger>
    <AccordionContent className="text-white/60">
      Answer text.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Form Field
```tsx
<div className="space-y-2">
  <Label htmlFor="name" className="text-sm text-white/60">Name</Label>
  <Input
    id="name"
    placeholder="Enter your name"
    className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30 focus:ring-0 rounded-xl"
  />
</div>
```

### Section Header
```tsx
<div className="text-center mb-16">
  <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-4">
    Section Label
  </p>
  <h2 className="text-3xl md:text-4xl font-bold mb-4">
    Section Title
  </h2>
  <p className="text-lg text-white/60 max-w-2xl mx-auto">
    Section description text goes here.
  </p>
</div>
```

---

## Empty States
```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <Icon className="h-12 w-12 text-white/20 mb-6" />
  <h3 className="text-lg font-semibold mb-2">No items yet</h3>
  <p className="text-sm text-white/40 mb-6">Description text.</p>
  <Button className="bg-white text-black hover:bg-white/90 rounded-full">
    Create Item
  </Button>
</div>
```

---

## Loading States

**Skeleton:**
```tsx
<div className="space-y-4">
  <div className="h-8 w-48 bg-white/5 animate-pulse rounded-xl" />
  <div className="h-4 w-full bg-white/5 animate-pulse rounded-xl" />
  <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded-xl" />
</div>
```

**Button Loading:**
```tsx
<Button disabled={isLoading} className="bg-white text-black rounded-full">
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Save
</Button>
```

---

## Framer Motion Patterns

### Fade In on Scroll
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
  {/* Content */}
</motion.div>
```

### Staggered Children
```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={{
    visible: { transition: { staggerChildren: 0.08 } },
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
    >
      {/* Item */}
    </motion.div>
  ))}
</motion.div>
```

### Hover Scale
```tsx
<motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
  {/* Card content */}
</motion.div>
```

---

## Spacing Reference

| Context | Class |
|---------|-------|
| Page horizontal padding | `px-6 md:px-8 lg:px-16` |
| Section vertical padding | `py-24` |
| Max content width | `max-w-6xl mx-auto` |
| Between major sections | `border-t border-white/10` |
| Within sections | `space-y-6` or `space-y-8` |
| Between form fields | `space-y-4` |
| Component gaps | `gap-4` or `gap-6` |
| Glass card padding | `p-6` or `p-8` |
| Grid gaps | `gap-6` or `gap-8` |

---

## Badge Variants

```tsx
{/* Default */}
<Badge className="bg-white/10 text-white border-white/20 hover:bg-white/15">
  Default
</Badge>

{/* Muted */}
<Badge className="bg-white/5 text-white/60 border-white/10">
  Muted
</Badge>

{/* Popular / Highlighted */}
<Badge className="bg-white text-black border-transparent">
  Popular
</Badge>
```

---

## Responsive Breakpoints

Follow Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Key responsive patterns:
- **Pricing grid**: 1 col → 2 col (md) → 3 col (lg)
- **Feature grid**: 1 col → 2 col (md) → 3 col (lg)
- **Section headings**: scale from `text-2xl` to `text-4xl` at `md`
- **Navbar**: hamburger menu on mobile, inline links on `md`+

---

## What NOT to Do

| Don't | Do Instead |
|-------|------------|
| Use any accent color (orange, blue, etc.) | Use white opacity variations for emphasis |
| Use solid background cards | Use glass panels (`bg-white/5 backdrop-blur-xl`) |
| Use sharp corners on panels | Use `rounded-2xl` for panels, `rounded-full` for buttons |
| Use heavy drop shadows | Use `border border-white/10` for elevation |
| Add bouncy or springy animations | Use subtle `ease-out` transitions |
| Use bright colored badges | Use monochrome badges with opacity |
| Over-decorate with gradients | At most one subtle radial gradient per section |
| Use multiple font families | Stick to Inter only |
