# Stage 7 — Build, Test & Deploy

## 7.1 Build verification

Run a full production build before delivery:

```bash
bun run build
```

This must complete with zero errors. Common issues:
- Missing translation keys — check both `en.json` and `hu.json` have identical structure
- Import path issues — all imports should use `@/` prefix (not `~/`)
- Missing `"use client"` — any component using hooks, useState, or browser APIs needs this directive
- Tailwind class issues — do NOT use `@apply` with custom glass classes

## 7.2 Testing checklist

### Functionality
- [ ] All nav links scroll to correct sections
- [ ] Language switcher toggles between HU and EN
- [ ] Theme toggle switches between light and dark mode
- [ ] Contact form submits and shows success message
- [ ] Mobile menu opens/closes correctly
- [ ] All legal page links work from footer
- [ ] Back link on legal pages returns to home
- [ ] All page sections render without errors

### Responsive design
- [ ] Mobile (375px) — single column, readable, no horizontal overflow
- [ ] Tablet (768px) — appropriate grid layouts
- [ ] Desktop (1280px+) — full layout, max-width container
- [ ] Hero headline scales appropriately across breakpoints

### SEO
- [ ] Page title and meta description render correctly
- [ ] Open Graph tags present (check with browser dev tools)
- [ ] `lang` attribute on `<html>` matches locale
- [ ] All images have alt text
- [ ] Heading hierarchy is correct (single h1 per page)

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Buttons and links have descriptive labels
- [ ] `aria-label` on icon-only buttons (theme toggle, mobile menu, socials)
- [ ] Color contrast meets WCAG AA (the default theme handles this)
- [ ] `prefers-reduced-motion` is respected (globals.css handles this)

### Both themes
- [ ] Light mode renders correctly — no white-on-white or invisible elements
- [ ] Dark mode renders correctly — no black-on-black or invisible elements
- [ ] Glass cards visible in both themes
- [ ] Form inputs readable in both themes

### Both languages
- [ ] All text renders correctly in Hungarian
- [ ] All text renders correctly in English
- [ ] No missing translation keys (check browser console)
- [ ] Legal pages render in both languages

## 7.3 Performance targets

- Lighthouse Performance: >90
- Lighthouse Accessibility: >95
- Lighthouse SEO: >95
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1

Next.js with static generation should hit these easily. If not, check:
- Large unoptimized images (use `next/image`)
- Excessive client-side JavaScript
- Font loading (Inter should use `display=swap`)

## 7.4 Deployment

### Vercel (recommended)

```bash
# Install Vercel CLI
bun add -g vercel

# Deploy
vercel
```

Or connect the GitHub repo to Vercel dashboard for auto-deploys.

Environment setup:
- Framework preset: Next.js (auto-detected)
- Build command: `bun run build`
- Output directory: `.next`
- No environment variables needed for static sites

### Custom domain

1. Add domain in Vercel dashboard → Settings → Domains
2. Update DNS records as instructed by Vercel
3. SSL certificate is automatically provisioned
4. Update `metadataBase` in layout.tsx to the final domain

### Post-deploy verification

- [ ] Site loads on production URL
- [ ] HTTPS is working
- [ ] Both locales work (/ for HU, /en for EN)
- [ ] Legal pages accessible
- [ ] Contact form works
- [ ] Mobile responsive on real device
- [ ] Google Search Console — submit sitemap

## 7.5 Handoff to client

Deliverables:
1. Live website URL
2. Source code (GitHub repo, if applicable)
3. Admin access / deployment access
4. Instructions for requesting content updates
5. Note about legal content needing lawyer review
6. Hosting included for 1 year — explain maintenance plan for after

## 7.6 Common post-launch tasks

- Connect a real form backend (email API, Resend, webhook to CRM)
- Add Google Analytics or Plausible (if client requests)
- Set up custom email (if domain+email add-on purchased)
- Add client's real photos to replace placeholders
