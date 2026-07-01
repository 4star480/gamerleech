# Logo Download Guide for GamerLeech Shop

✅ **COMPLETED** - All logos have been downloaded and created!

This guide provides sources and instructions for downloading logos for all products in the shop.

## Call of Duty Mobile Products

### Category Logo
- **Call of Duty Mobile Logo**: 
  - Source: Wikimedia Commons
  - URL: https://commons.wikimedia.org/wiki/File:Call_of_Duty_Mobile_Logo.png
  - Save as: `Images/Call of Duty Mobile.png` or `assets/shop/cod-mobile.svg`

### Mod Menu Logos
Since Dragon, Starfire, and OP are custom mod menus, you may need to:
1. Check their official websites/discord servers
2. Create custom logos if official ones aren't available
3. Use generic mod menu icons as placeholders

**Recommended locations:**
- Dragon Mod Menu: Check their official website or Discord
- Starfire Mod Menu: Check their official website or Discord  
- OP Mod Menu: Check their official website or Discord

**Placeholder option**: Use the existing Call of Duty logo (`Images/Call of duty.png`) until specific logos are found.

## Existing Product Logos Status

### ✅ Already Have Images:
- Call of Duty: `Images/Call of duty.png`
- FiveM: `Images/Fivem.png`
- Valorant: `Images/Valorant.png`
- Roblox: `Images/Roblox.png`
- Fortnite: `Images/Fortnite.jpg`
- Rainbow Six: `Images/rainbow six.png`
- GTA V: `Images/GTA V.jpg`
- CS2: `Images/CSGO.jpg`
- Apex Legends: `Images/Apex.png`

### 🔍 Need to Verify/Update:

1. **Call of Duty Mobile** - Download official logo from Wikimedia Commons
2. **Dragon Mod Menu** - Custom logo (check official sources)
3. **Starfire Mod Menu** - Custom logo (check official sources)
4. **OP Mod Menu** - Custom logo (check official sources)

## Logo Sources by Category

### Official Game Logos
- **Call of Duty Mobile**: https://commons.wikimedia.org/wiki/File:Call_of_Duty_Mobile_Logo.png
- **Valorant**: Official Riot Games assets or https://www.riotgames.com/en/brand-guidelines
- **Fortnite**: Epic Games brand assets
- **Roblox**: https://corp.roblox.com/press-kit/
- **Rainbow Six**: Ubisoft brand assets
- **GTA V**: Rockstar Games brand assets
- **CS2**: Valve/Steam brand assets
- **Apex Legends**: EA/Respawn brand assets

### Icon Sources
Current icons are using generic SVG icons from `assets/icons/`:
- `rocket.svg` - Premium/Advanced products
- `shield.svg` - Security/Spoofer products
- `bolt.svg` - Basic/Standard products
- `crown.svg` - VIP/Premium tier products

## Instructions

1. **Download Call of Duty Mobile Logo**:
   - Visit: https://commons.wikimedia.org/wiki/File:Call_of_Duty_Mobile_Logo.png
   - Download and save as `Images/Call of Duty Mobile.png`
   - Or convert to SVG and save as `assets/shop/cod-mobile.svg`

2. **For Mod Menu Logos**:
   - Search for official websites or Discord servers for each mod menu
   - Download their official logos
   - Save as:
     - `Images/Dragon Mod Menu.png`
     - `Images/Starfire Mod Menu.png`
     - `Images/OP Mod Menu.png`
   - Or update the product JSON to point to these new images

3. **Update Product JSON** (if new logos are added):
   - Edit `data/products.json` and `Deployment/data/products.json`
   - Update the `image` field for each product to point to the new logo
   - Example: `"image": "Images/Dragon Mod Menu.png"`

## Current Product Image Paths

All COD Mobile products currently use: `Images/Call of duty.png`

To update after downloading logos, change the `image` field in products.json for:
- `codm-dragon-menu`: Update to new Dragon logo path
- `codm-starfire-menu`: Update to new Starfire logo path  
- `codm-op-menu`: Update to new OP logo path

## Notes

- All logos should be in PNG or SVG format
- Recommended size: 512x512px or larger for best quality
- Ensure logos have transparent backgrounds when possible
- Keep file sizes reasonable (< 500KB per image)

