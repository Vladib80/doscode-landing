import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const siteUrl = 'https://doscode.kz';
const ogImageUrl = `${siteUrl}/v10/opengraph.jpg`;
const landingVersion = 'v12';
const landingEntry = '/src/v12/main.tsx';

const alternateLinks = [
  { hreflang: 'ru', href: `${siteUrl}/` },
  { hreflang: 'kk', href: `${siteUrl}/kk/` },
  { hreflang: 'en', href: `${siteUrl}/en/` },
  { hreflang: 'x-default', href: `${siteUrl}/` }
];

const localeConfigs = {
  ru: {
    langKey: 'ru',
    htmlLang: 'ru',
    dir: '.',
    url: `${siteUrl}/`,
    title: 'DosCode — сайты, MVP, e-commerce и автоматизация для бизнеса в Казахстане',
    description:
      'Запускаем сайты и лендинги за 48 часов, e-commerce, MVP, Telegram-ботов, WhatsApp-сценарии, дашборды и автоматизацию для бизнеса в Казахстане.',
    imageAlt: 'DosCode — сайты, MVP, боты, дашборды и автоматизация для бизнеса в Казахстане',
    ogLocale: 'ru_KZ',
    ogLocaleAlternates: ['kk_KZ', 'en_US']
  },
  kk: {
    langKey: 'kk',
    htmlLang: 'kk',
    dir: 'kk',
    url: `${siteUrl}/kk/`,
    title: 'DosCode — Қазақстан бизнесіне сайт, MVP, e-commerce және автоматизация',
    description:
      'Қазақстан бизнесіне 48 сағатта лендинг, сайт, e-commerce, MVP, Telegram-бот, WhatsApp сценарийі, дашборд және автоматтандыру жобаларын іске қосамыз.',
    imageAlt: 'DosCode — Қазақстан бизнесіне сайт, MVP, бот, дашборд және автоматизация',
    ogLocale: 'kk_KZ',
    ogLocaleAlternates: ['ru_KZ', 'en_US']
  },
  en: {
    langKey: 'en',
    htmlLang: 'en',
    dir: 'en',
    url: `${siteUrl}/en/`,
    title: 'DosCode — Websites, MVPs, E-commerce and Automation in Kazakhstan',
    description:
      'DosCode launches 48-hour landing pages, websites, e-commerce, MVPs, Telegram bots, WhatsApp flows, dashboards and automation for businesses in Kazakhstan.',
    imageAlt: 'DosCode — websites, MVPs, bots, dashboards and automation for Kazakhstan businesses',
    ogLocale: 'en_US',
    ogLocaleAlternates: ['ru_KZ', 'kk_KZ']
  }
};

const schemaContent = {
  ru: {
    inLanguage: 'ru-KZ',
    serviceDescription:
      'DosCode помогает бизнесу в Казахстане запускать рабочий путь от оффера до заявки, оплаты, аналитики и автоматизации.',
    audience: 'Малый и средний бизнес, фаундеры, рестораны, e-commerce, сервисные компании и операционные команды в Казахстане.',
    services: [
      'Лендинги и сайты за 48 часов',
      'Интернет-магазины и прямые заказы',
      'MVP и SaaS-продукты',
      'Telegram-боты и WhatsApp-сценарии',
      'Дашборды, отчёты и бизнес-автоматизация'
    ],
    faq: [
      {
        question: 'Что делает DosCode?',
        answer: 'DosCode строит сайты, лендинги, e-commerce, MVP, ботов, дашборды и автоматизацию для бизнеса в Казахстане.'
      },
      {
        question: 'Сколько занимает запуск лендинга?',
        answer: 'При готовом оффере и контенте лендинг можно запустить за 48 часов, а оценку проекта получить за день.'
      },
      {
        question: 'Какие языки поддерживает сайт?',
        answer: 'Основная страница DosCode доступна на русском, казахском и английском языках.'
      }
    ]
  },
  kk: {
    inLanguage: 'kk-KZ',
    serviceDescription:
      'DosCode Қазақстан бизнесіне офферден өтінімге, төлемге, аналитикаға және автоматизацияға дейінгі жұмыс істейтін digital-жолды іске қосуға көмектеседі.',
    audience: 'Қазақстандағы шағын және орта бизнес, фаундерлер, ресторандар, e-commerce, сервис компаниялары және операциялық командалар.',
    services: [
      '48 сағатта лендинг және сайт',
      'Интернет-дүкен және тікелей тапсырыс',
      'MVP және SaaS өнімдері',
      'Telegram-боттар және WhatsApp сценарийлері',
      'Дашбордтар, есептер және бизнес-автоматизация'
    ],
    faq: [
      {
        question: 'DosCode не істейді?',
        answer: 'DosCode Қазақстан бизнесіне сайт, лендинг, e-commerce, MVP, бот, дашборд және автоматизация жасайды.'
      },
      {
        question: 'Лендинг қанша уақытта іске қосылады?',
        answer: 'Оффер мен контент дайын болса, лендингті 48 сағатта іске қосуға болады, ал жобаның бағасын бір күнде ала аласыз.'
      },
      {
        question: 'Сайт қандай тілдерді қолдайды?',
        answer: 'DosCode негізгі беті орыс, қазақ және ағылшын тілдерінде қолжетімді.'
      }
    ]
  },
  en: {
    inLanguage: 'en-US',
    serviceDescription:
      'DosCode helps Kazakhstan businesses launch working digital paths from offer to lead, payment, analytics and automation.',
    audience: 'Small and mid-sized businesses, founders, restaurants, e-commerce, service companies and operations teams in Kazakhstan.',
    services: [
      '48-hour landing pages and websites',
      'E-commerce and direct order flows',
      'MVP and SaaS products',
      'Telegram bots and WhatsApp workflows',
      'Dashboards, reporting and business automation'
    ],
    faq: [
      {
        question: 'What does DosCode do?',
        answer: 'DosCode builds websites, landing pages, e-commerce, MVPs, bots, dashboards and automation for businesses in Kazakhstan.'
      },
      {
        question: 'How fast can a landing page launch?',
        answer: 'With a ready offer and content, a landing page can launch in 48 hours and the project estimate can be prepared in a day.'
      },
      {
        question: 'Which languages does the site support?',
        answer: 'The main DosCode page is available in Russian, Kazakh and English.'
      }
    ]
  }
};

