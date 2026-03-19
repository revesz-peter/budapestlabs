# Stage 1 — Project Setup

## 1.1 Verify project scaffold

Stage 0 already created the Next.js project and initialized git. Verify you're in the correct directory:

```bash
pwd  # Should be /Users/mac/labs/<project-name>
ls   # Should have package.json, src/, etc.
```

Continue with installing dependencies below.

## 1.2 Install dependencies

```bash
# Core
bun add next-intl next-themes framer-motion lucide-react

# UI primitives
bun add radix-ui class-variance-authority clsx tailwind-merge tw-animate

# Tailwind v4
bun add -d tailwindcss @tailwindcss/postcss
```

## 1.3 PostCSS config

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

## 1.4 TypeScript config

`tsconfig.json` — ensure path alias is set:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 1.5 Folder structure

Create the following directory structure:

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── imprint/page.tsx
│   ├── globals.css
│   └── icon.svg
├── components/
│   ├── landing/
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── services.tsx
│   │   ├── contact.tsx
│   │   ├── footer.tsx
│   │   └── theme-toggle.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── label.tsx
│       └── mesh-gradient.tsx
├── i18n/
│   ├── routing.ts
│   ├── request.ts
│   └── navigation.ts
├── messages/
│   ├── en.json
│   └── hu.json
├── proxy.ts
└── lib/
    └── utils.ts
```

### Multi-page folder structure

> Skip this if the project is a Landing site. Only applies to Multi-page sites.

If this is a multi-page site (determined in Stage 0), extend the base structure:

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx          # Shared layout (navbar, footer)
│   │   ├── page.tsx            # Homepage (shorter — hero + highlights + CTA)
│   │   ├── models/             # or /portfolio, /rooms, /properties, /projects
│   │   │   ├── page.tsx        # Grid/listing page
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Individual profile/detail page
│   │   ├── about/
│   │   │   └── page.tsx        # About page (if separate from homepage)
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact page (if separate from homepage)
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── imprint/page.tsx
├── data/
│   ├── index.ts                # Type definitions + data exports
│   └── items.json              # Structured content (models.json, rooms.json, etc.)
├── components/
│   ├── landing/                # Shared section components (hero, footer, etc.)
│   ├── [content-type]/         # e.g., models/, rooms/ — type-specific components
│   │   ├── grid.tsx            # Listing grid
│   │   ├── card.tsx            # Grid item card
│   │   └── profile.tsx         # Detail page layout
│   └── ui/
```

### Data layer

For multi-page sites with dynamic routes, create a typed data layer as the content source:

```typescript
// src/data/index.ts
export interface PortfolioItem {
  slug: string;
  name: string;
  category: string;
  heroImage: string;
  thumbnailImage: string;
  bio?: { hu: string; en: string };
  portfolio: string[];
}

import itemsData from "./items.json";
export const items: PortfolioItem[] = itemsData;
```

The JSON file holds all content. For sites with 50+ items, consider a headless CMS (Sanity, Contentful) instead of a JSON file.

## 1.6 Next.js config

Create `next.config.ts` (NOT `.js`) in the project root:

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {};

export default withNextIntl(nextConfig);
```

This wraps the Next.js config with next-intl's plugin for locale routing.

## 1.7 Utility helper

Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## 1.8 i18n setup

### `src/i18n/routing.ts`

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["hu", "en"],
  defaultLocale: "hu",
});
```

### `src/i18n/request.ts`

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "hu" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### `src/i18n/navigation.ts`

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### `src/proxy.ts` (Next.js 16 locale detection)

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

## 1.9 ShadCN UI components

Install the base UI components needed:

```bash
bunx shadcn@latest init
bunx shadcn@latest add button input textarea label accordion
```

When prompted for style, choose **New York**. Ensure the components are placed in `src/components/ui/`.

After installation, verify all UI component imports use `@/lib/utils` (not `~/lib/utils`).

## 1.10 Verify setup

```bash
bun run build
```

Should complete without errors. If there are issues, check:
- `postcss.config.mjs` exists and has the correct plugin
- `globals.css` starts with `@import "tailwindcss";`
- Path aliases resolve correctly
