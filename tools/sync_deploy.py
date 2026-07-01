"""Sync netlify-deploy to GamerLeech root and Deployment folder."""
import shutil
from pathlib import Path

ROOT = Path(r"C:\Users\vergio\Documents\projects\GamerLeech")
SRC = ROOT / "netlify-deploy"
TARGETS = [ROOT, ROOT / "Deployment"]

FILES = [
    "index.html", "shop.html", "checkout.html",
    "styles.css", "components.css", "script.js", "site.js", "config.js",
    "_redirects", "netlify.toml",
]

for target in TARGETS:
    for name in FILES:
        s = SRC / name
        if s.is_file():
            shutil.copy2(s, target / name)
            print(f"OK {target.name}/{name}")

print("Sync complete.")
