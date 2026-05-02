import { useEffect, useState, type ElementType } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Calculator,
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  Cpu,
  Database,
  Gauge,
  Globe2,
  Headphones,
  Layers3,
  MessageCircle,
  Monitor,
  Plus,
  Puzzle,
  Rocket,
  Send,
  ShoppingCart,
  Smartphone,
  Truck,
  Zap,
} from "lucide-react";
import pricingModel from "../../../docs/pricing-model.json";

const TELEGRAM_URL = "https://t.me/doscode_kz";

type Lang = "ru" | "kk" | "en";
type ProjectKind = "landing" | "ecommerce" | "nativeApp" | "dashboard" | "mvp" | "automation";
type ScopeLevel = "lean" | "standard" | "custom";

const LANGS: Array<{ code: Lang; label: string }> = [
  { code: "ru", label: "RU" },
  { code: "kk", label: "ҚАЗ" },
  { code: "en", label: "EN" },
];

const HERO_LINES: Record<Lang, string[]> = {
  ru: ["Цифровые", "системы для", "локального", "бизнеса"],
  kk: ["Жергілікті", "бизнеске", "арналған", "цифрлық жүйелер"],
  en: ["Digital systems", "for local", "business"],
};

const COPY = {
  ru: {
    nav: { services: "Услуги", work: "Работы", process: "Процесс", estimate: "Смета", contact: "Контакт" },
    heroEyebrow: "Базируемся в Казахстане. Строим для локального бизнеса.",
    heroTitle: "Цифровые системы для локального бизнеса",
    heroSubtitle: "Лендинги, e-commerce, приложения, дашборды, AI и боты, соединённые в одну рабочую систему.",
    discussProject: "Обсудить проект",
    estimateBudget: "Оценить бюджет",
    centerTag: "Ваша цифровая система",
    promises: [
      { title: "Быстрый запуск", text: "Запуск в днях, не в месяцах. Чёткий scope, гибкая работа, без бюрократии." },
      { title: "Реальные интеграции", text: "Подключаем инструменты, которыми вы реально пользуетесь каждый день." },
      { title: "Поддержка после деплоя", text: "Остаёмся рядом: мониторинг, обновления и улучшения после запуска." },
    ],
    servicesKicker: "Услуги",
    servicesTitle: "Не список функций. Рабочий маршрут от спроса до операций.",
    tracks: [
      {
        label: "Коммерческий контур",
        title: "Заказы, оплаты, POS и доставка в одном маршруте.",
        text: "Для ресторанов, retail и сервисных бизнесов, где нужно меньше ручных передач.",
        nodes: ["Сайт", "Kaspi", "iiko", "Кухня", "Курьер", "Дашборд"],
      },
      {
        label: "Пульт оператора",
        title: "Каналы поддержки с контекстом и AI-помощью.",
        text: "Telegram, WhatsApp и внутренние заметки становятся одной рабочей поверхностью для команды.",
        nodes: ["WhatsApp", "Telegram", "AI-черновик", "Проверка", "CRM", "Отчёт"],
      },
      {
        label: "Кабинет владельца",
        title: "Дашборд показывает, что изменилось и почему.",
        text: "Вытаскиваем полезные сигналы из разрозненных систем и делаем их читаемыми.",
        nodes: ["1C", "Таблицы", "API", "Графики", "Алерты", "Экспорт"],
      },
    ],
    workKicker: "Работы",
    workTitle: "Доказательство должно выглядеть как операции, а не как галерея.",
    before: "До",
    after: "После",
    cases: [
      { title: "Chicago Pizza", before: "Заказы через агрегаторы", after: "Своя платформа заказов", metric: "Прямые заказы + база клиентов", chips: ["iiko", "Kaspi", "Loyalty"] },
      { title: "DosPass", before: "Ручные отметки", after: "WhatsApp loyalty по ссылке", metric: "x3 механики возврата", chips: ["WhatsApp", "Награды", "Рефералы"] },
      { title: "MMG", before: "Excel + WhatsApp", after: "Дашборд для владельца", metric: "Одна точка правды", chips: ["1C", "FX", "Тендеры"] },
      { title: "Operator Copilot", before: "Много чатов без контекста", after: "AI-подсказки для команды", metric: "Быстрее ответы поддержки", chips: ["WhatsApp", "OpenAI", "Документы"] },
    ],
    processKicker: "Процесс",
    processTitle: "Спокойный sprint-ритм с достаточной структурой, чтобы защитить бюджет.",
    process: [
      { title: "Карта", text: "Сначала рисуем систему бизнеса: пользователи, инструменты, передачи и риски запуска.", time: "День 1" },
      { title: "Прототип", text: "Первая рабочая поверхность появляется быстро, чтобы обратная связь была про реальность.", time: "Дни 2-4" },
      { title: "Интеграции", text: "Формы, боты, оплаты, POS, таблицы и API подключаем там, где это полезно.", time: "Неделя 1+" },
      { title: "Операции", text: "После запуска смотрим логи, убираем узкие места и улучшаем flow.", time: "После деплоя" },
    ],
    estimatorKicker: "Смета",
    estimatorTitle: "Дайте человеку ощущение бюджета до сообщения в Telegram.",
    projectType: "Тип проекта",
    scope: "Scope",
    scopeLevels: [
      { id: "lean" as ScopeLevel, label: "Малый", note: "1-3 страницы / экрана" },
      { id: "standard" as ScopeLevel, label: "Средний", note: "Основные функции" },
      { id: "custom" as ScopeLevel, label: "Большой", note: "Сложно / кастом" },
    ],
    integrations: "Интеграции",
    integrationsNote: "выберите или добавьте своё",
    add: "Добавить",
    estimatedRange: "Оценочный диапазон",
    timeline: "Срок",
    copyBrief: "Скопировать бриф",
    copied: "Скопировано",
    briefIntro: "Привет, хочу оценить проект DosCode.",
    briefProject: "Тип проекта",
    briefScope: "Scope",
    briefIntegrations: "Интеграции",
    briefBudget: "Диапазон бюджета",
    briefTimeline: "Срок",
    contactKicker: "Готовы, когда scope реальный.",
    contactTitle: "Пришлите бизнес-flow. Мы превратим его в систему, которую можно запускать.",
    openTelegram: "Открыть Telegram",
    footerCity: "Алматы / Казахстан",
    footerPreview: "DosCode.kz v15 preview",
    integrationNames: { AI: "OpenAI", cardPayments: "Оплата картой" } as Record<string, string>,
  },
  kk: {
    nav: { services: "Қызметтер", work: "Жұмыстар", process: "Процесс", estimate: "Смета", contact: "Байланыс" },
    heroEyebrow: "Қазақстанда жұмыс істейміз. Жергілікті бизнеске арналған жүйелер құрамыз.",
    heroTitle: "Жергілікті бизнеске арналған цифрлық жүйелер",
    heroSubtitle: "Лендингтер, e-commerce, қосымшалар, дашбордтар, AI және боттар бір жұмыс жүйесіне біріктіріледі.",
    discussProject: "Жобаны талқылау",
    estimateBudget: "Бюджетті бағалау",
    centerTag: "Сіздің цифрлық жүйеңіз",
    promises: [
      { title: "Жылдам іске қосу", text: "Айлар емес, күндер ішінде. Нақты scope, икемді жеткізу, артық бюрократиясыз." },
      { title: "Нақты интеграциялар", text: "Күнделікті қолданатын құралдарыңызбен байланыстырамыз. Жалған демо емес." },
      { title: "Деплойдан кейін қолдау", text: "Іске қосқаннан кейін де бірге боламыз: мониторинг, жаңарту және жақсарту." },
    ],
    servicesKicker: "Қызметтер",
    servicesTitle: "Функциялар тізімі емес. Сұраныстан операцияға дейінгі жұмыс маршруты.",
    tracks: [
      {
        label: "Коммерция контуры",
        title: "Тапсырыс, төлем, POS және жеткізу бір маршрутта.",
        text: "Мейрамхана, retail және сервис бизнесіне қолмен берілетін жұмысты азайту үшін.",
        nodes: ["Сайт", "Kaspi", "iiko", "Асүй", "Курьер", "Дашборд"],
      },
      {
        label: "Оператор пульті",
        title: "Контексті бар қолдау арналары және AI-көмек.",
        text: "Telegram, WhatsApp және ішкі жазбалар командаға бір жұмыс бетіне жиналады.",
        nodes: ["WhatsApp", "Telegram", "AI draft", "Тексеру", "CRM", "Есеп"],
      },
      {
        label: "Иесінің кабинеті",
        title: "Дашборд не өзгергенін және неге екенін көрсетеді.",
        text: "Шашыраңқы жүйелерден пайдалы сигналдарды шығарып, түсінікті қыламыз.",
        nodes: ["1C", "Кестелер", "API", "Графиктер", "Алерттер", "Экспорт"],
      },
    ],
    workKicker: "Жұмыстар",
    workTitle: "Дәлел галерея сияқты емес, операция сияқты көрінуі керек.",
    before: "Бұрын",
    after: "Кейін",
    cases: [
      { title: "Chicago Pizza", before: "Агрегаторларға тәуелді тапсырыстар", after: "Өз тапсырыс платформасы", metric: "Тікелей тапсырыс + клиент базасы", chips: ["iiko", "Kaspi", "Loyalty"] },
      { title: "DosPass", before: "Қолмен белгілеу", after: "WhatsApp loyalty сілтемесі", metric: "x3 қайтару механикасы", chips: ["WhatsApp", "Сыйлық", "Реферал"] },
      { title: "MMG", before: "Excel + WhatsApp", after: "Иесіне арналған дашборд", metric: "Бір дерек көзі", chips: ["1C", "FX", "Тендер"] },
      { title: "Operator Copilot", before: "Көп чат, контекст жоқ", after: "Командаға AI-ұсыныстар", metric: "Қолдау жауаптары жылдамырақ", chips: ["WhatsApp", "OpenAI", "Құжаттар"] },
    ],
    processKicker: "Процесс",
    processTitle: "Бюджетті қорғауға жеткілікті құрылымы бар тыныш sprint-ритм.",
    process: [
      { title: "Карта", text: "Алдымен бизнес жүйесін сызамыз: қолданушылар, құралдар, handoff және іске қосу тәуекелі.", time: "1-күн" },
      { title: "Прототип", text: "Бірінші жұмыс беті тез пайда болады, сондықтан feedback нақты өнім туралы болады.", time: "2-4 күн" },
      { title: "Қосу", text: "Формалар, боттар, төлем, POS, кестелер және API қажет жерде қосылады.", time: "1-апта+" },
      { title: "Операция", text: "Іске қосқаннан кейін логтарды қарап, тар жерлерді түзеп, flow жақсартамыз.", time: "Деплойдан кейін" },
    ],
    estimatorKicker: "Смета",
    estimatorTitle: "Telegram-ға жазбай тұрып бюджет сезімін беріңіз.",
    projectType: "Жоба түрі",
    scope: "Scope",
    scopeLevels: [
      { id: "lean" as ScopeLevel, label: "Шағын", note: "1-3 бет / экран" },
      { id: "standard" as ScopeLevel, label: "Орта", note: "Негізгі функциялар" },
      { id: "custom" as ScopeLevel, label: "Үлкен", note: "Күрделі / кастом" },
    ],
    integrations: "Интеграциялар",
    integrationsNote: "таңдаңыз немесе өзіңізді қосыңыз",
    add: "Қосу",
    estimatedRange: "Баға диапазоны",
    timeline: "Мерзім",
    copyBrief: "Брифті көшіру",
    copied: "Көшірілді",
    briefIntro: "Сәлем, DosCode жобасын бағалатқым келеді.",
    briefProject: "Жоба түрі",
    briefScope: "Scope",
    briefIntegrations: "Интеграциялар",
    briefBudget: "Бюджет диапазоны",
    briefTimeline: "Мерзім",
    contactKicker: "Scope нақты болғанда дайынбыз.",
    contactTitle: "Бизнес-flow жіберіңіз. Біз оны іске қосылатын жүйеге айналдырамыз.",
    openTelegram: "Telegram ашу",
    footerCity: "Алматы / Қазақстан",
    footerPreview: "DosCode.kz v15 preview",
    integrationNames: { AI: "OpenAI", cardPayments: "Картамен төлеу" } as Record<string, string>,
  },
  en: {
    nav: { services: "Services", work: "Work", process: "Process", estimate: "Estimate", contact: "Contact" },
    heroEyebrow: "Based in Kazakhstan. Building for local business.",
    heroTitle: "Digital systems for local business",
    heroSubtitle: "Landing pages, e-commerce, apps, dashboards, AI and bots connected into one practical system.",
    discussProject: "Discuss project",
    estimateBudget: "Estimate budget",
    centerTag: "Your digital system",
    promises: [
      { title: "Fast launch", text: "Ship in days, not months. Clear scope, agile delivery, no bureaucracy." },
      { title: "Real integrations", text: "We connect with the tools you use every day. No fake demos." },
      { title: "Support after deploy", text: "We stay with you. Monitoring, updates and improvements." },
    ],
    servicesKicker: "Services",
    servicesTitle: "Not a list of features. A working route from demand to operations.",
    tracks: [
      {
        label: "Commerce engine",
        title: "Orders, payments, POS and delivery in one route.",
        text: "For restaurants, retail and service businesses that need fewer manual handoffs.",
        nodes: ["Website", "Kaspi", "iiko", "Kitchen", "Courier", "Dashboard"],
      },
      {
        label: "Operator desk",
        title: "Support channels with context and AI assistance.",
        text: "Telegram, WhatsApp and internal notes become one working surface for staff.",
        nodes: ["WhatsApp", "Telegram", "AI draft", "Approval", "CRM", "Report"],
      },
      {
        label: "Owner cockpit",
        title: "A dashboard that shows what changed and why.",
        text: "We pull the useful signals out of messy systems and keep them readable.",
        nodes: ["1C", "Sheets", "API", "Charts", "Alerts", "Export"],
      },
    ],
    workKicker: "Work",
    workTitle: "Proof should look like operations, not like a gallery.",
    before: "Before",
    after: "After",
    cases: [
      { title: "Chicago Pizza", before: "Aggregator-heavy orders", after: "Own order platform", metric: "Direct orders + customer base", chips: ["iiko", "Kaspi", "Loyalty"] },
      { title: "DosPass", before: "Manual stamps", after: "WhatsApp loyalty link", metric: "x3 return mechanics", chips: ["WhatsApp", "Rewards", "Referrals"] },
      { title: "MMG", before: "Excel + WhatsApp", after: "Connected owner dashboard", metric: "One source of truth", chips: ["1C", "FX", "Tenders"] },
      { title: "Operator Copilot", before: "Many chats, no context", after: "AI suggestions for staff", metric: "Faster support replies", chips: ["WhatsApp", "OpenAI", "Docs"] },
    ],
    processKicker: "Process",
    processTitle: "A calm sprint rhythm with enough structure to protect the budget.",
    process: [
      { title: "Map", text: "We draw the business system first: users, tools, handoffs and launch risk.", time: "Day 1" },
      { title: "Prototype", text: "The first working surface appears quickly, so feedback is about reality.", time: "Days 2-4" },
      { title: "Connect", text: "Forms, bots, payments, POS, spreadsheets and APIs are connected where useful.", time: "Week 1+" },
      { title: "Operate", text: "After launch we watch logs, fix bottlenecks and improve the flow.", time: "After deploy" },
    ],
    estimatorKicker: "Estimate",
    estimatorTitle: "Give people a budget feeling before they message you.",
    projectType: "Project type",
    scope: "Scope",
    scopeLevels: [
      { id: "lean" as ScopeLevel, label: "Small", note: "1-3 pages / screens" },
      { id: "standard" as ScopeLevel, label: "Medium", note: "Core features" },
      { id: "custom" as ScopeLevel, label: "Large", note: "Advanced / complex" },
    ],
    integrations: "Integrations",
    integrationsNote: "select or add custom",
    add: "Add",
    estimatedRange: "Estimated range",
    timeline: "Timeline",
    copyBrief: "Copy brief",
    copied: "Copied",
    briefIntro: "Hi, I want to estimate a DosCode project.",
    briefProject: "Project type",
    briefScope: "Scope",
    briefIntegrations: "Integrations",
    briefBudget: "Budget range",
    briefTimeline: "Timeline",
    contactKicker: "Ready when the scope is real.",
    contactTitle: "Send the business flow. We will turn it into a launchable system.",
    openTelegram: "Open Telegram",
    footerCity: "Almaty / Kazakhstan",
    footerPreview: "DosCode.kz v15 preview",
    integrationNames: { AI: "OpenAI", cardPayments: "Card payments" } as Record<string, string>,
  },
} as const;

