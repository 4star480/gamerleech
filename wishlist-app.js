/** Wishlist page */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	const wl = window.GL_WISHLIST;
	if (!chrome || !wl) return;

	async function init() {
		const el = document.getElementById('wishlist-results');
		if (!el) return;

		const ids = wl.read();
		const data = await chrome.loadMarketplace();
		const listings = (data?.listings || []).filter((l) => ids.includes(l.id));

		if (!listings.length) {
			el.innerHTML = `<p style="color:var(--syn-muted);text-align:center;padding:48px 0">
				No saved offers yet. Tap 🤍 on any marketplace card to save it, or browse
				<a href="browse.html" style="color:var(--syn-accent)">marketplace</a> /
				<a href="shop.html" style="color:var(--syn-accent)">cheats</a>.
			</p>`;
			return;
		}

		chrome.renderListings(listings, 'wishlist-results', { linkPrefix: 'browse.html?listing=' });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	window.addEventListener('gl-wishlist-updated', init);
})();
