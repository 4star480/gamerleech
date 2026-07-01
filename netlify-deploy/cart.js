/**
 * GamerLeech shared cart — localStorage gl_cart
 */
(function (global) {
	'use strict';

	const KEY = 'gl_cart';

	function parseCart(raw) {
		try {
			const data = JSON.parse(raw || '[]');
			return Array.isArray(data) ? data : [];
		} catch {
			return [];
		}
	}

	function normalizeItem(item) {
		const price = Number(item.price);
		return {
			...item,
			cartId: item.cartId || item.id,
			qty: Math.max(1, Number(item.qty) || 1),
			price: Number.isFinite(price) ? price : 0,
			title: item.title || 'Product'
		};
	}

	const GLCart = {
		KEY,

		get() {
			return parseCart(localStorage.getItem(KEY)).map(normalizeItem);
		},

		save(cart) {
			localStorage.setItem(KEY, JSON.stringify(cart.map(normalizeItem)));
			global.dispatchEvent(new CustomEvent('gl-cart-updated', { detail: { cart } }));
		},

		clear() {
			localStorage.removeItem(KEY);
			global.dispatchEvent(new CustomEvent('gl-cart-updated', { detail: { cart: [] } }));
		},

		count(cart) {
			return (cart || this.get()).reduce((n, i) => n + i.qty, 0);
		},

		total(cart) {
			return (cart || this.get()).reduce((sum, i) => sum + i.price * i.qty, 0);
		},

		find(cart, cartId) {
			return (cart || this.get()).find((i) => (i.cartId || i.id) === cartId);
		},

		add(product, period, price) {
			const cart = this.get();
			const cartId = period ? `${product.id}-${period}` : product.id;
			const periodMap = {
				daily: 'Day',
				weekly: 'Week',
				monthly: 'Month',
				onetime: 'One-Time',
				lifetime: 'Lifetime'
			};
			const displayPrice = Number(price) || Number(product.price) || 0;
			const displayTitle = period
				? `${product.title} (${periodMap[period] || period})`
				: product.title;

			const existing = cart.find((i) => i.cartId === cartId);
			if (existing) {
				existing.qty += 1;
			} else {
				cart.push(normalizeItem({
					...product,
					cartId,
					price: displayPrice,
					title: displayTitle,
					period: period || null,
					qty: 1
				}));
			}
			this.save(cart);
			return cart;
		},

		setQty(cartId, qty) {
			const cart = this.get();
			const item = cart.find((i) => (i.cartId || i.id) === cartId);
			if (!item) return cart;
			if (qty <= 0) return this.remove(cartId);
			item.qty = qty;
			this.save(cart);
			return cart;
		},

		inc(cartId) {
			const item = this.find(null, cartId);
			return item ? this.setQty(cartId, item.qty + 1) : this.get();
		},

		dec(cartId) {
			const item = this.find(null, cartId);
			return item ? this.setQty(cartId, item.qty - 1) : this.get();
		},

		remove(cartId) {
			const cart = this.get().filter((i) => (i.cartId || i.id) !== cartId);
			this.save(cart);
			return cart;
		},

		createOrderId() {
			return `GL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
		},

		saveOrder(order) {
			try {
				const orders = JSON.parse(localStorage.getItem('gl_orders') || '[]');
				orders.push(order);
				localStorage.setItem('gl_orders', JSON.stringify(orders.slice(-50)));
			} catch (e) {
				console.error('saveOrder', e);
			}
		}
	};

	global.GLCart = GLCart;
})(window);