const projectKinds: Array<{ id: ProjectKind; icon: ElementType }> = [
  { id: "landing", icon: Monitor },
  { id: "ecommerce", icon: ShoppingCart },
  { id: "mvp", icon: Rocket },
  { id: "dashboard", icon: BarChart3 },
  { id: "automation", icon: Bot },
  { id: "nativeApp", icon: Smartphone },
];

const integrationIcons: Record<string, ElementType> = {
  Kaspi: Gauge,
  iiko: Database,
  "1C": Cpu,
  cardPayments: Calculator,
  Telegram: Send,
  WhatsApp: MessageCircle,
  AI: Bot,
};

const systemNodes = [
  { label: "Website", icon: Globe2, x: 49, y: 8, accent: "cyan" },
  { label: "Kaspi", icon: Gauge, x: 68, y: 20, accent: "red" },
  { label: "iiko", icon: Database, x: 80, y: 34, accent: "red" },
  { label: "1C", icon: Cpu, x: 78, y: 52, accent: "red" },
  { label: "Delivery", icon: Truck, x: 70, y: 72, accent: "green" },
  { label: "Dashboard", icon: BarChart3, x: 50, y: 78, accent: "blue" },
  { label: "OpenAI", icon: Bot, x: 32, y: 70, accent: "cyan" },
  { label: "WhatsApp", icon: MessageCircle, x: 22, y: 59, accent: "green" },
  { label: "Telegram", icon: Send, x: 23, y: 42, accent: "blue" },
  { label: "CRM", icon: Layers3, x: 29, y: 22, accent: "cyan" },
];

