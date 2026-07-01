/** GamerLeech shared Synapse-style chrome */
(function () {
	'use strict';

	const cfg = window.GL_CONFIG || {};
	const BRAND = cfg.brand || 'GamerLeech';
	const EMAIL = cfg.email || 'gamerleech2@gmail.com';

	const CATEGORY_LABELS = {
		CURRENCY: 'Currency',
		ACCOUNT: 'Account',
		ITEM: 'Item',
		BOOSTING: 'Boosting',
	};

	const TABS = [
		{ id: 'popular', label: 'Popular', icon: '🔥', href: 'index.html' },
		{ id: 'cheats', label: 'Cheats', icon: '⚡', href: 'shop.html' },
		{ id: 'services', label: 'Services', icon: '🛠️', href: 'shop.html?tab=services' },
		{ id: 'currency', label: 'Currency', icon: '💰', href: 'browse.html?category=CURRENCY' },
		{ id: 'items', label: 'Items', icon: '📦', href: 'browse.html?category=ITEM' },
		{ id: 'accounts', label: 'Accounts', icon: '🛡️', href: 'browse.html?category=ACCOUNT' },
		{ id: 'boosting', label: 'Boosting', icon: '💪', href: 'browse.html?category=BOOSTING' },
	];

	const MOBILE_TABS = [
		{ href: 'index.html', label: 'Home', icon: '⌂', match: /^(index\.html)?$/ },
		{ href: 'shop.html', label: 'Cheats', icon: '⚡', match: /^shop\.html/ },
		{ href: 'browse.html', label: 'Browse', icon: '◎', match: /^browse\.html/ },
		{ href: 'games.html', label: 'Games', icon: '▦', match: /^games\.html/ },
		{ href: 'wishlist.html', label: 'Saved', icon: '♥', match: /^wishlist\.html/ },
	];

	const FOOTER_POPULAR = [
		{ label: 'Buy OSRS Gold', href: 'browse.html?game=old-school-runescape&category=CURRENCY' },
		{ label: 'WoW Gold', href: 'browse.html?game=world-of-warcraft&category=CURRENCY' },
		{ label: 'Fortnite Accounts', href: 'browse.html?game=fortnite&category=ACCOUNT' },
		{ label: 'Valorant Boosting', href: 'browse.html?game=valorant&category=BOOSTING' },
		{ label: 'COD Cheats', href: 'shop.html' },
		{ label: 'Valorant Cheats', href: 'shop.html' },
	];

	const PAYMENTS = ['Bitcoin', 'Ethereum', 'USDT', 'Litecoin', 'Amazon', 'Apple', 'Xbox', 'Steam', 'PlayStation'];

	const CATEGORY_TAB_MAP = {
		CURRENCY: 'currency',
		ACCOUNT: 'accounts',
		ITEM: 'items',
		BOOSTING: 'boosting',
	};

	function categoryTabActiveId(category) {
		if (!category) return 'popular';
		return CATEGORY_TAB_MAP[category] || 'popular';
	}

	function encodeImagePath(path) {
		if (window.GL_encodeImagePath) return window.GL_encodeImagePath(path);
		if (!path || /^https?:/i.test(path)) return path;
		return path.split('/').map((seg) => encodeURIComponent(seg)).join('/');
	}

	function gameCoverImg(slug, alt) {
		const safe = (alt || '').replace(/"/g, '&quot;');
		const jpg = encodeImagePath(`images/games/${slug}.jpg`);
		const svg = encodeImagePath(`images/games/${slug}.svg`);
		return `<img class="synapse-cover-img" src="${jpg}" alt="${safe}" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${svg}'}else{this.style.display='none'}">`;
	}

	function gameThumbHtml(game, badges) {
		const grad = `linear-gradient(135deg,${game.bannerFrom},${game.bannerTo})`;
		return `<div class="synapse-listing-thumb" style="background:${grad}">${gameCoverImg(game.slug, game.name)}${badges || ''}</div>`;
	}

	function injectMobileNav() {
		if (document.getElementById('primary-nav')) return;
		const header = document.querySelector('.synapse-header');
		if (!header) return;
		const nav = document.createElement('nav');
		nav.className = 'nav';
		nav.id = 'primary-nav';
		nav.innerHTML = `
			<a href="shop.html">Cheats</a>
			<a href="browse.html">Marketplace</a>
			<a href="games.html">All games</a>
			<a href="sell.html">Sell</a>
			<a href="status.html">Status</a>
			<a href="wishlist.html">Saved</a>
			<a href="login.html">Log in</a>
			<a href="register.html" class="btn btn-primary">Sign up</a>`;
		header.appendChild(nav);
	}

	function injectSynapseChrome() {
		injectMobileNav();
		initMobileTabbar();
		initSearch();
	}

	function currentPage() {
		return (location.pathname.split('/').pop() || 'index.html').split('?')[0];
	}

	function sortListings(listings, sort) {
		const list = [...listings];
		if (sort === 'popular') {
			return list.sort((a, b) => Number(b.featured) - Number(a.featured) || (b.views || 0) - (a.views || 0));
		}
		if (sort === 'price-asc') return list.sort((a, b) => a.priceCents - b.priceCents);
		if (sort === 'price-desc') return list.sort((a, b) => b.priceCents - a.priceCents);
		return list;
	}

	function hueFromName(name) {
		let h = 0;
		for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
		return h % 360;
	}

	function formatPrice(cents) {
		return '$' + (cents / 100).toFixed(2);
	}

	function formatDelivery(mins) {
		if (mins < 60) return mins + ' min';
		if (mins < 1440) return Math.round(mins / 60) + ' hr';
		return Math.round(mins / 1440) + ' day';
	}

	function stars(rating) {
		const n = Math.round(rating || 0);
		return '★'.repeat(n) + '☆'.repeat(5 - n);
	}

	function renderTicker(events) {
		const el = document.getElementById('live-ticker');
		if (!el || !events?.length) return;
		const items = [...events, ...events]
			.map((e, i) => {
				const dot = i > 0 ? '<span class="live-ticker-dot" aria-hidden="true"></span>' : '';
				return `${dot}<span class="live-ticker-item">
					<span class="user">${e.user}</span>
					<span class="muted">bought</span>
					<span aria-hidden="true">${e.icon}</span>
					<span class="item">${e.item}</span>
					<span class="detail">${e.detail}</span>
					<span class="price">${e.price}</span>
				</span>`;
			})
			.join('');
		el.innerHTML = `<div class="live-ticker-track" aria-live="polite">${items}</div>`;
	}

	function renderCategoryTabs(activeId) {
		const el = document.getElementById('category-tabs');
		if (!el) return;
		el.className = 'synapse-tabs';
		el.innerHTML = TABS.map((t) => {
			const active = t.id === activeId ? ' active' : '';
			return `<a href="${t.href}" class="synapse-tab${active}">
				<span class="synapse-tab-icon">${t.icon}</span>
				<span class="synapse-tab-label">${t.label}</span>
			</a>`;
		}).join('');
	}

	function renderGameCarousel(games, containerId) {
		const el = document.getElementById(containerId || 'game-carousel');
		if (!el || !games?.length) return;
		el.innerHTML = games
			.map(
				(g) => `<a href="browse.html?game=${g.slug}" class="synapse-hub-card synapse-game-card">
				<div class="synapse-game-cover" style="background:linear-gradient(135deg,${g.bannerFrom},${g.bannerTo})">
					${gameCoverImg(g.slug, g.name)}
					<span class="synapse-game-emoji">${g.emoji}</span>
				</div>
				<div class="synapse-game-body">
					<h3>${g.name}</h3>
					<p>${g.tagline}</p>
					<p class="synapse-game-meta">${g.listingCount} offers · ${g.avgRating}★</p>
				</div>
			</a>`
			)
			.join('');
		wireCarousel(el.closest('.synapse-carousel-wrap') || el.parentElement);
	}

	function renderListings(listings, containerId, opts) {
		const el = document.getElementById(containerId || 'hot-listings');
		if (!el || !listings?.length) {
			if (el) el.innerHTML = '<p style="color:var(--syn-muted);text-align:center;padding:24px">No offers found.</p>';
			return;
		}
		const linkPrefix = opts?.linkPrefix || 'browse.html?listing=';
		el.className = 'synapse-listings-grid';
		el.innerHTML = listings.map((l) => listingCardHtml(l, linkPrefix)).join('');
		if (window.GL_WISHLIST) window.GL_WISHLIST.wire(el);
	}

	function cheatCategoryCardHtml(cat, name, count, image, href) {
		const fallback = 'assets/shop/fallback.svg';
		const img = image || fallback;
		return `<a href="${href}" class="synapse-hub-card synapse-game-card synapse-category-card">
			<div class="synapse-game-cover" style="background:linear-gradient(135deg,#581c87,#22d3ee)">
				<img class="synapse-cover-img" src="${img}" alt="" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${fallback}'">
			</div>
			<div class="synapse-game-body">
				<h3>${name}</h3>
				<p>${count} product${count === 1 ? '' : 's'}</p>
				<div class="synapse-game-meta">Browse cheats →</div>
			</div>
		</a>`;
	}

	function cheatCardHtml(p, opts) {
		opts = opts || {};
		const resolve = window.GL_resolveProductImageUrl || window.GL_resolveProductImage || ((x) => x.image || 'assets/shop/fallback.svg');
		const fallback = 'assets/shop/fallback.svg';
		const img = resolve(p);
		const price = p.pricing?.weekly ?? p.pricing?.monthly ?? p.pricing?.lifetime ?? p.price ?? 0;
		const catLabel = (CATEGORY_LABELS[p.category] || p.category || 'cheats').replace(/_/g, ' ');
		const statusBadge = p.status === 'undetected'
			? '<span class="synapse-badge-instant">Undetected</span>'
			: p.status === 'updating'
				? '<span class="synapse-badge-hot">Updating</span>'
				: '';
		const tierBadge = p.tier && p.tier !== 'service'
			? `<span class="synapse-badge-hot">${p.tier}</span>`
			: '';
		const featured = p.featured ? '<span class="synapse-badge-hot">Featured</span>' : '';
		const inner = opts.bodyHtml || '';

		return `<article class="synapse-cheat-wrap product-frame" data-id="${p.id}">
			<div class="synapse-hub-card synapse-listing-card synapse-cheat-card">
				<div class="synapse-listing-thumb" style="background:linear-gradient(135deg,#581c87,#22d3ee)">
					<img class="synapse-cover-img" src="${img}" alt="${String(p.title).replace(/"/g, '&quot;')}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='${fallback}'">
					${featured}${statusBadge}${tierBadge}
				</div>
				<div class="synapse-listing-body">
					<div class="synapse-listing-top">
						<span>⚡ Cheats</span>
						<span class="synapse-cat-badge">${catLabel}</span>
					</div>
					<h3 class="synapse-listing-title">${p.title}</h3>
					${p.desc ? `<p class="synapse-cheat-desc">${p.desc}</p>` : ''}
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
					${inner}
				</div>
			</div>
		</article>`;
	}

	function listingCardHtml(l, linkPrefix) {
		const hue = hueFromName(l.seller.username);
		const instant = l.deliveryMins <= 60;
		const href = linkPrefix + encodeURIComponent(l.id);
		const badges = `${l.featured ? '<span class="synapse-badge-hot">Hot</span>' : ''}${instant ? '<span class="synapse-badge-instant">⚡ Instant</span>' : ''}`;
		return `<div class="synapse-listing-wrap">
			<button type="button" class="synapse-wishlist-btn" data-wishlist-id="${l.id}">🤍</button>
			<a href="${href}" class="synapse-hub-card synapse-listing-card" data-listing-id="${l.id}">
			${gameThumbHtml(l.game, badges)}
			<div class="synapse-listing-body">
				<div class="synapse-listing-top">
					<span>${l.game.emoji} ${l.game.name}</span>
					<span class="synapse-cat-badge">${CATEGORY_LABELS[l.category] || l.category}</span>
				</div>
				<h3 class="synapse-listing-title">${l.title}</h3>
				<div class="synapse-listing-footer">
					<div class="synapse-seller">
						<span class="synapse-avatar" style="background:hsl(${hue},55%,45%)">${l.seller.username[0].toUpperCase()}</span>
						<div>
							<div class="synapse-seller-name"><a href="seller.html?seller=${encodeURIComponent(l.seller.username)}" style="color:inherit;text-decoration:none">${l.seller.username}</a>${l.seller.verified ? ' <span style="color:var(--syn-accent)">✓</span>' : ''}</div>
							<div class="synapse-stars">${stars(l.sellerRating)}</div>
						</div>
					</div>
					<div class="synapse-price">
						<strong>${formatPrice(l.priceCents)}</strong>
						<span>~${formatDelivery(l.deliveryMins)}</span>
					</div>
				</div>
			</div>
		</a></div>`;
	}

	function getFeaturedListings(data, limit) {
		const all = data.listings || [];
		const ids = data.featuredListings || [];
		const picked = ids.length
			? ids.map((id) => all.find((l) => l.id === id)).filter(Boolean)
			: all.filter((l) => l.featured);
		if (picked.length >= limit) return picked.slice(0, limit);
		const rest = all.filter((l) => !picked.includes(l));
		return picked.concat(rest).slice(0, limit);
	}

	let marketplaceCache = null;
	let cheatsCache = null;

	async function loadCheatsProducts() {
		if (cheatsCache) return cheatsCache;
		try {
			const res = await fetch('data/products.json');
			if (!res.ok) return [];
			const data = await res.json();
			cheatsCache = Array.isArray(data.products) ? data.products : [];
			return cheatsCache;
		} catch {
			return [];
		}
	}

	function openListingModal(listing) {
		let modal = document.getElementById('listing-modal');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = 'listing-modal';
			modal.className = 'listing-modal';
			modal.innerHTML = `<div class="listing-modal-backdrop" data-close></div><div class="listing-modal-panel" role="dialog" aria-modal="true"><button type="button" class="listing-modal-close" data-close aria-label="Close">✕</button><div id="listing-modal-body"></div></div>`;
			document.body.appendChild(modal);
			modal.addEventListener('click', (e) => {
				if (e.target.matches('[data-close], .listing-modal-backdrop')) modal.hidden = true;
			});
		}
		const body = document.getElementById('listing-modal-body');
		body.innerHTML = `
			<div class="synapse-listing-thumb synapse-modal-thumb" style="height:140px;margin:0 0 16px;border-radius:12px;background:linear-gradient(135deg,${listing.game.bannerFrom},${listing.game.bannerTo})">
				${gameCoverImg(listing.game.slug, listing.game.name)}
			</div>
			<p style="font-size:12px;color:var(--syn-muted);margin:0">${listing.game.emoji} ${listing.game.name} · ${CATEGORY_LABELS[listing.category] || listing.category}</p>
			<h2 style="margin:8px 0 12px;font-size:1.25rem">${listing.title}</h2>
			<p style="color:var(--syn-muted);font-size:14px;line-height:1.6">${listing.description || 'Player-to-player offer on the GamerLeech marketplace.'}</p>
			<p style="font-size:1.5rem;font-weight:800;color:var(--syn-accent);margin:16px 0">${formatPrice(listing.priceCents)}</p>
			<p style="font-size:13px;color:var(--syn-muted)">Seller: <a href="seller.html?seller=${encodeURIComponent(listing.seller.username)}" style="color:var(--syn-accent)"><strong>${listing.seller.username}</strong></a> ${listing.seller.verified ? '✓' : ''} · ~${formatDelivery(listing.deliveryMins)} delivery</p>
			<p style="margin-top:20px;font-size:14px">To purchase, email <a href="mailto:${EMAIL}?subject=${encodeURIComponent('Marketplace: ' + listing.title)}&body=${encodeURIComponent('Listing ID: ' + listing.id + '\n\nPlease send payment instructions.')}" style="color:var(--syn-accent)">${EMAIL}</a> with this listing ID and title.</p>
			<div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px">
				<button type="button" class="synapse-btn-outline" data-wishlist-id="${listing.id}" style="cursor:pointer">Save offer</button>
				<a href="shop.html" class="synapse-btn-primary" style="display:inline-block">Browse cheats</a>
			</div>`;
		modal.hidden = false;
		if (window.GL_WISHLIST) window.GL_WISHLIST.wire(modal);
	}

	async function loadMarketplace() {
		if (marketplaceCache) return marketplaceCache;
		try {
			const res = await fetch('data/marketplace.json');
			if (!res.ok) return null;
			marketplaceCache = await res.json();
			return marketplaceCache;
		} catch {
			return null;
		}
	}

	function renderReviews(reviews, stats) {
		const track = document.getElementById('reviews-track');
		const summary = document.getElementById('reviews-summary');
		if (!track || !reviews?.length) return;
		track.innerHTML = reviews
			.map(
				(r) => `<article class="synapse-review-card">
				<div class="synapse-review-top">
					<span class="synapse-review-author">${r.author}</span>
					<span class="synapse-stars">${stars(r.rating)}</span>
				</div>
				<p class="synapse-review-game">${r.gameEmoji} ${r.gameName}</p>
				<p class="synapse-review-text">"${r.comment}"</p>
				<p class="synapse-review-listing">${r.listingTitle}</p>
			</article>`
			)
			.join('');
		if (summary && stats) {
			summary.innerHTML = `Rated <strong style="color:var(--syn-warning)">${stats.avgRating}/5</strong> from <strong>${stats.reviewCount.toLocaleString()}</strong> verified reviews`;
		}
	}

	function renderGuides(guides) {
		const el = document.getElementById('guides-grid');
		if (!el || !guides?.length) return;
		el.innerHTML = guides
			.map(
				(g) => `<a href="browse.html" class="synapse-guide-card">
				<div class="synapse-guide-thumb">${g.slug ? `<img src="images/guides/${g.slug}.svg" alt="" loading="lazy" onerror="this.parentElement.textContent='📖'">` : '📖'}</div>
				<div class="synapse-guide-body">
					<p class="synapse-guide-meta">${g.date} by ${g.author}</p>
					<h3 class="synapse-guide-title">${g.title}</h3>
				</div>
			</a>`
			)
			.join('');
	}

	function wireCarousel(wrap) {
		if (!wrap) return;
		const track = wrap.querySelector('.synapse-carousel');
		const prev = wrap.querySelector('[data-carousel-prev]');
		const next = wrap.querySelector('[data-carousel-next]');
		if (!track) return;
		const scroll = (dir) => track.scrollBy({ left: dir * 220, behavior: 'smooth' });
		if (prev) prev.addEventListener('click', () => scroll(-1));
		if (next) next.addEventListener('click', () => scroll(1));
	}

	function initMobileTabbar() {
		const page = currentPage();
		document.querySelectorAll('.synapse-tabbar a').forEach((a) => {
			const href = (a.getAttribute('href') || '').split('?')[0];
			const tab = MOBILE_TABS.find((t) => t.href === href);
			if (tab && tab.match.test(page)) a.classList.add('active');
		});
		// Status page special case
		if (page === 'status.html') {
			document.querySelectorAll('.synapse-tabbar a[href="status.html"]').forEach((a) => a.classList.add('active'));
		}
	}

	function initSearch() {
		const isShop = document.body.classList.contains('shop-page');
		document.querySelectorAll('[data-synapse-search]').forEach((form) => {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				const q = form.querySelector('input')?.value?.trim();
				if (isShop) {
					location.href = q ? `shop.html?q=${encodeURIComponent(q)}` : 'shop.html';
				} else if (q) {
					location.href = 'browse.html?q=' + encodeURIComponent(q);
				} else {
					location.href = 'browse.html';
				}
			});
		});
	}

	window.GL_CHROME = {
		BRAND,
		EMAIL,
		TABS,
		CATEGORY_LABELS,
		categoryTabActiveId,
		injectMobileNav,
		injectSynapseChrome,
		sortListings,
		currentPage,
		hueFromName,
		formatPrice,
		formatDelivery,
		stars,
		gameCoverImg,
		gameThumbHtml,
		renderTicker,
		renderCategoryTabs,
		renderGameCarousel,
		renderListings,
		listingCardHtml,
		cheatCardHtml,
		cheatCategoryCardHtml,
		getFeaturedListings,
		renderReviews,
		renderGuides,
		initMobileTabbar,
		initSearch,
		loadMarketplace,
		loadCheatsProducts,
		openListingModal,
	};
})();
