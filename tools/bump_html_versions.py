"""Bump asset versions in all netlify-deploy HTML files."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1] / "netlify-deploy"

for path in ROOT.glob("*.html"):
    text = path.read_text(encoding="utf-8")
    orig = text
    text = re.sub(r'synapse-ui\.css(?:\?v=\d+)?', 'synapse-ui.css?v=11', text)
    text = re.sub(r'mobile-menu\.js(?:\?v=\d+)?', 'mobile-menu.js?v=5', text)
    text = re.sub(r'chrome\.js(?:\?v=\d+)?', 'chrome.js?v=11', text)
    text = re.sub(r'shop-images\.js(?:\?v=\d+)?', 'shop-images.js?v=11', text)
    text = re.sub(r'shop-app\.js(?:\?v=\d+)?', 'shop-app.js?v=11', text)
    text = re.sub(r'checkout-app\.js(?:\?v=\d+)?', 'checkout-app.js?v=11', text)
    text = re.sub(r'product-app\.js(?:\?v=\d+)?', 'product-app.js?v=11', text)
    if text != orig:
        path.write_text(text, encoding="utf-8")
        print(f"updated {path.name}")

