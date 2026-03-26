import './styles/v6.css';
import ruLocale from '../i18n/ru.json';
import kkLocale from '../i18n/kk.json';
import enLocale from '../i18n/en.json';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroSphere, initWaveTerrain, initCtaSphere, initFloatingDots } from './particles.js';
import { initCarousel } from './carousel.js';

gsap.registerPlugin(ScrollTrigger);

/* ===== i18n ===== */
const locales = { ru: ruLocale, kk: kkLocale, en: enLocale };
let currentLang = localStorage.getItem('doscode-lang') || 'ru';

function getNestedValue(obj, path) {
  return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

function applyTranslations(lang) {
  const t = locales[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = getNestedValue(t, el.dataset.i18n);
    if (val) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const val = getNestedValue(t, el.dataset.i18nHtml);
    if (val) el.innerHTML = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = getNestedValue(t, el.dataset.i18nPlaceholder);
    if (val) el.placeholder = val;
  });

  document.querySelectorAll('.v6-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderTestimonials(t);
  renderFaq(t);
  renderPortfolio(t);
  populateFormDropdowns(t);

  document.documentElement.lang = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';

  const metaTitle = getNestedValue(t, 'meta.title');
  if (metaTitle) document.title = metaTitle;

  const metaDesc = getNestedValue(t, 'meta.description');
  if (metaDesc) {
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', metaDesc);
  }
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('doscode-lang', lang);
  applyTranslations(lang);
}

/* ===== Language Switcher ===== */
function initLangSwitcher() {
  document.querySelectorAll('.v6-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v6-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchLang(btn.dataset.lang);
    });
  });
}

