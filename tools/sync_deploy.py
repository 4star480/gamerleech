"""
Sync netlify-deploy → GamerLeech root (and Deployment/).
Merges cheat catalog stats into marketplace.json.

Run from GamerLeech folder:
  python tools/sync_deploy.py

Optional: refresh marketplace JSON from an external export path
  python tools/sync_deploy.py --import-catalog path/to/marketplace.json
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "netlify-deploy"
TARGETS = [ROOT, ROOT / "Deployment"]
SKIP_NAMES = {".git", "__pycache__", "node_modules", ".netlify", "marketplace-app.js"}


def copy_tree(src: Path, dest: Path) -> None:
    if not src.is_dir():
        return
    for item in src.iterdir():
        if item.name in SKIP_NAMES:
            continue
        target = dest / item.name
        if item.is_dir():
            if target.exists() and not target.is_dir():
                target.unlink()
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)


def sync_products() -> int:
    """Keep netlify-deploy/data/products.json in sync with data/products.json (source of truth)."""
    source = ROOT / "data" / "products.json"
    deploy = SRC / "data" / "products.json"
    enrich_script = SRC / "enrich_catalog.py"
    if source.is_file():
        deploy.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, deploy)

    if enrich_script.is_file():
        subprocess.run([sys.executable, str(enrich_script)], cwd=SRC, check=False)
        if source.is_file():
            shutil.copy2(deploy, source)
    if not deploy.is_file():
        return 0
    data = json.loads(deploy.read_text(encoding="utf-8"))
    return len(data.get("products", []))


def patch_marketplace_stats(cheats_count: int) -> None:
    path = SRC / "data" / "marketplace.json"
    if not path.is_file():
        print("WARN: data/marketplace.json missing — run export from gametrade first.")
        return
    data = json.loads(path.read_text(encoding="utf-8"))
    data["source"] = "GamerLeech"
    stats = data.setdefault("stats", {})
    stats["cheatsCount"] = cheats_count
    stats.setdefault("marketplaceListings", stats.get("activeListings", len(data.get("listings", []))))
    path.write_text(json.dumps(data) + "\n", encoding="utf-8")

    games_path = SRC / "data" / "games.json"
    games_path.write_text(
        json.dumps({"games": data.get("games", []), "stats": stats}, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Patched marketplace stats: {stats.get('activeListings', 0)} listings, {cheats_count} cheats, {len(data.get('games', []))} games index")


def import_catalog(src_path: Path) -> bool:
    if not src_path.is_file():
        print(f"WARN: catalog not found: {src_path}")
        return False
    dest = SRC / "data" / "marketplace.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_path, dest)
    print(f"Imported catalog -> {dest}")
    return True


def main() -> None:
    args = sys.argv[1:]
    if "--import-catalog" in args:
        i = args.index("--import-catalog")
        if i + 1 < len(args):
            import_catalog(Path(args[i + 1]))

    copy_script = ROOT / "tools" / "copy_game_images.py"
    if copy_script.is_file():
        subprocess.run([sys.executable, str(copy_script)], check=False)

    cheats = sync_products()
    patch_marketplace_stats(cheats)

    for target in TARGETS:
        target.mkdir(parents=True, exist_ok=True)
        copy_tree(SRC, target)
        print(f"Synced netlify-deploy -> {target.name}/")

    print(f"Done. Cheats: {cheats} · Open {SRC / 'index.html'} or deploy netlify-deploy/")


if __name__ == "__main__":
    main()
