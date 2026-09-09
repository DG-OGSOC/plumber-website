// =========================================================
// SIE Plumbing Services — interactive behavior
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFormValidation();
  initHeaderShadowOnScroll();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   Mobile hamburger menu
--------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the menu after a link is tapped (mobile navigation)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  });
}

/* ---------------------------------------------------------
   Sticky header shadow once the page scrolls
--------------------------------------------------------- */
function initHeaderShadowOnScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const applyShadow = () => {
    header.style.boxShadow = window.scrollY > 8 ? '0 4px 14px rgba(16,34,47,0.10)' : 'none';
  };
  applyShadow();
  window.addEventListener('scroll', applyShadow, { passive: true });
}

/* ---------------------------------------------------------
   Contact / quote form validation
--------------------------------------------------------- */
function initFormValidation() {
  const form = document.getElementById('quote-form');
  if (!form) return;
  const successMsg = document.getElementById('form-success');

  const validators = {
    name: (value) => value.trim().length >= 2 || 'Enter your full name.',
    phone: (value) => /^[\d\s()+-]{7,20}$/.test(value.trim()) || 'Enter a valid phone number.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Enter a valid email address.',
    service: (value) => value !== '' || 'Choose the service you need.',
    message: (value) => value.trim().length >= 10 || 'Add a few details (10+ characters) so we can prep.',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.hidden = true;

    let firstInvalidField = null;
    let allValid = true;

    Object.keys(validators).forEach((fieldName) => {
      const field = form.elements[fieldName];
      const result = validators[fieldName](field.value);
      const valid = result === true;
      setFieldError(fieldName, valid ? '' : result);
      if (!valid) {
        allValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      }
    });

    if (!allValid) {
      firstInvalidField.focus();
      return;
    }

    // No backend wired up yet — confirm receipt and reset the form.
    successMsg.hidden = false;
    form.reset();
  });

  // Clear a field's error as soon as the visitor fixes it
  Object.keys(validators).forEach((fieldName) => {
    const field = form.elements[fieldName];
    if (!field) return;
    const eventName = field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(eventName, () => {
      const result = validators[fieldName](field.value);
      if (result === true) setFieldError(fieldName, '');
    });
  });

  function setFieldError(fieldName, message) {
    const field = form.elements[fieldName];
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    const wrapper = field.closest('.field');
    if (errorEl) errorEl.textContent = message;
    if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
  }
}