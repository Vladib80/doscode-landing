import './styles/global.css';
import ruLocale from './i18n/ru.json';
import kkLocale from './i18n/kk.json';
import enLocale from './i18n/en.json';

const locales = { ru: ruLocale, kk: kkLocale, en: enLocale };
let currentLang = localStorage.getItem('doscode-lang') || 'ru';

/* ===== i18n ===== */
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

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderStats(t);
  renderServices(t);
  renderProcess(t);
  renderPortfolio(t);
  renderIndustries(t);
  renderTestimonials(t);
  renderFaq(t);
  populateFormDropdowns(t);
  initTextSplit();

  document.documentElement.lang = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';
}

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('doscode-lang', lang);
  applyTranslations(lang);
}

/* ===== STATS BAR ===== */
function renderStats(t) {
  const grid = document.getElementById('statsGrid');
  if (!grid || !t.stats?.items) return;
  grid.innerHTML = t.stats.items.map(item => `
    <div class="stat-item reveal">
      <span class="stat-value">${item.value}</span>
      <span class="stat-label">${item.label}</span>
    </div>
  `).join('');

  // Client logos (static — same across langs)
  const logosGrid = document.getElementById('logosGrid');
  if (logosGrid) {
    const logos = ['DosPass', 'Chicago Pizza', 'MMG Group'];
    logosGrid.innerHTML = logos.map(name => `<span class="logo-pill">${name}</span>`).join('');
  }
  observeReveals();
}

/* ===== PROCESS ===== */
function renderProcess(t) {
  const el = document.getElementById('processSteps');
  if (!el || !t.process?.steps) return;
  el.innerHTML = t.process.steps.map((step, i) => `
    <div class="process-step reveal" style="transition-delay: ${i * 0.15}s">
      <div class="process-num">${step.num}</div>
      <div class="process-connector"></div>
      <div class="process-content">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </div>
    </div>
  `).join('');
  observeReveals();
}

