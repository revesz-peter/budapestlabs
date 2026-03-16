# Theme Collection

CSS variable themes for client sites. Each file contains `:root` (light) and `.dark` (dark) blocks that replace the corresponding blocks in `globals.css`.

## Available themes

| Theme | Style | Best for |
|---|---|---|
| `monochrome.css` | Black & white, Scandinavian minimalism | Brands that lead with clarity and confidence |
| `amber-minimal.css` | Warm amber, sepia undertones | Anything that should feel warm, inviting, and human |
| `amethyst-haze.css` | Mystical purple haze, ethereal violets | Brands with atmosphere, creativity, and a sense of wonder |
| `art-deco.css` | 1920s-inspired gold and cream luxury | Anything that should feel premium, timeless, and worth the price |
| `blue.css` | Professional blue, trust-building | Businesses where credibility and trust come first |
| `bold-tech.css` | High-contrast neon, electric blues | Brands that want to feel cutting-edge and forward-thinking |
| `bubblegum.css` | Vibrant candy pink and purple pastels | Playful, bold, unapologetically fun brands |
| `caffeine.css` | Coffee-inspired warm espresso browns | Anything that should feel cozy, grounded, and comfortable |
| `candyland.css` | Bright rainbow candy colors | Brands built on energy, joy, and making people smile |
| `catppuccin.css` | Community-beloved warm pastels | Projects that want personality without shouting |
| `claude.css` | Warm terracotta orange, approachable | Brands that want to feel thoughtful, friendly, and human |
| `claymorphism.css` | Soft 3D clay-like, pillowy shadows | Brands that want to feel tactile, approachable, and touchable |
| `clean-slate.css` | Distraction-free grayscale | When the content is the product and everything else should disappear |
| `corporate.css` | Conservative navy, enterprise neutrals | When looking reliable matters more than looking innovative |
| `cosmic-night.css` | Deep space purples, stellar accents | Brands that want to inspire wonder and feel vast |
| `cyberpunk.css` | Neon magenta + toxic cyan, void-black | Gaming, esports, nightlife, crypto/web3, cutting-edge tech |
| `dark-matter.css` | Ultra-dark OLED-black, minimal accents | Media players, code editors, photography platforms, reading apps |
| `doom-64.css` | Gothic blood reds, toxic greens, zero radius | Gaming sites, retro communities, horror content, heavy metal |
| `elegant-luxury.css` | Velvet charcoal with warm gold accents | Luxury e-commerce, fashion, private banking, five-star hospitality |
| `studio-ghibli.css` | Hand-painted forest greens, warm earth tones | Children's education, storytelling, nature projects, indie games |

## How to use

When generating a client site, copy the chosen theme's `:root` and `.dark` blocks into the project's `globals.css`, replacing the existing variable blocks. The `@theme inline`, `@layer base`, glass classes, and everything else stays untouched.

## Adding new themes

1. Find a theme on [shadcn themes](https://www.shadcn.io/themes) or create your own
2. To grab from shadcn: fetch the JSON URL directly (don't run `bunx shadcn add` — it overwrites files), extract `cssVars.light` → `:root` and `cssVars.dark` → `.dark`
3. Save as a new `.css` file with the comment header describing style and best-for
4. Update this table
