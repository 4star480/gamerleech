# GamerLeech Design System v2

## Tokens (`styles.css` :root)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#060a06` | Page background |
| `--bg-alt` | `#0b110b` | Alternate sections |
| `--panel` | `#0e150e` | Cards, inputs |
| `--text` | `#eef8ee` | Body text |
| `--muted` | `#9bc49b` | Secondary text |
| `--green` | `#2ef47a` | Primary accent, CTA |
| `--green-600` | `#1fd866` | Button gradient end |
| `--border` | `#1a2a1a` | Default borders |
| `--radius-sm/md/lg` | 10 / 14 / 18px | Corners |
| `--header-h` | 64px | Sticky header |
| `--dock-h` | 62px | Mobile bottom nav |

## Typography

- **Font:** Urbanist (Google Fonts)
- **H1:** `clamp(36px, 6vw, 64px)` weight 800
- **Section title:** 32px weight 800
- **Body:** 16px / 1.6
- **Mobile inputs:** min 16px (prevent iOS zoom)

## Components

| Component | File | Notes |
|-----------|------|-------|
| Buttons | `styles.css` `.btn-*` | Min 44px height on mobile |
| Trust strip | `components.css` | Below header on home/shop |
| Mobile dock | `components.css` | 3 or 4 col; shop has Cart |
| Product card | `styles.css` `.product-frame` | Mobile single column |
| Cart drawer | `styles.css` | Full width ≤720px |
| Reveal | `components.css` `.reveal` | IntersectionObserver in script.js |

## Motion

- Page enter: `gl-page-enter` 450ms
- Cards: scroll reveal 550ms
- Nav drawer: `slide-down` 300ms
- **Reduced motion:** all animations disabled via `.reduce-motion`

## Files

- `styles.css` — base layout, shop, cart
- `components.css` — v2 additions
- `config.js` — brand + EmailJS
- `site.js` — nav, dock, page enter
- `script.js` — FAQ, contact, reveal