/* ===== Navigation Scroll Morph ===== */
function initNav() {
  const nav = document.getElementById('v6Nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('v6-nav--scrolled');
    } else {
      nav.classList.remove('v6-nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Hamburger Menu ===== */
function initHamburger() {
  const burger = document.querySelector('.v6-nav-burger');
  const links = document.querySelector('.v6-nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    links.classList.toggle('v6-nav-links--open');
    burger.classList.toggle('active');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('v6-nav-links--open');
      burger.classList.remove('active');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      links.classList.remove('v6-nav-links--open');
      burger.classList.remove('active');
    }
  });
}

/* ===== GSAP ScrollTrigger Animations ===== */
function initScrollAnimations() {

  // ── Core helper ──────────────────────────────────────────────────────────
  function reveal(targets, from, to, trigger, stagger) {
    const els = typeof targets === 'string' ? gsap.utils.toArray(targets) : targets;
    if (!els || (Array.isArray(els) && !els.length)) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger || (Array.isArray(els) ? els[0] : els),
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
    tl.fromTo(els,
      { opacity: 0, ...from },
      { opacity: 1, duration: 0.85, ease: 'power3.out', stagger: stagger || 0, ...to }
    );
    return tl;
  }

  // ── HERO — headline lines + sub-elements fade up on load ─────────────────
  const heroLeft = document.querySelector('.v6-hero-headline-left');
  const heroRight = document.querySelector('.v6-hero-headline-right');
  const heroTagline = document.querySelector('.v6-hero-tagline');
  const heroCta = document.querySelector('.v6-hero-cta');

  if (heroLeft)  gsap.fromTo(heroLeft,  { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.1 });
  if (heroRight) gsap.fromTo(heroRight, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.0, ease: 'power4.out', delay: 0.3 });
  if (heroTagline) gsap.fromTo(heroTagline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.6 });
  if (heroCta) gsap.fromTo(heroCta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.8 });

  // ── Generic .v6-reveal class ──────────────────────────────────────────────
  gsap.utils.toArray('.v6-reveal').forEach(el => {
    reveal(el, { y: 40 }, { duration: 0.9 });
  });

  // ── Helper: animate section label + heading together ─────────────────────
  function revealHeading(sectionEl) {
    if (!sectionEl) return;
    const label = sectionEl.querySelector('.v6-section-label');
    const heading = sectionEl.querySelector('h2');
    if (label) reveal(label, { x: -24, y: 0 }, { x: 0, duration: 0.7 }, sectionEl);
    if (heading) reveal(heading, { y: 50 }, { duration: 0.95, ease: 'power4.out' }, sectionEl);
  }

  // Apply heading reveals to each section
  ['#about', '#services', '#industries', '#portfolio', '#process', '#stats', '#contact'].forEach(id => {
    revealHeading(document.querySelector(id));
  });

  // ── ABOUT — stat boxes slide up ───────────────────────────────────────────
  const aboutStats = gsap.utils.toArray('.v6-about-stat');
  if (aboutStats.length) {
    reveal(aboutStats, { y: 40 }, { duration: 0.8 }, aboutStats[0], 0.12);
  }
  const aboutText = document.querySelector('.v6-about-text');
  if (aboutText) reveal(aboutText, { y: 30 }, { duration: 0.9 }, aboutText);
  const aboutCta = document.querySelector('.v6-about-cta');
  if (aboutCta) reveal(aboutCta, { y: 20 }, { duration: 0.8 }, aboutCta);

  // ── SERVICES / PILLARS — staggered cards with slight skew ────────────────
  const pillars = gsap.utils.toArray('.v6-pillar');
  if (pillars.length) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.v6-pillars-grid', start: 'top 85%', toggleActions: 'play none none none' }
    });
    tl.fromTo(pillars,
      { opacity: 0, y: 60, skewY: 2 },
      { opacity: 1, y: 0, skewY: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out' }
    );
  }

  // ── INDUSTRIES — cascade fade-up with CSS opacity preserved ──────────────
  const industryItems = gsap.utils.toArray('.v6-industry-item');
  if (industryItems.length) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.v6-industries-inner', start: 'top 85%', toggleActions: 'play none none none' }
    });
    industryItems.forEach((item, i) => {
      const targetOpacity = parseFloat(getComputedStyle(item).opacity) || 1;
      tl.fromTo(item,
        { opacity: 0, x: -40 },
        { opacity: targetOpacity, x: 0, duration: 0.55, ease: 'power3.out' },
        i * 0.07
      );
    });
  }

  // ── PORTFOLIO — heading + CTA + carousel ─────────────────────────────────
  const portfolioSection = document.querySelector('#portfolio');
  if (portfolioSection) {
    const portHeaderRight = portfolioSection.querySelector('.v6-portfolio-header-right');
    if (portHeaderRight) reveal(portHeaderRight, { y: 20 }, { duration: 0.8 }, portHeaderRight);
    const carousel = portfolioSection.querySelector('.v6-carousel');
    if (carousel) reveal(carousel, { y: 50 }, { duration: 1, ease: 'power3.out' }, carousel);
  }

  // ── PROCESS — cards alternate from left/right ─────────────────────────────
  const processCards = gsap.utils.toArray('.v6-process-card');
  processCards.forEach((card, i) => {
    reveal(card, { x: i % 2 === 0 ? -50 : 50, y: 0 }, { x: 0, duration: 0.85, ease: 'power3.out' }, card);
  });

  // ── STATS — counter + fade in ─────────────────────────────────────────────
  const statItems = gsap.utils.toArray('.v6-stat-item');
  if (statItems.length) {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.v6-stats-grid', start: 'top 85%', toggleActions: 'play none none none' }
    });
    tl.fromTo(statItems,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }
    );
  }

  // Stat number counters
  document.querySelectorAll('.v6-stat-value').forEach(el => {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/(\d+)/);
    if (!numMatch) return;
    const target = parseInt(numMatch[1], 10);
    const prefix = raw.slice(0, raw.indexOf(numMatch[1]));
    const suffix = raw.slice(raw.indexOf(numMatch[1]) + numMatch[1].length);
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target, duration: 1.8, ease: 'power2.out', snap: { val: 1 },
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      onUpdate() { el.textContent = prefix + Math.round(counter.val) + suffix; }
    });
  });

  // ── FAQ — items stagger in ─────────────────────────────────────────────────
  const faqItems = gsap.utils.toArray('.v6-faq-item');
  if (faqItems.length) {
    reveal(faqItems, { y: 30 }, { duration: 0.7 }, faqItems[0], 0.1);
  }

  // ── CONTACT — CTA card + form fade up ────────────────────────────────────
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const ctaCard = contactSection.querySelector('.v6-cta-card');
    const contactForm = contactSection.querySelector('.v6-form');
    if (ctaCard) reveal(ctaCard, { y: 40 }, { duration: 0.9, ease: 'power3.out' }, contactSection);
    if (contactForm) reveal(contactForm, { y: 40 }, { duration: 0.9, ease: 'power3.out', delay: 0.15 }, contactSection);
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footer = document.querySelector('.v6-footer');
  if (footer) reveal(footer, { y: 30 }, { duration: 0.8 }, footer);

  ScrollTrigger.refresh();
}

