
// ===== Helpers =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ===== Theme: dark/light toggle + background color ===== */
const root = document.documentElement;
const toggleBtn = $('#toggleTheme');
const swatches = $$('.swatch');
const customPicker = $('#customColor');

const LS_THEME = 'prefers-dark';
const LS_BG = 'custom-bg';

// Restore saved preferences
const savedDark = localStorage.getItem(LS_THEME) === 'true';
const savedBg = localStorage.getItem(LS_BG);

if (savedDark) {
  root.classList.add('dark');
  toggleBtn?.setAttribute('aria-pressed', 'true');
  toggleBtn && (toggleBtn.textContent = 'Light Mode');
}
if (savedBg) {
  applyBackground(savedBg);
  if (customPicker) customPicker.value = savedBg;
}

// Toggle dark/light
toggleBtn?.addEventListener('click', () => {
  const isDark = root.classList.toggle('dark');
  toggleBtn.setAttribute('aria-pressed', String(isDark));
  toggleBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem(LS_THEME, String(isDark));

  // If entering dark mode and bg is too light, we keep user's choice.
  // Accessibility tip: ensure enough contrast between --bg and --text.
});

// Preset swatches
swatches.forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    applyBackground(color);
    if (customPicker) customPicker.value = color;
    localStorage.setItem(LS_BG, color);
    showToast('Background updated');
  });
});

// Custom color picker
customPicker?.addEventListener('input', (e) => {
  const color = e.target.value;
  applyBackground(color);
  localStorage.setItem(LS_BG, color);
});

// Helper: change CSS variable
function applyBackground(color) {
  root.style.setProperty('--bg', color);
  // Optional: also set --surface to a slight variant for stronger theming:
  // root.style.setProperty('--surface', color);
  // (Leaving surface as-is keeps cards and sections distinct.)
}

/* ===== Navbar hamburger ===== */
const hamburger = $('#hamburger');
const nav = $('#nav');

hamburger?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

/* ===== Toast interactions ===== */
const toast = $('#toast');

function showToast(message = 'Action completed!') {
  if (!toast) return;
  toast.textContent = message;
  toast.setAttribute('aria-hidden', 'false');
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    toast.setAttribute('aria-hidden', 'true');
  }, 1800);
}

// Demo: buttons with data-toast trigger the toast
$$('[data-toast]').forEach(btn => {
  btn.addEventListener('click', () => showToast('Nice!'));
});

/* ===== Contact Form (basic client-side validation) ===== */
const contactForm = $('#contactForm');
const formStatus = $('#formStatus');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = $('#name');
  const email = $('#email');
  const message = $('#message');

  let valid = true;

  clearError(name);
  clearError(email);
  clearError(message);

  if (!name.value.trim()) { setError(name, 'Please enter your name'); valid = false; }
  if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) { setError(email, 'Please enter a valid email'); valid = false; }
  if (!message.value.trim()) { setError(message, 'Please write a message'); valid = false; }

  if (!valid) {
    formStatus.textContent = 'Please fix the errors and try again.';
    return;
  }

  // Simulate a successful submit
  formStatus.textContent = 'Thanks! Your message has been sent (demo).';
  showToast('Message sent (demo)');
  contactForm.reset();
});

function setError(inputEl, msg) {
  const field = inputEl.closest('.form-field');
  const small = field?.querySelector('.error');
  if (small) small.textContent = msg;
  inputEl.setAttribute('aria-invalid', 'true');
}

function clearError(inputEl) {
  const field = inputEl.closest('.form-field');
  const small = field?.querySelector('.error');
  if (small) small.textContent = '';
  inputEl.removeAttribute('aria-invalid');
}

/* ===== Footer Year ===== */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
``
