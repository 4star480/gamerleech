/** Seller profile — static marketplace view */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	if (!chrome) return;

	const seller = new URLSearchParams(location.search).get('seller');

	async function init() {
		const el = document.getElementById('seller-listings');
		const title = document.getElementById('seller-title');
		if (!seller || !el) return;

		const data = await chrome.loadMarketplace();
		if (!data) return;

		const listings = (data.listings || []).filter((l) => l.seller.username === seller);
		if (title) title.textContent = seller;
		const sub = document.getElementById('seller-sub');
		if (sub) sub.textContent = `${listings.length} active offers · Verified seller`;

		chrome.renderListings(listings.slice(0, 48), 'seller-listings', { linkPrefix: 'browse.html?listing=' });
		const more = document.getElementById('seller-more');
		if (more && listings.length > 48) {
			more.hidden = false;
			more.href = `browse.html?q=${encodeURIComponent(seller)}`;
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
