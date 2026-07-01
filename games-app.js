/** Games index with A–Z grouping (Synapse parity) */
(function () {
	'use strict';

	const chrome = window.GL_CHROME;
	if (!chrome) {
		document.getElementById('games-grid')?.insertAdjacentHTML(
			'beforeend',
			'<p style="color:var(--syn-muted);padding:32px 0;text-align:center">Site scripts failed to load. Hard-refresh the page (Ctrl+F5).</p>'
		);
		return;
	}

	async function init() {
		const el = document.getElementById('games-grid');
		const alpha = document.getElementById('games-alpha');
		if (!el) return;

		let games = null;
		try {
			const gRes = await fetch('data/games.json');
			if (gRes.ok) {
				const gData = await gRes.json();
				games = gData.games || gData;
			}
		} catch { /* fallback */ }

		if (!games?.length) {
			const data = await chrome.loadMarketplace();
			games = data?.games;
		}

		if (!games?.length) {
			el.innerHTML = `<p style="color:var(--syn-muted);padding:32px 0;text-align:center">Could not load games catalog. Use a local server (<code>python -m http.server 8080</code> in netlify-deploy) — opening HTML files directly won't load JSON.</p>`;
			return;
		}
		const sorted = [...games].sort((a, b) => a.name.localeCompare(b.name));
		const letters = [...new Set(sorted.map((g) => (g.name[0] || '#').toUpperCase()))].sort();

		if (alpha) {
			alpha.innerHTML = letters
				.map((l) => `<a href="#letter-${l}">${l}</a>`)
				.join('');
		}

		el.innerHTML = letters
			.map((letter) => {
				const group = sorted.filter((g) => (g.name[0] || '#').toUpperCase() === letter);
				const tiles = group
					.map(
						(g) => `<a href="browse.html?game=${g.slug}" class="synapse-hub-card synapse-game-tile">
						<div class="synapse-game-tile-cover" style="background:linear-gradient(135deg,${g.bannerFrom},${g.bannerTo})">
							${chrome.gameCoverImg(g.slug, g.name)}
						</div>
						<div class="synapse-game-tile-body">
						<h3 style="margin:0;font-size:16px">${g.name}</h3>
						<p style="margin:4px 0 0;font-size:13px;color:var(--syn-muted)">${g.tagline}</p>
						<p style="margin:8px 0 0;font-size:12px;color:var(--syn-accent-2);font-weight:600">${g.listingCount} offers</p>
						</div>
					</a>`
					)
					.join('');
				return `<h2 class="games-letter" id="letter-${letter}">${letter}</h2><div class="synapse-games-grid">${tiles}</div>`;
			})
			.join('');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