/* ===== TESTIMONIALS ===== */
function renderTestimonials(t) {
  const grid = document.getElementById('testimonialsGrid');
  if (!grid || !t.testimonials?.items) return;
  const starsSvg = Array(5).fill(`<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('');
  grid.innerHTML = t.testimonials.items.map((item, i) => `
    <div class="testimonial-card reveal" style="transition-delay: ${i * 0.12}s">
      <div class="testimonial-stars">${starsSvg}</div>
      <blockquote class="testimonial-quote">"${item.quote}"</blockquote>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${item.author[0]}</div>
        <div>
          <div class="testimonial-name">${item.author}</div>
          <div class="testimonial-role">${item.role}</div>
        </div>
      </div>
    </div>
  `).join('');
  observeReveals();
}

/* ===== FAQ ===== */
function renderFaq(t) {
  const list = document.getElementById('faqList');
  if (!list || !t.faq?.items) return;
  list.innerHTML = t.faq.items.map((item, i) => `
    <div class="faq-item reveal" style="transition-delay: ${i * 0.07}s">
      <button class="faq-question" aria-expanded="false">
        <span>${item.q}</span>
        <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq-answer"><p>${item.a}</p></div>
    </div>
  `).join('');

  // Accordion toggle
  list.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      list.querySelectorAll('.faq-question').forEach(b => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
  });
  observeReveals();
}

/* ===== SERVICE ICONS (inline SVG) ===== */
const serviceIcons = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="10" width="7" height="11" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`
];

/* ===== SERVICE GRAPHICS (bottom illustrations) ===== */
const serviceGraphics = [
  // 1. Web & Mobile — browser window + phone side by side
  `<svg class="svc-graphic-svg" viewBox="0 0 240 148" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round">
    <rect x="6" y="8" width="148" height="136" rx="7" opacity="0.18"/>
    <rect x="6" y="8" width="148" height="20" rx="7" fill="currentColor" opacity="0.07"/>
    <circle cx="17" cy="18" r="3" fill="currentColor" opacity="0.2"/>
    <circle cx="27" cy="18" r="3" fill="currentColor" opacity="0.15"/>
    <circle cx="37" cy="18" r="3" fill="currentColor" opacity="0.1"/>
    <rect x="50" y="12" width="76" height="10" rx="3" opacity="0.09"/>
    <rect x="12" y="36" width="136" height="6" rx="1" opacity="0.07"/>
    <rect x="110" y="36" width="38" height="6" rx="3" fill="currentColor" opacity="0.12"/>
    <rect x="12" y="50" width="80" height="10" rx="2" fill="currentColor" opacity="0.2"/>
    <rect x="12" y="64" width="60" height="6" rx="2" opacity="0.1"/>
    <rect x="12" y="76" width="52" height="16" rx="8" fill="currentColor" opacity="0.22"/>
    <rect x="94" y="44" width="54" height="50" rx="5" opacity="0.07"/>
    <line x1="94" y1="44" x2="148" y2="94" opacity="0.04" stroke-width="0.5"/>
    <line x1="148" y1="44" x2="94" y2="94" opacity="0.04" stroke-width="0.5"/>
    <rect x="12" y="104" width="40" height="18" rx="3" opacity="0.08"/>
    <rect x="58" y="104" width="40" height="18" rx="3" opacity="0.08"/>
    <rect x="104" y="104" width="40" height="18" rx="3" opacity="0.08"/>
    <rect x="16" y="108" width="24" height="4" rx="1" fill="currentColor" opacity="0.15"/>
    <rect x="62" y="108" width="24" height="4" rx="1" fill="currentColor" opacity="0.15"/>
    <rect x="108" y="108" width="24" height="4" rx="1" fill="currentColor" opacity="0.15"/>
    <rect x="166" y="6" width="68" height="136" rx="14" opacity="0.22"/>
    <rect x="171" y="18" width="58" height="112" rx="4" opacity="0.06"/>
    <rect x="186" y="8" width="28" height="5" rx="2.5" fill="currentColor" opacity="0.12"/>
    <rect x="171" y="18" width="58" height="12" rx="2" opacity="0.1"/>
    <rect x="176" y="36" width="48" height="28" rx="4" fill="currentColor" opacity="0.13"/>
    <rect x="181" y="41" width="30" height="5" rx="2" fill="currentColor" opacity="0.3"/>
    <rect x="181" y="50" width="20" height="4" rx="2" opacity="0.18"/>
    <rect x="176" y="70" width="48" height="10" rx="3" opacity="0.09"/>
    <rect x="176" y="84" width="48" height="10" rx="3" opacity="0.09"/>
    <rect x="176" y="98" width="48" height="10" rx="3" opacity="0.09"/>
    <rect x="180" y="73" width="22" height="4" rx="1" fill="currentColor" opacity="0.14"/>
    <rect x="180" y="87" width="18" height="4" rx="1" fill="currentColor" opacity="0.14"/>
    <rect x="180" y="101" width="26" height="4" rx="1" fill="currentColor" opacity="0.14"/>
    <rect x="171" y="120" width="58" height="10" rx="2" opacity="0.08"/>
    <circle cx="185" cy="125" r="3" fill="currentColor" opacity="0.2"/>
    <circle cx="200" cy="125" r="2.5" opacity="0.08"/>
    <circle cx="215" cy="125" r="2.5" opacity="0.08"/>
  </svg>`,

  // 2. Dashboards — bar chart + trend line + stat cards
  `<svg class="svc-graphic-svg" viewBox="0 0 240 148" fill="none" stroke="currentColor" stroke-width="0.8">
    <line x1="28" y1="18" x2="232" y2="18" opacity="0.05"/>
    <line x1="28" y1="40" x2="232" y2="40" opacity="0.05"/>
    <line x1="28" y1="62" x2="232" y2="62" opacity="0.05"/>
    <line x1="28" y1="84" x2="232" y2="84" opacity="0.05"/>
    <line x1="28" y1="106" x2="232" y2="106" opacity="0.05"/>
    <line x1="28" y1="18" x2="28" y2="108" opacity="0.1"/>
    <rect x="42" y="62" width="20" height="44" rx="3" fill="currentColor" opacity="0.12"/>
    <rect x="72" y="40" width="20" height="66" rx="3" fill="currentColor" opacity="0.18"/>
    <rect x="102" y="50" width="20" height="56" rx="3" fill="currentColor" opacity="0.14"/>
    <rect x="132" y="22" width="20" height="84" rx="3" fill="currentColor" opacity="0.28"/>
    <rect x="162" y="48" width="20" height="58" rx="3" fill="currentColor" opacity="0.16"/>
    <rect x="192" y="34" width="20" height="72" rx="3" fill="currentColor" opacity="0.22"/>
    <polyline points="52,66 82,44 112,54 142,26 172,52 202,38" fill="none" stroke-width="1.5" opacity="0.45"/>
    <circle cx="52" cy="66" r="3" fill="currentColor" opacity="0.5"/>
    <circle cx="82" cy="44" r="3" fill="currentColor" opacity="0.5"/>
    <circle cx="142" cy="26" r="4" fill="currentColor" opacity="0.75"/>
    <circle cx="202" cy="38" r="3" fill="currentColor" opacity="0.5"/>
    <rect x="42" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="72" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="102" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="132" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="162" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="192" y="112" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="10" y="124" width="64" height="20" rx="4" opacity="0.08"/>
    <rect x="16" y="129" width="30" height="5" rx="2" fill="currentColor" opacity="0.18"/>
    <rect x="16" y="137" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="82" y="124" width="64" height="20" rx="4" opacity="0.08"/>
    <rect x="88" y="129" width="30" height="5" rx="2" fill="currentColor" opacity="0.18"/>
    <rect x="88" y="137" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="154" y="124" width="64" height="20" rx="4" opacity="0.08"/>
    <rect x="160" y="129" width="30" height="5" rx="2" fill="currentColor" opacity="0.18"/>
    <rect x="160" y="137" width="20" height="4" rx="1" opacity="0.1"/>
    <rect x="6" y="16" width="16" height="4" rx="1" opacity="0.08"/>
    <rect x="6" y="60" width="16" height="4" rx="1" opacity="0.08"/>
    <rect x="6" y="104" width="16" height="4" rx="1" opacity="0.08"/>
  </svg>`,

  // 3. AI Agents — chat bubbles + bot elements
  `<svg class="svc-graphic-svg" viewBox="0 0 240 148" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round">
    <rect x="8" y="12" width="30" height="30" rx="10" fill="currentColor" opacity="0.1"/>
    <rect x="8" y="12" width="30" height="30" rx="10" opacity="0.18"/>
    <rect x="17" y="22" width="12" height="2" rx="1" fill="currentColor" opacity="0.3"/>
    <rect x="21" y="18" width="4" height="10" rx="2" fill="currentColor" opacity="0.3"/>
    <rect x="46" y="12" width="148" height="32" rx="16" fill="currentColor" opacity="0.1"/>
    <rect x="46" y="12" width="148" height="32" rx="16" opacity="0.15"/>
    <rect x="58" y="23" width="88" height="5" rx="2.5" fill="currentColor" opacity="0.28"/>
    <rect x="58" y="32" width="62" height="5" rx="2.5" opacity="0.18"/>
    <rect x="46" y="52" width="80" height="28" rx="14" fill="currentColor" opacity="0.08"/>
    <rect x="46" y="52" width="80" height="28" rx="14" opacity="0.12"/>
    <circle cx="68" cy="66" r="4" fill="currentColor" opacity="0.28"/>
    <circle cx="82" cy="66" r="4" fill="currentColor" opacity="0.38"/>
    <circle cx="96" cy="66" r="4" fill="currentColor" opacity="0.5"/>
    <circle cx="228" cy="98" r="14" fill="currentColor" opacity="0.08"/>
    <circle cx="228" cy="98" r="14" opacity="0.12"/>
    <circle cx="228" cy="93" r="5" fill="currentColor" opacity="0.15"/>
    <path d="M220 107 q4-6 8-6 t8 6" fill="currentColor" opacity="0.15" stroke="none"/>
    <rect x="40" y="84" width="180" height="28" rx="14" opacity="0.1"/>
    <rect x="52" y="94" width="110" height="5" rx="2.5" opacity="0.18"/>
    <rect x="52" y="103" width="80" height="5" rx="2.5" opacity="0.12"/>
    <rect x="46" y="120" width="160" height="24" rx="12" fill="currentColor" opacity="0.12"/>
    <rect x="58" y="129" width="100" height="5" rx="2.5" fill="currentColor" opacity="0.25"/>
    <line x1="190" y1="8" x2="232" y2="8" stroke-dasharray="4 3" opacity="0.15"/>
    <line x1="232" y1="8" x2="232" y2="46" stroke-dasharray="4 3" opacity="0.15"/>
    <circle cx="232" cy="8" r="2.5" fill="currentColor" opacity="0.3"/>
    <circle cx="232" cy="46" r="2" fill="currentColor" opacity="0.22"/>
    <circle cx="190" cy="8" r="2" fill="currentColor" opacity="0.2"/>
    <line x1="190" y1="8" x2="210" y2="26" stroke-dasharray="3 2" opacity="0.1"/>
  </svg>`,

  // 4. Landing / MVP — page wireframe with sections
  `<svg class="svc-graphic-svg" viewBox="0 0 240 148" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round">
    <rect x="8" y="5" width="224" height="142" rx="7" opacity="0.15"/>
    <rect x="8" y="5" width="224" height="18" rx="7" fill="currentColor" opacity="0.07"/>
    <circle cx="19" cy="14" r="3" fill="currentColor" opacity="0.15"/>
    <circle cx="29" cy="14" r="3" fill="currentColor" opacity="0.12"/>
    <circle cx="39" cy="14" r="3" fill="currentColor" opacity="0.1"/>
    <rect x="55" y="9" width="100" height="10" rx="3" opacity="0.08"/>
    <rect x="16" y="30" width="208" height="8" rx="2" opacity="0.07"/>
    <rect x="172" y="30" width="52" height="8" rx="4" fill="currentColor" opacity="0.16"/>
    <rect x="16" y="46" width="118" height="11" rx="3" fill="currentColor" opacity="0.2"/>
    <rect x="16" y="62" width="94" height="7" rx="2" opacity="0.1"/>
    <rect x="16" y="73" width="76" height="7" rx="2" opacity="0.08"/>
    <rect x="16" y="86" width="80" height="20" rx="10" fill="currentColor" opacity="0.25"/>
    <rect x="30" y="93" width="48" height="5" rx="2" fill="currentColor" opacity="0.5"/>
    <rect x="158" y="40" width="62" height="72" rx="5" opacity="0.08"/>
    <line x1="158" y1="40" x2="220" y2="112" opacity="0.04" stroke-width="0.5"/>
    <line x1="220" y1="40" x2="158" y2="112" opacity="0.04" stroke-width="0.5"/>
    <rect x="16" y="118" width="62" height="24" rx="4" opacity="0.08"/>
    <rect x="86" y="118" width="62" height="24" rx="4" opacity="0.08"/>
    <rect x="156" y="118" width="62" height="24" rx="4" opacity="0.08"/>
    <rect x="22" y="123" width="38" height="5" rx="2" fill="currentColor" opacity="0.15"/>
    <rect x="22" y="132" width="26" height="4" rx="1" opacity="0.08"/>
    <rect x="92" y="123" width="38" height="5" rx="2" fill="currentColor" opacity="0.15"/>
    <rect x="92" y="132" width="26" height="4" rx="1" opacity="0.08"/>
    <rect x="162" y="123" width="38" height="5" rx="2" fill="currentColor" opacity="0.15"/>
    <rect x="162" y="132" width="26" height="4" rx="1" opacity="0.08"/>
    <rect x="136" y="86" width="84" height="20" rx="5" opacity="0.07"/>
    <rect x="142" y="91" width="28" height="5" rx="2" fill="currentColor" opacity="0.18"/>
    <rect x="142" y="99" width="20" height="4" rx="1" opacity="0.1"/>
  </svg>`
];

function renderServices(t) {
  const grid = document.getElementById('servicesGrid');
  if (!grid || !t.services?.items) return;
  grid.innerHTML = t.services.items.map((item, i) => `
    <div class="service-card reveal" style="transition-delay: ${i * 0.1}s">
      <div class="service-body">
        <div class="service-icon">${serviceIcons[i] || ''}</div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${(item.bullets && item.bullets.length) ? `
          <ul class="service-bullets">
            ${item.bullets.map(b => `<li><span class="svc-dot"></span>${b}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
      <div class="service-graphic">${serviceGraphics[i] || ''}</div>
    </div>
  `).join('');
  observeReveals();
}

function renderPortfolio(t) {
  const grid = document.getElementById('portfolioGrid');
  if (!grid || !t.portfolio?.projects) return;

  const browserBar = `
    <div class="mockup-browser-bar">
      <span class="mockup-dot"></span>
      <span class="mockup-dot"></span>
      <span class="mockup-dot"></span>
      <span class="mockup-url-bar"></span>
    </div>`;

  const mockups = [
    `<div class="mockup-browser">${browserBar}
      <img class="mockup-screenshot" src="/screenshots/dospass.jpg" alt="DosPass Analytics Dashboard" loading="lazy">
    </div>`,
    `<div class="mockup-browser">${browserBar}
      <img class="mockup-screenshot" src="/screenshots/chicagopizza.jpg" alt="Chicago Pizza Menu" loading="lazy">
    </div>`,
    `<div class="mockup-browser">${browserBar}
      <img class="mockup-screenshot" src="/screenshots/mmg.jpg" alt="MMG Analytics Dashboard" loading="lazy">
    </div>`,
  ];

  const checkSvg = `<svg class="feature-check" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  grid.innerHTML = t.portfolio.projects.map((proj, i) => `
    <div class="portfolio-card${proj.comingSoon ? ' portfolio-card--coming-soon' : ''} reveal" style="transition-delay: ${i * 0.12}s">
      ${proj.comingSoon ? `<span class="coming-soon-badge">${proj.comingSoon}</span>` : ''}
      <div class="portfolio-mockup">${mockups[i] || mockups[0]}</div>
      <div class="portfolio-info">
        ${proj.type ? `<span class="portfolio-type">${proj.type}</span>` : ''}
        <h3>${proj.url
          ? `<a class="portfolio-name-link" href="${proj.url}" target="_blank" rel="noopener noreferrer">${proj.name}<svg class="link-arrow" viewBox="0 0 16 16" fill="none"><path d="M3 13L13 3M13 3H7M13 3v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`
          : proj.name
        }</h3>
        <p>${proj.description}</p>
        ${(proj.features && proj.features.length) ? `
          <ul class="portfolio-features">
            ${proj.features.map(f => `<li>${checkSvg}${f}</li>`).join('')}
          </ul>
        ` : ''}
        <div class="portfolio-tags">
          ${proj.tags.map(tag => `<span class="portfolio-tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="card-glare"></div>
    </div>
  `).join('');
  observeReveals();
  initTilt();
}

/* ===== INDUSTRY ICONS (inline SVG) ===== */
const industryIcons = {
  restaurant: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v7a4 4 0 008 0V3"/><path d="M7 3v18"/><path d="M14 3c0 5 5 3 5 8a5 5 0 01-5 5"/><path d="M14 16v5"/></svg>`,
  retail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  healthcare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  education: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  agency: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 11l3-4 3 3 3-4"/></svg>`,
  logistics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  govtender: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/><path d="M9 9h1"/></svg>`,
  realestate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
};

function renderIndustries(t) {
  const grid = document.getElementById('industriesGrid');
  if (!grid || !t.industries?.items) return;

  grid.innerHTML = t.industries.items.map((ind, i) => `
    <div class="industry-card reveal" style="transition-delay: ${i * 0.07}s">
      <div class="industry-icon">
        ${industryIcons[ind.icon] || ''}
      </div>
      <h3 class="industry-name">${ind.name}</h3>
      <ul class="industry-items">
        ${ind.items.map(item => `<li><span class="industry-dot"></span>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  observeReveals();
}

function populateFormDropdowns(t) {
  const populate = (id, items) => {
    const el = document.getElementById(id);
    if (!el || !items) return;
    el.innerHTML = '<option value="">—</option>' +
      items.map(item => `<option value="${item}">${item}</option>`).join('');
  };
  populate('formType', t.form?.projectTypes);
  populate('formBudget', t.form?.budgets);
  populate('formTimeline', t.form?.timelines);
}

/* ===== TEXT SPLIT ANIMATION ===== */
function initTextSplit() {
  const headline = document.getElementById('heroHeadline');
  if (!headline) return;

  const html = headline.innerHTML;
  const parts = [];
  let cursor = 0;
  const spanRe = /<span class="accent">(.*?)<\/span>/g;
  let match;

  while ((match = spanRe.exec(html)) !== null) {
    if (match.index > cursor) {
      const before = html.slice(cursor, match.index).trim();
      if (before) {
        before.split(/\s+/).forEach(w => {
          if (w) parts.push({ text: w, accent: false });
        });
      }
    }
    parts.push({ text: match[1], accent: true });
    cursor = match.index + match[0].length;
  }
  const after = html.slice(cursor).trim();
  if (after) {
    after.split(/\s+/).forEach(w => {
      if (w) parts.push({ text: w, accent: false });
    });
  }

  headline.innerHTML = parts.map((p, i) => {
    const cls = p.accent ? 'word accent' : 'word';
    return `<span class="${cls}" style="animation-delay: ${i * 0.08}s">${p.text}</span>`;
  }).join(' ');

  requestAnimationFrame(() => {
    headline.classList.add('words-ready');
  });
}

/* ===== 3D TILT (Portfolio Cards) ===== */
function initTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    const glare = card.querySelector('.card-glare');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;

      if (glare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
        glare.style.opacity = '1';
      }
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s var(--ease-out)';
      if (glare) glare.style.opacity = '0';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

/* ===== SCROLL REVEAL ===== */
function observeReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

/* ===== NAVBAR SCROLL ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    links.classList.toggle('mobile-open');
    overlay.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('mobile-open') ? 'hidden' : '';
  });

  overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');
  burger.classList.remove('open');
  links.classList.remove('mobile-open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== FORM ===== */
function initForm() {
  const expandBtn = document.getElementById('formExpandBtn');
  const step2 = document.getElementById('formStep2');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  expandBtn.addEventListener('click', () => {
    step2.classList.add('expanded');
    expandBtn.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log('Form submission:', data);

    form.querySelectorAll('.form-step, .form-expand-btn, .btn-submit').forEach(el => {
      el.style.display = 'none';
    });
    success.classList.add('show');
  });
}

/* ===== LANG SWITCHER ===== */
function initLangSwitcher() {
  document.getElementById('langSwitcher').addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn && btn.dataset.lang) {
      switchLang(btn.dataset.lang);
    }
  });
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLang);
  initNavbar();
  initMobileMenu();
  initForm();
  initLangSwitcher();
  observeReveals();
});
