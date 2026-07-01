"""Copy marketplace game/category/guide images into GamerLeech netlify-deploy (one-time asset sync)."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "netlify-deploy" / "images"
# Optional local Synapse/gametrade image source (not linked at runtime)
SOURCES = [
    Path(r"C:\Users\vergio\Projects\gametrade\public\images"),
    ROOT.parent / "gametrade" / "public" / "images",
]


def find_source() -> Path | None:
    for src in SOURCES:
        if (src / "games").is_dir():
            return src
    return None


def copy_tree(src: Path, dest: Path) -> int:
    if not src.is_dir():
        return 0
    dest.mkdir(parents=True, exist_ok=True)
    count = 0
    for item in src.iterdir():
        target = dest / item.name
        if item.is_dir():
            count += copy_tree(item, target)
        else:
            shutil.copy2(item, target)
            count += 1
    return count


def main() -> None:
    src = find_source()
    if not src:
        print("SKIP: no image source found (expected gametrade/public/images)")
        return
    total = 0
    for sub in ("games", "categories", "guides", "hero", "site"):
        sub_src = src / sub
        if sub_src.is_dir():
            n = copy_tree(sub_src, DEST / sub)
            total += n
            print(f"Copied {n} files -> images/{sub}/")
    print(f"Done. {total} image files in {DEST}")


if __name__ == "__main__":
    main()
