/* =============================================
   BRIGHTER MONEY COMPANY — MAIN JS
   ============================================= */

// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// --- Smooth active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function setActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

// --- Intersection Observer fade-in ---
const fadeEls = document.querySelectorAll(
  '.service-card, .why-card, .testimonial-card, .about-grid, .highlight'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// --- Contact Form (Formspree) ---
// To activate real email delivery:
//   1. Go to https://formspree.io and create a free account
//   2. Create a new form — enter Shamekacampbell95@yahoo.com as the destination
//   3. Copy your form ID (looks like: xpzgkane) and replace YOUR_FORM_ID below
const FORMSPREE_ID = 'YOUR_FORM_ID';

const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');
const resetFormBtn = document.getElementById('resetFormBtn');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  submitBtn.disabled = true;
  btnText.hidden    = true;
  btnLoading.hidden = false;

  const data = {
    firstName: contactForm.firstName.value.trim(),
    lastName:  contactForm.lastName.value.trim(),
    email:     contactForm.email.value.trim(),
    phone:     contactForm.phone.value.trim(),
    service:   contactForm.service.value,
    message:   contactForm.message.value.trim(),
  };

  // If Formspree ID is configured, submit there; otherwise fall back to mailto
  if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (res.ok) {
        showSuccess();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(json.error || 'Something went wrong. Please email us directly at Shamekacampbell95@yahoo.com');
        resetBtn();
      }
    } catch {
      alert('Network error. Please email us directly at Shamekacampbell95@yahoo.com');
      resetBtn();
    }
  } else {
    // Mailto fallback — opens the user's email client pre-filled
    const subject = encodeURIComponent(`Bookkeeping Inquiry from ${data.firstName} ${data.lastName}`);
    const body = encodeURIComponent(
      `Name: ${data.firstName} ${data.lastName}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone || 'Not provided'}\n` +
      `Service: ${data.service || 'Not specified'}\n\n` +
      `Message:\n${data.message}`
    );
    window.location.href = `mailto:Shamekacampbell95@yahoo.com?subject=${subject}&body=${body}`;
    showSuccess();
  }
});

function showSuccess() {
  contactForm.hidden  = true;
  formSuccess.hidden  = false;
  resetBtn();
}

function resetBtn() {
  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').hidden    = false;
  submitBtn.querySelector('.btn-loading').hidden = true;
}

resetFormBtn.addEventListener('click', () => {
  contactForm.reset();
  contactForm.hidden = false;
  formSuccess.hidden = true;
});
