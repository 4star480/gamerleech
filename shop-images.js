/** Resolve product image paths — use files that exist in the deploy bundle */
(function () {
	'use strict';

	const TITLE_MAP = [
		[/eulen/i, 'Images/Eulen Cheats.svg'],
		[/susano/i, 'Images/Susano.svg'],
		[/hx cheat/i, 'Images/HX Cheats.svg'],
		[/tz project/i, 'Images/TZ Project.svg'],
		[/account generator/i, 'Images/Account Generator.svg'],
		[/external pvp/i, 'Images/External PvP.svg'],
		[/redengine spoofer|red engine spoofer/i, 'Images/redENGINE Spoofer.svg'],
		[/redengine executor|red engine executor/i, 'Images/redENGINE Executor.svg'],
		[/macho/i, 'Images/Macho.svg'],
		[/lumia/i, 'Images/Lumia Lua Menu.svg'],
		[/phaze/i, 'Images/Phaze Lua Menu.svg'],
		[/vortex/i, 'Images/Vortex Lua Menu.svg'],
		[/dragon mod/i, 'Images/Dragon Mod Menu.svg'],
		[/op mod/i, 'Images/OP Mod Menu.svg'],
		[/starfire/i, 'Images/Starfire Mod Menu.svg'],
	];

	const LEGACY_CATEGORY_IMAGES = {
		'call-of-duty': 'images/games/call-of-duty.svg',
		'cod-mobile': 'Images/Call of Duty Mobile.png',
		fivem: 'assets/shop/fivem.svg',
		valorant: 'images/games/valorant.svg',
		roblox: 'images/games/roblox.svg',
		fortnite: 'images/games/fortnite.svg',
		'rainbow-six': 'images/games/rainbow-six-siege.svg',
		gta5: 'images/games/gta-v.svg',
		premium: 'assets/shop/premium.svg',
		cs2: 'images/games/cs2.svg',
		apex: 'images/games/apex-legends.svg',
		tiktok: 'assets/shop/tiktok.svg',
		facebook: 'assets/shop/facebook.svg',
		services: 'assets/shop/services.svg',
	};

	function encodeImagePath(path) {
		if (!path || /^https?:/i.test(path) || /^data:/i.test(path)) return path;
		const encoded = path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
		const v = window.GL_CONFIG?.assetVersion;
		return v ? `${encoded}?v=${encodeURIComponent(v)}` : encoded;
	}

	function resolve(product) {
		if (!product) return 'assets/shop/fallback.svg';
		const title = product.title || '';
		for (const [re, imgPath] of TITLE_MAP) {
			if (re.test(title)) return imgPath;
		}
		const cat = product.category || '';
		if (LEGACY_CATEGORY_IMAGES[cat]) return LEGACY_CATEGORY_IMAGES[cat];
		const raw = product.image || '';
		if (raw.startsWith('images/') || raw.startsWith('Images/') || raw.startsWith('assets/')) {
			return raw;
		}
		return 'assets/shop/fallback.svg';
	}

	function resolveUrl(product) {
		return encodeImagePath(resolve(product));
	}

	window.GL_encodeImagePath = encodeImagePath;
	window.GL_resolveProductImage = resolve;
	window.GL_resolveProductImageUrl = resolveUrl;
	window.GL_markLazyImages = function () { /* noop */ };
})();
