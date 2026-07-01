/** Synapse-style mobile menu — checkbox + label, portaled to body */
(function () {
	'use strict';

	const MENU_ID = 'gamerleech-mobile-menu';
	const lock = () => window.GL_lockBodyScroll?.();
	const unlock = () => window.GL_unlockBodyScroll?.();

	const NAV_LINKS = [
		{ href: 'index.html', label: 'Home' },
		{ href: 'shop.html', label: 'Cheats' },
		{ href: 'browse.html', label: 'Marketplace' },
		{ href: 'games.html', label: 'All games' },
		{ href: 'sell.html', label: 'Sell' },
		{ href: 'status.html', label: 'Status' },
		{ href: 'wishlist.html', label: 'Saved' },
	];

	const ICON_OPEN = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
	const ICON_CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';

	function closeMenu() {
		const input = document.getElementById(MENU_ID);
		if (!input?.checked) return;
		input.checked = false;
		unlock();
	}

	function menuHTML() {
		const links = NAV_LINKS.map((l) =>
			`<a href="${l.href}" class="mobile-menu-link">${l.label}</a>`
		).join('');

		return `
			<input type="checkbox" id="${MENU_ID}" class="mobile-menu-check" aria-hidden="true" tabindex="-1">
			<label for="${MENU_ID}" class="mobile-menu-trigger" aria-label="Open menu">
				<span class="mobile-menu-icon mobile-menu-icon--open" aria-hidden="true">${ICON_OPEN}</span>
				<span class="mobile-menu-icon mobile-menu-icon--close" aria-hidden="true">${ICON_CLOSE}</span>
			</label>
			<div class="mobile-menu-overlay">
				<label for="${MENU_ID}" class="mobile-menu-backdrop" aria-label="Close menu"></label>
				<nav class="mobile-menu-panel" aria-label="Mobile navigation">
					<div class="mobile-menu-head">
						<span class="mobile-menu-title">Menu</span>
						<label for="${MENU_ID}" class="mobile-menu-close touch-target" aria-label="Close menu">${ICON_CLOSE}</label>
					</div>
					<div class="mobile-menu-links">${links}</div>
					<div class="mobile-menu-foot">
						<a href="sell.html" class="mobile-menu-cta">Start selling</a>
						<a href="login.html" class="mobile-menu-secondary">Log in</a>
						<a href="register.html" class="mobile-menu-accent">Create account</a>
					</div>
				</nav>
			</div>`;
	}

	function ensureSpacer() {
		const actions = document.querySelector('.synapse-header-actions');
		if (!actions || actions.querySelector('.mobile-menu-spacer')) return;
		const spacer = document.createElement('div');
		spacer.className = 'mobile-menu-spacer';
		spacer.setAttribute('aria-hidden', 'true');
		actions.appendChild(spacer);
	}

	function mount() {
		if (document.getElementById(MENU_ID)) return;

		const root = document.createElement('div');
		root.className = 'mobile-menu-root';
		root.innerHTML = menuHTML();
		document.body.appendChild(root);

		const headerToggle = document.querySelector('.synapse-header .nav-toggle');
		if (headerToggle) {
			headerToggle.hidden = true;
			headerToggle.setAttribute('aria-hidden', 'true');
		}
		ensureSpacer();

		const input = root.querySelector(`#${MENU_ID}`);
		if (!input) return;

		input.addEventListener('change', () => {
			if (input.checked) lock();
			else unlock();
		});

		root.querySelectorAll('.mobile-menu-panel a').forEach((a) => {
			a.addEventListener('click', closeMenu);
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeMenu();
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', mount);
	} else {
		mount();
	}

	window.GL_closeMobileMenu = closeMenu;
})();
