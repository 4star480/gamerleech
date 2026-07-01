"""Download JPG game cover art into netlify-deploy/Images/games (Steam / curated URLs)."""
from __future__ import annotations

import json
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GAMES_JSON = ROOT / "netlify-deploy" / "data" / "games.json"
COVER_URLS_TS = Path(r"C:\Users\vergio\Projects\gametrade\prisma\game-cover-urls.ts")
DEST = ROOT / "netlify-deploy" / "Images" / "games"
DEST_REPO = ROOT / "Images" / "games"
MIN_BYTES = 2500
UA = "GamerLeech/1.0 (cover downloader)"
DELAY = 0.12


def parse_ts_record(name: str, text: str) -> dict[str, str | int]:
    m = re.search(rf"export const {name}[^=]*=\s*\{{([^}}]+)\}}", text, re.S)
    if not m:
        return {}
    block = m.group(1)
    out: dict[str, str | int] = {}
    for key, val in re.findall(r'"([^"]+)":\s*("(?:\\.|[^"\\])*"|\d+)', block):
        if val.startswith('"'):
            out[key] = val[1:-1].encode().decode("unicode_escape")
        else:
            out[key] = int(val)
    return out


def steam_header(app_id: int) -> str:
    return f"https://shared.steamstatic.com/store_item_assets/steam/apps/{app_id}/header.jpg"


def fetch(url: str) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=25) as res:
            ct = res.headers.get("content-type", "")
            data = res.read()
            if len(data) < MIN_BYTES:
                return None
            if "image" not in ct and "octet-stream" not in ct:
                return None
            return data
    except Exception:
        return None


def wikipedia_image(title: str) -> str | None:
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.request.quote(title)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode())
        raw = (data.get("originalimage") or {}).get("source") or (data.get("thumbnail") or {}).get("source")
        if raw:
            return re.sub(r"/(\d+)px-", "/800px-", raw)
    except Exception:
        pass
    return None


def candidates(slug: str, steam_ids: dict, external: dict, wiki: dict) -> list[str]:
    urls: list[str] = []
    if slug in external:
        urls.append(str(external[slug]))
    if slug in steam_ids:
        urls.append(steam_header(int(steam_ids[slug])))
    if slug in wiki:
        img = wikipedia_image(str(wiki[slug]))
        if img:
            urls.append(img)
    return urls


def main() -> None:
    if not GAMES_JSON.is_file():
        raise SystemExit(f"Missing {GAMES_JSON}")
    games = json.loads(GAMES_JSON.read_text(encoding="utf-8"))["games"]
    ts_text = COVER_URLS_TS.read_text(encoding="utf-8") if COVER_URLS_TS.is_file() else ""
    steam_ids = {k: v for k, v in parse_ts_record("STEAM_APP_IDS", ts_text).items() if isinstance(v, int)}
    external = {k: str(v) for k, v in parse_ts_record("EXTERNAL_COVER_URLS", ts_text).items()}
    wiki = {k: str(v) for k, v in parse_ts_record("WIKIPEDIA_TITLES", ts_text).items()}

    DEST.mkdir(parents=True, exist_ok=True)
    DEST_REPO.mkdir(parents=True, exist_ok=True)

    saved = 0
    skipped = 0
    for i, game in enumerate(games):
        slug = game["slug"]
        dest = DEST / f"{slug}.jpg"
        if dest.is_file() and dest.stat().st_size >= MIN_BYTES:
            skipped += 1
            continue
        ok = False
        for url in candidates(slug, steam_ids, external, wiki):
            time.sleep(DELAY)
            buf = fetch(url)
            if buf:
                dest.write_bytes(buf)
                (DEST_REPO / f"{slug}.jpg").write_bytes(buf)
                saved += 1
                print(f"OK {slug}")
                ok = True
                break
        if not ok:
            print(f"-- {slug} (no cover)")
        if (i + 1) % 25 == 0:
            print(f"... {i + 1}/{len(games)}")

    print(f"\nDone: {saved} downloaded, {skipped} already had JPG, {len(games) - saved - skipped} still missing")


if __name__ == "__main__":
    main()
