# GamerLeech v2 Changelog

## 2026-06-29 — Mobile-first remodel

### New files
- `config.js` — shared EmailJS + brand config
- `site.js` — nav, mobile dock, page enter, EmailJS init
- `components.css` — trust strip, dock, hero stats, footer grid
- `docs/GAMERLEECH_*.md` — audit, benchmark, design system

### Fixed
- `_redirects` — removed SPA catch-all
- `netlify.toml` — removed `/* → index.html` redirect
- `script.js` — syntax error; EmailJS via `GL_CONFIG`
- `index.html` — brand link, trust strip, hero stats, footer, dock
- `shop.html` — dock cart sync, header layout, trust strip
- `checkout.html` — mobile nav, `GL_CONFIG`, checkout mobile CSS

### Design
- Darker background, brighter accent `#2ef47a`
- Safe-area + `theme-color` meta
- Scroll reveal on cards/pricing
- 3-column footer with store/support links

### Deploy
Drag `netlify-deploy/` to Netlify or run:
```powershell
cd C:\Users\vergio\Documents\projects\GamerLeech\netlify-deploy
netlify deploy --prod
```

### Still TODO (user approval)
- Terms + Refund Policy pages (checkout links)
- Custom domain `gamerleech.com`
- OG image + Twitter card
- Discord/Telegram link in header
- Consolidate shop inline JSON → `data/products.json` only
