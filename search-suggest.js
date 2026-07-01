/** Client-side search suggestions (Synapse search-suggest parity) */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	if (!chrome) return;

	let index = [];

	async function buildIndex() {
		const data = await chrome.loadMarketplace();
		index = [];
		if (data) {
			(data.games || []).forEach((g) => {
				index.push({ type: 'game', label: g.name, href: `browse.html?game=${g.slug}`, icon: g.emoji });
			});
			(data.listings || []).slice(0, 500).forEach((l) => {
				index.push({
					type: 'listing',
					label: l.title,
					href: `browse.html?listing=${encodeURIComponent(l.id)}`,
					icon: l.game?.emoji || '📦',
				});
			});
		}
		const cheats = await chrome.loadCheatsProducts();
		(cheats || []).forEach((p) => {
			index.push({
				type: 'cheat',
				label: p.title,
				href: `shop.html?category=${encodeURIComponent(p.category)}`,
				icon: '⚡',
			});
		});
	}

	function mount(form) {
		const input = form.querySelector('input[type="search"]');
		if (!input || form.querySelector('.search-suggest')) return;

		const box = document.createElement('div');
		box.className = 'search-suggest';
		box.hidden = true;
		form.appendChild(box);

		function show(q) {
			const term = (q || '').trim().toLowerCase();
			if (term.length < 2) {
				box.hidden = true;
				return;
			}
			const hits = index
				.filter((x) => x.label.toLowerCase().includes(term))
				.slice(0, 8);
			if (!hits.length) {
				box.hidden = true;
				return;
			}
			box.innerHTML = hits
				.map(
					(h) =>
						`<a href="${h.href}" class="search-suggest-item"><span>${h.icon}</span><span>${h.label}</span></a>`
				)
				.join('');
			box.hidden = false;
		}

		input.addEventListener('input', () => show(input.value));
		input.addEventListener('focus', () => show(input.value));
		document.addEventListener('click', (e) => {
			if (!form.contains(e.target)) box.hidden = true;
		});
	}

	document.addEventListener('DOMContentLoaded', async () => {
		await buildIndex();
		document.querySelectorAll('[data-synapse-search]').forEach(mount);
	});
})();
