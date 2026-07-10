# TODO

## High priority

- [ ] **Regenerate legal PDFs after copy changes** — run `bun run generate:legal-pdfs` whenever `legal.*` messages change
- [ ] **Resend production setup** — verify `RESEND_API_KEY` and `hello@budapestlabs.com` sender domain on Vercel
- [ ] **Comparison CellIcon refactor** — replace fragile string-matching across 3 languages with explicit icon mapping

## Medium priority

- [ ] **Wire favicon** — add `app/icon.tsx` or use `public/icon.png`
- [ ] **Form error state UX** — styled validation messages beyond HTML5 defaults
- [ ] **Dark mode contrast audit** — verify `text-muted-foreground` meets WCAG AA

## Low priority

- [ ] **Remove unused message keys** — section eyebrows (`pricing.label`, `faq.label`, etc.) and plan `description` fields if still unused
- [ ] **Comparison table mobile hint** — scroll indicator for `min-w-[600px]` table
