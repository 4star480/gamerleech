// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');

if (navToggle && nav) {
	// Toggle menu on button click
	navToggle.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', String(!expanded));
		nav.classList.toggle('open');
	});
	
	// Close nav when clicking on a link
	nav.addEventListener('click', (e) => {
		if (e.target.tagName === 'A') {
			nav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
		}
	});
	
	// Close nav when clicking outside
	document.addEventListener('click', (e) => {
		if (nav.classList.contains('open') && 
			!nav.contains(e.target) && 
			!navToggle.contains(e.target)) {
			nav.classList.remove('open');
			navToggle.setAttribute('aria-expanded', 'false');
		}
	});
	
	// Prevent body scroll when menu is open
	navToggle.addEventListener('click', () => {
		if (nav.classList.contains('open')) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	});
}

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

// Lazy loading images
if ('loading' in HTMLImageElement.prototype) {
	const images = document.querySelectorAll('img[loading="lazy"]');
	images.forEach(img => {
		img.addEventListener('load', function() {
			this.classList.add('loaded');
		});
		if (img.complete) {
			img.classList.add('loaded');
		}
	});
}

// Contact form handler
function handleContactSubmit(event) {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);
	
	const button = form.querySelector('button[type="submit"]');
	const originalText = button.textContent;
	button.textContent = 'Sending...';
	button.disabled = true;
	
	// Send email to gamerleech2@gmail.com
	const recipientEmail = 'gamerleech2@gmail.com';
	const subject = encodeURIComponent(`Contact Form: ${data.name || 'New Message'}`);
	const body = encodeURIComponent(`Name: ${data.name || 'N/A'}\nEmail: ${data.email || 'N/A'}\n\nMessage:\n${data.message || 'N/A'}`);
	
	// Use mailto as primary method (opens email client)
	const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
	window.location.href = mailtoLink;
	
	// Also try to send via EmailJS if available (for better UX)
	if (typeof emailjs !== 'undefined') {
		emailjs.send('service_gamerleech', 'template_contact', {
			to_email: recipientEmail,
			from_name: data.name || 'Anonymous',
			from_email: data.email || 'no-reply@gamerleech.com',
			message: data.message || '',
			subject: `Contact Form: ${data.name || 'New Message'}`
		}).then(() => {
			button.textContent = 'Message Sent! ✓';
			button.style.background = 'var(--green)';
			form.reset();
			setTimeout(() => {
				button.textContent = originalText;
				button.disabled = false;
				button.style.background = '';
			}, 2000);
		}).catch(() => {
			// Fallback to mailto if EmailJS fails
			button.textContent = 'Message Sent! ✓';
			button.style.background = 'var(--green)';
			form.reset();
			setTimeout(() => {
				button.textContent = originalText;
				button.disabled = false;
				button.style.background = '';
			}, 2000);
		});
	} else {
		// Fallback: show success after mailto opens
		setTimeout(() => {
			button.textContent = 'Message Sent! ✓';
			button.style.background = 'var(--green)';
			form.reset();
			setTimeout(() => {
				button.textContent = originalText;
				button.disabled = false;
				button.style.background = '';
			}, 2000);
		}, 500);
	}
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		const href = this.getAttribute('href');
		if (href === '#' || href === '') return;
		
		const target = document.querySelector(href);
		if (target) {
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			
			// Close mobile nav if open
			if (nav && nav.classList.contains('open')) {
				nav.classList.remove('open');
				if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
			}
		}
	});

// Intersection Observer for fade-in animations
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.style.opacity = '1';
			entry.target.style.transform = 'translateY(0)';
		}
	});
}, observerOptions);

// Observe cards and other elements
document.querySelectorAll('.card, .price-card, blockquote').forEach(el => {
	el.style.opacity = '0';
	el.style.transform = 'translateY(20px)';
	el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
	observer.observe(el);
});








