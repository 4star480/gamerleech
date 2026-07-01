# GamerLeech site audit fixes (June 2026)

## Cart & shop

- **Shared cart module** (`cart.js` / `GLCart`) — single source of truth for `localStorage` key `gl_cart`, normalized prices/qty, order ID generation, order history.
- **Shop wired to GLCart** — removed ~240 lines of duplicated inline cart logic from `shop.html`.
- **Empty cart UX** — drawer shows empty state; checkout button disabled when count is 0; toast if user tries to checkout empty.
- **Add-to-cart feedback** — toast notification + body scroll lock while drawer open; Escape closes drawer.
- **Safe pricing** — `Number(p.price || 0).toFixed(2)` prevents crashes on missing prices.

## Checkout & order flow

- **Dedicated checkout app** (`checkout-app.js`) — replaced ~600 lines of inline script in `checkout.html`.
- **Empty cart** — checkout shows browse-shop message only (no payment methods when cart is empty).
- **Fresh order IDs** — new ID per checkout session (removed stale `gl_current_order_id` reuse).
- **Success screen** — replaces `alert()` with in-page confirmation + Discord link; cart cleared after submit.
- **EmailJS validation** — checks `serviceId` and both templates before sending.
- **Mobile pay bar** — sticky bottom “I’ve sent payment” on small screens; 16px email input (no iOS zoom).
- **Crypto selectors** — proper `<button>` elements with `aria-pressed`; QR panels toggle correctly.

## Other

- **Contact form** — EmailJS init added in `script.js` (uses `config.js` templates).
- **Styles** — `cart-ui.css` for drawer, toast, checkout empty/success, sticky pay bar.

## Files touched

| File | Change |
|------|--------|
| `netlify-deploy/cart.js` | New shared cart |
| `netlify-deploy/cart-ui.css` | New cart/checkout UI |
| `netlify-deploy/checkout-app.js` | New checkout flow |
| `netlify-deploy/shop.html` | GLCart integration |
| `netlify-deploy/checkout.html` | Module scripts, cleanup |
| `netlify-deploy/script.js` | EmailJS init |

## Test checklist

1. Shop → add product (with pricing tier) → drawer opens, count updates, toast shows.
2. Empty cart → checkout button inactive; direct `/checkout.html` shows empty state.
3. Checkout with items → pick crypto → enter email → accept terms → submit → success screen, cart cleared.
4. Contact form on home → submit (EmailJS or mailto fallback).
