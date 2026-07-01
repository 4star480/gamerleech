/** Browse full Synapse marketplace catalog (paginated) */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	if (!chrome) return;

	const PAGE_SIZE = 48;
	const params = new URLSearchParams(location.search);
	const category = params.get('category');
	const game = params.get('game');
	const sort = params.get('sort') || '';
	const q = (params.get('q') || '').toLowerCase();
	const listingId = params.get('listing');

	let filtered = [];
	let page = 1;

	async function init() {
		const data = await chrome.loadMarketplace();
		if (!data) {
			document.getElementById('browse-results').innerHTML =
				'<p style="color:var(--syn-muted);padding:32px 0">Marketplace catalog not found. Run <code>python tools/sync_deploy.py</code> from the GamerLeech folder.</p>';
			return;
		}

		filtered = chrome.sortListings(data.listings || [], sort || 'popular');
		if (category) filtered = filtered.filter((l) => l.category === category);
		if (game) filtered = filtered.filter((l) => l.game.slug === game);
		if (q) {
			filtered = filtered.filter(
				(l) =>
					l.title.toLowerCase().includes(q) ||
					l.game.name.toLowerCase().includes(q) ||
					(l.description || '').toLowerCase().includes(q)
			);
		}

		const title = document.getElementById('browse-title');
		const sub = document.getElementById('browse-sub');
		if (title) {
			if (q) title.textContent = `Search: "${params.get('q')}"`;
			else if (game) {
				const g = data.games.find((x) => x.slug === game);
				title.textContent = g ? `${g.name} marketplace` : 'Browse';
			} else if (category) title.textContent = `${chrome.CATEGORY_LABELS[category] || category} offers`;
			else title.textContent = 'Browse marketplace';
		}
		if (sub) {
			const cheatNote = data.stats?.cheatsCount ? ` · ${data.stats.cheatsCount} cheats in shop` : '';
			sub.textContent = `${filtered.length.toLocaleString()} offers${cheatNote}`;
		}

		renderFilters(category);
		renderSort(sort);
		chrome.renderCategoryTabs(chrome.categoryTabActiveId(category));
		chrome.renderTicker(data.ticker);
		renderPage();

		if (listingId) {
			const item = data.listings.find((l) => l.id === listingId);
			if (item) chrome.openListingModal(item);
		}

		document.getElementById('load-more-btn')?.addEventListener('click', () => {
			page += 1;
			renderPage();
		});
	}

	function renderFilters(active) {
		const el = document.getElementById('browse-filters');
		if (!el) return;
		const cats = ['', 'CURRENCY', 'ACCOUNT', 'ITEM', 'BOOSTING'];
		el.innerHTML = cats
			.map((c) => {
				const label = c ? chrome.CATEGORY_LABELS[c] : 'All';
				const href = c ? `browse.html?category=${c}` : 'browse.html';
				return `<a href="${href}" class="synapse-filter-btn${active === c ? ' active' : ''}">${label}</a>`;
			})
			.join('');
	}

	function renderSort(active) {
		const el = document.getElementById('browse-sort');
		if (!el) return;
		const current = active || 'popular';
		const opts = [
			{ id: 'popular', label: 'Popular' },
			{ id: 'price-asc', label: 'Price ↑' },
			{ id: 'price-desc', label: 'Price ↓' },
		];
		const base = new URLSearchParams(location.search);
		el.innerHTML = opts
			.map((o) => {
				base.set('sort', o.id);
				return `<a href="browse.html?${base}" class="synapse-filter-btn${current === o.id ? ' active' : ''}">${o.label}</a>`;
			})
			.join('');
	}

	function renderPage() {
		const slice = filtered.slice(0, page * PAGE_SIZE);
		chrome.renderListings(slice, 'browse-results', { linkPrefix: 'browse.html?listing=' });
		const moreBtn = document.getElementById('load-more-wrap');
		if (moreBtn) {
			moreBtn.hidden = slice.length >= filtered.length;
			const count = document.getElementById('load-more-count');
			if (count) count.textContent = `Showing ${slice.length} of ${filtered.length.toLocaleString()}`;
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
