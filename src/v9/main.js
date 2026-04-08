const showcaseData = {
  landing: {
    kicker: "LANDING MODE / HIGH-CONTRAST PITCH",
    title: "Арт-дирекшн, который поднимает perceived value без кейсов.",
    description:
      "Здесь сила в композиции, масштабе и воздухе. Такой screen language говорит: команда умеет делать category-upgrade, а не просто аккуратный шаблон.",
    bullets: [
      "hero, который ведёт взгляд и создаёт momentum",
      "контрастные section shifts вместо однообразной ленты",
      "CTA встроен в ритм страницы, а не приклеен в конец"
    ]
  },
  dashboard: {
    kicker: "DASHBOARD MODE / QUIET CONTROL",
    title: "Плотный интерфейс, который ощущается собранным, а не перегруженным.",
    description:
      "Если нужен enterprise или ops feel, мы выключаем лишний шум и усиливаем scan speed, приоритеты, статусы и рабочие состояния.",
    bullets: [
      "тихий chrome и акцент только там, где есть решение",
      "иерархия через spacing, weight и grouping, а не через сто рамок",
      "ощущение контроля вместо визуального хаоса"
    ]
  },
  launch: {
    kicker: "LAUNCH MODE / BUILT TO FEEL NEW",
    title: "Запусковой сайт должен ощущаться как событие, а не как лендинг из библиотеки.",
    description:
      "Для launch page мы усиливаем эмоциональный сигнал: richer surfaces, sharper typography, резкие паузы и section theatrics, которые держат внимание.",
    bullets: [
      "более выразительная типографика и layered art direction",
      "section design с разной энергетикой по ходу страницы",
      "современный visual tone без шаблонной startup-пластмассы"
    ]
  },
  automation: {
    kicker: "AI MODE / MODERN WITHOUT GIMMICKS",
    title: "AI-поверхность может выглядеть зрелой, а не экспериментальной.",
    description:
      "Когда продукт строится вокруг automation или AI, важно показать логику, контроль и clean response states. Тогда trust растёт быстрее, чем curiosity падает.",
    bullets: [
      "сценарии и feedback понятны даже в сложной логике",
      "motion ощущается живым, но не крикливым",
      "визуально это продукт, а не demo playground"
    ]
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector("#siteNav");
const header = document.querySelector(".v9-header");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    });
  });
}

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
}, { passive: true });

const revealNodes = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.16 });

revealNodes.forEach((node) => {
  if (prefersReducedMotion) {
    node.classList.add("is-visible");
  } else {
    revealObserver.observe(node);
  }
});

const countNodes = document.querySelectorAll(".count-up");
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const value = Number(node.dataset.value || "0");
    const prefix = node.dataset.prefix || "";
    const suffix = node.dataset.suffix || "";

    if (prefersReducedMotion) {
      node.textContent = `${prefix}${value}${suffix}`;
      countObserver.unobserve(node);
      return;
    }

    const start = performance.now();
    const duration = 900;

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${prefix}${Math.round(value * eased)}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        node.textContent = `${prefix}${value}${suffix}`;
      }
    };

    requestAnimationFrame(frame);
    countObserver.unobserve(node);
  });
}, { threshold: 0.5 });

countNodes.forEach((node) => countObserver.observe(node));

const showcaseButtons = document.querySelectorAll("[data-showcase]");
const demoPanel = document.querySelector("#demoPanel");
const showcaseKicker = document.querySelector("#showcaseKicker");
const showcaseTitle = document.querySelector("#showcaseTitle");
const showcaseDescription = document.querySelector("#showcaseDescription");
const showcaseBullets = document.querySelector("#showcaseBullets");

const renderShowcase = (key) => {
  const config = showcaseData[key];
  if (!config) return;

  showcaseButtons.forEach((button) => {
    const active = button.dataset.showcase === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  demoPanel?.setAttribute("data-mode", key);

  if (showcaseKicker) showcaseKicker.textContent = config.kicker;
  if (showcaseTitle) showcaseTitle.textContent = config.title;
  if (showcaseDescription) showcaseDescription.textContent = config.description;
  if (showcaseBullets) {
    showcaseBullets.innerHTML = "";
    config.bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      showcaseBullets.appendChild(li);
    });
  }
};

showcaseButtons.forEach((button) => {
  button.addEventListener("click", () => renderShowcase(button.dataset.showcase));
});

renderShowcase("landing");

const stageRoot = document.querySelector("#stageRoot");
if (stageRoot && !prefersReducedMotion) {
  const floatingNodes = stageRoot.querySelectorAll(".v9-float");
  stageRoot.addEventListener("pointermove", (event) => {
    const rect = stageRoot.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    floatingNodes.forEach((node) => {
      const depth = Number(node.dataset.depth || "0");
      node.style.transform = `translate3d(${x * depth * 120}px, ${y * depth * 120}px, 0)`;
    });
  });

  stageRoot.addEventListener("pointerleave", () => {
    floatingNodes.forEach((node) => {
      node.style.transform = "translate3d(0, 0, 0)";
    });
  });
}
