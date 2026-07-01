# GamerLeech — Forensic Audit (Phase 1)

**Live:** https://gamerleech.netlify.app · **Source:** `netlify-deploy/`

## Critical (fixed in v2)

| Issue | Location | Impact |
|-------|----------|--------|
| SPA redirect `/* → /index.html` | `_redirects`, `netlify.toml` | Could serve homepage for `/shop.html`, `/data/products.json` |
| Broken `script.js` syntax | `script.js` ~L133 — unclosed `forEach` | Entire site JS failed silently on some pages |
| EmailJS split config | `index.html` placeholder vs `checkout.html` hardcoded | Contact form never used working EmailJS |
| Checkout mobile nav missing | `checkout.html` used `.header-nav` only | No hamburger menu on mobile checkout |
| Brand link `href="#"` | `index.html` L29 | Broken home navigation |

## High

| Issue | Location | Impact |
|-------|----------|--------|
| No mobile bottom navigation | All pages | Thumb-unfriendly; cart buried in header on shop |
| Contact uses `mailto:` first | `script.js` | Poor mobile UX (opens mail app) |
| Terms/Refund links `#` | `checkout.html` | Legal dead ends at checkout |
| Testimonials unverifiable | `index.html` | Trust gap vs competitors (Hooked, Zhex) |
| Font load 4 weights | Google Fonts Urbanist | Render-blocking, CLS risk |
| Hero art hidden on mobile | CSS grid collapse | Wasted above-fold on phones |

## Medium

| Issue | Location |
|-------|----------|
| Duplicate product catalog | `shop.html` inline JSON + `data/products.json` |
| Inconsistent favicon | `index` logo.svg vs `shop` favicon.svg |
| No `theme-color` / safe-area | `<head>` all pages |
| Cart drawer no focus trap | `shop.html` a11y |
| Pricing tabs cramped on tablet | 920px breakpoint only |

## Low

| Issue | Location |
|-------|----------|
| OG image missing | meta tags |
| No custom domain | `gamerleech.com` timeout |
| OSINT tools in repo folder | `OSINT_Investigation_Tools/` — unrelated to store |

## Mobile test matrix (pre-fix)

| Width | Issues observed |
|-------|-----------------|
| 320px | Header crowded (brand + cart + menu); no dock |
| 375px | Product cards OK; checkout sticky card overlapped scroll |
| 768px | 3-col grids collapse late |

## v2 fixes applied

- Removed SPA catch-all redirect
- `config.js` single EmailJS source
- `site.js` + `components.css` mobile dock, trust strip, page enter
- Fixed `script.js`, scroll reveal, EmailJS contact path
- Checkout unified header + mobile padding + 16px inputs
- Hero stats + footer grid
