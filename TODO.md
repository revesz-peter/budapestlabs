# TODO

## High Priority

- [ ] **Contact form backend** — Currently non-functional (`src/components/landing/contact.tsx` line 18). Integrate with Supabase or an API route + Resend for email notifications
- [ ] **Messaging contradictions** — Hero says "6 hours" + "Only pay after delivery", but FAQ q8 mentions 15% deposit and Business/Custom plans take 1–5 days. Clarify in hero trust signals
- [ ] **Footer social links** — GitHub, LinkedIn, Instagram all `href="#"`. Add real links or remove icons (`src/components/landing/footer.tsx`)
- [ ] **Missing imprint data** — Tax number and registration number are placeholders in all 3 languages
- [ ] **Phone placeholder in EN** — Shows `+36 ...` (Hungarian format) instead of something international

## Medium Priority

- [ ] **og:image / twitter:image** — No preview image for social shares. Create 1200x630 branded image, add to layout metadata
- [ ] **JSON-LD structured data** — Add Organization, LocalBusiness, Service schemas for Google rich snippets
- [ ] **Comparison CellIcon refactor** — String-matching translations across 3 languages is fragile. Use explicit icon mapping or data attributes
- [ ] **Google Fonts → next/font** — Current `<link>` in `<head>` blocks first paint. Switch to `next/font` for self-hosting (also better for GDPR)
- [ ] **Mesh gradient prefers-reduced-motion** — MeshGradientBackground doesn't respect the media query. Pause animation for motion-sensitive users
- [ ] **Form error state UX** — HTML5 validates but no styled error messages. Add visible validation feedback

## Low Priority

- [ ] **Dark mode contrast check** — Verify `text-muted-foreground` on dark background meets WCAG AA
- [ ] **Legal pages locale-aware back link** — "Back to home" uses hardcoded `/` instead of locale-aware routing
- [ ] **Comparison table mobile scroll indicator** — `min-w-[600px]` forces horizontal scroll with no visual hint
- [ ] **Self-host fonts for GDPR** — Google Fonts sends user IP to Google servers
