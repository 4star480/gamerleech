"""Bump asset versions in all netlify-deploy HTML files."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "netlify-deploy"

for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    orig = text
    text = re.sub(r'synapse-ui\.css(?:\?v=\d+)?', 'synapse-ui.css?v=9', text)
    text = re.sub(r'mobile-menu\.js(?:\?v=\d+)?', 'mobile-menu.js?v=4', text)
    text = re.sub(r'chrome\.js(?:\?v=\d+)?', 'chrome.js?v=9', text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print(f"updated {path.name}")