const promiseIcons = [Zap, Puzzle, Headphones];

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "ru";
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (fromQuery === "kk" || fromQuery === "en" || fromQuery === "ru") return fromQuery;
    const stored = window.localStorage.getItem("doscode-v15-lang");
    return stored === "kk" || stored === "en" || stored === "ru" ? stored : "ru";
  } catch {
    return "ru";
  }
}

function localizedLabel(labels: Record<string, string>, lang: Lang) {
  return labels[lang] || labels.ru || labels.en || "";
}

function formatKzt(value: number) {
  return new Intl.NumberFormat("ru-KZ").format(value) + " KZT";
}

function roundKzt(value: number) {
  return Math.round(value / 10_000) * 10_000;
}

function HeroMap({ centerTag }: { centerTag: string }) {
  return (
    <div className="v15-map" aria-label="DosCode connected system map">
      <svg className="v15-map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 50 L50 16" />
        <path d="M50 50 C62 50 62 28 68 28" />
        <path d="M50 50 C68 50 68 40 80 40" />
        <path d="M50 50 C70 52 66 55 78 58" />
        <path d="M50 50 C63 58 61 73 70 77" />
        <path d="M50 50 L50 78" />
        <path d="M50 50 C42 58 39 69 35 72" />
        <path d="M50 50 C34 52 30 61 22 63" />
        <path d="M50 50 L23 46" />
        <path d="M50 50 C40 47 31 36 29 27" />
      </svg>
      <div className="v15-map-center">
        <strong>DosCode.kz</strong>
        <span>{centerTag}</span>
      </div>
      {systemNodes.map(({ label, icon: Icon, x, y, accent }) => (
        <div key={label} className={`v15-map-node is-${accent}`} style={{ left: `${x}%`, top: `${y}%` }}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </div>
      ))}
      <div className="v15-map-coords">55.7558 N<br />37.6176 E</div>
    </div>
  );
}

