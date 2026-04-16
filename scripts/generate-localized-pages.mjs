import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const rootDir = process.cwd();
const siteUrl = 'https://doscode.kz';
const sourcePath = path.join(rootDir, 'index.html');
const publicDir = path.join(rootDir, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const localeConfigs = {
  ru: {
    langKey: 'ru',
    htmlLang: 'ru',
    dir: '',
    url: `${siteUrl}/`,
    title: 'DosCode — Разработка веб-приложений, MVP и Telegram-ботов в Алматы',
    description: 'DosCode в Алматы: веб-приложения, MVP, Telegram-боты, AI-автоматизация и внутренние системы для бизнеса. Лендинги за 48 часов, MVP за 4–8 недель.',
    ogLocale: 'ru_KZ',
    ogLocaleAlternates: ['kk_KZ', 'en_US'],
    schemaDescription: 'Студия разработки веб-приложений, MVP, AI-автоматизации и Telegram-ботов в Алматы.',
    schemaCatalogName: 'Услуги разработки',
    schemaLandingName: 'Лендинг',
    schemaLandingDescription: 'Дизайн, разработка, деплой под ключ за 2 недели',
    schemaMvpName: 'MVP разработка',
    schemaMvpDescription: 'Полный цикл: дизайн + разработка + деплой за 4–8 недель'
  },
  kk: {
    langKey: 'kz',
    htmlLang: 'kk',
    dir: 'kk',
    url: `${siteUrl}/kk/`,
    title: 'DosCode — Алматыда веб-қосымша, MVP және Telegram-бот жасау',
    description: 'DosCode Алматыда веб-қосымшалар, MVP, Telegram-боттар, AI-автоматтандыру және бизнеске арналған ішкі жүйелер жасайды. Лендинг 48 сағатта, MVP 4–8 аптада.',
    ogLocale: 'kk_KZ',
    ogLocaleAlternates: ['ru_KZ', 'en_US'],
    schemaDescription: 'Алматыдағы DosCode веб-қосымшалар, MVP, AI-автоматтандыру және Telegram-боттар жасайды.',
    schemaCatalogName: 'Әзірлеу қызметтері',
    schemaLandingName: 'Лендинг',
    schemaLandingDescription: 'Дизайн, әзірлеу және деплой толық циклмен 2 апта ішінде',
    schemaMvpName: 'MVP әзірлеу',
    schemaMvpDescription: 'Толық цикл: дизайн + әзірлеу + деплой 4–8 аптада'
  },
  en: {
    langKey: 'en',
    htmlLang: 'en',
    dir: 'en',
    url: `${siteUrl}/en/`,
    title: 'DosCode — Web App Development, MVPs and Telegram Bots in Almaty',
    description: 'DosCode builds web apps, MVPs, Telegram bots, AI automation and internal systems in Almaty, Kazakhstan. Landing pages in 48 hours, MVPs in 4–8 weeks.',
    ogLocale: 'en_US',
    ogLocaleAlternates: ['ru_KZ', 'kk_KZ'],
    schemaDescription: 'DosCode builds web apps, MVPs, AI automation and Telegram bots in Almaty.',
    schemaCatalogName: 'Development services',
    schemaLandingName: 'Landing page development',
    schemaLandingDescription: 'Design, development and deployment turnkey in 2 weeks',
    schemaMvpName: 'MVP development',
    schemaMvpDescription: 'Full cycle: design + development + deployment in 4–8 weeks'
  }
};

function mustReplace(html, pattern, replacement, label) {
  if (typeof pattern === 'string') {
    if (!html.includes(pattern)) {
      throw new Error(`Failed to replace ${label}`);
    }
    return html.replace(pattern, replacement);
  }

  const next = html.replace(pattern, replacement);
  if (next === html) {
    throw new Error(`Failed to replace ${label}`);
  }
  return next;
}

function resolvePath(obj, dottedPath) {
  return dottedPath.split('.').reduce((acc, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

function repeatMarquee(base) {
  return `${base}${base}${base}${base}`;
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

function extractObjectLiteral(source, regex, label) {
  const match = source.match(regex);
  if (!match) {
    throw new Error(`Failed to extract ${label}`);
  }
  return vm.runInNewContext(`(${match[1]})`);
}

function localizeHtml(baseHtml, translations, marqueeBase, config) {
  let html = baseHtml;

  html = mustReplace(html, /<html lang="[^"]+">/, `<html lang="${config.htmlLang}">`, 'html lang');
  html = mustReplace(html, /<title>[\s\S]*?<\/title>/, `<title>${config.title}</title>`, 'title');
  html = mustReplace(
    html,
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${config.description}">`,
    'meta description'
  );
  html = mustReplace(
    html,
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${config.url}">`,
    'canonical'
  );
  html = mustReplace(
    html,
    /<meta property="og:url" content="[^"]*">/,
    `<meta property="og:url" content="${config.url}">`,
    'og:url'
  );
  html = mustReplace(
    html,
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${config.title}">`,
    'og:title'
  );
  html = mustReplace(
    html,
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${config.description}">`,
    'og:description'
  );
  html = mustReplace(
    html,
    /<meta property="og:locale" content="[^"]*">/,
    `<meta property="og:locale" content="${config.ogLocale}">`,
    'og:locale'
  );
  html = mustReplace(
    html,
    /<meta property="og:locale:alternate" content="[^"]*">\n  <meta property="og:locale:alternate" content="[^"]*">/,
    config.ogLocaleAlternates
      .map((locale) => `  <meta property="og:locale:alternate" content="${locale}">`)
      .join('\n'),
    'og alternate locales'
  );
  html = mustReplace(
    html,
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${config.title}">`,
    'twitter:title'
  );
  html = mustReplace(
    html,
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${config.description}">`,
    'twitter:description'
  );
  html = mustReplace(
    html,
    /"description": "[^"]*",\n    "url": "https:\/\/doscode\.kz"/,
    `"description": "${config.schemaDescription}",\n    "url": "${config.url}"`,
    'schema description and url'
  );
  html = mustReplace(
    html,
    /"inLanguage": "[^"]*"/,
    `"inLanguage": "${config.htmlLang}"`,
    'schema inLanguage'
  );
  html = mustReplace(
    html,
    '"name": "Услуги разработки"',
    `"name": "${config.schemaCatalogName}"`,
    'schema catalog name'
  );
  html = mustReplace(
    html,
    '"itemOffered": {"@type": "Service", "name": "Лендинг"}',
    `"itemOffered": {"@type": "Service", "name": "${config.schemaLandingName}"}`,
    'schema landing service name'
  );
  html = mustReplace(
    html,
    '"description": "Дизайн, разработка, деплой под ключ за 2 недели"',
    `"description": "${config.schemaLandingDescription}"`,
    'schema landing description'
  );
  html = mustReplace(
    html,
    '"itemOffered": {"@type": "Service", "name": "MVP разработка"}',
    `"itemOffered": {"@type": "Service", "name": "${config.schemaMvpName}"}`,
    'schema mvp service name'
  );
  html = mustReplace(
    html,
    '"description": "Полный цикл: дизайн + разработка + деплой за 4–8 недель"',
    `"description": "${config.schemaMvpDescription}"`,
    'schema mvp description'
  );

  html = html.replace(/class="lang-btn active"/g, 'class="lang-btn"');
  html = mustReplace(
    html,
    new RegExp(`class="lang-btn" data-lang="${config.langKey}"`),
    `class="lang-btn active" data-lang="${config.langKey}"`,
    'active language switcher'
  );

  html = html.replace(
    /<([a-zA-Z0-9]+)([^>]*?)data-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, before, key, after, inner) => {
      let translated;
      if (key === 'marquee.text') {
        translated = repeatMarquee(marqueeBase[config.langKey]);
      } else {
        translated = resolvePath(translations[config.langKey], key);
      }

      if (translated === undefined || translated === null) {
        return match;
      }

      let output = String(translated);
      if (key.startsWith('offer.check')) {
        const iconMatch = inner.match(/<span class="fo-check">[\s\S]*?<\/span>/);
        if (iconMatch) {
          output = `${iconMatch[0]}${translated}`;
        }
      }

      return `<${tag}${before}data-i18n="${key}"${after}>${output}</${tag}>`;
    }
  );

  [
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-title', 'title'],
    ['data-i18n-alt', 'alt']
  ].forEach(([dataAttr, targetAttr]) => {
    html = html.replace(
      new RegExp(`<([a-zA-Z0-9]+)([^>]*?)${dataAttr}="([^"]+)"([^>]*)>`, 'g'),
      (match, tag, before, key, after) => {
        const translated = resolvePath(translations[config.langKey], key);
        if (translated === undefined || translated === null) {
          return match;
        }

        const safeValue = escapeHtmlAttr(translated);
        if (new RegExp(`${targetAttr}="[^"]*"`).test(match)) {
          return match.replace(new RegExp(`${targetAttr}="[^"]*"`), `${targetAttr}="${safeValue}"`);
        }

        return `<${tag}${before}${targetAttr}="${safeValue}" ${dataAttr}="${key}"${after}>`;
      }
    );
  });

  const initialThemeLabel = resolvePath(translations[config.langKey], 'ui.themeToLight');
  if (initialThemeLabel) {
    const safeThemeLabel = escapeHtmlAttr(initialThemeLabel);
    html = mustReplace(
      html,
      /(<button class="theme-toggle" id="themeToggle" type="button" aria-label=")[^"]*(" aria-pressed="false" title=")[^"]*(")/,
      `$1${safeThemeLabel}$2${safeThemeLabel}$3`,
      'theme toggle label'
    );
  }

  return html;
}

