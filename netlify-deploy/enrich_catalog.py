"""Enrich GamerLeech catalog with catalog type + cheat metadata (no fake Synapse SKUs)."""
import json
import re
from pathlib import Path

path = Path(__file__).parent / "data" / "products.json"
data = json.loads(path.read_text(encoding="utf-8"))

TITLE_MAP = [
    (re.compile(r"eulen", re.I), "Images/Eulen Cheats.svg"),
    (re.compile(r"susano", re.I), "Images/Susano.svg"),
    (re.compile(r"hx cheat", re.I), "Images/HX Cheats.svg"),
    (re.compile(r"tz project", re.I), "Images/TZ Project.svg"),
    (re.compile(r"account generator", re.I), "Images/Account Generator.svg"),
    (re.compile(r"external pvp", re.I), "Images/External PvP.svg"),
    (re.compile(r"redengine spoofer|red engine spoofer", re.I), "Images/redENGINE Spoofer.svg"),
    (re.compile(r"redengine executor|red engine executor", re.I), "Images/redENGINE Executor.svg"),
    (re.compile(r"macho", re.I), "Images/Macho.svg"),
    (re.compile(r"lumia", re.I), "Images/Lumia Lua Menu.svg"),
    (re.compile(r"phaze", re.I), "Images/Phaze Lua Menu.svg"),
    (re.compile(r"vortex", re.I), "Images/Vortex Lua Menu.svg"),
    (re.compile(r"dragon mod", re.I), "Images/Dragon Mod Menu.svg"),
    (re.compile(r"op mod", re.I), "Images/OP Mod Menu.svg"),
    (re.compile(r"starfire", re.I), "Images/Starfire Mod Menu.svg"),
]

LEGACY_CATEGORY_IMAGES = {
    "call-of-duty": "Images/games/call-of-duty.svg",
    "cod-mobile": "Images/Call of Duty Mobile.png",
    "fivem": "assets/shop/fivem.svg",
    "valorant": "Images/games/valorant.svg",
    "roblox": "Images/games/roblox.svg",
    "fortnite": "Images/games/fortnite.svg",
    "rainbow-six": "Images/games/rainbow-six-siege.svg",
    "gta5": "Images/games/gta-v.svg",
    "premium": "assets/shop/premium.svg",
    "cs2": "Images/games/cs2.svg",
    "apex": "Images/games/apex-legends.svg",
    "tiktok": "assets/shop/tiktok.svg",
    "facebook": "assets/shop/facebook.svg",
    "services": "assets/shop/services.svg",
}

DEPLOY_ROOT = Path(__file__).parent


def asset_exists(rel: str) -> bool:
    return (DEPLOY_ROOT / rel).exists()


def resolve_product_image(p: dict) -> str:
    title = p.get("title", "")
    for pattern, img_path in TITLE_MAP:
        if pattern.search(title):
            return img_path if asset_exists(img_path) else "assets/shop/fallback.svg"
    cat = p.get("category", "")
    if cat in LEGACY_CATEGORY_IMAGES:
        path = LEGACY_CATEGORY_IMAGES[cat]
        return path if asset_exists(path) else "assets/shop/fallback.svg"
    raw = p.get("image", "")
    if raw and asset_exists(raw):
        return raw
    if raw.startswith("assets/"):
        return raw
    return "assets/shop/fallback.svg"

CATEGORY_FALLBACK = LEGACY_CATEGORY_IMAGES

CHEAT_CATS = {
    "call-of-duty", "cod-mobile", "fivem", "valorant", "roblox",
    "fortnite", "rainbow-six", "gta5", "premium", "cs2", "apex",
}
SOCIAL_CATS = {"tiktok", "facebook"}
SERVICE_CATS = {"services"}

FEATURED_IDS = {
    "bo6-wz4-internal", "val-vip", "fivem-eulen-cheats", "fn-vip",
    "fivem-susano", "cs2-cheat-premium",
}

DEFAULT_CHEAT_FEATURES = [
    "Instant key delivery",
    "Regular updates",
    "Email support",
]


def infer_tier(p):
    text = f"{p.get('title', '')} {p.get('desc', '')}".upper()
    if "PRIVATE" in text:
        return "private"
    if "INTERNAL" in text:
        return "internal"
    if "EXTERNAL" in text:
        return "external"
    if any(k in text for k in ("SPOOFER", "UNLOCK", "GENERATOR", "EXECUTOR")):
        return "serials"
    if p.get("category") in ("roblox",):
        return "serials"
    return "external"


def infer_features(p):
    desc = p.get("desc", "")
    title = p.get("title", "")
    feats = []
    text = f"{title} {desc}".upper()
    mapping = [
        ("AIMBOT", "Aimbot"),
        ("ESP", "ESP / wallhack"),
        ("WALLHACK", "Wallhack"),
        ("SPOOFER", "HWID spoofer"),
        ("UNLOCK", "Unlock all"),
        ("SKINCHANGER", "Skin changer"),
        ("SKIN CHANGER", "Skin changer"),
        ("EXECUTOR", "Script executor"),
        ("LUA", "Lua menu"),
        ("UNDETECTED", "Undetected build"),
        ("STREAM", "Stream proof"),
        ("MONEY", "Money tools"),
    ]
    for key, label in mapping:
        if key in text and label not in feats:
            feats.append(label)
    if not feats:
        feats = list(DEFAULT_CHEAT_FEATURES)
    elif "Instant key delivery" not in feats:
        feats.append("Instant key delivery")
    return feats[:8]


for p in data["products"]:
    p["image"] = resolve_product_image(p)
    cat = p.get("category", "")
    if cat in CHEAT_CATS:
        p["catalog"] = "cheats"
        p.setdefault("status", "undetected")
        p.setdefault("tier", infer_tier(p))
        if not p.get("features"):
            p["features"] = infer_features(p)
        p["featured"] = p.get("id") in FEATURED_IDS
    elif cat in SOCIAL_CATS:
        p["catalog"] = "social"
        p.setdefault("status", "available")
        p.setdefault("tier", "service")
        if not p.get("features"):
            p["features"] = ["Real engagement", "Fast delivery", "Email support"]
    elif cat in SERVICE_CATS:
        p["catalog"] = "services"
        p.setdefault("status", "available")
        p.setdefault("tier", "service")
        if not p.get("features"):
            p["features"] = ["One-time service", "Expert setup", "Email support"]
    else:
        p["catalog"] = "cheats"

# Keep only original 14 categories
data["categories"] = [
    c for c in data["categories"]
    if c in CHEAT_CATS | SOCIAL_CATS | SERVICE_CATS
]

path.write_text(json.dumps(data, indent="\t", ensure_ascii=False) + "\n", encoding="utf-8")
cheats = sum(1 for p in data["products"] if p.get("catalog") == "cheats")
social = sum(1 for p in data["products"] if p.get("catalog") == "social")
services = sum(1 for p in data["products"] if p.get("catalog") == "services")
print(f"Enriched {len(data['products'])} products: {cheats} cheats, {social} social, {services} services")
