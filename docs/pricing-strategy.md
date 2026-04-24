# DosCode Pricing Strategy

Last updated: 2026-04-24
Market: Kazakhstan
Currency: KZT

## Positioning

DosCode is a new lean studio using Codex-assisted development. We should not price like a large agency yet, but we also should not compete with cheap template freelancers.

Charge for the business outcome: shipped site, working product, integrations, deployment, fixes, and speed. Do not discount only because the build is faster with AI. The speed is our margin and competitive edge.

## Core Rules

- Landing starts from `100,000 ₸` only when the client accepts our proposed structure quickly, content is mostly ready, and there are no unusual integrations.
- More custom direction, unclear copy, extra revisions, multilingual content, custom animations, calculators, CRM, payment, or API work moves the price up.
- Never give a final quote from one message. Give an orientation range first, then ask for the missing scope details.
- Quote in ranges until scope is clear.
- Avoid hourly pricing for new builds. Use fixed project stages.
- Use hourly/support pricing only for maintenance, debugging, or open-ended work.
- Keep the first-client discount small, visible, and temporary. Do not silently underprice.

## Public Price Anchors

These are the ranges we can safely show as budget orientation.

| Project type | Lean / quick | Standard | Custom / complex |
| --- | ---: | ---: | ---: |
| Landing | 100,000-220,000 ₸ | 220,000-420,000 ₸ | 420,000-900,000 ₸ |
| E-commerce | 450,000-750,000 ₸ | 750,000-1,400,000 ₸ | 1,400,000-3,500,000 ₸ |
| Native app | 900,000-1,600,000 ₸ | 1,600,000-3,000,000 ₸ | 3,000,000-6,000,000 ₸ |
| Business dashboard | 600,000-1,000,000 ₸ | 1,000,000-2,000,000 ₸ | 2,000,000-4,500,000 ₸ |
| MVP / SaaS | 1,500,000-2,500,000 ₸ | 2,500,000-5,000,000 ₸ | 5,000,000-10,000,000 ₸ |
| AI / Telegram bot | 250,000-500,000 ₸ | 500,000-1,200,000 ₸ | 1,200,000-3,000,000 ₸ |

## Integration Add-ons

Add these ranges on top of the project type when the integration is real work, not just a button/link.

| Integration | Add-on range |
| --- | ---: |
| Telegram | 60,000-180,000 ₸ |
| WhatsApp | 80,000-250,000 ₸ |
| Kaspi | 80,000-250,000 ₸ |
| Card payments / acquiring | 120,000-450,000 ₸ |
| iiko | 120,000-400,000 ₸ |
| 1C | 150,000-500,000 ₸ |
| AI | 150,000-600,000 ₸ |

If the integration has no API access, poor documentation, unstable credentials, or requires manual reverse engineering, move to the high end or quote separately after discovery.

## Scope Levels

### Lean / quick

Use when:

- Client accepts our proposed structure.
- Content is mostly ready.
- One decision maker.
- No unusual backend or API work.
- We can use an existing design pattern and adapt it.

### Standard

Use when:

- Custom design is needed.
- There are a few feedback rounds.
- There are normal integrations or admin needs.
- The client has business logic but it is understandable.

### Custom / complex

Use when:

- Requirements are unclear or changing.
- Several stakeholders approve the work.
- UX must be highly custom.
- There are complicated integrations, roles, card payments, data sync, or reporting.
- The project needs stronger QA, documentation, or handoff.

## Surcharges and Discounts

- Rush deadline: add `15-30%`.
- First-client / portfolio discount: max `15%`, only if we can use the work publicly as a case study.
- Scope creep: quote as a new stage, not as free extra work.
- Ongoing support: do not include unlimited support. Offer a separate monthly package after launch.

## Payment Schedule

Default:

1. `50%` upfront to start.
2. `30%` after clickable draft or first working build.
3. `20%` before production handoff.

For larger MVPs, split into stages:

1. Discovery / scope.
2. Design / prototype.
3. Build phase 1.
4. Build phase 2.
5. Launch / handoff.

## How AI Agents Should Price a Project

Use `docs/pricing-model.json` as the machine-readable source.

Process:

1. Identify the project type: landing, ecommerce, native app, dashboard, MVP/SaaS, or AI/Telegram bot.
2. Choose scope level: lean, standard, or custom.
3. Add integration ranges for each real integration.
4. Add rush surcharge if deadline is unusually tight.
5. Never go below the floor in `rules.neverQuoteBelow`.
6. Return a range, not a single number.
7. Explain what would move the quote up or down.
8. Ask for the minimum missing details needed to make the estimate precise.

## Quote Template

Use this when answering leads:

```text
Предварительно я бы ориентировал проект в диапазоне [MIN]-[MAX] ₸.

Почему такой диапазон:
- формат: [PROJECT_TYPE]
- сложность: [SCOPE_LEVEL]
- интеграции: [INTEGRATIONS]
- срок: [TIMELINE]

Что может сделать дешевле:
- быстро принимаем предложенную структуру
- контент готов
- меньше кастомных экранов и интеграций

Что может сделать дороже:
- много правок
- сложная логика
- 1C/iiko/Kaspi/оплата картой/AI интеграции
- срочный запуск

Чтобы назвать точнее, нужно понять:
1. какие разделы/экраны нужны
2. какие интеграции обязательны
3. кто готовит тексты/фото
4. когда нужен запуск
```

## Sources Used for Market Calibration

- OSN.KZ landing pricing, Kazakhstan 2026: standard landing ranges and package anchors.
- OSN.KZ e-commerce pricing: entry store from 250,000 ₸ and budget buckets.
- A-LUX e-commerce pricing: store packages from 450,000 ₸ to 1,500,000+ ₸.
- OSN.KZ mobile app pricing: simple React Native apps from roughly 250,000-350,000 ₸ and medium apps from roughly 700,000-1,000,000+ ₸.
- OSN.KZ SaaS pricing: agency-style SaaS MVP from about 3,000,000 ₸.
- EasyMatrix public hourly rate: 15,500 ₸/hour for freelance/support style work.
