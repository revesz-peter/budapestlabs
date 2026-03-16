# Agent Memory — Lessons Learned

Record issues, solutions, and patterns discovered while building client sites. This file helps avoid repeating mistakes across projects.

---

## Format

Each entry:
```
### [DATE] — Short title
**Problem:** What went wrong
**Solution:** How it was fixed
**Rule:** What to do/avoid going forward
```

---

## Entries

### 2026-03-15 — Hungarian quotation marks break JSON

**Problem:** Using `„text"` (Hungarian-style quotation marks) inside JSON string values caused Turbopack build failures with cryptic parse errors.
**Solution:** Replace with standard single quotes `'text'` or escaped double quotes `\"text\"`.
**Rule:** Never use special quotation characters in JSON files. Stick to `'` or `\"`.

### 2026-03-15 — Stale dev server after theme changes

**Problem:** After implementing dark/light mode, only the scrollbar color changed. The site appeared unchanged despite correct code.
**Solution:** Kill the dev server, delete `.next/` cache, restart with `bun run dev`.
**Rule:** When making changes to `globals.css` theme variables or `layout.tsx` ThemeProvider, always restart the dev server and clear `.next/` cache.

### 2026-03-15 — CSS mask-image cannot be animated

**Problem:** Attempted to animate `mask-image` gradient values in a CSS keyframe (for a breathing dot grid effect). The animation didn't work — it just snapped between states.
**Solution:** CSS cannot interpolate between `mask-image` gradient values. Use `transform: scale()`, `opacity`, or `filter: hue-rotate()` instead — these are animatable properties.
**Rule:** For background animations, only animate transform, opacity, and filter. Don't try to animate gradients, masks, or complex background properties.

### 2026-03-15 — Backdrop-filter invisible on solid backgrounds

**Problem:** `backdrop-blur` on glass cards had zero visible effect on a pure black or near-white background because there's nothing behind the card to blur.
**Solution:** Removed all backdrop-filter from glass cards. They now use only border + semi-transparent background fill.
**Rule:** Only use `backdrop-blur` on elements that overlap real content (like the navbar overlapping the page on scroll). Never on cards sitting on a solid background.

### 2026-03-15 — Mesh gradient invisible on mobile

**Problem:** The MeshGradientBackground orbs were barely visible on iPhone. Hex alpha values (`40`, `35`, `30`, `25`) are very low opacity, and combined with heavy blur (80-120px), the color spreads too thin on small screens. Orbs positioned with negative offsets were partially off-screen.
**Solution:** Increased opacity, reduced blur, repositioned orbs to stay on-screen. But be careful not to go too strong — there's a sweet spot.
**Rule:** Always test gradient backgrounds on a real mobile device. Desktop monitors show subtle colors much more clearly than phone screens.

### 2026-03-15 — Per-plan delivery times need per-plan translation keys

**Problem:** Pricing section used a shared `t("delivery")` key for all plans. When Pro plan needed a different delivery time ("1-2 days" instead of "≤6 hours"), the shared key couldn't support it.
**Solution:** Changed to per-plan keys: `t(\`${plan.key}.delivery\`)` with each plan having its own `"delivery"` field in the JSON.
**Rule:** If a field might differ between items in a list, make it per-item from the start. Don't use shared keys for values that could diverge.

---

## Patterns to reuse

### Archetype system
5 archetypes (Service, Showcase, Catalog, Brand, Accommodation) determine page structure. Client selects type in CLIENT.md → agent follows the matching STAGE-4-{archetype}.md. Shared stages (1-3, 5-7) are identical. Always check CLIENT.md "For the agent" section for theme/font/CTA recommendations per archetype.

### Section header pattern
Every section uses the same header structure: label (small uppercase) → title (h2 bold) → subtitle (muted). Copy from any STAGE-4 file.

### Form input styling
All inputs share the same class string. Copy from contact.tsx. Don't reinvent.

### Scroll-aware navbar
The `requestAnimationFrame` throttling pattern in navbar prevents scroll jank. Always use this, not a raw `onscroll`.

### Translation-driven iteration
For lists of items (services, FAQ, features), define keys in an array and map over them with `t(\`items.${key}.title\`)`. Don't hardcode each item separately.
