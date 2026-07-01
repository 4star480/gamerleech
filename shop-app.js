/* GamerLeech shop — Cheats + Services tabs, original catalog */
(function () {
	'use strict';

	let PRODUCTS = [];
	let activeTier = 'all';
	let activeTab = 'cheats';

	const CHEAT_CATEGORIES = new Set([
		'call-of-duty', 'cod-mobile', 'fivem', 'valorant', 'roblox',
		'fortnite', 'rainbow-six', 'gta5', 'premium', 'cs2', 'apex'
	]);
	const SERVICE_CATEGORIES = new Set(['tiktok', 'facebook', 'services']);

	const CATEGORY_NAMES = {
		'call-of-duty': 'Call of Duty',
		'cod-mobile': 'Call of Duty Mobile',
		fivem: 'FiveM',
		valorant: 'Valorant',
		roblox: 'Roblox',
		fortnite: 'Fortnite',
		'rainbow-six': 'Rainbow Six',
		tiktok: 'TikTok',
		facebook: 'Facebook',
		gta5: 'GTA V',
		premium: 'Premium Products',
		cs2: 'Counter-Strike 2',
		apex: 'Apex Legends',
		services: 'Services'
	};

	const TIER_LABELS = {
		internal: 'Internal',
		external: 'External',
		private: 'Private',
		serials: 'Serials',
		service: 'Service'
	};

	const STATUS_LABELS = {
		undetected: 'Undetected',
		updating: 'Updating',
		maintenance: 'Maintenance',
		available: 'Available'
	};

	const categoryGrid = document.getElementById('category-grid');
	const productGrid = document.getElementById('product-grid');
	const featuredGrid = document.getElementById('featured-grid');
	const featuredStrip = document.getElementById('featured-strip');
	const searchEl = document.getElementById('search-input');
	const headerSearchEl = document.getElementById('header-search');
	const pageTitle = document.getElementById('page-title');
	const pageSubtitle = document.getElementById('page-subtitle');
	const backLink = document.getElementById('back-link');
	const shopFilters = document.getElementById('shop-filters');
	const tierChips = document.getElementById('tier-chips');
	const productModal = document.getElementById('product-modal');
	const catalogTabs = document.getElementById('catalog-tabs');
	const breadcrumbCurrent = document.getElementById('breadcrumb-current');
	const chrome = window.GL_CHROME;

	function getParams() {
		return new URLSearchParams(window.location.search);
	}

	function getTabFromURL() {
		const tab = getParams().get('tab');
		return tab === 'services' ? 'services' : 'cheats';
	}

	function getSearchQuery() {
		const q = getParams().get('q');
		if (q) return q;
		return (searchEl?.value || headerSearchEl?.value || '').trim();
	}

	function syncSearchInputs(value) {
		if (searchEl) searchEl.value = value;
		if (headerSearchEl) headerSearchEl.value = value;
	}

	function getCategoryFromURL() {
		return getParams().get('category');
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

	function shopUrl(tab, category) {
		const params = new URLSearchParams();
		if (tab === 'services') params.set('tab', 'services');
		if (category) params.set('category', category);
		const q = params.toString();
		return q ? `shop.html?${q}` : 'shop.html';
	}

	const FEATURED_IDS = new Set([
		'bo6-wz4-internal', 'val-vip', 'fivem-eulen-cheats', 'fn-vip', 'fivem-susano', 'cs2-cheat-premium',
	]);

	function normalizeProduct(p) {
		const isCheat = CHEAT_CATEGORIES.has(p.category);
		const raw = typeof window.GL_resolveProductImage === 'function'
			? window.GL_resolveProductImage(p)
			: (p.image || `assets/shop/${p.category}.svg`);
		const image = typeof window.GL_resolveProductImageUrl === 'function'
			? window.GL_resolveProductImageUrl(p)
			: (typeof window.GL_encodeImagePath === 'function' ? window.GL_encodeImagePath(raw) : raw);
		return {
			...p,
			image,
			catalog: p.catalog || (isCheat ? 'cheats' : SERVICE_CATEGORIES.has(p.category) ? (p.category === 'services' ? 'services' : 'social') : 'cheats'),
			status: p.status || (isCheat ? 'undetected' : 'available'),
			tier: p.tier || (isCheat ? 'external' : 'service'),
			features: Array.isArray(p.features) ? p.features : [],
			featured: Boolean(p.featured) || FEATURED_IDS.has(p.id),
		};
	}

	function statusBadge(status) {
		const label = STATUS_LABELS[status] || status;
		const cls = status === 'available' ? 'undetected' : status;
		return `<span class="badge-pill badge-${cls}">${label}</span>`;
	}

	function tierBadge(tier) {
		if (tier === 'service') return '';
		const label = TIER_LABELS[tier] || tier;
		return `<span class="badge-pill badge-tier">${label}</span>`;
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
			</button>
		`).join('');
	}

	function renderCategories(categories) {
		if (!categoryGrid) return;
		categoryGrid.className = 'synapse-category-grid';
		categoryGrid.style.display = 'grid';
		if (!categories.length) {
			categoryGrid.innerHTML = '<p class="synapse-empty" style="grid-column:1/-1">No categories available.</p>';
			return;
		}
		const render = chrome?.cheatCategoryCardHtml;
		categoryGrid.innerHTML = categories.map((cat) => {
			const count = PRODUCTS.filter((p) => p.category === cat && (
				activeTab === 'cheats'
					? (p.catalog === 'cheats' || CHEAT_CATEGORIES.has(p.category))
					: (p.catalog === 'social' || p.catalog === 'services')
			)).length;
			const name = CATEGORY_NAMES[cat] || cat;
			const firstProduct = PRODUCTS.find((p) => p.category === cat);
			const image = firstProduct?.image || `assets/shop/${cat}.svg`;
			const href = shopUrl(activeTab, cat);
			if (render) return render(cat, name, count, image, href);
			return `<a href="${href}" class="synapse-hub-card synapse-category-card"><h3>${name}</h3><p>${count} products</p></a>`;
		}).join('');
	}

	function buildPricingUI(p) {
		const pricing = p.pricing;
		if (!pricing || typeof pricing !== 'object') return null;

		const tabOrder = ['daily', 'weekly', 'monthly', 'onetime', 'lifetime'];
		let defaultPeriod = null;
		let defaultPrice = null;

		for (const period of tabOrder) {
			if (pricing[period] !== undefined) {
				defaultPeriod = period;
				defaultPrice = pricing[period];
				break;
			}
		}

		const periodLabels = { daily: 'Day', weekly: 'Week', monthly: 'Month', onetime: 'One-Time', lifetime: 'Lifetime' };
		const tabs = [];
		const allOptions = [];

		tabOrder.forEach((period) => {
			if (pricing[period] !== undefined) {
				const isActive = period === defaultPeriod;
				tabs.push(`<button class="pricing-tab${isActive ? ' active' : ''}" data-period="${period}" data-price="${pricing[period]}">${periodLabels[period]}</button>`);
				allOptions.push({ period, label: periodLabels[period], price: pricing[period], isActive });
			}
		});

		const defaultLabel = allOptions.find((o) => o.period === defaultPeriod)?.label || 'Select';

		return {
			defaultPeriod,
			defaultPrice,
			html: `
				<div class="pricing-section">
					<div class="pricing-tabs" data-product-id="${p.id}">
						${tabs.join('')}
					</div>
					<div class="pricing-selector-mobile" data-product-id="${p.id}">
						<button class="pricing-selector-btn" data-product-id="${p.id}" type="button">
							<span class="pricing-selector-label">${defaultLabel}</span>
							<span class="pricing-selector-price">$${defaultPrice.toFixed(2)}</span>
							<svg class="pricing-selector-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
								<path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</button>
						<div class="pricing-options-dropdown" data-product-id="${p.id}">
							${allOptions.map((opt) => `
								<button class="pricing-option${opt.isActive ? ' active' : ''}" data-period="${opt.period}" data-price="${opt.price}" data-product-id="${p.id}" type="button">
									<span class="pricing-option-label">${opt.label}</span>
									<span class="pricing-option-price">$${opt.price.toFixed(2)}</span>
								</button>
							`).join('')}
						</div>
					</div>
				</div>`
		};
	}

	function productCardHTML(p) {
		const pricingBlock = buildPricingUI(p);
		const price = pricingBlock ? pricingBlock.defaultPrice : Number(p.price || 0);
		const period = pricingBlock ? pricingBlock.defaultPeriod : null;
		const actions = `
			<div class="synapse-cheat-actions">
				${pricingBlock ? pricingBlock.html : ''}
				<div class="cheat-price-row">
					<span class="price-label">Price</span>
					<span class="p-price" data-product-id="${p.id}">$${price.toFixed(2)}</span>
				</div>
				<div class="product-actions-row">
					<button type="button" class="btn btn-details view-details touch-target" data-id="${p.id}">Details</button>
					<button type="button" class="btn btn-outline add-to-cart touch-target" data-id="${p.id}"${period ? ` data-period="${period}" data-price="${price}"` : ''}>Add to cart</button>
				</div>
			</div>`;
		return chrome?.cheatCardHtml
			? chrome.cheatCardHtml(p, { bodyHtml: actions })
			: `<article class="product-frame" data-id="${p.id}">${p.title}</article>`;
	}

	function renderProducts(list) {
		productGrid.className = 'synapse-listings-grid';
		productGrid.innerHTML = list.length
			? list.map(productCardHTML).join('')
			: '<p class="synapse-empty" style="grid-column:1/-1">No products match your filters.</p>';
	}

	function renderFeatured() {
		if (!featuredGrid || !featuredStrip) return;
		if (activeTab !== 'cheats' || getCategoryFromURL()) {
			featuredStrip.hidden = true;
			return;
		}
		const featured = PRODUCTS.filter((p) => p.featured && p.catalog === 'cheats').slice(0, 4);
		if (!featured.length) {
			featuredStrip.hidden = true;
			return;
		}
		featuredStrip.hidden = false;
		featuredGrid.className = 'synapse-listings-grid';
		featuredGrid.innerHTML = featured.map(productCardHTML).join('');
	}

	function renderShopFilters(categories) {
		if (!shopFilters) return;
		const cat = getCategoryFromURL();
		if (!cat) {
			shopFilters.hidden = true;
			shopFilters.innerHTML = '';
			return;
		}
		shopFilters.hidden = false;
		shopFilters.innerHTML = categories.map((c) => {
			const name = CATEGORY_NAMES[c] || c;
			const active = cat === c ? ' active' : '';
			return `<a href="${shopUrl(activeTab, c)}" class="synapse-filter-btn${active}">${name}</a>`;
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
			{ id: 'all', label: 'All' },
			{ id: 'internal', label: 'Internal' },
			{ id: 'external', label: 'External' },
			{ id: 'private', label: 'Private' },
			{ id: 'serials', label: 'Serials' }
		];
		tierChips.style.display = 'flex';
		tierChips.innerHTML = tiers.map((t) => `
			<button type="button" class="synapse-filter-btn${activeTier === t.id ? ' active' : ''}" data-tier="${t.id}">${t.label}</button>
		`).join('');
	}

	function filteredProducts() {
		const q = getSearchQuery().toLowerCase();
		const cat = getCategoryFromURL();
		const tabProducts = productsForTab(activeTab);
		return tabProducts.filter((p) => {
			const matchCat = !cat || p.category === cat;
			const matchTier = activeTab !== 'cheats' || activeTier === 'all' || p.tier === activeTier;
			const matchText = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
			return matchCat && matchTier && matchText;
		});
	}

	function showCategoryView(category) {
		activeTab = CHEAT_CATEGORIES.has(category) ? 'cheats' : 'services';
		const filtered = productsForTab(activeTab).filter((p) => p.category === category);
		const name = CATEGORY_NAMES[category] || category;
		pageTitle.innerHTML = name;
		pageSubtitle.textContent = activeTab === 'cheats'
			? `${filtered.length} cheat products · Status on each card`
			: `${filtered.length} services · Instant delivery`;
		if (breadcrumbCurrent) breadcrumbCurrent.textContent = name;
		backLink.style.display = 'inline-block';
		backLink.href = shopUrl(activeTab);
		backLink.textContent = activeTab === 'cheats' ? '← All cheats' : '← All services';
		if (featuredStrip) featuredStrip.hidden = true;
		categoryGrid.style.display = 'none';
		productGrid.style.display = 'grid';
		renderCatalogTabs();
		renderTierChips();
		renderShopFilters(tabCategories(activeTab));
		applyFilters();
	}

	function showMainView() {
		activeTab = getTabFromURL();
		const categories = tabCategories(activeTab);
		const count = productsForTab(activeTab).length;

		if (activeTab === 'cheats') {
			pageTitle.innerHTML = 'Gaming <span class="synapse-hero-gradient">Cheats</span>';
			pageSubtitle.textContent = `${count} products across ${categories.length} games · Pick a category to browse`;
		} else {
			pageTitle.textContent = 'Services';
			pageSubtitle.textContent = `${count} social growth & setup services · TikTok, Facebook, and more`;
		}
		if (breadcrumbCurrent) breadcrumbCurrent.textContent = activeTab === 'cheats' ? 'Cheats' : 'Services';

		backLink.style.display = 'none';
		categoryGrid.style.display = 'grid';
		productGrid.style.display = 'none';
		activeTier = 'all';
		const urlQ = getParams().get('q');
		if (urlQ) syncSearchInputs(urlQ);
		renderCatalogTabs();
		renderFeatured();
		renderCategories(categories);
		renderShopFilters(categories);
		renderTierChips();
	}

	function applyFilters() {
		renderProducts(filteredProducts());
	}

	function openProductModal(id) {
		const p = PRODUCTS.find((x) => x.id === id);
		if (!p || !productModal) return;

		const fallback = 'assets/shop/fallback.svg';
		const img = p.image || (typeof window.GL_resolveProductImageUrl === 'function'
			? window.GL_resolveProductImageUrl(p)
			: 'assets/shop/fallback.svg');
		const pricingBlock = buildPricingUI(p);
		const price = pricingBlock ? pricingBlock.defaultPrice : Number(p.price || 0);
		const period = pricingBlock ? pricingBlock.defaultPeriod : null;
		const isCheat = p.catalog === 'cheats';

		productModal.querySelector('.modal-hero img').src = img;
		productModal.querySelector('.modal-hero img').onerror = function () {
			this.onerror = null;
			this.src = fallback;
		};
		productModal.querySelector('.modal-meta h2').textContent = p.title;
		productModal.querySelector('.modal-desc').textContent = p.desc;
		productModal.querySelector('.modal-badges').innerHTML = `${statusBadge(p.status)}${isCheat ? tierBadge(p.tier) : ''}`;
		productModal.querySelector('.feature-grid').innerHTML = (p.features.length ? p.features : ['Instant delivery', 'Email support'])
			.map((f) => `<div class="feature-item">${f}</div>`).join('');

		const pricingEl = productModal.querySelector('.modal-pricing');
		if (pricingBlock) {
			pricingEl.innerHTML = pricingBlock.html + `
				<div class="p-footer" style="border-top:none;padding-top:12px">
					<div class="price-display">
						<span class="price-label">From:</span>
						<span class="p-price modal-price">$${price.toFixed(2)}</span>
					</div>
					<button class="btn btn-primary add-to-cart modal-add" data-id="${p.id}"${period ? ` data-period="${period}" data-price="${price}"` : ''}>Add to cart</button>
				</div>`;
		} else {
			pricingEl.innerHTML = `
				<div class="p-footer" style="border-top:none;padding-top:12px">
					<div class="price-display">
						<span class="price-label">Price:</span>
						<span class="p-price">$${price.toFixed(2)}</span>
					</div>
					<button class="btn btn-primary add-to-cart modal-add" data-id="${p.id}">Add to cart</button>
				</div>`;
		}

		productModal.hidden = false;
		document.body.classList.add('modal-open');
	}

	function closeProductModal() {
		if (!productModal) return;
		productModal.hidden = true;
		document.body.classList.remove('modal-open');
	}

	function useCatalog(data) {
		if (!data || !Array.isArray(data.products)) {
			if (categoryGrid) categoryGrid.innerHTML = '<p class="synapse-empty">Could not load catalog.</p>';
			return;
		}
		PRODUCTS = data.products.map(normalizeProduct);
		const category = getCategoryFromURL();
		if (category) showCategoryView(category);
		else showMainView();
	}

	function loadCatalog() {
		if (categoryGrid) {
			categoryGrid.innerHTML = '<p class="synapse-empty" style="grid-column:1/-1">Loading cheats…</p>';
			categoryGrid.style.display = 'grid';
		}
		return fetch('data/products.json', { cache: 'no-store' })
			.then((r) => { if (!r.ok) throw new Error('catalog'); return r.json(); })
			.then(useCatalog)
			.catch(() => {
				if (categoryGrid) {
					categoryGrid.innerHTML = '<p class="synapse-empty" style="grid-column:1/-1">Could not load catalog. Please refresh.</p>';
				}
				if (productGrid) productGrid.innerHTML = '';
			});
	}

	// Cart
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
	let cartTriggerEl;

	function showToast(msg) {
		if (!cartToast) return;
		cartToast.textContent = msg;
		cartToast.classList.add('show');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => cartToast.classList.remove('show'), 2200);
	}

	function goCheckout() {
		if (GLCart.count() === 0) {
			showToast('Add items before checkout');
			return;
		}
		window.location.href = 'checkout.html';
	}

	function openCart() {
		cartTriggerEl = document.activeElement;
		drawer.setAttribute('aria-hidden', 'false');
		drawerBackdrop.hidden = false;
		document.body.classList.add('cart-open');
		if (cartPayBar) cartPayBar.hidden = false;
		drawerClose?.focus();
	}

	function closeCart() {
		drawer.setAttribute('aria-hidden', 'true');
		drawerBackdrop.hidden = true;
		document.body.classList.remove('cart-open');
		if (cartPayBar) cartPayBar.hidden = true;
		if (cartTriggerEl?.focus) cartTriggerEl.focus();
	}

	function updateCartUI() {
		const cart = GLCart.get();
		if (!cart.length) {
			cartItemsEl.innerHTML = `
				<div class="cart-empty">
					<p>Your cart is empty.</p>
					<button type="button" class="btn btn-outline" id="cart-browse-btn">Browse products</button>
				</div>`;
			document.getElementById('cart-browse-btn')?.addEventListener('click', closeCart);
		} else {
			cartItemsEl.innerHTML = cart.map((item) => {
				const cid = item.cartId || item.id;
				const icon = item.icon || 'assets/icons/bolt.svg';
				const line = (item.price * item.qty).toFixed(2);
				return `
				<div class="cart-item">
					<div class="ci-left">
						<img class="cart-thumb" src="${icon}" alt="" width="44" height="44" decoding="async"/>
						<div>
							<strong>${item.title}</strong>
							<p class="muted">$${item.price.toFixed(2)} × ${item.qty}</p>
							<span class="line-total">$${line}</span>
						</div>
					</div>
					<div class="ci-right">
						<button type="button" class="icon-btn" data-action="dec" data-cart-id="${cid}" aria-label="Decrease">−</button>
						<button type="button" class="icon-btn" data-action="inc" data-cart-id="${cid}" aria-label="Increase">+</button>
						<button type="button" class="icon-btn" data-action="remove" data-cart-id="${cid}" aria-label="Remove">✕</button>
					</div>
				</div>`;
			}).join('');
		}

		const total = GLCart.total(cart);
		const count = GLCart.count(cart);
		cartTotalEl.textContent = `$${total.toFixed(2)}`;
		cartCountEl.textContent = String(count);
		const dockCount = document.getElementById('dock-cart-count');
		if (dockCount) dockCount.textContent = String(count);

		[checkoutBtn, checkoutBtnFixed].forEach((btn) => {
			if (!btn) return;
			const empty = count === 0;
			btn.disabled = empty;
			btn.textContent = empty ? 'Add items to checkout' : `Proceed to Checkout — $${total.toFixed(2)}`;
		});
	}

	function addToCart(id, period = null, price = null) {
		const prod = PRODUCTS.find((p) => p.id === id);
		if (!prod) return;
		GLCart.add(prod, period, price ? parseFloat(price) : null);
		updateCartUI();
		openCart();
		showToast(`${prod.title} added to cart`);
		closeProductModal();
	}

	function updateMobileSelector(productId, period, price) {
		const selector = document.querySelector(`.pricing-selector-mobile[data-product-id="${productId}"]`);
		if (!selector) return;
		const labelEl = selector.querySelector('.pricing-selector-label');
		const priceEl = selector.querySelector('.pricing-selector-price');
		const periodLabels = { daily: 'Day', weekly: 'Week', monthly: 'Month', onetime: 'One-Time', lifetime: 'Lifetime' };
		if (labelEl) labelEl.textContent = periodLabels[period] || period;
		if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
		selector.querySelectorAll('.pricing-option').forEach((opt) => {
			opt.classList.toggle('active', opt.getAttribute('data-period') === period);
		});
	}

	function handlePricingTab(tab) {
		const tabs = tab.closest('.pricing-tabs');
		if (!tabs) return;
		const productId = tabs.getAttribute('data-product-id');
		const period = tab.getAttribute('data-period');
		const price = parseFloat(tab.getAttribute('data-price'));
		tabs.querySelectorAll('.pricing-tab').forEach((t) => t.classList.remove('active'));
		tab.classList.add('active');
		const scope = tab.closest('.synapse-cheat-wrap, .product-frame, .product-modal-panel') || document;
		const priceEl = scope.querySelector(`.p-price[data-product-id="${productId}"], .modal-price`);
		if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
		const addBtn = scope.querySelector(`.add-to-cart[data-id="${productId}"]`);
		if (addBtn) {
			addBtn.setAttribute('data-period', period);
			addBtn.setAttribute('data-price', price);
		}
		updateMobileSelector(productId, period, price);
	}

	function bindGridEvents(grid) {
		if (!grid) return;
		grid.addEventListener('click', (e) => {
			const details = e.target.closest('.view-details');
			if (details) { openProductModal(details.getAttribute('data-id')); return; }
			const add = e.target.closest('.add-to-cart');
			if (add) { addToCart(add.getAttribute('data-id'), add.getAttribute('data-period'), add.getAttribute('data-price')); return; }
			const tab = e.target.closest('.pricing-tab');
			if (tab) handlePricingTab(tab);
			const btn = e.target.closest('.pricing-selector-btn');
			if (btn) {
				e.stopPropagation();
				const productId = btn.getAttribute('data-product-id');
				const selector = document.querySelector(`.pricing-selector-mobile[data-product-id="${productId}"]`);
				document.querySelectorAll('.pricing-selector-mobile').forEach((s) => { if (s !== selector) s.classList.remove('open'); });
				selector?.classList.toggle('open');
				return;
			}
			const option = e.target.closest('.pricing-option');
			if (option) {
				e.stopPropagation();
				const productId = option.getAttribute('data-product-id');
				const period = option.getAttribute('data-period');
				const price = parseFloat(option.getAttribute('data-price'));
				updateMobileSelector(productId, period, price);
				const scope = option.closest('.synapse-cheat-wrap, .product-frame, .product-modal-panel') || document;
				const priceEl = scope.querySelector(`.p-price[data-product-id="${productId}"], .modal-price`);
				if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
				const addBtn = scope.querySelector(`.add-to-cart[data-id="${productId}"]`);
				if (addBtn) { addBtn.setAttribute('data-period', period); addBtn.setAttribute('data-price', price); }
				const tabs = document.querySelector(`.pricing-tabs[data-product-id="${productId}"]`);
				tabs?.querySelectorAll('.pricing-tab').forEach((t) => t.classList.toggle('active', t.getAttribute('data-period') === period));
				option.closest('.pricing-selector-mobile')?.classList.remove('open');
			}
		});
	}

	searchEl?.addEventListener('input', applyFilters);
	headerSearchEl?.addEventListener('input', () => {
		if (searchEl) searchEl.value = headerSearchEl.value;
		applyFilters();
	});

	catalogTabs?.addEventListener('click', (e) => {
		const tab = e.target.closest('[data-tab]');
		if (!tab) return;
		window.location.href = shopUrl(tab.getAttribute('data-tab'));
	});

	tierChips?.addEventListener('click', (e) => {
		const chip = e.target.closest('[data-tier]');
		if (!chip) return;
		activeTier = chip.getAttribute('data-tier');
		renderTierChips();
		applyFilters();
	});

	productModal?.addEventListener('click', (e) => {
		if (e.target.matches('[data-close-modal], .product-modal-backdrop')) closeProductModal();
		if (e.target.closest('.pricing-tab')) handlePricingTab(e.target.closest('.pricing-tab'));
		if (e.target.closest('.add-to-cart')) {
			const btn = e.target.closest('.add-to-cart');
			addToCart(btn.getAttribute('data-id'), btn.getAttribute('data-period'), btn.getAttribute('data-price'));
		}
	});

	document.addEventListener('click', (e) => {
		if (!e.target.closest('.pricing-selector-mobile')) {
			document.querySelectorAll('.pricing-selector-mobile').forEach((s) => s.classList.remove('open'));
		}
	});

	loadCatalog();

	bindGridEvents(productGrid);
	bindGridEvents(featuredGrid);
	window.addEventListener('gl-cart-updated', updateCartUI);
	drawerBtn?.addEventListener('click', openCart);
	document.getElementById('dock-cart-btn')?.addEventListener('click', openCart);
	drawerClose?.addEventListener('click', closeCart);
	drawerBackdrop?.addEventListener('click', closeCart);
	cartItemsEl?.addEventListener('click', (e) => {
		const btn = e.target.closest('button');
		if (!btn) return;
		const cartId = btn.getAttribute('data-cart-id');
		const action = btn.getAttribute('data-action');
		if (!cartId || !action) return;
		if (action === 'inc') GLCart.inc(cartId);
		else if (action === 'dec') GLCart.dec(cartId);
		else if (action === 'remove') GLCart.remove(cartId);
		updateCartUI();
	});
	checkoutBtn?.addEventListener('click', goCheckout);
	checkoutBtnFixed?.addEventListener('click', goCheckout);
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			if (!productModal?.hidden) closeProductModal();
			else if (drawer?.getAttribute('aria-hidden') === 'false') closeCart();
		}
	});
	updateCartUI();
})();
