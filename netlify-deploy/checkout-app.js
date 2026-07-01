/**
 * GamerLeech checkout flow
 */
(function () {
	'use strict';

	const CRYPTO_ADDRESSES = {
		'binance-pay': { name: 'Binance Pay', icon: '💳', logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png', address: 'bnb1qxy2kg9gj2gskp6e5m4kmq6g5g4n6g8k9x0z2p', barcode: null },
		bitcoin: { name: 'Bitcoin', icon: '₿', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', address: '1LrtmepWxUKXbWVMcNBHXV8WXqt29aHUWv', barcode: 'Images/barcodes/BTC.jpg' },
		'crypto-com': { name: 'Crypto.com', icon: '🟣', logo: 'https://cryptologos.cc/logos/crypto-com-cro-logo.png', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', barcode: null },
		ethereum: { name: 'Ethereum', icon: 'Ξ', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg' },
		'usdt-eth': { name: 'Tether', network: 'USDT (ETH)', icon: '₮', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg' },
		'usdt-polygon': { name: 'Tether', network: 'USDT (Polygon)', icon: '₮', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/usdt polygon.jpg' },
		'usdt-trc20': { name: 'Tether', network: 'USDT (TRC20)', icon: '₮', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png', address: 'TCwDWG1sWdke4X7AyLAUKSQFA93Hcqzb5w', barcode: 'Images/barcodes/usdt trc20.jpg' },
		usdc: { name: 'USD Coin', network: 'USDC', icon: '💵', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/eth.jpg' },
		'usdc-arbitrum': { name: 'USD Coin', network: 'USDC (Arbitrum)', icon: '💵', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/usdc arbitrum .jpg' },
		'usdc-polygon': { name: 'USD Coin', network: 'USDC (Polygon)', icon: '💵', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: '0xe26085227017e56647606c722cc4162d3926df83', barcode: 'Images/barcodes/Usdc polygon.jpg' },
		'usdc-solana': { name: 'USD Coin', network: 'USDC (Solana)', icon: '💵', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', address: '8TP6k4DHorT67LUSPrH7C34maPLzZN6MUuSdWGkW7iXc', barcode: 'Images/barcodes/usdc solana.jpg' }
	};

	const E_WALLET = ['binance-pay', 'crypto-com'];
	const CRYPTO = ['bitcoin', 'ethereum', 'usdt-eth', 'usdt-polygon', 'usdt-trc20', 'usdc', 'usdc-arbitrum', 'usdc-polygon', 'usdc-solana'];

	const ORDER_KEY = 'gl_checkout_order_id';

	let cart = [];
	let selectedCrypto = null;
	let currentTotal = 0;
	let pendingOrderId = null;

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
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
	const cfg = () => window.GL_CONFIG || {};
	const ej = () => cfg().emailjs || {};

	function isEmailReady() {
		const c = ej();
		return typeof emailjs !== 'undefined' && c.publicKey && c.serviceId && c.templatePayment && c.templateConfirmation;
	}

	function cryptoOptionHtml(id) {
		const c = CRYPTO_ADDRESSES[id];
		const icon = c.logo
			? `<img src="${c.logo}" alt="${c.name}" onerror="this.replaceWith(document.createTextNode('${c.icon}'))">`
			: c.icon;
		return `
			<button type="button" class="crypto-option" data-crypto="${id}" aria-pressed="false">
				<div class="crypto-option-icon">${icon}</div>
				<div class="crypto-option-name">${c.name}</div>
				${c.network ? `<div class="crypto-option-network">${c.network}</div>` : ''}
			</button>`;
	}

	function addressBlockHtml(id) {
		const c = CRYPTO_ADDRESSES[id];
		return `
			<div class="crypto-address" id="address-${id}" hidden>
				<div class="crypto-address-label">${c.name}${c.network ? ` (${c.network})` : ''} address</div>
				<div class="crypto-address-value" id="address-value-${id}">${c.address}</div>
				<button type="button" class="copy-btn" data-copy="${id}">Copy address</button>
				<div class="qr-code-container" id="qr-code-${id}" data-address="${escapeHtml(c.address)}" hidden>
					<canvas class="qr-dynamic" aria-label="${escapeHtml(c.name)} payment QR code"></canvas>
				</div>
			</div>`;
	}

	function renderEmpty() {
		const el = document.getElementById('checkout-content');
		if (!el) return;
		el.innerHTML = `
			<div class="checkout-empty">
				<h2>Your cart is empty</h2>
				<p class="muted">Add products from the shop before checkout.</p>
				<a href="shop.html" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Browse shop</a>
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

		const el = document.getElementById('checkout-content');
		if (!el) return;

		el.innerHTML = `
			<div class="checkout-grid">
				<div>
					<div class="checkout-card">
						<h2>Order summary</h2>
						<div style="padding:12px 14px;background:rgba(46,244,122,.08);border-radius:10px;margin-bottom:16px;border-left:3px solid var(--green)">
							<div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em">Order ID</div>
							<div style="font-family:ui-monospace,monospace;font-size:1rem;color:var(--green);font-weight:800">${escapeHtml(pendingOrderId)}</div>
						</div>
						${cart.map((item) => `
							<div class="order-item">
								<div class="order-item-info">
									<h4>${escapeHtml(item.title)}</h4>
									<p>Qty ${item.qty}${item.period ? ` · ${item.period}` : ''}</p>
								</div>
								<div class="order-item-price">$${(item.price * item.qty).toFixed(2)}</div>
							</div>`).join('')}
						<div class="order-total"><span>Total</span><strong>$${currentTotal.toFixed(2)}</strong></div>
						<p class="muted" style="font-size:0.8125rem;margin:12px 0 0"><a href="shop.html">← Edit cart in shop</a></p>
					</div>
					<div class="checkout-card" style="margin-top:24px">
						<h2>Payment method</h2>
						<div class="payment-section">
							<div class="payment-section-title">E-Wallet</div>
							<div class="crypto-options">${E_WALLET.map(cryptoOptionHtml).join('')}</div>
						</div>
						<div class="payment-section">
							<div class="payment-section-title">Cryptocurrency</div>
							<div class="crypto-options">${CRYPTO.map(cryptoOptionHtml).join('')}</div>
						</div>
						${Object.keys(CRYPTO_ADDRESSES).map(addressBlockHtml).join('')}
						<div class="payment-status" id="payment-status" hidden>
							<div class="status-icon">⏳</div>
							<div class="status-message">Awaiting payment</div>
							<div class="status-note" id="status-note"></div>
						</div>
					</div>
				</div>
				<div class="payable-amount-card">
					<div class="payable-amount checkout-card">
						<div class="payable-amount-label">Payable amount</div>
						<div class="payable-amount-value">$${currentTotal.toFixed(2)}</div>
						<div class="form-field">
							<label for="customer-email">Email for delivery</label>
							<input type="email" id="customer-email" placeholder="you@example.com" autocomplete="email" required>
						</div>
						<div class="terms-checkbox">
							<input type="checkbox" id="terms-checkbox">
							<label for="terms-checkbox">I accept the <a href="terms.html" target="_blank" rel="noopener">Terms</a> and <a href="refund.html" target="_blank" rel="noopener">Refund Policy</a></label>
						</div>
						<button type="button" class="pay-now-btn" id="pay-now-btn" disabled>I’ve sent payment</button>
						<p class="muted" style="font-size:0.75rem;margin-top:12px;line-height:1.4">Send the exact USD amount in crypto to the address shown, then confirm. Keys are delivered via email.</p>
					</div>
				</div>
			</div>
			<div class="checkout-sticky-pay" id="checkout-sticky-pay">
				<span class="sticky-total">$${currentTotal.toFixed(2)}</span>
				<button type="button" class="pay-now-btn" id="pay-now-btn-mobile" disabled>I’ve sent payment</button>
			</div>`;

		bindCheckoutEvents();
		renderQrCodes();
	}

	function renderQrCodes() {
		if (typeof QRCode === 'undefined') return;
		document.querySelectorAll('.qr-code-container[data-address]').forEach((container) => {
			const addr = container.dataset.address;
			if (!addr) return;
			const canvas = container.querySelector('canvas.qr-dynamic');
			if (!canvas) return;
			QRCode.toCanvas(canvas, addr, { width: 200, margin: 1 }, (err) => {
				if (err) container.hidden = true;
			});
		});
	}

	function bindCheckoutEvents() {
		document.querySelectorAll('.crypto-option').forEach((btn) => {
			btn.addEventListener('click', () => selectCrypto(btn.dataset.crypto));
		});
		document.querySelectorAll('[data-copy]').forEach((btn) => {
			btn.addEventListener('click', () => copyAddress(btn.dataset.copy));
		});
		document.getElementById('terms-checkbox')?.addEventListener('change', updatePayButton);
		document.getElementById('customer-email')?.addEventListener('input', updatePayButton);
		document.getElementById('pay-now-btn')?.addEventListener('click', processPayment);
		document.getElementById('pay-now-btn-mobile')?.addEventListener('click', processPayment);
	}

	function selectCrypto(cryptoId) {
		selectedCrypto = cryptoId;
		document.querySelectorAll('.crypto-option').forEach((o) => {
			const on = o.dataset.crypto === cryptoId;
			o.classList.toggle('active', on);
			o.setAttribute('aria-pressed', on ? 'true' : 'false');
		});
		document.querySelectorAll('.crypto-address').forEach((a) => { a.hidden = true; });
		document.querySelectorAll('.qr-code-container').forEach((q) => {
			q.classList.remove('active');
			q.hidden = true;
		});
		const block = document.getElementById(`address-${cryptoId}`);
		if (block) block.hidden = false;
		const qr = document.getElementById(`qr-code-${cryptoId}`);
		if (qr) {
			qr.hidden = false;
			qr.classList.add('active');
		}
		const status = document.getElementById('payment-status');
		const note = document.getElementById('status-note');
		const c = CRYPTO_ADDRESSES[cryptoId];
		if (status && note && c) {
			status.hidden = false;
			note.textContent = `Send $${currentTotal.toFixed(2)} via ${c.name}${c.network ? ` (${c.network})` : ''} to the address above.`;
		}
		updatePayButton();
	}

	function copyAddress(id) {
		const text = CRYPTO_ADDRESSES[id]?.address;
		if (!text) return;
		navigator.clipboard.writeText(text).then(() => {
			const btn = document.querySelector(`[data-copy="${id}"]`);
			if (btn) {
				const prev = btn.textContent;
				btn.textContent = 'Copied!';
				setTimeout(() => { btn.textContent = prev; }, 2000);
			}
		}).catch(() => alert('Copy failed — select and copy the address manually.'));
	}

	function updatePayButton() {
		const ok = document.getElementById('terms-checkbox')?.checked;
		const email = document.getElementById('customer-email')?.value.trim() || '';
		const validEmail = email.includes('@') && email.includes('.');
		const enabled = !!(ok && selectedCrypto && validEmail);
		['pay-now-btn', 'pay-now-btn-mobile'].forEach((id) => {
			const b = document.getElementById(id);
			if (b) b.disabled = !enabled;
		});
	}

	function showSuccess(orderId, customerEmail, paymentMethod, emailNote) {
		const el = document.getElementById('checkout-content');
		if (!el) return;
		const supportEmail = cfg().email || 'gamerleech2@gmail.com';
		el.innerHTML = `
			<div class="checkout-success">
				<h2>Payment submitted</h2>
				<p>We received your order. Once payment is confirmed, delivery goes to <strong>${escapeHtml(customerEmail)}</strong>.</p>
				<div class="order-id">${escapeHtml(orderId)}</div>
				<p class="muted">Method: ${escapeHtml(paymentMethod)}<br>Total: $${currentTotal.toFixed(2)}</p>
				${emailNote ? `<p class="checkout-warn">${escapeHtml(emailNote)}</p>` : ''}
				<div class="checkout-success-actions">
					<a href="mailto:${supportEmail}" class="btn btn-primary">Email support</a>
					<a href="shop.html" class="btn btn-outline">Continue shopping</a>
				</div>
			</div>`;
		document.getElementById('checkout-sticky-pay')?.remove();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function showSubmitError(message) {
		const el = document.getElementById('checkout-content');
		const sticky = document.getElementById('checkout-sticky-pay');
		if (sticky) {
			sticky.querySelectorAll('.pay-now-btn').forEach((b) => {
				b.disabled = false;
				b.textContent = 'I\u2019ve sent payment';
			});
		}
		const banner = document.getElementById('checkout-error');
		if (banner) {
			banner.textContent = message;
			banner.hidden = false;
			return;
		}
		if (el) {
			const note = document.createElement('p');
			note.id = 'checkout-error';
			note.className = 'checkout-warn';
			note.textContent = message;
			el.prepend(note);
		}
	}

	async function processPayment() {
		if (!selectedCrypto || !cart.length) return;
		const email = document.getElementById('customer-email')?.value.trim();
		if (!email || !email.includes('@')) return;

		const btns = ['pay-now-btn', 'pay-now-btn-mobile'].map((id) => document.getElementById(id)).filter(Boolean);
		btns.forEach((b) => { b.disabled = true; b.textContent = 'Submitting…'; });

		const orderId = pendingOrderId || GLCart.createOrderId();
		const crypto = CRYPTO_ADDRESSES[selectedCrypto];
		const paymentMethod = `${crypto.name}${crypto.network ? ` (${crypto.network})` : ''}`;
		const businessEmail = cfg().email || 'gamerleech2@gmail.com';
		const cartLines = cart.map((i) => `- ${i.title} ×${i.qty} — $${(i.price * i.qty).toFixed(2)}`).join('\n');

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

		let businessSent = false;
		let customerSent = false;

		if (isEmailReady()) {
			const base = {
				order_id: orderId,
				total_amount: `$${currentTotal.toFixed(2)}`,
				payment_method: paymentMethod,
				wallet_address: crypto.address,
				cart_items: cartLines,
				customer_email: email
			};
			try {
				await emailjs.send(ej().serviceId, ej().templatePayment, {
					...base,
					to_email: businessEmail,
					reply_to: email,
					from_name: 'GamerLeech',
					from_email: email,
					message: `New order ${orderId}\n${cartLines}\n${paymentMethod}\n${crypto.address}`
				});
				businessSent = true;
			} catch (e) { console.warn('Business email failed', e); }
			try {
				await emailjs.send(ej().serviceId, ej().templateConfirmation, {
					...base,
					to_email: email,
					from_name: 'GamerLeech',
					reply_to: businessEmail,
					message: `Thanks for your order ${orderId}. We will deliver to this email after payment confirms.`
				});
				customerSent = true;
			} catch (e) { console.warn('Customer email failed', e); }
		}

		if (isEmailReady() && !businessSent && !customerSent) {
			showSubmitError('Order saved locally but confirmation emails failed. Your cart is still here — try again or email gamerleech2@gmail.com with your order ID.');
			btns.forEach((b) => { b.disabled = false; b.textContent = 'I\u2019ve sent payment'; });
			return;
		}

		GLCart.clear();
		clearCheckoutSession();

		let emailNote = '';
		if (isEmailReady()) {
			if (!customerSent) emailNote = 'We could not send your confirmation email — save your order ID and email us if needed.';
			else if (!businessSent) emailNote = 'Your confirmation was sent; our team notification may be delayed.';
		} else {
			emailNote = 'Email service unavailable — order saved locally. Contact gamerleech2@gmail.com with your order ID.';
		}

		showSuccess(orderId, email, paymentMethod, emailNote);
	}

	window.selectCrypto = selectCrypto;
	window.copyAddress = copyAddress;
	window.updatePayButton = updatePayButton;
	window.processPayment = processPayment;

	document.addEventListener('DOMContentLoaded', renderCheckout);
	window.addEventListener('pageshow', (e) => {
		if (e.persisted) renderCheckout();
	});
})();