function renderAlternateMeta() {
  return alternateLinks
    .map((link) => `    <link rel="alternate" hreflang="${link.hreflang}" href="${link.href}" />`)
    .join('\n');
}

function renderOgLocaleAlternates(locales) {
  return locales
    .map((locale) => `    <meta property="og:locale:alternate" content="${locale}" />`)
    .join('\n');
}

function renderStructuredData(config) {
  const content = schemaContent[config.langKey];
  const pageId = `${config.url}#webpage`;
  const serviceId = `${siteUrl}/#professional-service`;
  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const faqId = `${config.url}#faq`;
  const offerCatalogId = `${siteUrl}/#offer-catalog`;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'DosCode',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`
        },
        email: 'hello@doscode.kz',
        description: config.description,
        areaServed: {
          '@type': 'Country',
          name: 'Kazakhstan'
        },
        availableLanguage: ['ru', 'kk', 'en'],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: 'hello@doscode.kz',
            url: 'https://t.me/doscode_bot',
            availableLanguage: ['Russian', 'Kazakh', 'English']
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: 'DosCode',
        publisher: { '@id': orgId },
        inLanguage: ['ru-KZ', 'kk-KZ', 'en-US']
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: config.url,
        name: config.title,
        description: config.description,
        isPartOf: { '@id': websiteId },
        about: { '@id': serviceId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: ogImageUrl
        },
        inLanguage: content.inLanguage,
        breadcrumb: { '@id': `${config.url}#breadcrumb` },
        mainEntity: { '@id': faqId }
      },
      {
        '@type': 'ProfessionalService',
        '@id': serviceId,
        name: 'DosCode',
        url: siteUrl,
        image: ogImageUrl,
        email: 'hello@doscode.kz',
        priceRange: '100000 KZT - 5000000+ KZT',
        description: content.serviceDescription,
        audience: {
          '@type': 'Audience',
          audienceType: content.audience
        },
        areaServed: {
          '@type': 'Country',
          name: 'Kazakhstan'
        },
        provider: { '@id': orgId },
        hasOfferCatalog: { '@id': offerCatalogId }
      },
      {
        '@type': 'OfferCatalog',
        '@id': offerCatalogId,
        name: 'DosCode services',
        itemListElement: content.services.map((serviceName) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: serviceName,
            provider: { '@id': orgId },
            areaServed: {
              '@type': 'Country',
              name: 'Kazakhstan'
            }
          }
        }))
      },
      {
        '@type': 'FAQPage',
        '@id': faqId,
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${config.url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'DosCode',
            item: config.url
          }
        ]
      }
    ]
  };

  return `    <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function renderShell(config) {
  return `<!DOCTYPE html>
<html lang="${config.htmlLang}" data-landing-version="${landingVersion}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="doscode-landing-version" content="${landingVersion}" />

    <title>${config.title}</title>
    <meta name="description" content="${config.description}" />
    <link rel="canonical" href="${config.url}" />
${renderAlternateMeta()}
    <link rel="alternate" type="text/plain" title="DosCode AI summary" href="${siteUrl}/llms.txt" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="DosCode" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${config.url}" />
    <meta property="og:title" content="${config.title}" />
    <meta property="og:description" content="${config.description}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:alt" content="${config.imageAlt}" />
    <meta property="og:locale" content="${config.ogLocale}" />
${renderOgLocaleAlternates(config.ogLocaleAlternates)}
    <meta property="og:site_name" content="DosCode" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${config.title}" />
    <meta name="twitter:description" content="${config.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <meta name="twitter:image:alt" content="${config.imageAlt}" />
    <meta name="theme-color" content="#f5f1e6" id="themeColorMeta" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
