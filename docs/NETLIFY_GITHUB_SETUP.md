# Netlify ↔ GitHub auto-deploy

## 1. Push repo to GitHub (one-time)

Local git is initialized at `GamerLeech/` with commit on **`main`**.

```powershell
cd "C:\Users\vergio\Documents\projects\GamerLeech"
gh auth login --web
gh repo create gamerleech --public --source=. --remote=origin --push
```

If repo name is taken, use another name and update Netlify later:
```powershell
gh repo create gamerleech-site --public --source=. --remote=origin --push
```

Or re-run:
```powershell
python tools\push_github.py
```

## 2. Connect Netlify to GitHub

1. Open https://app.netlify.com/
2. **Add new site** → **Import an existing project** → **GitHub**
3. Authorize Netlify on GitHub if prompted
4. Select repo: **`gamerleech`** (or your repo name)
5. Build settings (auto-filled from root `netlify.toml`):

   | Setting | Value |
   |---------|--------|
   | Branch | `main` |
   | Build command | `echo 'Static site — no build step'` |
   | Publish directory | **`netlify-deploy`** |

6. **Deploy site**

## 3. Custom domain (optional)

Netlify → **Domain management** → add `gamerleech.com` → follow DNS instructions.

## 4. After every code change

```powershell
cd "C:\Users\vergio\Documents\projects\GamerLeech"
git add netlify-deploy docs
git commit -m "Your change description"
git push origin main
```

Netlify rebuilds automatically (~30–60 seconds).

## Repo layout

```
GamerLeech/
├── netlify.toml          ← tells Netlify publish = netlify-deploy
├── netlify-deploy/       ← LIVE SITE FILES (edit these)
├── docs/
├── tools/
└── README.md
```

**Edit files in `netlify-deploy/`** — not the old root `index.html` unless you sync with `tools/sync_deploy.py`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Site shows old version | Netlify → Deploys → check latest commit hash |
| 404 on `/shop.html` | Ensure `_redirects` in `netlify-deploy/` has no `/* → index.html` |
| Build fails | Build command should be harmless echo; no npm install needed |
| Wrong folder deployed | Publish directory must be `netlify-deploy` |
