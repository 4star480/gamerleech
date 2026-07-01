/** GamerLeech cheats shop — browse-style product grid (Synapse layout) */
(function () {
	'use strict';

	let PRODUCTS = [];
	let activeTier = 'all';
	let activeTab = 'cheats';
	let activeSort = 'featured';

	const CHEAT_CATEGORIES = new Set([
		'call-of-duty', 'cod-mobile', 'fivem', 'valorant', 'roblox',
		'fortnite', 'rainbow-six', 'gta5', 'premium', 'cs2', 'apex'
	]);
	const SERVICE_CATEGORIES = new Set(['tiktok', 'facebook', 'services']);

	const CATEGORY_NAMES = {
		'call-of-duty': 'Call of Duty', 'cod-mobile': 'Call of Duty Mobile', fivem: 'FiveM',
		valorant: 'Valorant', roblox: 'Roblox', fortnite: 'Fortnite', 'rainbow-six': 'Rainbow Six',
		tiktok: 'TikTok', facebook: 'Facebook', gta5: 'GTA V', premium: 'Premium', cs2: 'CS2',
		apex: 'Apex Legends', services: 'Services'
	};

	const chrome = window.GL_CHROME;
	const productGrid = document.getElementById('product-grid');
	const searchEl = document.getElementById('search-input');
	const headerSearchEl = document.getElementById('header-search');
	const pageTitle = document.getElementById('page-title');
	const pageSubtitle = document.getElementById('page-subtitle');
	const shopFilters = document.getElementById('shop-filters');
	const shopSort = document.getElementById('shop-sort');
	const tierChips = document.getElementById('tier-chips');
	const catalogTabs = document.getElementById('catalog-tabs');
	const breadcrumbCurrent = document.getElementById('breadcrumb-current');

	function params() { return new URLSearchParams(window.location.search); }

	function getTabFromURL() {
		return params().get('tab') === 'services' ? 'services' : 'cheats';
	}

	function getCategoryFromURL() { return params().get('category'); }

	function getSearchQuery() {
		const q = params().get('q');
		if (q) return q;
		return (searchEl?.value || headerSearchEl?.value || '').trim();
	}

	function syncSearchInputs(value) {
		if (searchEl) searchEl.value = value;
		if (headerSearchEl) headerSearchEl.value = value;
	}

	function tabCategories(tab) {
		const set = tab === 'services' ? SERVICE_CATEGORIES : CHEAT_CATEGORIES;
		return [...set].filter((c) => PRODUCTS.some((p) => p.category === c));
	}

	function productsForTab(tab) {
		return PRODUCTS.filter((p) => {
			if (tab === 'services') return p.catalog === 'social' || p.catalog === 'services';
			return p.catalog === 'cheats' || CHEAT_CATEGORIES.has(p.category);
		});
	}

	function shopUrl(tab, category, sort) {
		const p = new URLSearchParams();
		if (tab === 'services') p.set('tab', 'services');
		if (category) p.set('category', category);
		if (sort && sort !== 'featured') p.set('sort', sort);
		const q = p.toString();
		return q ? `shop.html?${q}` : 'shop.html';
	}

	function normalizeProduct(p) {
		const raw = window.GL_resolveProductImage?.(p) || p.image || `assets/shop/${p.category}.svg`;
		const image = window.GL_resolveProductImageUrl?.(p) || raw;
		return {
			...p,
			image,
			catalog: p.catalog || (CHEAT_CATEGORIES.has(p.category) ? 'cheats' : 'services'),
			status: p.status || 'undetected',
			tier: p.tier || 'external',
			features: Array.isArray(p.features) ? p.features : [],
			featured: Boolean(p.featured)
		};
	}

	function basePrice(p) {
		const pr = p.pricing;
		if (pr && typeof pr === 'object') {
			for (const k of ['weekly', 'monthly', 'lifetime', 'daily', 'onetime']) {
				if (pr[k] !== undefined) return Number(pr[k]);
			}
		}
		return Number(p.price || 0);
	}

	function productCardHtml(p) {
		const href = `product.html?id=${encodeURIComponent(p.id)}`;
		const catLabel = CATEGORY_NAMES[p.category] || p.category;
		const price = basePrice(p);
		const badges = [
			p.featured ? '<span class="synapse-badge-hot">Hot</span>' : '',
			p.status === 'undetected' ? '<span class="synapse-badge-instant">Undetected</span>' : '',
			p.tier && p.tier !== 'service' ? `<span class="synapse-badge-hot">${p.tier}</span>` : ''
		].join('');

		return `<div class="synapse-listing-wrap">
			<a href="${href}" class="synapse-hub-card synapse-listing-card synapse-product-card">
				<div class="synapse-listing-thumb" style="background:linear-gradient(135deg,#581c87,#22d3ee)">
					<img class="synapse-cover-img" src="${p.image}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/shop/fallback.svg'">
					${badges}
				</div>
				<div class="synapse-listing-body">
					<div class="synapse-listing-top">
						<span>⚡ ${catLabel}</span>
						<span class="synapse-cat-badge">Cheats</span>
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
							<strong>$${price.toFixed(2)}</strong>
							<span>from</span>
						</div>
					</div>
				</div>
			</a>
		</div>`;
	}

	function sortProducts(list) {
		const sorted = [...list];
		if (activeSort === 'price-asc') return sorted.sort((a, b) => basePrice(a) - basePrice(b));
		if (activeSort === 'price-desc') return sorted.sort((a, b) => basePrice(b) - basePrice(a));
		if (activeSort === 'name') return sorted.sort((a, b) => a.title.localeCompare(b.title));
		return sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title));
	}

	function filteredProducts() {
		const q = getSearchQuery().toLowerCase();
		const cat = getCategoryFromURL();
		return sortProducts(productsForTab(activeTab).filter((p) => {
			const matchCat = !cat || p.category === cat;
			const matchTier = activeTab !== 'cheats' || activeTier === 'all' || p.tier === activeTier;
			const matchText = !q || p.title.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q);
			return matchCat && matchTier && matchText;
		}));
	}

	function renderCatalogTabs() {
		if (!catalogTabs) return;
		const cheatCount = productsForTab('cheats').length;
		const serviceCount = productsForTab('services').length;
		catalogTabs.innerHTML = [
			{ id: 'cheats', label: 'Cheats', count: cheatCount },
			{ id: 'services', label: 'Services', count: serviceCount }
		].map((t) => `
			<button type="button" class="synapse-catalog-tab${activeTab === t.id ? ' active' : ''}" data-tab="${t.id}">
				${t.label}<span class="synapse-catalog-tab-count">${t.count}</span>
			</button>`).join('');
	}

	function renderFilters(categories) {
		if (!shopFilters) return;
		const cat = getCategoryFromURL();
		const items = [{ id: '', label: 'All' }, ...categories.map((c) => ({ id: c, label: CATEGORY_NAMES[c] || c }))];
		shopFilters.innerHTML = items.map((item) => {
			const active = (cat || '') === item.id;
			const href = shopUrl(activeTab, item.id || null, activeSort);
			return `<a href="${href}" class="synapse-filter-btn${active ? ' active' : ''}">${item.label}</a>`;
		}).join('');
	}

	function renderSort() {
		if (!shopSort) return;
		const opts = [
			{ id: 'featured', label: 'Featured' },
			{ id: 'price-asc', label: 'Price ↑' },
			{ id: 'price-desc', label: 'Price ↓' },
			{ id: 'name', label: 'Name' }
		];
		shopSort.innerHTML = opts.map((o) => {
			const p = new URLSearchParams(window.location.search);
			p.set('sort', o.id);
			if (activeTab === 'services') p.set('tab', 'services');
			return `<a href="shop.html?${p}" class="synapse-filter-btn${activeSort === o.id ? ' active' : ''}">${o.label}</a>`;
		}).join('');
	}

	function renderTierChips() {
		if (!tierChips) return;
		if (activeTab !== 'cheats') {
			tierChips.innerHTML = '';
			tierChips.style.display = 'none';
			return;
		}
		const tiers = [
			{ id: 'all', label: 'All types' },
			{ id: 'internal', label: 'Internal' },
			{ id: 'external', label: 'External' },
			{ id: 'private', label: 'Private' },
			{ id: 'serials', label: 'Serials' }
		];
		tierChips.style.display = 'flex';
		tierChips.innerHTML = tiers.map((t) =>
			`<button type="button" class="synapse-filter-btn${activeTier === t.id ? ' active' : ''}" data-tier="${t.id}">${t.label}</button>`
		).join('');
	}

	function updateHeader() {
		activeTab = getTabFromURL();
		activeSort = params().get('sort') || 'featured';
		const cat = getCategoryFromURL();
		const list = filteredProducts();
		const categories = tabCategories(activeTab);

		if (cat) {
			const name = CATEGORY_NAMES[cat] || cat;
			if (pageTitle) pageTitle.textContent = name;
			if (breadcrumbCurrent) breadcrumbCurrent.textContent = name;
		} else if (activeTab === 'services') {
			if (pageTitle) pageTitle.textContent = 'Services';
			if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Services';
		} else {
			if (pageTitle) pageTitle.innerHTML = 'Browse <span class="synapse-hero-gradient">cheats</span>';
			if (breadcrumbCurrent) breadcrumbCurrent.textContent = 'Cheats';
		}

		if (pageSubtitle) {
			pageSubtitle.textContent = `${list.length} product${list.length === 1 ? '' : 's'} · Crypto checkout on every order`;
		}

		const urlQ = params().get('q');
		if (urlQ) syncSearchInputs(urlQ);

		renderCatalogTabs();
		renderFilters(categories);
		renderSort();
		renderTierChips();
		renderProducts(list);
	}

	function renderProducts(list) {
		if (!productGrid) return;
		productGrid.innerHTML = list.length
			? list.map(productCardHtml).join('')
			: `<p class="synapse-empty" style="grid-column:1/-1">No products match your filters. <a href="shop.html" class="synapse-link">Clear filters</a></p>`;
	}

	function applyFilters() {
		updateHeader();
	}

	function loadCatalog() {
		if (productGrid) productGrid.innerHTML = '<p class="synapse-empty" style="grid-column:1/-1">Loading products…</p>';
		return fetch('data/products.json', { cache: 'no-store' })
			.then((r) => { if (!r.ok) throw new Error('catalog'); return r.json(); })
			.then((data) => {
				PRODUCTS = (data.products || []).map(normalizeProduct);
				updateHeader();
			})
			.catch(() => {
				if (productGrid) productGrid.innerHTML = '<p class="synapse-empty" style="grid-column:1/-1">Could not load catalog. Please refresh.</p>';
			});
	}

	// Cart (unchanged)
	const drawer = document.getElementById('cart-drawer');
	const drawerBtn = document.getElementById('cart-button');
	const drawerClose = document.getElementById('cart-close');
	const drawerBackdrop = document.getElementById('cart-backdrop');
	const cartItemsEl = document.getElementById('cart-items');
	const cartCountEl = document.getElementById('cart-count');
	const cartTotalEl = document.getElementById('cart-total');
	const checkoutBtn = document.getElementById('checkout-btn');
	const checkoutBtnFixed = document.getElementById('checkout-btn-fixed');
	const cartPayBar = document.getElementById('cart-pay-bar');
	const cartToast = document.getElementById('cart-toast');
	let toastTimer;

	function showToast(msg) {
		if (!cartToast) return;
		cartToast.textContent = msg;
		cartToast.classList.add('show');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => cartToast.classList.remove('show'), 2200);
	}

	function goCheckout() {
		if (GLCart.count() === 0) { showToast('Add items before checkout'); return; }
		window.location.href = 'checkout.html';
	}

	function openCart() {
		drawer?.setAttribute('aria-hidden', 'false');
		if (drawerBackdrop) drawerBackdrop.hidden = false;
		document.body.classList.add('cart-open');
		if (cartPayBar) cartPayBar.hidden = false;
	}

	function closeCart() {
		drawer?.setAttribute('aria-hidden', 'true');
		if (drawerBackdrop) drawerBackdrop.hidden = true;
		document.body.classList.remove('cart-open');
		if (cartPayBar) cartPayBar.hidden = true;
	}

	function updateCartUI() {
		const cart = GLCart.get();
		if (!cartItemsEl) return;
		if (!cart.length) {
			cartItemsEl.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p><a href="shop.html" class="btn btn-outline">Browse products</a></div>';
		} else {
			cartItemsEl.innerHTML = cart.map((item) => {
				const cid = item.cartId || item.id;
				return `<div class="cart-item"><div class="ci-left"><div><strong>${item.title}</strong><p class="muted">$${item.price.toFixed(2)} × ${item.qty}</p></div></div><div class="ci-right"><button type="button" class="icon-btn" data-action="remove" data-cart-id="${cid}">✕</button></div></div>`;
			}).join('');
		}
		const total = GLCart.total(cart);
		const count = GLCart.count(cart);
		if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
		if (cartCountEl) cartCountEl.textContent = String(count);
		[checkoutBtn, checkoutBtnFixed].forEach((btn) => {
			if (!btn) return;
			btn.disabled = count === 0;
			btn.textContent = count === 0 ? 'Add items to checkout' : `Checkout — $${total.toFixed(2)}`;
		});
	}

	catalogTabs?.addEventListener('click', (e) => {
		const tab = e.target.closest('[data-tab]');
		if (tab) window.location.href = shopUrl(tab.getAttribute('data-tab'));
	});

	tierChips?.addEventListener('click', (e) => {
		const chip = e.target.closest('[data-tier]');
		if (!chip) return;
		activeTier = chip.getAttribute('data-tier');
		renderTierChips();
		applyFilters();
	});

	searchEl?.addEventListener('input', applyFilters);
	headerSearchEl?.addEventListener('input', () => {
		if (searchEl) searchEl.value = headerSearchEl.value;
		applyFilters();
	});

	drawerBtn?.addEventListener('click', openCart);
	drawerClose?.addEventListener('click', closeCart);
	drawerBackdrop?.addEventListener('click', closeCart);
	checkoutBtn?.addEventListener('click', goCheckout);
	checkoutBtnFixed?.addEventListener('click', goCheckout);
	cartItemsEl?.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-action="remove"]');
		if (btn) { GLCart.remove(btn.getAttribute('data-cart-id')); updateCartUI(); }
	});
	window.addEventListener('gl-cart-updated', updateCartUI);

	loadCatalog();
	updateCartUI();
})();