${renderStructuredData(config)}

    <script>
      (function () {
        var root = document.documentElement;
        var defaultLang = "${config.langKey}";

        try {
          var url = new URL(window.location.href);
          var queryLang = url.searchParams.get("lang");
          var redirectMap = { ru: "/", kk: "/kk/", kz: "/kk/", en: "/en/" };
          if (queryLang && redirectMap[queryLang] && url.pathname !== redirectMap[queryLang]) {
            window.location.replace(redirectMap[queryLang] + url.hash);
            return;
          }

          var path = window.location.pathname;
          var forcedLang = path.indexOf("/kk/") === 0 ? "kk" : path.indexOf("/en/") === 0 ? "en" : null;
          var storedLang = null;

          try {
            storedLang = localStorage.getItem("doscode-lang");
          } catch (e) {
            storedLang = null;
          }

          var lang = forcedLang || (storedLang === "ru" || storedLang === "kk" || storedLang === "en" ? storedLang : defaultLang);
          root.lang = lang;
          root.dataset.lang = lang;

          if (forcedLang) {
            try {
              localStorage.setItem("doscode-lang", forcedLang);
            } catch (e) {}
          }

          var storedTheme = null;
          try {
            storedTheme = localStorage.getItem("doscode-v10-theme");
          } catch (e) {
            storedTheme = null;
          }

          var theme = storedTheme === "dark" ? "dark" : "light";
          root.classList.toggle("v10-light", theme === "light");
          root.classList.toggle("dark", theme !== "light");
          root.dataset.theme = theme;
          root.style.colorScheme = theme === "light" ? "light" : "dark";

          var meta = document.getElementById("themeColorMeta");
          if (meta) {
            meta.setAttribute("content", theme === "light" ? "#f5f1e6" : "#0a0a0d");
          }
        } catch (e) {
          root.lang = defaultLang;
          root.dataset.lang = defaultLang;
          root.classList.add("v10-light");
          root.dataset.theme = "light";
          root.style.colorScheme = "light";
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <main style="max-width: 860px; margin: 40px auto; padding: 24px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6;">
        <h1>DosCode - сайты, лендинги, MVP и автоматизация для бизнеса в Казахстане</h1>
        <p>DosCode запускает рабочий путь от предложения до заявки: сайт, форма, Telegram или WhatsApp, оплата, аналитика, бот, дашборд или MVP.</p>
        <p>Услуги: лендинги и сайты, интернет-магазины, нативные приложения, бизнес-дашборды, MVP, Telegram-боты, WhatsApp-сценарии и AI-автоматизация.</p>
        <p>Контакты: <a href="https://t.me/doscode_bot">Telegram</a> · <a href="mailto:hello@doscode.kz">hello@doscode.kz</a> · <a href="/contacts/">контактная информация</a> · <a href="/privacy/">политика конфиденциальности</a> · <a href="/terms/">условия работы</a>.</p>
      </main>
    </noscript>
    <script type="module" src="${landingEntry}"></script>
  </body>
</html>
`;
}

function buildSitemap(lastmod) {
  const restopulseAlternateLinks = [
    { hreflang: 'ru-KZ', href: `${siteUrl}/restopulse` },
    { hreflang: 'kk-KZ', href: `${siteUrl}/kk/restopulse` },
    { hreflang: 'x-default', href: `${siteUrl}/restopulse` }
  ];
  const whatsappAlternateLinks = [
    { hreflang: 'ru-KZ', href: `${siteUrl}/whatsapp` },
    { hreflang: 'kk-KZ', href: `${siteUrl}/kk/whatsapp` },
    { hreflang: 'x-default', href: `${siteUrl}/whatsapp` }
  ];

  const urls = [
    { loc: `${siteUrl}/`, alternates: alternateLinks, priority: '1.0' },
    { loc: `${siteUrl}/kk/`, alternates: alternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/en/`, alternates: alternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/restopulse`, alternates: restopulseAlternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/kk/restopulse`, alternates: restopulseAlternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/whatsapp`, alternates: whatsappAlternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/kk/whatsapp`, alternates: whatsappAlternateLinks, priority: '0.9' },
    { loc: `${siteUrl}/contacts/`, alternates: [{ hreflang: 'ru-KZ', href: `${siteUrl}/contacts/` }], priority: '0.7' },
    { loc: `${siteUrl}/privacy/`, alternates: [{ hreflang: 'ru-KZ', href: `${siteUrl}/privacy/` }], priority: '0.5' },
    { loc: `${siteUrl}/terms/`, alternates: [{ hreflang: 'ru-KZ', href: `${siteUrl}/terms/` }], priority: '0.5' }
  ];

  const body = urls
    .map(
      ({ loc, alternates, priority }) => `  <url>
    <loc>${loc}</loc>
${alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`).join('\n')}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}

async function main() {
  for (const locale of Object.keys(localeConfigs)) {
    const config = localeConfigs[locale];
    const dir = path.join(rootDir, config.dir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), renderShell(config));
  }

  await fs.mkdir(publicDir, { recursive: true });
  const lastmod = new Date().toISOString().slice(0, 10);
  await fs.writeFile(sitemapPath, buildSitemap(lastmod));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
