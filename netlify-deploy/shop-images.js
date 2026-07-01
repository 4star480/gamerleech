/** Resolve product image paths — prefer legacy GamerLeech raster art in Images/ */
(function () {
	'use strict';

	const TITLE_MAP = [
		[/eulen/i, 'Images/eulen clear.jpg'],
		[/susano/i, 'Images/susano.png'],
		[/hx cheat/i, 'Images/hx cheats.jpeg'],
		[/tz project/i, 'Images/tz projects.jpeg'],
		[/account generator/i, 'Images/Account Generator.svg'],
		[/external pvp/i, 'Images/External PvP.svg'],
		[/redengine spoofer|red engine spoofer/i, 'Images/redENGINE Spoofer.svg'],
		[/redengine executor|red engine executor/i, 'Images/redENGINE Executor.svg'],
		[/macho/i, 'Images/Macho cheats.jpeg'],
		[/lumia/i, 'Images/Lumia menu.jpeg'],
		[/phaze/i, 'Images/Phaze menu.jpeg'],
		[/vortex/i, 'Images/Vortex Lua Menu.svg'],
		[/dragon mod/i, 'Images/Dragon Mod Menu.svg'],
		[/op mod/i, 'Images/OP Mod Menu.svg'],
		[/starfire/i, 'Images/Starfire Mod Menu.svg'],
	];

	const LEGACY_CATEGORY_IMAGES = {
		'call-of-duty': 'Images/Call of duty.png',
		'cod-mobile': 'Images/Call of Duty Mobile.png',
		fivem: 'Images/Fivem.png',
		valorant: 'Images/Valorant.png',
		roblox: 'Images/Roblox.png',
		fortnite: 'Images/Fortnite.jpg',
		'rainbow-six': 'Images/rainbow six.png',
		gta5: 'Images/GTA V.jpg',
		premium: 'assets/shop/premium.svg',
		cs2: 'Images/CSGO.jpg',
		apex: 'Images/Apex.png',
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
		const raw = product.image || '';
		if (raw.startsWith('Images/') && /\.(svg|png|jpe?g)$/i.test(raw)) return raw;
		if (LEGACY_CATEGORY_IMAGES[product.category]) return LEGACY_CATEGORY_IMAGES[product.category];
		if (raw.startsWith('assets/')) return raw;
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
