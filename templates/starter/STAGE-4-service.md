# Stage 4 — Service Archetype

> **Archetype:** Service — "I do things for people, they read about it, then contact me."
> **Examples:** Car repair, salon, lawyer, dentist, plumber, trainer, consultant, therapist, vet, cleaning co.
> **Sections:** Hero (mesh gradient) → About → Services → Contact
> **Nav links:** about, services, contact

## 4.1 Section structure

Every section follows this pattern:

```tsx
<section id="section-name" className="px-6 py-24 md:px-8 lg:px-16">
  <div className="mx-auto max-w-6xl">
    {/* Header */}
    <div className="mb-16 text-center">
      <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {t("label")}
      </p>
      <h2 className="text-3xl font-bold md:text-4xl">{t("title")}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
        {t("subtitle")}
      </p>
    </div>

    {/* Content */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* section-specific content */}
    </motion.div>
  </div>
</section>
```

All sections are `"use client"` and use `useTranslations("sectionName")`.

## 4.2 Hero section

> **Optional:** For tech-forward service businesses (agencies, consultancies, IT services), replace the default `MeshGradientBackground` with `FlickeringGrid` or `CosmicWavesShaders` for a more dynamic hero. See CUSTOMIZATION.md "Animated backgrounds" for the full catalog and code snippets.

The hero is the landing page's first impression. It does NOT use `whileInView` — it uses `animate` since it's visible on load.

Structure:
1. Background — `MeshGradientBackground` component (animated gradient orbs)
2. Badge pill — small uppercase label with icon (e.g., Zap icon + "Modern, secure, fast")
3. Headline — massive bold text, the main selling point
4. Subtitle — 1-2 sentences explaining the value proposition
5. CTA buttons — primary "Get Started"/"Kezdjük el" + secondary "Free Consultation"/"Ingyenes konzultáció"
6. Trust signals — 3 small text items with icons (pay after delivery, fast, revision)

```tsx
<section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
  {/* Mesh gradient background */}
  <MeshGradientBackground
    className="pointer-events-none"
    colors={["#2563eb", "#0d9488", "#3b82f6", "#06b6d4"]}
    speed={0.5}
    backgroundColor="transparent"
  />

  <div className="relative mx-auto max-w-5xl text-center">
    {/* Badge → Headline → Subtitle → CTAs → Trust signals */}
  </div>
</section>
```

Hero elements animate in sequence with increasing delays: 0s, 0.1s, 0.25s, 0.4s, 0.6s.

## 4.3 About section

A simple section introducing the business. Use `glass-hover` cards for key differentiators.

Typical layout: 2-3 column grid of value proposition cards.

```tsx
<motion.div className="grid gap-6 md:grid-cols-3">
  {/* Each card */}
  <div className="glass-hover p-8">
    <IconComponent className="mb-4 h-8 w-8 text-foreground/30" />
    <h3 className="mb-2 text-lg font-semibold">{t("card.title")}</h3>
    <p className="text-sm text-muted-foreground">{t("card.description")}</p>
  </div>
</motion.div>
```

## 4.4 Services section

List of services the business offers. Can be a grid of cards or a list.

For card grid (recommended):

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
>
  {serviceKeys.map((key) => (
    <motion.div
      key={key}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className="glass-hover p-8"
    >
      <h3 className="mb-2 text-lg font-semibold">{t(`${key}.title`)}</h3>
      <p className="text-sm text-muted-foreground">{t(`${key}.description`)}</p>
    </motion.div>
  ))}
</motion.div>
```

## 4.5 Contact section

Form with the following fields:
- Name (required)
- Email (required)
- Phone (optional)
- Message (required)

Use `max-w-2xl` for the form container. All inputs use:

```tsx
className="rounded-xl border-border bg-foreground/5 text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus-visible:ring-0"
```

Form wraps in a `.glass` card with `p-8`. Submit button is full-width `rounded-full`.

> **For businesses with physical locations**, add opening hours and address alongside the form — see CUSTOMIZATION.md "Opening hours display" for the code pattern, or use the extended contact layout from STAGE-4-catalog.md section 4.6.

On submit, show a success message in a `.glass` card:

```tsx
const [submitted, setSubmitted] = useState(false);

function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // TODO: integrate with backend (email API, webhook, etc.)
  setSubmitted(true);
}
```

## 4.6 Mesh gradient background

Create `src/components/ui/mesh-gradient.tsx`. This provides animated gradient orbs for the hero background.

Key props:
- `colors` — array of 4 hex colors for the orbs
- `speed` — animation speed multiplier (0.5 = slow, 1 = normal)
- `backgroundColor` — set to `"transparent"` to layer over page background
- `className` — add `"pointer-events-none"` so it doesn't block clicks

```tsx
"use client"

import { cn } from "@/lib/utils"

export interface MeshGradientBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Gradient colors */
  colors?: string[]
  /** Animation speed multiplier */
  speed?: number
  /** Background color */
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
      {/* Gradient orbs */}
      <div className="absolute inset-0">
        {/* Orb 1 - Top left */}
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

        {/* Orb 2 - Top right */}
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

        {/* Orb 3 - Bottom center */}
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

        {/* Orb 4 - Center accent */}
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

      {/* Subtle noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content layer */}
      {children && <div className="relative z-10 h-full w-full">{children}</div>}

      <style jsx>{`
        @keyframes meshMove1 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(5%, 10%) scale(1.05);
          }
          50% {
            transform: translate(10%, 5%) scale(0.95);
          }
          75% {
            transform: translate(5%, -5%) scale(1.02);
          }
        }
        @keyframes meshMove2 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          33% {
            transform: translate(-10%, 8%) scale(1.08);
          }
          66% {
            transform: translate(-5%, -5%) scale(0.95);
          }
        }
        @keyframes meshMove3 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          50% {
            transform: translate(-8%, -10%) scale(1.1);
          }
        }
        @keyframes meshMove4 {
          0%, 100% {
            transform: translate(0%, 0%) scale(1);
          }
          25% {
            transform: translate(15%, -10%) scale(0.9);
          }
          50% {
            transform: translate(-10%, 15%) scale(1.1);
          }
          75% {
            transform: translate(-15%, -5%) scale(0.95);
          }
        }
      `}</style>
    </div>
  )
}
```

## 4.7 Optional additions

These sections are not part of the core Service archetype but can be added between Services and Contact when the business needs them. See CUSTOMIZATION.md for full code and translation patterns:

- **Pricing / Packages** — for businesses with tiered pricing (trainers, consultants, salons)
- **FAQ** — for businesses that get repetitive questions (lawyers, therapists, agencies)
- **Testimonials** — for businesses that rely on social proof (trainers, therapists, consultants). Only use with real testimonials.
- **Gallery** — for businesses that want to show their work or space (auto repair, salon, gym). Use the gallery from STAGE-4-showcase.md section 4.3.

## 4.8 Content rules

All user-facing text must come from translation files (`useTranslations`). Never hardcode text in components.

Write copy for the client's target audience — no tech jargon. Keep it clear, direct, benefit-focused.
