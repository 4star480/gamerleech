# GamerLeech site audit fixes

## Round 2 (latest)

### Assets & shop
- Fixed **71 product image paths** in `data/products.json` to match files in repo
- Added `shop-images.js` resolver + category/product fallbacks with `onerror` → `fallback.svg`
- Removed **duplicate inline catalog** from `shop.html` (single source: `data/products.json`)
- Fixed broken **favicon** on shop (`assets/logo.svg`)
- Removed dead **category filter** dropdown; search-only in category view
- Fixed **onetime** pricing label on mobile selector
- Empty search results message

### Checkout
- **Order ID** persisted in `sessionStorage` until payment completes (no new ID on refresh)
- **Dynamic QR codes** via `qrcode.min.js` when barcode images missing
- **Cart not cleared** if EmailJS configured but both emails fail; user can retry
- Success screen shows email delivery warnings when applicable
- HTML escaping for order display fields

### Site-wide
- **Unified footer** on shop + checkout (matches homepage)
- **Trust strip** on checkout page
- **Dock active state** works with `?category=` query URLs
- Contact form **single-column on mobile**
- FAQ refund copy aligned with refund policy
- Pricing section clarified as “starting at” tiers
- Cart drawer: `role="dialog"`, focus return on close
- Single **EmailJS init** in `site.js` (removed duplicates)
- Contact mailto fallback no longer shows false “sent” toast

## Round 1 (prior)

- Shared `GLCart` module, checkout-app.js, cart-ui.css
- Empty cart UX, toast notifications, mobile sticky pay bar

## Still manual / content

- Verify **crypto wallet addresses** in `checkout-app.js` are production-ready
- Add real product photos where only category SVGs exist
- Confirm EmailJS templates match variable names in `config.js`

## Test checklist

1. Shop homepage — category images load (or fallback)
2. Category view — search, pricing tiers, add to cart
3. Checkout — refresh keeps same order ID; QR appears when crypto selected
4. Submit with EmailJS down — cart retained, error shown
5. Submit success — cart cleared, success screen with order ID
