import './styles/v7.css';
import ruLocale from '../i18n/ru.json';
import kkLocale from '../i18n/kk.json';
import enLocale from '../i18n/en.json';

// GSAP loaded from CDN (global)
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
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

  document.querySelectorAll('.v7-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderTestimonials(t);
  renderPortfolio(t);

  document.documentElement.lang = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';

  const metaTitle = getNestedValue(t, 'meta.title');
  if (metaTitle) document.title = metaTitle;

  const metaDesc = getNestedValue(t, 'meta.description');
  if (metaDesc) {
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', metaDesc);
  }

  // Re-split hero headline for word animation
  initHeroWords();
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('doscode-lang', lang);
  applyTranslations(lang);
}

/* ===== Language Switcher ===== */
function initLangSwitcher() {
  document.querySelectorAll('.v7-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.v7-lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      switchLang(btn.dataset.lang);
    });
  });
}

/* ===== Navigation Scroll Morph ===== */
function initNav() {
  const nav = document.getElementById('v7Nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('v7-nav--scrolled');
    } else {
      nav.classList.remove('v7-nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Hamburger Menu ===== */
function initHamburger() {
  const burger = document.querySelector('.v7-nav-burger');
  const links = document.querySelector('.v7-nav-links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    links.classList.toggle('v7-nav-links--open');
    burger.classList.toggle('active');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('v7-nav-links--open');
      burger.classList.remove('active');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      links.classList.remove('v7-nav-links--open');
      burger.classList.remove('active');
    }
  });
}

/* ===== Hero Word Split ===== */
function initHeroWords() {
  const headline = document.getElementById('v7HeroHeadline');
  if (!headline) return;

  const text = headline.textContent.trim();
  const words = text.split(/\s+/);

  headline.innerHTML = words.map(w => `<span class="v7-word">${w}</span>`).join(' ');
}

/* ===== GSAP ScrollTrigger Animations ===== */
function initScrollAnimations() {

  // ── Hero: staggered word reveal via clipPath (plays immediately) ──
  const heroWords = gsap.utils.toArray('#v7HeroHeadline .v7-word');
  if (heroWords.length) {
    gsap.fromTo(heroWords,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.08,
        delay: 0.2,
      }
    );
  }

  // Hero subline + CTA fade up (plays immediately)
  const heroSubline = document.querySelector('.v7-hero-subline');
  const heroCta = document.querySelector('.v7-hero-cta');
  if (heroSubline) gsap.fromTo(heroSubline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.8 });
  if (heroCta) gsap.fromTo(heroCta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.0 });

  // ── Section title clipPath reveals (scroll-triggered, visible by default) ──
  gsap.utils.toArray('.v7-clip-reveal').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power4.out' }
        );
      }
    });
  });

  // ── Section labels fade in (scroll-triggered, visible by default) ──
  gsap.utils.toArray('.v7-section-label').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
        );
      }
    });
  });

  // ── Services: staggered card fade-up ──────────────────────────────
  const serviceCards = gsap.utils.toArray('.v7-service-card');
  if (serviceCards.length) {
    ScrollTrigger.create({
      trigger: '.v7-services-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(serviceCards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }
        );
      }
    });
  }

  // ── Portfolio: carousel fade-up ───────────────────────────────────
  const carousel = document.querySelector('.v7-carousel');
  if (carousel) {
    ScrollTrigger.create({
      trigger: carousel,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(carousel,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );
      }
    });
  }

  // ── Process: staggered left-to-right reveal ───────────────────────
  const processSteps = gsap.utils.toArray('.v7-process-step');
  if (processSteps.length) {
    ScrollTrigger.create({
      trigger: '.v7-process-steps',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo(processSteps,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
        );
      }
    });
  }

  // ── Contact: CTA card + form fade-up ──────────────────────────────
  const contactSection = document.querySelector('#contact');
  if (contactSection) {
    const ctaCard = contactSection.querySelector('.v7-cta-card');
    const form = contactSection.querySelector('.v7-form');
    ScrollTrigger.create({
      trigger: contactSection,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        if (ctaCard) gsap.fromTo(ctaCard, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
        if (form) gsap.fromTo(form, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.15 });
      }
    });
  }

  // ── Footer ────────────────────────────────────────────────────────
  const footer = document.querySelector('.v7-footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.fromTo(footer, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  }

  ScrollTrigger.refresh();
}

