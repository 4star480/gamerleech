/** GamerLeech product detail — Synapse listing-style page */
(function () {
	'use strict';

	const CATEGORY_NAMES = {
		'call-of-duty': 'Call of Duty', fivem: 'FiveM', valorant: 'Valorant', roblox: 'Roblox',
		fortnite: 'Fortnite', 'rainbow-six': 'Rainbow Six', gta5: 'GTA V', cs2: 'CS2', apex: 'Apex Legends'
	};

	let product = null;
	let selectedPeriod = null;
	let selectedPrice = 0;

	const main = document.getElementById('product-main');
	const sticky = document.getElementById('product-sticky');
	const stickyPrice = document.getElementById('sticky-price');
	const stickyLabel = document.getElementById('sticky-label');
	const stickyBuy = document.getElementById('sticky-buy');

	function esc(s) {
		return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	}

	function periodLabels() {
		return { daily: 'Day', weekly: 'Week', monthly: 'Month', onetime: 'One-Time', lifetime: 'Lifetime' };
	}

	function defaultPricing(p) {
		const pr = p.pricing;
		if (!pr) return { period: null, price: Number(p.price || 0) };
		for (const k of ['weekly', 'monthly', 'lifetime', 'daily', 'onetime']) {
			if (pr[k] !== undefined) return { period: k, price: Number(pr[k]) };
		}
		return { period: null, price: Number(p.price || 0) };
	}

	function pricingTabsHtml(p) {
		const pr = p.pricing;
		if (!pr) return '';
		const labels = periodLabels();
		const def = defaultPricing(p);
		const tabs = Object.keys(labels).filter((k) => pr[k] !== undefined).map((k) =>
			`<button type="button" class="synapse-pricing-tab${k === def.period ? ' active' : ''}" data-period="${k}" data-price="${pr[k]}">${labels[k]}</button>`
		).join('');
		return tabs ? `<div class="synapse-pricing-tabs">${tabs}</div>` : '';
	}

	function featuresHtml(p) {
		const feats = p.features?.length ? p.features : ['Instant key delivery', 'Regular updates', 'Email support'];
		return feats.map((f) => `<div class="synapse-feature-chip">${esc(f)}</div>`).join('');
	}

	function updateSelection(period, price) {
		selectedPeriod = period;
		selectedPrice = price;
		if (stickyPrice) stickyPrice.textContent = `$${price.toFixed(2)}`;
		if (stickyLabel) stickyLabel.textContent = period ? (periodLabels()[period] || period) : 'Price';
		document.querySelectorAll('.synapse-product-price-display strong').forEach((el) => {
			el.textContent = `$${price.toFixed(2)}`;
		});
		document.querySelectorAll('.synapse-pricing-tab').forEach((t) => {
			t.classList.toggle('active', t.dataset.period === period);
		});
	}

	function render(p) {
		product = p;
		const img = window.GL_resolveProductImageUrl?.(p) || p.image || 'assets/shop/fallback.svg';
		const def = defaultPricing(p);
		selectedPeriod = def.period;
		selectedPrice = def.price;
		const catLabel = CATEGORY_NAMES[p.category] || p.category;
		document.title = `${p.title} — GamerLeech`;

		main.innerHTML = `
			<div class="synapse-section synapse-product-layout">
				<nav class="synapse-breadcrumb">
					<a href="shop.html" class="synapse-link">Cheats</a>
					<span>/</span>
					<a href="shop.html?category=${encodeURIComponent(p.category)}" class="synapse-link">${esc(catLabel)}</a>
					<span>/</span>
					<span>${esc(p.title.length > 40 ? p.title.slice(0, 38) + '…' : p.title)}</span>
				</nav>

				<div class="synapse-product-grid">
					<div class="synapse-product-main">
						<article class="synapse-product-card">
							<div class="synapse-product-hero">
								<img src="${img}" alt="${esc(p.title)}" onerror="this.onerror=null;this.src='assets/shop/fallback.svg'">
								${p.featured ? '<span class="synapse-badge-hot">Hot</span>' : ''}
								${p.status === 'undetected' ? '<span class="synapse-badge-instant">Undetected</span>' : ''}
							</div>
							<div class="synapse-product-body">
								<div class="synapse-listing-top">
									<span>⚡ ${esc(catLabel)}</span>
									<span class="synapse-cat-badge">Cheats</span>
								</div>
								<h1>${esc(p.title)}</h1>
								<p class="synapse-product-desc">${esc(p.desc || 'Premium undetected build with instant crypto checkout.')}</p>
							</div>
						</article>
						<section class="synapse-product-card synapse-product-features">
							<h2>Features</h2>
							<div class="synapse-feature-grid">${featuresHtml(p)}</div>
						</section>
					</div>

					<aside class="synapse-product-sidebar">
						<div class="synapse-product-card synapse-product-buy">
							<p class="synapse-product-price-display"><strong>$${def.price.toFixed(2)}</strong></p>
							${pricingTabsHtml(p)}
							<div class="synapse-product-seller">
								<span class="synapse-avatar" style="background:#7e22ce">G</span>
								<div>
									<div class="synapse-seller-name">GamerLeech</div>
									<div class="synapse-stars">★★★★★ · Verified store</div>
								</div>
							</div>
							<dl class="synapse-product-meta">
								<div><dt>Delivery</dt><dd>Instant key via email</dd></div>
								<div><dt>Payment</dt><dd>Crypto checkout</dd></div>
								<div><dt>Status</dt><dd class="synapse-text-success">${esc(p.status || 'Available')}</dd></div>
							</dl>
							<button type="button" class="synapse-btn-primary synapse-product-add" id="add-cart-btn">Add to cart</button>
							<button type="button" class="synapse-btn-outline synapse-product-buy-now" id="buy-now-btn">Buy now — checkout</button>
						</div>
					</aside>
				</div>
			</div>`;

		if (sticky) sticky.hidden = false;
		updateSelection(def.period, def.price);

		main.querySelectorAll('.synapse-pricing-tab').forEach((tab) => {
			tab.addEventListener('click', () => updateSelection(tab.dataset.period, parseFloat(tab.dataset.price)));
		});
		document.getElementById('add-cart-btn')?.addEventListener('click', addToCart);
		document.getElementById('buy-now-btn')?.addEventListener('click', buyNow);
		stickyBuy?.addEventListener('click', addToCart);
	}

	function addToCart() {
		if (!product) return;
		GLCart.add(product, selectedPeriod, selectedPrice);
		updateCartUI();
		openCart();
	}

	function buyNow() {
		if (!product) return;
		GLCart.add(product, selectedPeriod, selectedPrice);
		window.location.href = 'checkout.html';
	}

	function openCart() {
		document.getElementById('cart-drawer')?.setAttribute('aria-hidden', 'false');
		const bd = document.getElementById('cart-backdrop');
		if (bd) bd.hidden = false;
		document.body.classList.add('cart-open');
	}

	function closeCart() {
		document.getElementById('cart-drawer')?.setAttribute('aria-hidden', 'true');
		const bd = document.getElementById('cart-backdrop');
		if (bd) bd.hidden = true;
		document.body.classList.remove('cart-open');
	}

	function updateCartUI() {
		const cart = GLCart.get();
		const count = GLCart.count(cart);
		document.querySelectorAll('.cart-count').forEach((el) => { el.textContent = String(count); });
		const totalEl = document.getElementById('cart-total');
		if (totalEl) totalEl.textContent = `$${GLCart.total(cart).toFixed(2)}`;
		const itemsEl = document.getElementById('cart-items');
		if (itemsEl) {
			itemsEl.innerHTML = cart.length
				? cart.map((i) => `<div class="cart-item"><strong>${esc(i.title)}</strong> — $${(i.price * i.qty).toFixed(2)}</div>`).join('')
				: '<p class="cart-empty">Cart is empty</p>';
		}
	}

	function init() {
		const id = new URLSearchParams(location.search).get('id');
		if (!id) {
			main.innerHTML = '<div class="synapse-section"><p class="synapse-empty">Product not found. <a href="shop.html">Back to shop</a></p></div>';
			return;
		}
		fetch('data/products.json', { cache: 'no-store' })
			.then((r) => r.json())
			.then((data) => {
				const p = (data.products || []).find((x) => x.id === id);
				if (!p) {
					main.innerHTML = '<div class="synapse-section"><p class="synapse-empty">Product not found. <a href="shop.html">Back to shop</a></p></div>';
					return;
				}
				render(p);
			})
			.catch(() => {
				main.innerHTML = '<div class="synapse-section"><p class="synapse-empty">Could not load product.</p></div>';
			});

		document.getElementById('cart-button')?.addEventListener('click', openCart);
		document.getElementById('cart-close')?.addEventListener('click', closeCart);
		document.getElementById('cart-backdrop')?.addEventListener('click', closeCart);
		document.getElementById('checkout-btn')?.addEventListener('click', () => {
			if (GLCart.count()) window.location.href = 'checkout.html';
		});
		updateCartUI();
	}

	init();
})();