function buildSitemap(lastmod) {
  const urls = [
    { loc: `${siteUrl}/`, hreflang: 'ru' },
    { loc: `${siteUrl}/kk/`, hreflang: 'kk' },
    { loc: `${siteUrl}/en/`, hreflang: 'en' }
  ];

  const alternates = [
    { hreflang: 'ru', href: `${siteUrl}/` },
    { hreflang: 'kk', href: `${siteUrl}/kk/` },
    { hreflang: 'en', href: `${siteUrl}/en/` },
    { hreflang: 'x-default', href: `${siteUrl}/` }
  ];

  const body = urls
    .map(
      ({ loc }) => `  <url>
    <loc>${loc}</loc>
${alternates.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`).join('\n')}
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
  const source = await fs.readFile(sourcePath, 'utf8');
  const marqueeBase = extractObjectLiteral(
    source,
    /var MARQUEE_BASE = (\{[\s\S]*?\n\});\n\nvar TRANSLATIONS =/,
    'MARQUEE_BASE'
  );
  const translations = extractObjectLiteral(
    source,
    /var TRANSLATIONS = (\{[\s\S]*?\n\});\n\nfunction setLang/,
    'TRANSLATIONS'
  );

  for (const locale of ['kk', 'en']) {
    const config = localeConfigs[locale];
    const localizedHtml = localizeHtml(source, translations, marqueeBase, config);
    const dir = path.join(publicDir, config.dir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), localizedHtml);
  }

  const lastmod = new Date().toISOString().slice(0, 10);
  await fs.writeFile(sitemapPath, buildSitemap(lastmod));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
