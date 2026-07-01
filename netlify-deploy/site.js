/** GamerLeech shared UI — nav, page enter, dock, EmailJS init */
(function () {
	'use strict';

	const cfg = window.GL_CONFIG || {};
	const navToggle = document.querySelector('.nav-toggle');
	const nav = document.getElementById('primary-nav');

	function initNav() {
		if (!navToggle || !nav) return;

		navToggle.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			const open = navToggle.getAttribute('aria-expanded') === 'true';
			navToggle.setAttribute('aria-expanded', String(!open));
			nav.classList.toggle('open', !open);
			document.body.classList.toggle('nav-open', !open);
		});

		nav.addEventListener('click', (e) => {
			if (e.target.tagName === 'A') closeNav();
		});

		document.addEventListener('click', (e) => {
			if (!nav.classList.contains('open')) return;
			if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') closeNav();
		});
	}

	function closeNav() {
		if (!nav || !navToggle) return;
		nav.classList.remove('open');
		navToggle.setAttribute('aria-expanded', 'false');
		document.body.classList.remove('nav-open');
	}

	function initDock() {
		const path = location.pathname.split('/').pop() || 'index.html';
		document.querySelectorAll('.mobile-dock .dock-item').forEach((link) => {
			const href = link.getAttribute('href') || '';
			const match =
				(path === 'index.html' || path === '') && (href === 'index.html' || href === './' || href === '/')
				|| href.endsWith(path);
			link.classList.toggle('active', match);
		});
	}

	function initPageEnter() {
		const main = document.querySelector('main');
		if (main) main.classList.add('page-enter');
	}

	function initEmailJs() {
		const ej = cfg.emailjs;
		if (typeof emailjs === 'undefined' || !ej?.publicKey || ej.publicKey === 'YOUR_PUBLIC_KEY') return;
		try {
			emailjs.init(ej.publicKey);
		} catch (_) { /* optional */ }
	}

	function initReducedMotion() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			document.documentElement.classList.add('reduce-motion');
		}
	}

	initReducedMotion();
	initNav();
	initDock();
	initPageEnter();
	initEmailJs();
	window.GL_closeNav = closeNav;
})();
