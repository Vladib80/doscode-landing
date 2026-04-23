import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight, Terminal, Zap, Code2, Rocket, CheckCircle2, ChevronDown, Command, LayoutTemplate, Database, Cpu, Bot, LineChart, Timer, TrendingUp, TrendingDown, Minus, Check, X, Clock, Sun, Moon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../v10/components/ui/accordion";
import { Button } from "../../v10/components/ui/button";
import { applyV10Theme, getV10ThemeFromRoot, type V10Theme } from "../../v10/theme-mode";

const TELEGRAM_URL = "https://t.me/doscode_kz";
const LOCALE_PATHS: Record<"ru" | "kk" | "en", string> = {
  ru: "/",
  kk: "/kk/",
  en: "/en/",
};

function normalizeLocalePath(pathname: string) {
  if (pathname === "/index.html") return "/";
  if (pathname === "/kk" || pathname === "/kk/index.html") return "/kk/";
  if (pathname === "/en" || pathname === "/en/index.html") return "/en/";
  return pathname;
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = (i18n.language || "ru").split("-")[0];
  const langs = [
    { code: "ru", label: "RU" },
    { code: "kk", label: "ҚАЗ" },
    { code: "en", label: "EN" },
  ] as const;

  const setLanguage = (code: "ru" | "kk" | "en") => {
    void i18n.changeLanguage(code);

    if (typeof document !== "undefined") {
      document.documentElement.lang = code;
      document.documentElement.dataset.lang = code;
    }

    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem("doscode-lang", code);
    } catch {
      // Storage can be unavailable in private or embedded contexts; navigation still keeps locale correct.
    }

    const targetPath = LOCALE_PATHS[code];
    const currentPath = normalizeLocalePath(window.location.pathname);

    if (currentPath === targetPath) {
      return;
    }

    window.location.assign(`${targetPath}${window.location.search}${window.location.hash}`);
  };

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-border/50 bg-card/40 p-0.5"
      data-testid="lang-switcher"
    >
      {langs.map((l) => {
        const active = current === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-mono font-bold rounded transition-colors ${
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`lang-${l.code}`}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState<V10Theme>(() => getV10ThemeFromRoot());
  const options: Array<{ value: V10Theme; label: string; icon: React.ElementType }> = [
    { value: "light", label: "Lite", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  useEffect(() => {
    setTheme(getV10ThemeFromRoot());
  }, []);

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-border/40 bg-background/55 p-0.5"
      data-testid="theme-switcher"
      aria-label="Theme"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => {
              applyV10Theme(value);
              setTheme(value);
            }}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
              active
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-transparent text-muted-foreground hover:bg-card/40 hover:text-foreground"
            }`}
            data-testid={`theme-${value}`}
            aria-label={`${label} theme`}
            title={label}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

function Header() {
  const { t } = useTranslation();
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <div className="flex items-center gap-2 shrink-0">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-lg sm:text-xl tracking-tight">DosCode</span>
        </div>
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-muted-foreground font-mono" aria-label="Primary">
          <a href="#services" className="hover:text-foreground transition-colors" data-testid="nav-services">{t("header.services")}</a>
          <a href="#cases" className="hover:text-foreground transition-colors" data-testid="nav-cases">{t("header.cases")}</a>
          <a href="#process" className="hover:text-foreground transition-colors" data-testid="nav-process">{t("header.process")}</a>
          <a href="#pricing" className="hover:text-foreground transition-colors" data-testid="nav-pricing">{t("header.pricing")}</a>
          <a href="#faq" className="hover:text-foreground transition-colors" data-testid="nav-faq">{t("header.faq")}</a>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hidden xl:block">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors gap-2 px-3 h-10"
              data-testid="btn-header-telegram"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm">{t("header.cta")}</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

function HeroPipeline() {
  const { t } = useTranslation();
  const fileLabel = t("hero.pipeline.file");
  const liveLabel = t("hero.pipeline.live");
  const allSteps = [
    { label: (t("hero.pipeline.steps", { returnObjects: true }) as string[])[0], icon: <Zap className="h-4 w-4" /> },
    { label: (t("hero.pipeline.steps", { returnObjects: true }) as string[])[1], icon: <LayoutTemplate className="h-4 w-4" /> },
    { label: (t("hero.pipeline.steps", { returnObjects: true }) as string[])[2], icon: <Code2 className="h-4 w-4" /> },
    { label: (t("hero.pipeline.steps", { returnObjects: true }) as string[])[3], icon: <Rocket className="h-4 w-4" /> },
    { label: (t("hero.pipeline.steps", { returnObjects: true }) as string[])[4], icon: <LineChart className="h-4 w-4" /> },
  ];
  // Mobile shows 3 steps: Идея → Код → Запуск (indices 0, 2, 3)
  const mobileSteps = [allSteps[0], allSteps[2], allSteps[3]];
  const successLine = t("hero.pipeline.successLine");

  return (
    <div className="relative w-full max-w-3xl min-w-0 mx-auto mt-12 sm:mt-16 aspect-[16/9] border border-border/50 bg-card/50 rounded-xl overflow-hidden font-mono text-xs shadow-[0_0_50px_-12px_rgba(132,204,22,0.15)]">
      <div className="absolute top-0 left-0 right-0 h-8 border-b border-border/50 bg-card flex items-center px-3 sm:px-4 gap-2">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-destructive/80" />
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500/80" />
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/80" />
        <span className="ml-2 sm:ml-4 text-muted-foreground opacity-50 text-[10px] sm:text-xs truncate">{fileLabel}</span>
        <span className="ml-auto text-primary animate-pulse text-[10px] sm:text-xs">{liveLabel}</span>
      </div>

      <div className="p-3 sm:p-6 pt-10 sm:pt-12 h-full flex flex-col justify-between relative">
        <motion.div
          className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#84cc16_1px,transparent_1px),linear-gradient(to_bottom,#84cc16_1px,transparent_1px)] bg-[size:40px_40px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        />

        {/* Desktop: 5 steps */}
        <div className="hidden md:flex justify-between items-center relative z-10 w-full mt-4">
          {allSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 relative">
              <motion.div
                className="w-12 h-12 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center text-primary relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.3 + 0.2 }}
              >
                {step.icon}
                <motion.div
                  className="absolute inset-0 border border-primary rounded-lg"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
              <motion.span
                className="text-primary/70 tracking-wider uppercase text-[10px] font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 + 0.4 }}
              >
                {step.label}
              </motion.span>
            </div>
          ))}

          <div className="absolute top-6 left-6 right-6 h-[2px] bg-primary/10 -z-10">
            <motion.div
              className="h-full bg-primary/50 relative"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, delay: 0.5, ease: "linear" }}
            >
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 right-0 w-8 h-[2px] bg-primary blur-[2px]"
                animate={{ x: ["-1000%", "0%"] }}
                transition={{ duration: 2.5, delay: 0.5, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Mobile: 3 steps */}
        <div className="md:hidden flex justify-between items-center relative z-10 w-full mt-2 px-2">
          {mobileSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative">
              <motion.div
                className="w-9 h-9 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center text-primary relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.3 + 0.2 }}
              >
                {step.icon}
              </motion.div>
              <span className="text-primary/70 tracking-wider uppercase text-[8px] font-bold">{step.label}</span>
            </div>
          ))}
          <div className="absolute top-[18px] left-8 right-8 h-[2px] bg-primary/30 -z-10" />
        </div>

        <div className="bg-background/80 rounded border border-border p-2 sm:p-4 mt-4 sm:mt-8 font-mono text-[9px] sm:text-xs leading-relaxed text-muted-foreground backdrop-blur h-28 sm:h-36 overflow-hidden relative shadow-inner">
          <motion.div
            className="max-w-full overflow-hidden"
            initial={{ y: 0 }}
            animate={{ y: -180 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <p><span className="text-primary">❯</span> doscode/dospass: deploying loyalty engine v2.4</p>
            <p><span className="text-cyan-400">INFO</span> WhatsApp gateway connected</p>
            <p><span className="text-cyan-400">INFO</span> Stripe webhook verified</p>
            <p><span className="text-primary">❯</span> doscode/chicago-pizza: building order panel</p>
            <p><span className="text-cyan-400">INFO</span> Yandex.Eda integration: ok</p>
            <p><span className="text-primary">❯</span> doscode/mmg-dashboard: aggregating sources</p>
            <p><span className="text-cyan-400">INFO</span> 5 data sources merged in 240ms</p>
            <p><span className="text-orange-400">WARN</span> retry openai/embed (1/3) — recovered</p>
            <p><span className="text-primary">❯</span> doscode/mmg: 1C ⇄ AgentMail sync ok</p>
            <p><span className="text-cyan-400">INFO</span> Latency p95: 180ms</p>
            <p><span className="text-primary">❯</span> doscode/landing-sprint: ship in 47:12:08</p>
            <p className="text-primary font-bold mt-2"><span className="text-primary">SUCCESS</span> {successLine}</p>
            <p className="opacity-0">---</p>
            <p><span className="text-primary">❯</span> doscode/dospass: deploying loyalty engine v2.4</p>
            <p><span className="text-cyan-400">INFO</span> WhatsApp gateway connected</p>
            <p><span className="text-cyan-400">INFO</span> Stripe webhook verified</p>
            <p><span className="text-primary">❯</span> doscode/chicago-pizza: building order panel</p>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-full px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-mono text-muted-foreground tracking-wider mb-4"
          data-testid="hero-kicker"
        >
          // Almaty · 2020 — present
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-8 uppercase tracking-widest"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {t("hero.badge")}
        </motion.div>

        <motion.h1
          className="mx-auto w-[calc(100vw-2rem)] max-w-5xl sm:w-auto text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-balance mb-6 font-display"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("hero.title1")} <br />
          <span className="text-primary">{t("hero.title2")}</span>
        </motion.h1>

        <motion.p
          className="v10-hero-copy mx-auto mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          className="mx-auto flex w-[calc(100vw-2rem)] max-w-md flex-col items-center justify-center gap-4 sm:w-auto sm:max-w-none sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 font-mono tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-transform" data-testid="btn-hero-primary">
              <Zap className="mr-2 h-5 w-5" />
              {t("hero.ctaPrimary")}
            </Button>
          </a>
          <a href="#cases" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 font-mono border-border/50 hover:bg-card/50" data-testid="btn-hero-cases">
              {t("hero.ctaSecondary")}
            </Button>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="v10-hero-trust mx-auto flex w-[calc(100vw-2rem)] max-w-sm flex-wrap items-center justify-center gap-3 text-xs font-mono text-muted-foreground sm:w-auto sm:max-w-none sm:gap-6 sm:text-sm"
          data-testid="hero-trust-row"
        >
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t("hero.trustHour")}</span>
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t("hero.trustEstimate")}</span>
          <span className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> {t("hero.trustPrice")}</span>
        </motion.div>
      </div>
    </section>
  );
}

function Services() {
  const { t } = useTranslation();
  return (
    <section id="services" className="py-20 sm:py-24 bg-card/30 relative border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="mb-16 sm:mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-display">{t("services.title")}</h2>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl">{t("services.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

          {/* AI Agent Module */}
          <div className="col-span-1 lg:col-span-2 border border-border/50 bg-background rounded-3xl p-6 sm:p-8 overflow-hidden relative group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu className="w-48 h-48 text-primary" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-3 font-display">
                  <Bot className="text-primary w-6 h-6" /> {t("services.ai.title")}
                </h3>
                <p className="text-muted-foreground max-w-md">{t("services.ai.desc")}</p>
              </div>

              <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm shadow-inner mt-8 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs border border-primary/20">{t("services.ai.active")}</span>
                  <span className="text-muted-foreground text-xs">{t("services.ai.trace")}</span>
                </div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="text-cyan-400 shrink-0">Step 1</span>
                  <span className="text-muted-foreground break-words min-w-0">{t("services.ai.step1")}</span>
                </div>
                <div className="pl-4 border-l-2 border-primary/30 mb-3 ml-2 space-y-1">
                  <p className="text-primary">Intent: TASK_AUTOMATION</p>
                  <p className="text-primary/70">Confidence: 0.98</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-cyan-400 shrink-0">Step 2</span>
                  <span className="text-muted-foreground break-words min-w-0">
                    {t("services.ai.step2Prefix")} <span className="text-orange-400">web_scraper</span>
                  </span>
                </div>
                <div className="mt-4 h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Bot Module */}
          <div className="col-span-1 border border-border/50 bg-background rounded-3xl p-6 sm:p-8 relative group hover:border-primary/30 transition-colors">
            <h3 className="text-2xl font-bold mb-3 font-display">{t("services.telegram.title")}</h3>
            <p className="text-muted-foreground mb-8">{t("services.telegram.desc")}</p>

            <div className="bg-[#0f172a] rounded-2xl p-4 h-[220px] border border-border/50 flex flex-col gap-3 sm:gap-4 font-sans text-xs sm:text-sm overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] pointer-events-none" />
              <div className="bg-[#1e293b] text-foreground p-3 sm:p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] self-start border border-border/30 relative z-10 shadow-sm break-words">
                {t("services.telegram.msg1")}
              </div>
              <div className="bg-primary text-primary-foreground p-3 sm:p-3.5 rounded-2xl rounded-tr-sm max-w-[85%] self-end relative z-10 shadow-sm font-medium break-words">
                {t("services.telegram.msg2")}
              </div>
              <div className="bg-[#1e293b] text-foreground p-3 sm:p-3.5 rounded-2xl rounded-tl-sm max-w-[85%] self-start border border-border/30 flex items-center gap-2 relative z-10 shadow-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                {t("services.telegram.msg3")}
              </div>
            </div>
          </div>

          {/* Dashboard Module */}
          <div className="col-span-1 border border-border/50 bg-background rounded-3xl p-6 sm:p-8 group hover:border-primary/30 transition-colors">
            <h3 className="text-2xl font-bold mb-3 font-display">{t("services.dashboards.title")}</h3>
            <p className="text-muted-foreground mb-8">{t("services.dashboards.desc")}</p>

            <div className="bg-card border border-border/50 rounded-2xl p-5 h-[200px] flex flex-col justify-end gap-3 shadow-inner">
              <div className="flex items-end gap-2 h-28">
                {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-primary/20 rounded-t relative group-hover:bg-primary/40 transition-colors"
                    style={{ height: `${h}%` }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary rounded-t" />
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 border-t border-border/50 pt-3">
                <span className="uppercase tracking-wider font-bold">{t("services.dashboards.label")}</span>
                <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded text-sm">+24.5%</span>
              </div>
            </div>
          </div>

          {/* Landing Sprint */}
          <div className="col-span-1 border border-border/50 bg-background rounded-3xl p-6 sm:p-8 group hover:border-primary/30 transition-colors">
            <h3 className="text-2xl font-bold mb-3 font-display">{t("services.sprint.title")}</h3>
            <p className="text-muted-foreground mb-8">{t("services.sprint.desc")}</p>

            <div className="bg-card border border-border/50 rounded-2xl p-5 h-[200px] flex flex-col justify-center shadow-inner relative overflow-hidden">
              <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-[80px] font-bold text-primary/5 select-none font-mono">48H</div>
              <div className="space-y-4 relative z-10 font-mono text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary rounded-full" /></div>
                  <div className="flex-1 h-[1px] bg-primary/30" />
                  <span className="text-muted-foreground">0h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-primary rounded-full" /></div>
                  <div className="flex-1 h-[1px] bg-primary/30" />
                  <span className="text-muted-foreground">24h</span>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-4 h-4 rounded-full border-2 border-border" />
                  <div className="flex-1 h-[1px] bg-border" />
                  <span className="text-muted-foreground">48h</span>
                </div>
              </div>
            </div>
          </div>

          {/* MVP / SaaS */}
          <div className="col-span-1 lg:col-span-1 border border-border/50 bg-background rounded-3xl p-6 sm:p-8 group hover:border-primary/30 transition-colors">
            <h3 className="text-2xl font-bold mb-3 font-display">{t("services.mvp.title")}</h3>
            <p className="text-muted-foreground mb-8">{t("services.mvp.desc")}</p>

            <div className="bg-card border border-border/50 rounded-2xl p-3 sm:p-5 h-[200px] flex flex-col items-center justify-center gap-4 font-mono text-xs shadow-inner">
              <div className="w-full flex items-center justify-center gap-1.5 sm:gap-3">
                <div className="p-2 sm:p-3 border border-border bg-background rounded-xl text-center shadow-sm w-16 sm:w-24">
                  <Database className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-cyan-400" />
                  DB
                </div>
                <ArrowRight className="text-muted-foreground w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <div className="p-2 sm:p-3 border border-primary/50 bg-primary/5 rounded-xl text-center text-primary shadow-[0_0_15px_-3px_rgba(132,204,22,0.2)] w-16 sm:w-24 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                  <Code2 className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 relative z-10" />
                  <span className="relative z-10">API</span>
                </div>
                <ArrowRight className="text-muted-foreground w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <div className="p-2 sm:p-3 border border-border bg-background rounded-xl text-center shadow-sm w-16 sm:w-24">
                  <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 text-orange-400" />
                  UI
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const { t } = useTranslation();
  const stats = [
    { value: "40+", label: t("stats.projects") },
    { value: "5", label: t("stats.years") },
    { value: t("stats.valueMvp"), label: t("stats.mvp") },
    { value: t("stats.valueEstimate"), label: t("stats.estimate") },
  ];
  return (
    <section className="border-t border-border/50 py-16 sm:py-20 bg-background" data-testid="stats-bar">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              data-testid={`stat-${i}`}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-primary break-words">{s.value}</div>
              <div className="text-xs sm:text-sm font-mono uppercase tracking-widest text-muted-foreground mt-3">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilitiesMarquee() {
  const { t } = useTranslation();
  const proofItems = t("proofStrip.items", { returnObjects: true }) as Array<{ label: string; value: string; note: string }>;
  return (
    <section className="border-y border-border/50 bg-card/20 py-8 sm:py-10" data-testid="capabilities-marquee">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {proofItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 backdrop-blur-sm"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-primary/80">{item.label}</div>
              <div className="mt-2 text-lg font-bold leading-tight text-foreground">{item.value}</div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type CaseDetails = {
  overview: string;
  capabilities: string[];
  outcomes: string[];
  stack: string[];
};

function Cases() {
  const { t } = useTranslation();
  const cases: Array<{
    title: string;
    metric: string;
    desc: string;
    visual: React.ReactNode;
    details: CaseDetails;
    url?: string;
  }> = [
    {
      title: "DosPass",
      metric: t("cases.dospass.metric"),
      desc: t("cases.dospass.desc"),
      visual: (
        <div className="w-full h-full bg-[#0a0a0a] border border-border/50 rounded-xl p-3 sm:p-5 flex items-center justify-center shadow-inner relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none" />

          {/* Dotted virality connectors — desktop only */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 hidden md:block" preserveAspectRatio="none">
            <line x1="50%" y1="50%" x2="12%" y2="18%" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="50%" y1="50%" x2="88%" y2="22%" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="50%" y1="50%" x2="14%" y2="82%" stroke="#fb923c" strokeWidth="1" strokeDasharray="2 4" />
            <line x1="50%" y1="50%" x2="86%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="2 4" />
          </svg>

          {/* Phone frame */}
          <div className="relative z-10 w-[140px] sm:w-[170px] h-[230px] sm:h-[280px] bg-[#0f1115] border border-border rounded-[24px] sm:rounded-[28px] p-2 shadow-[0_0_40px_-10px_rgba(132,204,22,0.4)]">
            <div className="w-full h-full bg-[#0a0a0a] rounded-[18px] sm:rounded-[22px] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center px-3 pt-2 pb-1 text-[8px] font-mono text-muted-foreground">
                <span>9:41</span>
                <span className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-primary/70" />
                </span>
              </div>
              <div className="px-3 pt-1 flex flex-col gap-2">
                <div className="text-[9px] font-mono text-primary tracking-widest">DosPass</div>
                <div className="text-[11px] font-bold text-foreground leading-tight">Hi, Guest!</div>

                <div className="mt-1">
                  <div className="grid grid-cols-5 gap-1.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i, type: "spring", stiffness: 240 }}
                        className={`w-full aspect-square rounded-full border ${i < 9 ? "bg-primary border-primary shadow-[0_0_6px_-1px_rgba(132,204,22,0.7)]" : "border-border bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[8px] font-mono">
                    <span className="text-primary font-bold">9/10</span>
                    <span className="text-muted-foreground">1 to go!</span>
                  </div>
                </div>

                <div className="mt-1 rounded-md border border-primary/30 bg-primary/5 px-2 py-1.5 flex items-center justify-between">
                  <div>
                    <div className="text-[7px] uppercase tracking-wider text-muted-foreground font-mono">Reward</div>
                    <div className="text-[10px] font-bold text-primary leading-tight">Free Latte</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full border border-border bg-card text-foreground">Invite Friends</span>
                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">Post Story +3</span>
                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full border border-border bg-card text-foreground">Spin Wheel</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating viral metric badges — desktop only */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:block absolute top-3 left-3 px-2 py-1 rounded-md border border-primary/30 bg-background/90 backdrop-blur text-[10px] font-mono text-primary z-20"
          >
            +30 customers
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="hidden md:block absolute top-4 right-3 px-2 py-1 rounded-md border border-cyan-400/30 bg-background/90 backdrop-blur text-[10px] font-mono text-cyan-400 z-20"
          >
            +215 shares
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="hidden md:block absolute bottom-4 left-3 px-2 py-1 rounded-md border border-orange-400/30 bg-background/90 backdrop-blur text-[10px] font-mono text-orange-400 z-20"
          >
            +7.2K views
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.75 }}
            className="hidden md:block absolute bottom-3 right-3 px-2 py-1 rounded-md border border-primary/30 bg-background/90 backdrop-blur text-[10px] font-mono text-primary z-20"
          >
            +94 forwards
          </motion.div>

          {/* Mobile inline badges (stacked under phone) */}
          <div className="md:hidden absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 justify-center z-20">
            <span className="px-1.5 py-0.5 rounded border border-primary/30 bg-background/90 text-[8px] font-mono text-primary">+30 customers</span>
            <span className="px-1.5 py-0.5 rounded border border-cyan-400/30 bg-background/90 text-[8px] font-mono text-cyan-400">+215 shares</span>
            <span className="px-1.5 py-0.5 rounded border border-orange-400/30 bg-background/90 text-[8px] font-mono text-orange-400">+7.2K views</span>
            <span className="px-1.5 py-0.5 rounded border border-primary/30 bg-background/90 text-[8px] font-mono text-primary">+94 forwards</span>
          </div>
        </div>
      ),
      details: t("cases.dospass.details", { returnObjects: true }) as CaseDetails,
      url: "https://dospass.com",
    },
    {
      title: "Chicago Pizza",
      metric: t("cases.chicago.metric"),
      desc: t("cases.chicago.desc"),
      visual: (
        <div className="w-full h-full bg-[#0a0a0a] border border-border/50 rounded-xl p-3 flex flex-col gap-2 shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/15 blur-[60px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

          {/* Top row: phone + QR + desktop — stack on mobile */}
          <div className="flex-1 flex flex-col md:flex-row gap-2 items-stretch min-h-0 relative">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 hidden md:block" preserveAspectRatio="none">
              <line x1="22%" y1="50%" x2="38%" y2="50%" stroke="#fb923c" strokeWidth="1" strokeDasharray="2 3" />
              <line x1="56%" y1="50%" x2="68%" y2="50%" stroke="#84cc16" strokeWidth="1" strokeDasharray="2 3" />
            </svg>

            {/* Phone mockup */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full md:w-[105px] md:shrink-0 bg-[#0f1115] border border-border rounded-[18px] p-1 shadow-[0_0_30px_-10px_rgba(251,146,60,0.4)]"
            >
              <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center px-2 pt-1 pb-0.5 text-[6px] font-mono text-muted-foreground">
                  <span>9:41</span>
                  <span className="w-1 h-1 rounded-full bg-orange-400/70" />
                </div>
                <div className="px-1.5 pt-0.5 pb-1.5 flex-1 flex flex-col">
                  <div className="text-[7px] font-mono text-orange-400 tracking-widest">CHICAGO</div>
                  <div className="text-[8px] font-bold text-foreground mb-1">Меню</div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-1 flex-1">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="bg-card/60 border border-border/40 rounded p-1 flex flex-col gap-0.5"
                      >
                        <div className={`w-full h-7 rounded ${i % 2 === 0 ? "bg-gradient-to-br from-orange-500 to-red-500" : "bg-gradient-to-br from-amber-500 to-orange-600"}`} />
                        <div className="h-[3px] w-full bg-border/70 rounded" />
                        <div className="text-[6px] font-mono text-foreground leading-none">₸ {[4200, 5800, 3600, 4900][i]}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* QR + Desktop on a sub-row on mobile */}
            <div className="flex md:contents gap-2 flex-1 min-h-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative z-10 w-[88px] shrink-0 bg-[#0f1115] border border-border rounded-xl p-2 flex flex-col items-center justify-between shadow-[0_0_20px_-6px_rgba(132,204,22,0.25)]"
              >
                <div className="text-[6px] font-mono text-muted-foreground uppercase tracking-widest">scan & pay</div>
                <div className="grid grid-cols-7 gap-[1px] w-14 h-14 my-1">
                  {Array.from({ length: 49 }).map((_, i) => {
                    const pattern = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48, 8, 9, 11, 15, 17, 19, 23, 25, 29, 31, 33, 37, 39].includes(i);
                    return <div key={i} className={`aspect-square rounded-[1px] ${pattern || (i * 7) % 11 < 4 ? "bg-foreground" : "bg-transparent"}`} />;
                  })}
                </div>
                <div className="flex gap-0.5 items-center">
                  <span className="text-[5px] font-mono px-1 py-[1px] rounded bg-card border border-border/50 text-foreground">Pay</span>
                  <span className="text-[5px] font-mono px-1 py-[1px] rounded bg-card border border-border/50 text-orange-400">Kaspi</span>
                  <span className="text-[5px] font-mono px-1 py-[1px] rounded bg-card border border-border/50 text-cyan-400">Visa</span>
                </div>
                <div className="text-[6px] font-mono text-primary mt-0.5">{t("cases.chicago.qrEarn")}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative z-10 flex-1 min-w-0 bg-[#0f1115] border border-border rounded-xl p-2 shadow-[0_0_30px_-10px_rgba(132,204,22,0.25)] flex flex-col"
              >
                <div className="flex gap-1 mb-1.5 border-b border-border/50 pb-1 flex-wrap">
                  {["ЗАКАЗЫ", "МЕНЮ", "ЛОЯЛЬНОСТЬ"].map((tab, i) => (
                    <span
                      key={tab}
                      className={`text-[6px] font-mono px-1 py-0.5 rounded ${
                        i === 0 ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" : "text-muted-foreground border border-border/40"
                      }`}
                    >
                      {tab}
                    </span>
                  ))}
                </div>
                <div className="flex items-end gap-[2px] h-12 mb-1.5">
                  {[55, 75, 40, 90, 65, 80, 100, 70, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                      className="flex-1 bg-orange-500/70 rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1 mt-auto">
                  <div className="bg-card/70 border border-border/40 rounded p-1">
                    <div className="text-[5px] font-mono text-muted-foreground uppercase tracking-wider">День</div>
                    <div className="text-[7px] font-mono font-bold text-orange-400">₸ 1.2M</div>
                  </div>
                  <div className="bg-card/70 border border-border/40 rounded p-1">
                    <div className="text-[5px] font-mono text-muted-foreground uppercase tracking-wider">Заказов</div>
                    <div className="text-[7px] font-mono font-bold text-foreground">247</div>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded p-1">
                    <div className="text-[5px] font-mono text-primary uppercase tracking-wider">iiko</div>
                    <div className="text-[7px] font-mono font-bold text-primary flex items-center gap-0.5"><Check className="w-2 h-2" /> sync</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-10 flex flex-wrap items-center gap-1.5 bg-card/60 border border-border/40 rounded-lg px-2 py-1.5 backdrop-blur"
          >
            <span className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest shrink-0">{t("cases.chicago.pointsLabel")}</span>
            <div className="flex items-center gap-1 flex-wrap min-w-0">
              {(t("cases.chicago.channels", { returnObjects: true }) as string[]).map((ch, i, arr) => (
                <span key={ch} className="contents">
                  <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded ${i === arr.length - 1 ? "bg-primary/10 border border-primary/30 text-primary" : "bg-background border border-border/50 text-foreground"}`}>{ch}</span>
                  {i < arr.length - 1 && <span className="text-orange-400/60 text-[7px]">+</span>}
                </span>
              ))}
            </div>
            <ArrowRight className="w-3 h-3 text-primary ml-auto shrink-0" />
            <span className="text-[7px] font-mono text-primary font-bold tracking-wider shrink-0">iiko</span>
          </motion.div>
        </div>
      ),
      details: t("cases.chicago.details", { returnObjects: true }) as CaseDetails,
      url: "https://chicagopizza.kz",
    },
    {
      title: "MMG",
      metric: t("cases.mmg.metric"),
      desc: t("cases.mmg.desc"),
      visual: (
        <div className="w-full h-full bg-[#0a0a0a] border border-border/50 rounded-xl p-3 shadow-inner relative overflow-hidden flex flex-col">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-2 relative z-10 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="text-[8px] sm:text-[9px] font-mono text-foreground truncate">MMG / Operations</span>
              <span className="text-[6px] sm:text-[7px] font-mono px-1 py-[1px] rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 shrink-0">owner</span>
            </div>
            <div className="flex gap-1 shrink-0">
              {[
                { label: "RU", active: true },
                { label: "KZ", active: false },
                { label: "EN", active: false },
              ].map((l) => (
                <span
                  key={l.label}
                  className={`text-[6px] sm:text-[7px] font-mono px-1 py-[1px] rounded border ${
                    l.active ? "bg-primary/15 text-primary border-primary/30" : "text-muted-foreground border-border/40"
                  }`}
                >
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile: top horizontal nav. Desktop: sidebar. */}
          <div className="md:hidden flex gap-1 mb-2 overflow-x-auto relative z-10">
            {[
              { label: "Каталог", active: false },
              { label: "Клиенты", active: false },
              { label: "Тендеры", active: true },
              { label: "Отчёты", active: false },
            ].map((n) => (
              <div
                key={n.label}
                className={`text-[7px] font-mono px-1.5 py-1 rounded border shrink-0 ${
                  n.active
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "text-muted-foreground border-border/40 bg-card/40"
                }`}
              >
                {n.label}
              </div>
            ))}
          </div>

          <div className="flex flex-1 gap-2 relative z-10 min-h-0">
            <div className="hidden md:flex w-[70px] shrink-0 flex-col gap-1">
              {[
                { label: "Каталог", active: false },
                { label: "Клиенты", active: false },
                { label: "Тендеры", active: true },
                { label: "Отчёты", active: false },
              ].map((n) => (
                <div
                  key={n.label}
                  className={`text-[8px] font-mono px-1.5 py-1 rounded border ${
                    n.active
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "text-muted-foreground border-border/40 bg-card/40"
                  }`}
                >
                  {n.label}
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-2 gap-1.5 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-card/70 border border-border/40 rounded p-1.5 flex flex-col"
              >
                <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Курсы</div>
                <div className="space-y-0.5 text-[7px] sm:text-[8px] font-mono">
                  <div className="flex justify-between"><span>USD 540</span><TrendingUp className="w-2.5 h-2.5 text-primary" /></div>
                  <div className="flex justify-between"><span>EUR 588</span><TrendingDown className="w-2.5 h-2.5 text-orange-400" /></div>
                  <div className="flex justify-between"><span>RUB 5.4</span><Minus className="w-2.5 h-2.5 text-muted-foreground" /></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-card/70 border border-border/40 rounded p-1.5 flex flex-col"
              >
                <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Маржа</div>
                <div className="h-2 w-full rounded bg-border/40 overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="h-full bg-cyan-400"
                  />
                  <div className="h-full w-[15%] bg-red-500/70" />
                </div>
                <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground mt-1">18% <span className="text-orange-400">(alert: курс)</span></div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-card/70 border border-border/40 rounded p-1.5 flex flex-col"
              >
                <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Тендеры</div>
                <div className="space-y-0.5 text-[7px] sm:text-[8px] font-mono">
                  <div className="flex items-center justify-between"><span>#4421</span><Check className="w-2.5 h-2.5 text-primary" /></div>
                  <div className="flex items-center justify-between"><span>#4422</span><Clock className="w-2.5 h-2.5 text-orange-400" /></div>
                  <div className="flex items-center justify-between"><span>#4423</span><X className="w-2.5 h-2.5 text-red-500" /></div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-card/70 border border-border/40 rounded p-1.5 flex flex-col"
              >
                <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground uppercase tracking-wider mb-1">Цены</div>
                <div className="space-y-0.5 text-[7px] sm:text-[8px] font-mono">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1 py-[1px] rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 text-[6px] sm:text-[7px]">ГОС</span>
                    <span>₸ 12 400</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1 py-[1px] rounded bg-primary/10 text-primary border border-primary/30 text-[6px] sm:text-[7px]">VIP</span>
                    <span>₸ 14 800</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-1 py-[1px] rounded bg-orange-400/10 text-orange-400 border border-orange-400/30 text-[6px] sm:text-[7px]">DIST</span>
                    <span>₸ 11 200</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-2 pt-1.5 relative z-10">
            <div className="text-[6px] sm:text-[7px] font-mono text-muted-foreground flex items-center justify-between gap-2">
              <span className="truncate">1C ⇄ AgentMail · sync 09:42</span>
              <span className="text-primary truncate">→ daily owner report sent</span>
            </div>
          </div>
        </div>
      ),
      details: t("cases.mmg.details", { returnObjects: true }) as CaseDetails,
    },
  ];

  const [expandedId, setExpandedId] = useState<number | null>(0);

  return (
    <section id="cases" className="py-20 sm:py-24 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 sm:mb-20 text-center font-display">{t("cases.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {cases.map((c, i) => {
            const isOpen = expandedId === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                onClick={() => setExpandedId(isOpen ? null : i)}
                className="flex flex-col group cursor-pointer rounded-3xl bg-card/30 border border-border hover:border-primary/50 hover:shadow-[0_0_30px_-15px_rgba(132,204,22,0.3)] transition-all duration-300 overflow-hidden"
                data-testid={`case-card-${i}`}
              >
                <div className="p-5 sm:p-6">
                  <div className="h-[280px] sm:h-[320px] mb-6 rounded-2xl bg-card/50 border border-border p-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                    {c.visual}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center gap-4 font-display">
                    {c.title}
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <div className="inline-flex self-start px-3 py-1 bg-primary/10 text-primary font-mono text-xs sm:text-sm mb-4 rounded border border-primary/20 max-w-full break-words">
                    {c.metric}
                  </div>
                  <p className="text-muted-foreground text-base sm:text-lg">{c.desc}</p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-mono text-primary transition-colors hover:bg-primary/15"
                      >
                        <span>{t("cases.openSite")}</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isOpen ? null : i);
                      }}
                      aria-expanded={isOpen}
                      className="inline-flex items-center gap-2 text-sm font-mono text-primary hover:text-primary/80 transition-colors"
                      data-testid={`case-toggle-${i}`}
                    >
                      <span>{isOpen ? t("cases.collapse") : t("cases.expand")}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && c.details && (
                    <motion.div
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="overflow-hidden border-t border-border/60"
                      data-testid={`case-details-${i}`}
                    >
                      <div className="p-5 sm:p-6 space-y-6">
                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-2">{t("cases.overview")}</div>
                          <p className="text-base text-foreground/90 leading-relaxed">{c.details.overview}</p>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{t("cases.capabilities")}</div>
                          <ul className="space-y-2">
                            {c.details.capabilities.map((cap, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{cap}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{t("cases.outcomes")}</div>
                          <ul className="space-y-2">
                            {c.details.outcomes.map((o, j) => (
                              <li key={j} className="flex items-start gap-2.5 text-sm text-foreground/85">
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>{o}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground mb-3">{t("cases.stack")}</div>
                          <div className="flex flex-wrap gap-2">
                            {c.details.stack.map((s, j) => (
                              <span
                                key={j}
                                className="px-2.5 py-1 text-xs font-mono rounded border border-border/60 bg-background/60 text-foreground/80"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FastLaunch() {
  const { t } = useTranslation();
  const logLines = t("fastLaunch.logLines", { returnObjects: true }) as string[];
  const tStamps = ["[T-48:00]", "[T-45:30]", "[T-24:00]", "[T-12:00]", "[T-02:00]", "[T-00:30]", "[T-00:00]"];
  return (
    <section className="py-20 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="lg:w-1/2 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/20 bg-black/5 text-black font-mono text-xs sm:text-sm font-bold mb-6">
              <Timer className="w-4 h-4" /> {t("fastLaunch.badge")}
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-black font-display">{t("fastLaunch.title")}</h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4">{t("fastLaunch.guarantee")}</p>
            <p className="text-lg sm:text-2xl mb-10 text-black font-medium leading-tight">{t("fastLaunch.subtitle")}</p>
            <div className="space-y-4 font-mono text-sm sm:text-base">
              {[t("fastLaunch.bullet1"), t("fastLaunch.bullet2"), t("fastLaunch.bullet3"), t("fastLaunch.bullet4")].map((b, i) => (
                <div key={i} className="flex items-center gap-4 bg-black/6 p-4 rounded-xl border border-black/12 transition-colors hover:bg-black/10">
                  <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                  <span className="text-black font-medium">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-black/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <div>
                <div className="text-sm font-bold text-black/75 uppercase tracking-widest mb-1">{t("fastLaunch.priceLabel")}</div>
                <div className="text-3xl sm:text-4xl font-bold text-black font-mono">{t("fastLaunch.price")}</div>
              </div>
              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 text-base sm:text-lg bg-black text-primary hover:bg-black/90 font-mono transition-transform hover:scale-105" data-testid="btn-fast-launch">{t("fastLaunch.cta")}</Button>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-[#0a0a0a] text-white rounded-3xl p-5 sm:p-8 font-mono text-xs sm:text-sm relative shadow-2xl overflow-hidden border border-black/20 h-[440px] sm:h-[500px] flex flex-col">
              <div className="absolute right-[-40px] bottom-[-20px] text-[120px] sm:text-[180px] font-bold opacity-[0.03] leading-none select-none pointer-events-none">48H</div>
              <div className="text-primary mb-4 sm:mb-6 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-2 min-w-0"><Terminal className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> <span className="truncate">{t("fastLaunch.logTitle")}</span></div>
                <div className="flex gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary/50" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 opacity-80 flex-1 overflow-hidden relative">
                <motion.div
                  initial={{ y: 50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="space-y-3 sm:space-y-4"
                >
                  {logLines.map((line, i) => {
                    const isLast = i === logLines.length - 1;
                    const isPerf = i === 4;
                    return (
                      <p key={i} className={`flex gap-2 sm:gap-4 ${isLast ? "font-bold" : ""}`}>
                        <span className={`w-16 sm:w-20 shrink-0 ${isLast ? "text-primary" : "text-muted-foreground"}`}>{tStamps[i]}</span>
                        <span className={`min-w-0 break-words ${isPerf ? "text-cyan-400" : isLast ? "text-primary inline-flex items-center gap-2" : ""}`}>
                          {isLast && <Rocket className="w-4 h-4 inline shrink-0" />}
                          {line}
                        </span>
                      </p>
                    );
                  })}
                </motion.div>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs text-muted-foreground mb-2 font-bold">
                  <span>{t("fastLaunch.progress")}</span>
                  <span className="text-primary">100%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const { t } = useTranslation();
  const rawSteps = t("process.steps", { returnObjects: true }) as Array<{ title: string; desc: string; time: string }>;
  const steps = rawSteps.map((s, i) => ({ num: String(i + 1).padStart(2, "0"), ...s }));

  return (
    <section id="process" className="py-20 sm:py-24 bg-background relative border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-display">{t("process.title")}</h2>
          <p className="text-muted-foreground text-lg sm:text-xl">{t("process.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto relative">
          <div className="hidden lg:block absolute top-[50px] left-[10%] right-[10%] h-[2px] bg-border/50 z-0" />
          <div className="hidden lg:block absolute top-[250px] left-[10%] right-[10%] h-[2px] bg-border/50 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border/50 p-6 sm:p-8 rounded-3xl relative z-10 hover:border-primary/50 transition-colors group"
            >
              <div className="text-4xl sm:text-5xl font-mono font-bold text-border group-hover:text-primary/20 transition-colors mb-6">{step.num}</div>
              <h3 className="text-2xl font-bold mb-3 font-display">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
              <div className="text-xs font-mono text-primary mt-6 pt-4 border-t border-border/50">{step.time}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const { t } = useTranslation();
  const plans = (t("pricing.plans", { returnObjects: true }) as Array<{
    name: string; price: string; time: string; for: string; features: string[];
  }>).map((p, i) => ({ ...p, popular: i === 1 }));

  return (
    <section id="pricing" className="py-20 sm:py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-display">{t("pricing.title")}</h2>
          <p className="text-muted-foreground text-lg sm:text-xl">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-8 sm:p-10 rounded-3xl border ${plan.popular ? "border-primary bg-primary/5 shadow-[0_0_40px_-15px_rgba(132,204,22,0.2)]" : "border-border/50 bg-background"} flex flex-col`}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full font-mono whitespace-nowrap">{t("pricing.popular")}</div>}

              <h3 className="text-3xl font-bold mb-3 font-display">{plan.name}</h3>
              <div className="text-base text-muted-foreground mb-8 min-h-12 leading-tight">{plan.for}</div>

              <div className="mb-10 pb-8 border-b border-border/50">
                <div className="text-3xl sm:text-4xl font-bold font-mono text-primary mb-3 break-words">{plan.price}</div>
                <div className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                  <Command className="w-4 h-4" /> {plan.time}
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-base">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="w-full mt-auto">
                <Button variant={plan.popular ? "default" : "outline"} size="lg" className="w-full h-14 font-mono text-base border-border/50">
                  {plan.popular ? t("pricing.ctaPopular") : t("pricing.ctaDefault")}
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const { t } = useTranslation();
  const faqs = t("faq.items", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="py-20 sm:py-24 border-t border-border/50 bg-background relative overflow-hidden">
      <div className="absolute -left-40 top-40 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12 sm:mb-16 text-center font-display">{t("faq.title")}</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-2">
              <AccordionTrigger className="text-left font-bold text-lg sm:text-xl hover:text-primary transition-colors py-6 data-[state=open]:text-primary">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base sm:text-lg leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Testimonials() {
  const { t } = useTranslation();
  const quotes = t("testimonials.quotes", { returnObjects: true }) as Array<{
    metric: string; quote: string; author: string; role: string; initials: string;
  }>;

  return (
    <section id="testimonials" className="py-20 sm:py-24 border-t border-border/50 bg-background">
      <div className="container mx-auto px-6">
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 font-display">{t("testimonials.title")}</h2>
          <p className="text-muted-foreground text-lg sm:text-xl">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card/50 border border-border/50 rounded-3xl p-6 sm:p-8 hover:border-primary/30 transition-colors flex flex-col"
              data-testid={`testimonial-${i}`}
            >
              <div className="flex flex-col gap-3 mb-6">
                <span className="self-start font-mono text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary max-w-full break-words">
                  {q.metric}
                </span>
                <span className="text-primary text-base tracking-widest">★★★★★</span>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-foreground/90 mb-8 flex-1 break-words">
                «{q.quote}»
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-border/50 min-w-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-mono font-bold flex items-center justify-center shrink-0">
                  {q.initials}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-foreground truncate">{q.author}</span>
                  <span className="text-sm text-muted-foreground font-mono truncate">{q.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:mt-10 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="text-[11px] font-mono uppercase tracking-[0.24em] text-primary/80">{t("testimonials.ctaKicker")}</div>
              <div className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">{t("testimonials.ctaTitle")}</div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{t("testimonials.ctaNote")}</div>
            </div>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="w-full lg:w-auto">
              <Button size="lg" className="w-full lg:w-auto bg-primary text-primary-foreground hover:bg-primary/90" data-testid="btn-testimonials-cta">
                {t("testimonials.ctaButton")}
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-28 relative overflow-hidden bg-[#050505] border-t border-border/50">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-8 font-display">{t("ctaSection.title")}</h2>
        <p className="text-lg sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
          {t("ctaSection.subtitle")}
        </p>
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
          <Button size="lg" className="h-16 sm:h-20 px-8 sm:px-12 text-base sm:text-xl font-mono tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(132,204,22,0.6)]" data-testid="btn-footer-telegram">
            <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" />
            {t("ctaSection.button")}
          </Button>
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-10 border-t border-border/50 bg-background text-sm text-muted-foreground">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-foreground text-lg tracking-tight">DosCode</span>
          <span className="font-mono">© 2026</span>
        </div>
        <div className="font-mono">{t("footer.city")}</div>
        <div className="flex items-center gap-6 font-mono">
          <a href={TELEGRAM_URL} className="hover:text-primary transition-colors">{t("footer.telegram")}</a>
          <a href="mailto:hello@doscode.kz" className="hover:text-primary transition-colors">{t("footer.email")}</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <div className="noise-bg" />
      <Header />
      <main>
        <Hero />
        <FastLaunch />
        <StatsBar />
        <CapabilitiesMarquee />
        <Cases />
        <Testimonials />
        <Services />
        <Process />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