/* ===== Dynamic Rendering ===== */
function renderTestimonials(t) {
  const grid = document.getElementById('v6TestimonialsGrid');
  if (!grid || !t.testimonials?.items) return;

  const starsSvg = Array(5).fill(
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="#E86C3A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  ).join('');

  grid.innerHTML = t.testimonials.items.map((item) => `
    <div class="v6-testimonial">
      <div class="v6-testimonial-stars">${starsSvg}</div>
      <blockquote class="v6-testimonial-quote">"${item.quote}"</blockquote>
      <div class="v6-testimonial-author">
        <div class="v6-testimonial-avatar">${item.author[0]}</div>
        <div>
          <div class="v6-testimonial-name">${item.author}</div>
          <div class="v6-testimonial-role">${item.role}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Animate testimonials with scroll reveal (fade + slide)
  const testimonials = gsap.utils.toArray(grid.querySelectorAll('.v6-testimonial'));
  if (testimonials.length) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
    tl.fromTo(testimonials,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
    );
  }
}

function renderFaq(t) {
  const list = document.getElementById('v6FaqList');
  if (!list || !t.faq?.items) return;

  list.innerHTML = t.faq.items.map(item => `
    <div class="v6-faq-item">
      <button class="v6-faq-question" aria-expanded="false">
        <span>${item.q}</span>
        <svg class="v6-faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="v6-faq-answer"><p>${item.a}</p></div>
    </div>
  `).join('');

  // Accordion toggle
  list.querySelectorAll('.v6-faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      list.querySelectorAll('.v6-faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
}

function renderPortfolio(t) {
  if (!t.portfolio?.projects) return;

  // Update existing portfolio card descriptions from i18n
  const cards = document.querySelectorAll('.v6-portfolio-card');
  t.portfolio.projects.forEach((project, i) => {
    if (cards[i]) {
      const titleEl = cards[i].querySelector('.v6-carousel-card-name');
      const descEl = cards[i].querySelector('.v6-carousel-card-desc');
      if (titleEl && project.title) titleEl.textContent = project.title;
      if (descEl && project.description) descEl.textContent = project.description;
    }
  });

  initCarousel();
}

function populateFormDropdowns(t) {
  const select = document.querySelector('.v6-form select');
  if (!select || !t.contact?.projectTypes) return;

  const currentValue = select.value;
  select.innerHTML = t.contact.projectTypes.map((type, i) => `
    <option value="${type}"${i === 0 ? ' disabled selected' : ''}>${type}</option>
  `).join('');

  // Restore selection if possible
  if (currentValue) {
    const matchingOption = Array.from(select.options).find(opt => opt.value === currentValue);
    if (matchingOption) matchingOption.selected = true;
  }
}

/* ===== Contact Form ===== */
function initContactForm() {
  const form = document.querySelector('.v6-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const projectType = formData.get('project') || '';
    const message = formData.get('message') || '';

    const subject = encodeURIComponent(`${name} — ${projectType}`);
    const body = encodeURIComponent(`${message}\n\nEmail: ${email}`);

    window.location.href = `mailto:hello@doscode.kz?subject=${subject}&body=${body}`;
  });
}

/* ===== Three.js Particles ===== */
function initParticles() {
  const heroCanvas = document.getElementById('heroCanvas');
  const waveCanvas = document.getElementById('waveCanvas');
  const ctaCanvas = document.getElementById('ctaCanvas');
  const dotsCanvas = document.getElementById('dotsCanvas');

  if (heroCanvas) initHeroSphere(heroCanvas);
  // Wave terrain now lives in the industries section (light bg variant)
  if (waveCanvas) initWaveTerrain(waveCanvas, { dark: false });
  if (ctaCanvas) initCtaSphere(ctaCanvas);
  if (dotsCanvas) initFloatingDots(dotsCanvas);
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
  initLangSwitcher();
  initNav();
  initHamburger();
  initScrollAnimations();
  initParticles();
  initContactForm();

  // Delayed refresh: after images load & dynamic content settles,
  // recalculate all ScrollTrigger positions for accurate reveals
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
