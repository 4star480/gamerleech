// Mobile nav — site.js handles toggle; keep FAQ + contact here

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((btn) => {
	btn.addEventListener('click', () => {
		const expanded = btn.getAttribute('aria-expanded') === 'true';
		btn.setAttribute('aria-expanded', String(!expanded));
	});
});

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

(function initEmailJS() {
	const ej = window.GL_CONFIG?.emailjs;
	if (typeof emailjs !== 'undefined' && ej?.publicKey) {
		try { emailjs.init(ej.publicKey); } catch (e) { console.warn('EmailJS init', e); }
	}
})();

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
	document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
		img.addEventListener('load', function () { this.classList.add('loaded'); });
		if (img.complete) img.classList.add('loaded');
	});
}

function showFormToast(button, ok) {
	const originalText = button.textContent;
	button.textContent = ok ? 'Message sent ✓' : 'Could not send — try again';
	button.disabled = true;
	if (ok) button.classList.add('btn-success-flash');
	setTimeout(() => {
		button.textContent = originalText;
		button.disabled = false;
		button.classList.remove('btn-success-flash');
	}, 2800);
}

// Contact form handler
function handleContactSubmit(event) {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);
	const button = form.querySelector('button[type="submit"]');
	const cfg = window.GL_CONFIG || {};
	const recipientEmail = cfg.email || 'gamerleech2@gmail.com';
	const ej = cfg.emailjs || {};

	button.textContent = 'Sending…';
	button.disabled = true;

	if (typeof emailjs !== 'undefined' && ej.serviceId && ej.templateContact) {
		emailjs.send(ej.serviceId, ej.templateContact, {
			to_email: recipientEmail,
			from_name: data.name || 'Anonymous',
			from_email: data.email || 'no-reply@gamerleech.com',
			message: data.message || '',
			subject: `Contact: ${data.name || 'New message'}`
		}).then(() => {
			showFormToast(button, true);
			form.reset();
		}).catch(() => {
			showFormToast(button, false);
		});
		return;
	}

	const subject = encodeURIComponent(`Contact: ${data.name || 'New Message'}`);
	const body = encodeURIComponent(`Name: ${data.name || 'N/A'}\nEmail: ${data.email || 'N/A'}\n\n${data.message || ''}`);
	window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
	setTimeout(() => {
		showFormToast(button, true);
		form.reset();
	}, 400);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
		if (!href || href === '#') return;
		const target = document.querySelector(href);
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		if (typeof window.GL_closeNav === 'function') window.GL_closeNav();
	});
});

// Scroll reveal (respects reduce-motion via CSS)
if (!document.documentElement.classList.contains('reduce-motion')) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) entry.target.classList.add('is-visible');
		});
	}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

	document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}
