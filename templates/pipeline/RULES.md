# Rules & Gotchas

Critical constraints the agent MUST follow. Violating these will cause bugs or build failures.

---

## Tailwind CSS v4

- **Do NOT use `@apply` with custom utility classes that reference each other.** Tailwind v4 doesn't support this. Glass card classes (`.glass`, `.glass-hover`, `.glass-active`) must stay as plain CSS in `globals.css`.
- Use `@import "tailwindcss"` not `@tailwind base/components/utilities` (v3 syntax).
- Theme is defined with `@theme inline {}` block in `globals.css`, NOT in `tailwind.config.js` (which doesn't exist).
- Use `@custom-variant dark (&:is(.dark *));` for dark mode variant, NOT media query.
- Backdrop-filter (`backdrop-blur`) has no visible effect on pure black/white backgrounds. Don't use it on glass cards. Only use it on the navbar (which overlays content).

## Next.js 16 specifics

- **Locale detection uses `proxy.ts`, NOT `middleware.ts`.** Next.js 16 renamed this. The file is `src/proxy.ts`.
- **`params` is a Promise in Next.js 16.** Always `await` it:
  ```tsx
  // CORRECT
  const { locale } = await params;

  // WRONG — will break
  const { locale } = params;
  ```
- **`next.config.ts`** (not `.js`) — must wrap with `createNextIntlPlugin`:
  ```ts
  import createNextIntlPlugin from "next-intl/plugin";
  const withNextIntl = createNextIntlPlugin();
  const nextConfig = {};
  export default withNextIntl(nextConfig);
  ```

## Hydration

- **`suppressHydrationWarning`** must be on the `<html>` tag when using `next-themes`. Without it, theme toggling causes React hydration errors.
- **Theme-dependent components must guard against SSR.** Use the mounted pattern:
  ```tsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-8" />; // placeholder same size
  ```
  This prevents flash of wrong theme content.

## Client vs Server components

- **Server components** (default, no directive): `layout.tsx`, `page.tsx`, legal pages
- **Client components** (need `"use client"`): Any component using:
  - `useState`, `useEffect`, `useRef`
  - `useTranslations()` from next-intl
  - `useTheme()` from next-themes
  - `useRouter()`, `usePathname()` from next-intl navigation
  - `motion` from framer-motion
  - Event handlers (`onClick`, `onSubmit`)
- **Rule of thumb:** All landing section components are client components. Layout and page files are server components.

## next-intl

- **Always import navigation from `@/i18n/navigation`**, not from `next/navigation`. The next-intl versions handle locale prefixing.
- `useTranslations("sectionName")` scopes to a key in the JSON. `useTranslations()` (no arg) accesses root.
- `t("key")` returns a string. `t.raw("key")` returns the raw value (use for arrays).
- **Both `en.json` and `hu.json` must have identical key structures.** Missing keys cause runtime errors.
- Hungarian text uses formal "Ön" (not informal "te").
- **Do NOT use Hungarian-style quotation marks (`„ "`) in JSON files** — they cause parse errors. Use standard `'` or `"` with escaping.

## Colors

- **NEVER hardcode colors.** No `text-white`, `bg-black`, `text-gray-500`, `border-gray-800`.
- **ALWAYS use semantic tokens:** `text-foreground`, `bg-background`, `text-muted-foreground`, `border-border`, `bg-foreground/5`.
- Hardcoded colors break in the opposite theme.
- The only place raw rgba values are allowed is inside `globals.css` for glass cards, gradient borders, and other theme-scoped utility classes.

## Content

- **No tech jargon in client-facing copy.** The audience is everyday business owners.
  - Say "secure hosting" not "Vercel + SSL + CDN"
  - Say "latest technology" not "Next.js + React"
  - Say "loads instantly" not "edge-cached SSG with ISR"
- All user-facing text goes in translation files. Never hardcode text in components.

## Animations

- **Always use `once: true`** on `viewport` prop for `whileInView` animations. Without it, animations replay every time the user scrolls past.
- Use `whileInView` for scroll sections, `animate` for hero (loads on page load).
- Keep animations subtle: `y: 20` slide distance, `0.5s` duration, `easeOut` easing.

## Forms

- Contact form currently uses client-side state only (`setSubmitted(true)`).
- For production, integrate a backend. Options:
  1. **Resend** (email API) — create `app/api/contact/route.ts`, send email on POST
  2. **Server action** — `"use server"` function that sends email
  3. **External webhook** — POST form data to Zapier/Make/n8n
  4. **Formspree/Getform** — third-party form endpoint
- Always validate on the server side, even if you validate on the client.
- Add rate limiting or honeypot field to prevent spam.

## Gradients & animations

- **Mesh gradient invisible on mobile.** Hex alpha values (`40`, `35`) are very low opacity. Combined with heavy blur (80-120px), the color spreads too thin on phone screens. Increase opacity, reduce blur, keep orbs on-screen. Always test gradient backgrounds on a real mobile device.
- **CSS mask-image cannot be animated.** Don't try to animate `mask-image` gradient values in keyframes — they snap, not interpolate. Only animate `transform`, `opacity`, and `filter`.

## Translation structure

- If a field **might differ between items** in a list, make it per-item from the start. Don't use shared keys for values that could diverge (e.g., delivery time per pricing plan).
- For lists of structured items (menus, rooms, features), use `t.raw("key")` to get the array from JSON, then iterate:

```json
{
  "menu": {
    "categories": {
      "starters": {
        "title": "Előételek",
        "items": [
          { "name": "Pogácsa", "description": "Házi készítésű", "price": "1 890 Ft", "tags": [] }
        ]
      }
    }
  }
}
```

```tsx
const items = t.raw(`categories.${catKey}.items`) as Array<{ name: string; description: string; price: string; tags?: string[] }>;
```

## Dynamic routes (multi-page sites)

- **Always use `generateStaticParams`** for dynamic routes. This enables SSG — pages are pre-rendered at build time, not on-demand.
- **Data layer is JSON files** (`src/data/*.json`) for sites with fewer than 50 items. For larger content sets, integrate a headless CMS.
- **`params` is a Promise.** Same as layout — always `await params` before destructuring.
- **Bilingual content in data files** uses `{ hu: "...", en: "..." }` objects. In components, access with `item.bio[locale]`.
- **Images for dynamic content** go in `public/images/[content-type]/` (e.g., `public/images/models/anna-kovacs/`).
- **Don't put item-specific content in translation files.** Names, bios, descriptions for portfolio items live in the data layer. Only UI labels (`"Back to models"`, `"Biography"`, `"Portfolio"`) go in `en.json` / `hu.json`.

## Build

- **Run `bun run build` after every change.** It catches missing translations, type errors, and import issues that `dev` mode might miss.
- If build fails on translations: check both JSON files have the same keys.
- If build fails on imports: ensure all paths use `@/` prefix, not `~/`.
- If build fails on types: check `params` is awaited (Next.js 16 Promise pattern).

## File naming

- Components in `src/components/landing/` use kebab-case: `hero.tsx`, `theme-toggle.tsx`
- UI components in `src/components/ui/` use kebab-case: `mesh-gradient.tsx`
- Pages use Next.js conventions: `page.tsx`, `layout.tsx`
- Translations: `en.json`, `hu.json`
- Import alias: `@/` maps to `src/`
