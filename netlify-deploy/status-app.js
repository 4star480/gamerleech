(function () {
	'use strict';

	const grid = document.getElementById('status-grid');
	const banner = document.getElementById('status-banner');
	const refreshBtn = document.getElementById('status-refresh');

	const CATEGORY_NAMES = {
		'call-of-duty': 'Call of Duty',
		'cod-mobile': 'Call of Duty Mobile',
		fivem: 'FiveM',
		valorant: 'Valorant',
		roblox: 'Roblox',
		fortnite: 'Fortnite',
		'rainbow-six': 'Rainbow Six',
		gta5: 'GTA V',
		cs2: 'CS2',
		apex: 'Apex Legends',
		'hwid-spoofer': 'HWID Spoofer',
		premium: 'Premium',
		services: 'Services'
	};

	const STATUS_LABELS = {
		undetected: 'Undetected',
		updating: 'Updating',
		maintenance: 'Maintenance'
	};

	function badge(status) {
		const label = STATUS_LABELS[status] || status;
		return `<span class="badge-pill badge-${status}">${label}</span>`;
	}

	function render(products) {
		const cheats = products.filter((p) => p.catalog === 'cheats' || !['tiktok', 'facebook', 'services'].includes(p.category));
		cheats.sort((a, b) => a.title.localeCompare(b.title));

		const updating = cheats.filter((p) => (p.status || 'undetected') !== 'undetected').length;
		if (banner) {
			if (updating === 0) {
				banner.textContent = 'All Systems Online';
				banner.style.background = 'rgba(52, 211, 153, 0.1)';
				banner.style.borderColor = 'rgba(52, 211, 153, 0.35)';
				banner.style.color = 'var(--status-ok)';
			} else {
				banner.textContent = `${updating} product${updating > 1 ? 's' : ''} updating`;
				banner.style.background = 'rgba(251, 191, 36, 0.1)';
				banner.style.borderColor = 'rgba(251, 191, 36, 0.35)';
				banner.style.color = 'var(--status-warn)';
			}
		}

		grid.innerHTML = cheats.map((p) => `
			<div class="status-row">
				<div>
					<h3>${p.title}</h3>
					<div class="status-game">${CATEGORY_NAMES[p.category] || p.category}</div>
				</div>
				${badge(p.status || 'undetected')}
				<a href="shop.html?category=${p.category}" class="btn btn-ghost" style="padding:8px 12px;font-size:0.8125rem">View</a>
			</div>
		`).join('');
	}

	function load() {
		fetch('data/products.json')
			.then((r) => r.json())
			.then((data) => render(data.products || []))
			.catch(() => {
				grid.innerHTML = '<p class="muted">Could not load status. Please refresh.</p>';
			});
	}

	refreshBtn?.addEventListener('click', load);
	load();
})();
