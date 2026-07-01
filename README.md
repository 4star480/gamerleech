# GamerLeech

Premium gaming services storefront — static site deployed via **Netlify** from this repo.

## Live site

https://gamerleech.netlify.app

## Structure

| Path | Purpose |
|------|---------|
| `netlify-deploy/` | **Production site** (HTML, CSS, JS, assets) — Netlify publish directory |
| `docs/` | Audit, design system, changelog |
| `tools/` | Local sync scripts |

## Netlify (GitHub auto-deploy)

1. Connect this repo in [Netlify](https://app.netlify.com/) → **Add new site** → **Import from Git**
2. Settings (should auto-detect from root `netlify.toml`):
   - **Build command:** `echo 'Static site — no build step'`
   - **Publish directory:** `netlify-deploy`
3. Deploy — every push to `main` rebuilds the site.

## Local preview

Open `netlify-deploy/index.html` in a browser, or:

```bash
npx serve netlify-deploy
```

## Support

- Discord: https://discord.gg/EDhZwqxH9
- Email: gamerleech2@gmail.com
