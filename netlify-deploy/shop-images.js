/** Resolve product/category images to paths that exist in the repo. */
(function (global) {
	'use strict';

	const FALLBACK = 'assets/shop/fallback.svg';

	const IMAGE_OVERRIDES = {
		'Images/Call of duty.png': 'assets/shop/call-of-duty.svg',
		'Images/eulen clear.jpg': 'Images/Eulen Cheats.svg',
		'Images/hx cheats.jpeg': 'Images/HX Cheats.svg',
		'Images/susano.png': 'Images/Susano.svg',
		'Images/tz projects.jpeg': 'Images/TZ Project.svg',
		'Images/red engine.png': 'Images/redENGINE Spoofer.svg',
		'Images/Macho cheats.jpeg': 'Images/Macho.svg',
		'Images/Lumia menu.jpeg': 'Images/Lumia Lua Menu.svg',
		'Images/Phaze menu.jpeg': 'Images/Phaze Lua Menu.svg',
		'Images/vortex menu.jpeg': 'Images/Vortex Lua Menu.svg',
		'Images/Fivem.png': 'assets/shop/fivem.svg',
		'Images/Valorant.png': 'assets/shop/valorant.svg',
		'Images/Roblox.png': 'assets/shop/roblox.svg',
		'Images/Fortnite.jpg': 'assets/shop/fortnite.svg',
		'Images/rainbow six.png': 'assets/shop/rainbow-six.svg',
		'Images/GTA V.jpg': 'assets/shop/gta5.svg',
		'Images/CSGO.jpg': 'assets/shop/cs2.svg',
		'Images/Apex.png': 'assets/shop/apex.svg',
		'Images/csll of duty mobile.png': 'Images/Call of Duty Mobile.png'
	};

	const ID_OVERRIDES = {
		'fivem-redengine-executor': 'Images/redENGINE Executor.svg',
		'codm-dragon-menu': 'Images/Dragon Mod Menu.svg',
		'codm-starfire-menu': 'Images/Starfire Mod Menu.svg',
		'codm-op-menu': 'Images/OP Mod Menu.svg'
	};

	function productImage(product) {
		if (product?.id && ID_OVERRIDES[product.id]) return ID_OVERRIDES[product.id];
		const raw = product?.image || (product?.category ? `assets/shop/${product.category}.svg` : FALLBACK);
		return IMAGE_OVERRIDES[raw] || raw;
	}

	function categoryImage(category, products) {
		const first = products.find((p) => p.category === category);
		if (first) return productImage(first);
		return `assets/shop/${category}.svg`;
	}

	global.GLShopImages = { productImage, categoryImage, FALLBACK };
})(window);
