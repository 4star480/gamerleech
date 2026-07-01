/**
 * GamerLeech checkout — Synapse-style crypto payment (GamerLeech wallet addresses)
 */
(function () {
	'use strict';

	const ORDER_KEY = 'gl_checkout_order_id';
	const cfg = () => window.GL_CONFIG || {};
	const v = () => cfg().assetVersion || '10';

	let cart = [];
	let selectedCrypto = null;
	let currentTotal = 0;
	let pendingOrderId = null;

	function esc(str) {
		return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	}

	function assetUrl(path) {
		if (!path) return '';
		const enc = path.split('/').map((s) => encodeURIComponent(s)).join('/');
		return `${enc}?v=${encodeURIComponent(v())}`;
	}

	function wallets() {
		return cfg().cryptoWallets || {};
	}

	function primaryIds() {
		return cfg().cryptoPrimary || ['bitcoin', 'ethereum', 'usdt-trc20', 'usdt-eth'];
	}

	function extendedIds() {
		return cfg().cryptoExtended || [];
	}

	function getOrCreateOrderId() {
		let id = sessionStorage.getItem(ORDER_KEY);
		if (!id) {
			id = GLCart.createOrderId();
			sessionStorage.setItem(ORDER_KEY, id);
		}
		return id;
	}

	function clearCheckoutSession() {
		sessionStorage.removeItem(ORDER_KEY);
	}

	function isEmailReady() {
		const ej = cfg().emailjs || {};
		return typeof emailjs !== 'undefined' && ej.publicKey && ej.serviceId && ej.templatePayment;
	}

	function cryptoOption(id) {
		const c = wallets()[id];
		if (!c) return '';
		return `
			<label class="synapse-checkout-crypto-opt">
				<input type="radio" name="crypto" value="${id}"${selectedCrypto === id ? ' checked' : ''}>
				<span class="synapse-checkout-crypto-label">${esc(c.symbol)} ${esc(c.name)}</span>
				${c.network ? `<span class="synapse-checkout-crypto-net">${esc(c.network)}</span>` : ''}
			</label>`;
	}

	function paymentPanel(id) {
		const c = wallets()[id];
		if (!c) return '';
		const barcode = c.barcode ? `<img class="synapse-checkout-barcode" src="${assetUrl(c.barcode)}" alt="Payment QR" width="200" height="200">` : '';
		return `
			<div class="synapse-checkout-paypanel" id="paypanel-${id}" hidden>
				<div class="synapse-checkout-amount-box">
					<p class="synapse-checkout-amount-label">Send exactly</p>
					<p class="synapse-checkout-amount-value">$${currentTotal.toFixed(2)} USD</p>
					<p class="synapse-checkout-amount-hint">in ${esc(c.symbol)}${c.network ? ` · ${esc(c.network)}` : ''}</p>
				</div>
				<div class="synapse-checkout-wallet">
					<p class="synapse-checkout-field-label">Wallet address</p>
					<div class="synapse-checkout-copy-row">
						<code class="synapse-checkout-address" id="addr-${id}">${esc(c.address)}</code>
						<button type="button" class="synapse-btn-outline synapse-checkout-copy" data-copy="${id}">Copy</button>
					</div>
					${barcode ? `<div class="synapse-checkout-qr">${barcode}</div>` : `<div class="synapse-checkout-qr"><canvas class="qr-dynamic" data-qr="${esc(c.address)}" aria-label="QR code"></canvas></div>`}
				</div>
				<p class="synapse-checkout-warning">Send only <strong>${esc(c.symbol)}</strong> on the correct network. Wrong network = lost funds.</p>
			</div>`;
	}

	function renderEmpty() {
		const el = document.getElementById('checkout-content');
		if (!el) return;
		el.innerHTML = `
			<div class="synapse-checkout-empty">
				<span class="synapse-checkout-empty-icon">🛒</span>
				<h2>Your cart is empty</h2>
				<p>Add cheat products from the shop, then return here to pay with crypto.</p>
				<a href="shop.html" class="synapse-btn-primary">Browse cheats</a>
			</div>`;
		document.getElementById('checkout-sticky-pay')?.remove();
	}

	function renderCheckout() {
		cart = GLCart.get();
		currentTotal = GLCart.total(cart);
		pendingOrderId = getOrCreateOrderId();

		if (!cart.length) {
			renderEmpty();
			return;
		}

		if (!selectedCrypto) selectedCrypto = primaryIds()[0];

		const el = document.getElementById('checkout-content');
		if (!el) return;

		const allIds = [...primaryIds(), ...extendedIds()].filter((id) => wallets()[id]);

		el.innerHTML = `
			<nav class="synapse-breadcrumb" aria-label="Breadcrumb">
				<a href="shop.html" class="synapse-link">Cheats</a>
				<span aria-hidden="true">/</span>
				<span>Checkout</span>
			</nav>
			<h1 class="synapse-checkout-title">Secure checkout</h1>
			<p class="synapse-checkout-sub">Pay with crypto — keys delivered to your email after confirmation.</p>

			<div class="synapse-checkout-layout">
				<div class="synapse-checkout-main">
					<section class="synapse-checkout-card">
						<h2>Order summary</h2>
						<div class="synapse-checkout-order-id">
							<span>Order ID</span>
							<strong>${esc(pendingOrderId)}</strong>
						</div>
						<ul class="synapse-checkout-items">
							${cart.map((item) => `
								<li>
									<div>
										<strong>${esc(item.title)}</strong>
										<span>Qty ${item.qty}${item.period ? ` · ${item.period}` : ''}</span>
									</div>
									<strong>$${(item.price * item.qty).toFixed(2)}</strong>
								</li>`).join('')}
						</ul>
						<div class="synapse-checkout-total"><span>Total</span><strong>$${currentTotal.toFixed(2)}</strong></div>
					</section>

					<section class="synapse-checkout-card">
						<h2>Payment method</h2>
						<p class="synapse-checkout-lead">Select cryptocurrency — you'll get a wallet address and exact USD amount.</p>
						<fieldset class="synapse-checkout-crypto-grid">
							<legend class="sr-only">Cryptocurrency</legend>
							${allIds.map(cryptoOption).join('')}
						</fieldset>
						${allIds.map(paymentPanel).join('')}
					</section>
				</div>

				<aside class="synapse-checkout-sidebar">
					<div class="synapse-checkout-card synapse-checkout-sidebar-card">
						<p class="synapse-checkout-sidebar-total">$${currentTotal.toFixed(2)}</p>
						<p class="synapse-checkout-sidebar-label">Payable amount</p>
						<label class="synapse-checkout-field" for="customer-email">
							<span>Email for delivery</span>
							<input type="email" id="customer-email" placeholder="you@example.com" autocomplete="email" required>
						</label>
						<label class="synapse-checkout-terms">
							<input type="checkbox" id="terms-checkbox">
							<span>I accept the <a href="terms.html" target="_blank" rel="noopener">Terms</a> and <a href="refund.html" target="_blank" rel="noopener">Refund Policy</a></span>
						</label>
						<button type="button" class="synapse-btn-primary synapse-checkout-submit" id="pay-now-btn" disabled>I've sent the payment</button>
						<p class="synapse-checkout-note">After sending crypto, tap the button above. We verify payment and email your key.</p>
					</div>
				</aside>
			</div>

			<div class="synapse-checkout-sticky mobile-above-tab-bar" id="checkout-sticky-pay">
				<div>
					<strong>$${currentTotal.toFixed(2)}</strong>
					<span>Total due</span>
				</div>
				<button type="button" class="synapse-btn-primary synapse-checkout-submit" id="pay-now-btn-mobile" disabled>I've sent payment</button>
			</div>`;

		bindEvents();
		showPaymentPanel(selectedCrypto);
		renderDynamicQr();
	}

	function renderDynamicQr() {
		if (typeof QRCode === 'undefined') return;
		document.querySelectorAll('canvas.qr-dynamic[data-qr]').forEach((canvas) => {
			const addr = canvas.dataset.qr;
			if (!addr) return;
			QRCode.toCanvas(canvas, addr, { width: 180, margin: 1 }, (err) => {
				if (err) canvas.closest('.synapse-checkout-qr')?.remove();
			});
		});
	}

	function showPaymentPanel(id) {
		selectedCrypto = id;
		document.querySelectorAll('.synapse-checkout-paypanel').forEach((p) => { p.hidden = true; });
		const panel = document.getElementById(`paypanel-${id}`);
		if (panel) panel.hidden = false;
		updatePayButton();
	}

	function bindEvents() {
		document.querySelectorAll('input[name="crypto"]').forEach((input) => {
			input.addEventListener('change', () => showPaymentPanel(input.value));
		});
		document.querySelectorAll('[data-copy]').forEach((btn) => {
			btn.addEventListener('click', () => {
				const c = wallets()[btn.dataset.copy];
				if (!c?.address) return;
				navigator.clipboard.writeText(c.address).then(() => {
					btn.textContent = 'Copied!';
					setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
				}).catch(() => alert('Copy failed — select the address manually.'));
			});
		});
		document.getElementById('terms-checkbox')?.addEventListener('change', updatePayButton);
		document.getElementById('customer-email')?.addEventListener('input', updatePayButton);
		document.getElementById('pay-now-btn')?.addEventListener('click', processPayment);
		document.getElementById('pay-now-btn-mobile')?.addEventListener('click', processPayment);
	}

	function updatePayButton() {
		const ok = document.getElementById('terms-checkbox')?.checked;
		const email = document.getElementById('customer-email')?.value.trim() || '';
		const validEmail = email.includes('@') && email.includes('.');
		const enabled = !!(ok && selectedCrypto && validEmail);
		document.querySelectorAll('.synapse-checkout-submit').forEach((b) => { b.disabled = !enabled; });
	}

	function showSuccess(orderId, customerEmail, paymentMethod, emailNote) {
		const el = document.getElementById('checkout-content');
		if (!el) return;
		el.innerHTML = `
			<div class="synapse-checkout-success">
				<span class="synapse-checkout-success-icon">✓</span>
				<h2>Payment submitted</h2>
				<p>Order <strong>${esc(orderId)}</strong> received. Once your crypto payment confirms, we deliver to <strong>${esc(customerEmail)}</strong>.</p>
				<p class="synapse-checkout-success-meta">Method: ${esc(paymentMethod)} · Total: $${currentTotal.toFixed(2)}</p>
				${emailNote ? `<p class="synapse-checkout-warn">${esc(emailNote)}</p>` : ''}
				<div class="synapse-checkout-success-actions">
					<a href="orders.html" class="synapse-btn-primary">View orders</a>
					<a href="shop.html" class="synapse-btn-outline">Continue shopping</a>
				</div>
			</div>`;
		document.getElementById('checkout-sticky-pay')?.remove();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	async function processPayment() {
		if (!selectedCrypto || !cart.length) return;
		const email = document.getElementById('customer-email')?.value.trim();
		if (!email || !email.includes('@')) return;

		const btns = document.querySelectorAll('.synapse-checkout-submit');
		btns.forEach((b) => { b.disabled = true; b.textContent = 'Submitting…'; });

		const orderId = pendingOrderId || GLCart.createOrderId();
		const crypto = wallets()[selectedCrypto];
		const paymentMethod = `${crypto.name} (${crypto.symbol})${crypto.network ? ` · ${crypto.network}` : ''}`;

		GLCart.saveOrder({
			id: orderId,
			date: new Date().toISOString(),
			items: cart,
			total: currentTotal,
			cryptoType: selectedCrypto,
			address: crypto.address,
			customerEmail: email,
			status: 'pending'
		});

		const cartLines = cart.map((i) => `- ${i.title} ×${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join('\n');
		let emailNote = '';

		if (isEmailReady()) {
			const ej = cfg().emailjs;
			const businessEmail = cfg().email || 'gamerleech2@gmail.com';
			const base = {
				order_id: orderId,
				total_amount: `$${currentTotal.toFixed(2)}`,
				payment_method: paymentMethod,
				wallet_address: crypto.address,
				cart_items: cartLines,
				customer_email: email
			};
			try {
				await emailjs.send(ej.serviceId, ej.templatePayment, {
					...base,
					to_email: businessEmail,
					reply_to: email,
					from_name: 'GamerLeech',
					from_email: email,
					message: `New order ${orderId}\n${cartLines}\n${paymentMethod}\n${crypto.address}`
				});
			} catch (e) {
				console.warn('Business email failed', e);
				emailNote = 'Order saved — our notification email may be delayed. Save your order ID.';
			}
			try {
				await emailjs.send(ej.serviceId, ej.templateConfirmation, {
					...base,
					to_email: email,
					from_name: 'GamerLeech',
					reply_to: businessEmail,
					message: `Thanks for order ${orderId}. We will deliver after payment confirms.`
				});
			} catch (e) {
				console.warn('Customer email failed', e);
				if (!emailNote) emailNote = 'Order saved — confirmation email may be delayed. Save your order ID.';
			}
		}

		GLCart.clear();
		clearCheckoutSession();
		showSuccess(orderId, email, paymentMethod, emailNote);
	}

	document.addEventListener('DOMContentLoaded', renderCheckout);
	window.addEventListener('pageshow', (e) => {
		if (e.persisted) renderCheckout();
	});
})();
