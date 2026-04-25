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
    title: 'DosCode — сайты, лендинги, интернет-магазины и MVP в Казахстане',
    description:
      'Разрабатываем сайты и лендинги за 48 часов, интернет-магазины, нативные приложения, бизнес-дашборды, MVP и автоматизацию для бизнеса в Казахстане.',
    imageAlt: 'DosCode — разработка сайтов и цифровых продуктов для бизнеса в Казахстане',
    ogLocale: 'ru_KZ',
    ogLocaleAlternates: ['kk_KZ', 'en_US']
  },
  kk: {
    langKey: 'kk',
    htmlLang: 'kk',
    dir: 'kk',
    url: `${siteUrl}/kk/`,
    title: 'DosCode — Қазақстандағы сайттар, лендингтер, e-commerce және MVP',
    description:
      'Қазақстан бизнесіне сайттар мен лендингтерді 48 сағатта, e-commerce, нативті қосымша, бизнес-дашборд, MVP және автоматтандыру жобаларын іске қосамыз.',
    imageAlt: 'DosCode — Қазақстан бизнесіне сайттар мен цифрлық өнімдер әзірлеу',
    ogLocale: 'kk_KZ',
    ogLocaleAlternates: ['ru_KZ', 'en_US']
  },
  en: {
    langKey: 'en',
    htmlLang: 'en',
    dir: 'en',
    url: `${siteUrl}/en/`,
    title: 'DosCode — Websites, Landing Pages, E-commerce and MVPs in Kazakhstan',
    description:
      'DosCode builds websites and landing pages in 48 hours, e-commerce, native apps, business dashboards, MVPs and automation for businesses in Kazakhstan.',
    imageAlt: 'DosCode — websites and digital products for businesses in Kazakhstan',
    ogLocale: 'en_US',
    ogLocaleAlternates: ['ru_KZ', 'kk_KZ']
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
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DosCode',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
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
  };

  return `    <script type="application/ld+json">${JSON.stringify(data)}</script>`;
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
    <noscript>Please enable JavaScript to view this site.</noscript>
    <script type="module" src="${landingEntry}"></script>
  </body>
</html>
`;
}

function buildSitemap(lastmod) {
  const urls = [
    { loc: `${siteUrl}/` },
    { loc: `${siteUrl}/kk/` },
    { loc: `${siteUrl}/en/` }
  ];

  const body = urls
    .map(
      ({ loc }) => `  <url>
    <loc>${loc}</loc>
${alternateLinks.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`).join('\n')}
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${loc === `${siteUrl}/` ? '1.0' : '0.9'}</priority>
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
