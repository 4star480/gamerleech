/** GamerLeech wishlist (localStorage) */
(function () {
	'use strict';

	const KEY = 'gamerleech_wishlist';

	function read() {
		try {
			const raw = localStorage.getItem(KEY);
			return raw ? JSON.parse(raw) : [];
		} catch {
			return [];
		}
	}

	function write(ids) {
		localStorage.setItem(KEY, JSON.stringify(ids));
	}

	function has(id) {
		return read().includes(id);
	}

	function toggle(id) {
		const ids = read();
		const i = ids.indexOf(id);
		if (i >= 0) ids.splice(i, 1);
		else ids.push(id);
		write(ids);
		return has(id);
	}

	function wire(root) {
		if (!root) return;
		root.querySelectorAll('[data-wishlist-id]').forEach((btn) => {
			const id = btn.getAttribute('data-wishlist-id');
			if (!id) return;
			btn.textContent = has(id) ? '❤️' : '🤍';
			btn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const on = toggle(id);
				btn.textContent = on ? '❤️' : '🤍';
			};
		});
	}

	window.GL_WISHLIST = { read, write, has, toggle, wire };
})();
