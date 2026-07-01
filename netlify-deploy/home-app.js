/** GamerLeech homepage — Synapse-style sections */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	if (!chrome) return;

	const CHEAT_CATEGORIES = new Set([
		'call-of-duty', 'cod-mobile', 'fivem', 'valorant', 'roblox',
		'fortnite', 'rainbow-six', 'gta5', 'premium', 'cs2', 'apex',
	]);

	async function init() {
		const data = await chrome.loadMarketplace();
		if (!data) {
			showLoadError();
			return;
		}

		const stats = data.stats;
		chrome.renderTicker(data.ticker);
		chrome.renderCategoryTabs('popular');
		chrome.renderGameCarousel(data.games.slice(0, 24));
		chrome.renderListings(chrome.getFeaturedListings(data, 8), 'hot-listings');
		chrome.renderReviews(data.reviews, stats);
		chrome.renderGuides(data.guides);

		const statEl = document.getElementById('hero-stats-text');
		if (statEl && stats) {
			statEl.textContent = `Rare loot, ranked accounts, and instant boosts across ${stats.gameCount}+ games — plus ${stats.cheatsCount || 71} GamerLeech cheats with crypto checkout.`;
		}

		const hotMeta = document.getElementById('hot-offers-meta');
		if (hotMeta && stats) {
			hotMeta.textContent = `${stats.activeListings.toLocaleString()} marketplace offers · ${stats.activeSellers}+ sellers · ${stats.avgRating}★ avg`;
		}

		const ctaSellers = document.getElementById('cta-sellers');
		if (ctaSellers && stats) {
			ctaSellers.textContent = String(stats.activeSellers);
		}

		const cheats = await chrome.loadCheatsProducts();
		let featured = cheats.filter((p) => (p.catalog === 'cheats' || CHEAT_CATEGORIES.has(p.category)) && p.featured);
		if (!featured.length) {
			featured = cheats.filter((p) => p.catalog === 'cheats' || !p.catalog).slice(0, 4);
		}
		renderFeaturedCheats(featured.slice(0, 4));
	}

	function showLoadError() {
		const el = document.getElementById('hot-listings');
		if (el) {
			el.innerHTML = '<p style="color:var(--syn-muted);text-align:center;padding:24px">Could not load marketplace catalog. Open via <code>netlify-deploy/</code> or run <code>python tools/sync_deploy.py</code>.</p>';
		}
	}

	function renderFeaturedCheats(products) {
		const el = document.getElementById('featured-cheats');
		if (!el || !products.length) {
			const section = document.getElementById('featured-cheats-section');
			if (section) section.hidden = true;
			return;
		}
		const resolve = window.GL_resolveProductImage || ((p) => p.image || 'assets/shop/fallback.svg');
		el.className = 'synapse-listings-grid';
		el.innerHTML = products
			.map((p) => {
				const price = p.pricing?.weekly ?? p.pricing?.monthly ?? p.price ?? 0;
				const img = resolve(p);
				return `<a href="shop.html?category=${encodeURIComponent(p.category)}" class="synapse-hub-card synapse-listing-card">
					<div class="synapse-listing-thumb" style="background:linear-gradient(135deg,#581c87,#22d3ee)">
						<img class="synapse-cover-img" src="${img}" alt="${p.title.replace(/"/g, '&quot;')}" loading="lazy" onerror="this.onerror=null;this.src='assets/shop/fallback.svg'">
						${p.status === 'undetected' ? '<span class="synapse-badge-instant">Undetected</span>' : ''}
						${p.tier ? `<span class="synapse-badge-hot">${p.tier}</span>` : ''}
					</div>
					<div class="synapse-listing-body">
						<div class="synapse-listing-top">
							<span>⚡ Cheats</span>
							<span class="synapse-cat-badge">${p.category || 'game'}</span>
						</div>
						<h3 class="synapse-listing-title">${p.title}</h3>
						<div class="synapse-listing-footer">
							<div class="synapse-seller">
								<span class="synapse-avatar" style="background:#7e22ce">G</span>
								<div>
									<div class="synapse-seller-name">GamerLeech</div>
									<div class="synapse-stars">★★★★★</div>
								</div>
							</div>
							<div class="synapse-price">
								<strong>$${Number(price).toFixed(2)}</strong>
								<span>from</span>
							</div>
						</div>
					</div>
				</a>`;
			})
			.join('');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