function Header({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const copy = COPY[lang];
  return (
    <header className="v15-header">
      <a href="#top" className="v15-logo" aria-label="DosCode v15 preview">
        DosCode<span>.</span>kz
      </a>
      <nav className="v15-nav" aria-label="Preview sections">
        <a href="#services">{copy.nav.services}</a>
        <a href="#work">{copy.nav.work}</a>
        <a href="#process">{copy.nav.process}</a>
        <a href="#pricing">{copy.nav.estimate}</a>
        <a href="#contact">{copy.nav.contact}</a>
      </nav>
      <div className="v15-header-actions">
        <div className="v15-lang-switcher" aria-label="Language">
          {LANGS.map((item) => (
            <button key={item.code} type="button" onClick={() => setLang(item.code)} aria-pressed={lang === item.code}>
              {item.label}
            </button>
          ))}
        </div>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Open Telegram">
          <Send aria-hidden="true" />
        </a>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Open chat">
          <MessageCircle aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function Hero({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section id="top" className="v15-hero">
      <div className="v15-hero-copy">
        <p className="v15-eyebrow"><span /> {copy.heroEyebrow}</p>
        <h1>
          {HERO_LINES[lang].map((line, index) => (
            <span key={line} className="v15-title-line">
              {line}
              {index === HERO_LINES[lang].length - 1 && <span className="v15-title-dot">.</span>}
            </span>
          ))}
        </h1>
        <p className="v15-hero-subtitle">{copy.heroSubtitle}</p>
        <div className="v15-hero-actions">
          <a className="v15-button is-primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
            {copy.discussProject} <ArrowRight aria-hidden="true" />
          </a>
          <a className="v15-button is-ghost" href="#pricing">
            {copy.estimateBudget} <ArrowRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <HeroMap centerTag={copy.centerTag} />
    </section>
  );
}

function PromiseBand({ lang }: { lang: Lang }) {
  return (
    <section className="v15-promise-band" aria-label="DosCode delivery promises">
      {COPY[lang].promises.map(({ title, text }, index) => {
        const Icon = promiseIcons[index];
        return (
          <article key={title}>
            <Icon aria-hidden="true" />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function Services({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section id="services" className="v15-section v15-services">
      <div className="v15-section-head">
        <p>{copy.servicesKicker}</p>
        <h2>{copy.servicesTitle}</h2>
      </div>
      <div className="v15-system-tracks">
        {copy.tracks.map((track, index) => (
          <article key={track.label} className="v15-track">
            <div className="v15-track-number">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <p className="v15-track-label">{track.label}</p>
              <h3>{track.title}</h3>
              <p>{track.text}</p>
            </div>
            <div className="v15-track-flow" aria-label={`${track.label} flow`}>
              {track.nodes.map((node, nodeIndex) => (
                <span key={node}>
                  {node}
                  {nodeIndex < track.nodes.length - 1 && <ArrowRight aria-hidden="true" />}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Work({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section id="work" className="v15-section v15-work">
      <div className="v15-section-head is-light">
        <p>{copy.workKicker}</p>
        <h2>{copy.workTitle}</h2>
      </div>
      <div className="v15-proof-grid">
        {copy.cases.map((item) => (
          <article key={item.title} className="v15-proof-card">
            <div className="v15-proof-top">
              <h3>{item.title}</h3>
              <CheckCircle2 aria-hidden="true" />
            </div>
            <div className="v15-before-after">
              <div>
                <span>{copy.before}</span>
                <strong>{item.before}</strong>
              </div>
              <ArrowRight aria-hidden="true" />
              <div>
                <span>{copy.after}</span>
                <strong>{item.after}</strong>
              </div>
            </div>
            <p>{item.metric}</p>
            <div className="v15-chip-row">
              {item.chips.map((chip) => <span key={chip}>{chip}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section id="process" className="v15-section v15-process">
      <div className="v15-section-head">
        <p>{copy.processKicker}</p>
        <h2>{copy.processTitle}</h2>
      </div>
      <div className="v15-process-board">
        {copy.process.map((step, index) => (
          <article key={step.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <strong>{step.time}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function integrationName(item: string, lang: Lang) {
  const copy = COPY[lang];
  const addOn = pricingModel.integrationAddOns[item as keyof typeof pricingModel.integrationAddOns];
  return copy.integrationNames[item] || (addOn ? localizedLabel(addOn.labels, lang) : item);
}

function Estimator({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  const [kind, setKind] = useState<ProjectKind>("mvp");
  const [scope, setScope] = useState<ScopeLevel>("standard");
  const [integrations, setIntegrations] = useState<string[]>(["Kaspi", "iiko", "1C", "Telegram", "WhatsApp", "AI"]);
  const [copied, setCopied] = useState(false);

  const selectedKind = pricingModel.projectTypes[kind];
  const selectedRange = selectedKind.ranges[scope];
  const integrationAddOns = integrations.reduce(
    (sum, item) => {
      const addOn = pricingModel.integrationAddOns[item as keyof typeof pricingModel.integrationAddOns];
      return addOn ? { min: sum.min + addOn.min, max: sum.max + addOn.max } : sum;
    },
    { min: 0, max: 0 }
  );
  const min = roundKzt(selectedRange.min + integrationAddOns.min);
  const max = roundKzt(selectedRange.max + integrationAddOns.max);
  const timeline = localizedLabel(selectedRange.timeline, lang);
  const integrationKeys = Object.keys(pricingModel.integrationAddOns);
  const projectLabel = localizedLabel(selectedKind.labels, lang);
  const scopeLabel = copy.scopeLevels.find((item) => item.id === scope)?.label || scope;
  const brief = `${copy.briefIntro}
${copy.briefProject}: ${projectLabel}
${copy.briefScope}: ${scopeLabel}
${copy.briefIntegrations}: ${integrations.map((item) => integrationName(item, lang)).join(", ")}
${copy.briefBudget}: ${formatKzt(min)} - ${formatKzt(max)}
${copy.briefTimeline}: ${timeline}`;

  const toggleIntegration = (item: string) => {
    setIntegrations((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item]
    );
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="pricing" className="v15-section v15-estimator-section">
      <div className="v15-section-head">
        <p>{copy.estimatorKicker}</p>
        <h2>{copy.estimatorTitle}</h2>
      </div>
      <div className="v15-estimator">
        <div className="v15-estimator-row">
          <h3>1. {copy.projectType}</h3>
          <div className="v15-project-tabs">
            {projectKinds.map(({ id, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setKind(id)} aria-pressed={kind === id}>
                <Icon aria-hidden="true" />
                {localizedLabel(pricingModel.projectTypes[id].labels, lang)}
              </button>
            ))}
          </div>
        </div>

        <div className="v15-estimator-row">
          <h3>2. {copy.scope}</h3>
          <div className="v15-scope-control" data-scope={scope}>
            <div className="v15-scope-line" />
            {copy.scopeLevels.map((item) => (
              <button key={item.id} type="button" onClick={() => setScope(item.id)} aria-pressed={scope === item.id}>
                <span />
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="v15-estimator-row">
          <h3>3. {copy.integrations} <span>({copy.integrationsNote})</span></h3>
          <div className="v15-integrations">
            {integrationKeys.map((item) => {
              const Icon = integrationIcons[item] || Plus;
              return (
                <button key={item} type="button" onClick={() => toggleIntegration(item)} aria-pressed={integrations.includes(item)}>
                  <Icon aria-hidden="true" />
                  {integrationName(item, lang)}
                  {integrations.includes(item) && <Check aria-hidden="true" />}
                </button>
              );
            })}
            <button type="button" className="is-add">
              <Plus aria-hidden="true" />
              {copy.add}
            </button>
          </div>
        </div>

        <div className="v15-estimator-bottom">
          <div className="v15-result">
            <Calculator aria-hidden="true" />
            <div>
              <span>{copy.estimatedRange}</span>
              <strong>{formatKzt(min)} - {formatKzt(max)}</strong>
            </div>
          </div>
          <div className="v15-result">
            <Clock3 aria-hidden="true" />
            <div>
              <span>{copy.timeline}</span>
              <strong>{timeline}</strong>
            </div>
          </div>
          <button type="button" className="v15-copy" onClick={copyBrief}>
            <Clipboard aria-hidden="true" />
            {copied ? copy.copied : copy.copyBrief}
          </button>
        </div>
      </div>
    </section>
  );
}

function Contact({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <section id="contact" className="v15-contact">
      <div>
        <p>{copy.contactKicker}</p>
        <h2>{copy.contactTitle}</h2>
      </div>
      <a className="v15-button is-primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
        {copy.openTelegram} <ArrowRight aria-hidden="true" />
      </a>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  const copy = COPY[lang];
  return (
    <footer className="v15-footer">
      <span>{copy.footerPreview}</span>
      <span>{copy.footerCity}</span>
      <a href="mailto:hello@doscode.kz">hello@doscode.kz</a>
    </footer>
  );
}

export default function Preview() {
  const [lang, setLang] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      window.localStorage.setItem("doscode-v15-lang", lang);
    } catch {
      // Preview still works if storage is unavailable.
    }
  }, [lang]);

  return (
    <div className="v15-page">
      <Header lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <PromiseBand lang={lang} />
        <Services lang={lang} />
        <Work lang={lang} />
        <Process lang={lang} />
        <Estimator lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}