/* ===== Dynamic Rendering ===== */
function renderTestimonials(t) {
  const container = document.getElementById('v7TestimonialsInline');
  if (!container || !t.testimonials?.items) return;

  // Show max 2 testimonials
  const items = t.testimonials.items.slice(0, 2);

  container.innerHTML = items.map(item => `
    <div class="v7-testimonial">
      <blockquote class="v7-testimonial-quote">"${item.quote}"</blockquote>
      <div class="v7-testimonial-author">
        <div class="v7-testimonial-avatar">${item.author[0]}</div>
        <div>
          <div class="v7-testimonial-name">${item.author}</div>
          <div class="v7-testimonial-role">${item.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderPortfolio(t) {
  if (!t.portfolio?.projects) return;

  const cards = document.querySelectorAll('.v7-portfolio-card');
  t.portfolio.projects.forEach((project, i) => {
    if (cards[i]) {
      const titleEl = cards[i].querySelector('.v7-carousel-card-name');
      const descEl = cards[i].querySelector('.v7-carousel-card-desc');
      if (titleEl && project.title) titleEl.textContent = project.title;
      if (descEl && project.description) descEl.textContent = project.description;
    }
  });

  initCarousel();
}

/* ===== Carousel (ported from v6) ===== */
function initCarousel() {
  const carousel = document.getElementById('portfolioCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.v7-carousel-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.v7-carousel-card'));
  const counter = document.querySelector('.v7-carousel-counter');
  const prevBtn = document.querySelector('.v7-carousel-arrow--prev');
  const nextBtn = document.querySelector('.v7-carousel-arrow--next');
  const total = cards.length;

  if (total === 0) return;

  // ARIA setup
  carousel.setAttribute('aria-label', 'Portfolio');
  cards.forEach((card, i) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `Project ${i + 1} of ${total}`);
    card.setAttribute('tabindex', '0');
  });

  let activeIndex = 0;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function updateCounter() {
    if (!counter) return;
    counter.textContent = `${pad(activeIndex + 1)} / ${pad(total)}`;
  }

  function setActiveCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
        const color = card.dataset.color;
        if (color) card.style.backgroundColor = color;
      } else {
        card.classList.remove('active');
        card.style.backgroundColor = '';
      }
    });
    activeIndex = index;
    updateCounter();
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setActiveCard(clamped);
    cards[clamped].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  function goPrev() { goTo(activeIndex - 1); }
  function goNext() { goTo(activeIndex + 1); }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  // Scroll-based detection for manual drag/swipe
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(cardCenter - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveCard(closestIndex);
      }
    }, 300);
  }, { passive: true });

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
      cards[activeIndex].focus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
      cards[activeIndex].focus();
    }
  });

  // Click on card to select
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== activeIndex) goTo(i);
    });
  });

  // Initial state
  track.scrollLeft = 0;
  setActiveCard(0);
  updateCounter();
}

/* ===== Contact Form ===== */
function initContactForm() {
  const form = document.querySelector('.v7-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name') || '';
    const email = formData.get('email') || '';
    const projectType = formData.get('project_type') || '';
    const message = formData.get('message') || '';

    const subject = encodeURIComponent(`${name} — ${projectType}`);
    const body = encodeURIComponent(`${message}\n\nEmail: ${email}`);

    window.location.href = `mailto:hello@doscode.kz?subject=${subject}&body=${body}`;
  });
}

/* ===== Init ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
  initLangSwitcher();
  initNav();
  initHamburger();
  initHeroWords();
  initScrollAnimations();
  initContactForm();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
