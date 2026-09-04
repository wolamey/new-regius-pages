# RegiusLab Landings — передача разработчикам

**Состояние пакета:** локальная реализация готова к переносу и инженерной интеграции.  
**Production:** публикация и подключение рекламного трафика не разрешены до закрытия блокеров из раздела «Перед production».  
**Дата сборки handoff:** 2026-09-01.

## 1. Что находится в проекте

Один React/Vite-проект содержит четыре отдельные посадочные страницы:

| Оффер | Маршрут | Код оффера |
|---|---|---|
| Контроль производства и движения заказа | `/solutions/production-control/` | `production_control` |
| Заявки из мессенджеров в 1С | `/solutions/order-1c-automation/` | `order_1c_automation` |
| Regius Sales Intelligence | `/products/sales-intelligence/` | `sales_intelligence` |
| Битрикс24 с измеримым бизнес-результатом | `/solutions/bitrix24-business-result/` | `bitrix24_business_result` |

Корень `/` — служебный локальный каталог. `/privacy/` — заглушка, которую нельзя публиковать как юридический документ.

## 2. Технологии

- React 18 + TypeScript;
- Vite 7;
- React Router;
- Express 5 для защищённого form API и раздачи production build;
- Zod, Helmet, express-rate-limit;
- Lucide React для иконок;
- собственные CSS-системы и motion-сценарии без Tailwind, shadcn, coss или платных UI-реестров.

Сторонний Pro-код и лицензионные компоненты не использованы.

## 3. Структура, которую нужно сохранить

```text
src/
  App.tsx                         маршруты
  content.ts                     тексты, SEO и page-specific поля формы
  styles.css                     общая основа и shared-блоки
  production.css                 визуальная система производства
  campaigns.css                  три самостоятельные campaign-системы
  components/
    ProductionLanding.tsx        производство
    CampaignLandings.tsx         заявки, Sales Intelligence, Битрикс24
    LeadForm.tsx                 единая двухшаговая форма
    Calculator.tsx               калькулятор заявок
    Seo.tsx                      meta, JSON-LD, canonical
  lib/
    analytics.ts                 события и UTM
    leadApi.ts                   frontend-контракт формы
server/index.ts                  защищённый backend и reference mapping Bitrix24
scripts/prerender.mjs            prerender семи маршрутов
public/                          шрифты, брендовые файлы, robots, sitemap
docs/                            канон, интеграционные контракты и QA
```

## 4. Быстрый запуск

Нужен Node.js 20+ и npm.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

- frontend: `http://127.0.0.1:4173/`;
- API health: `http://127.0.0.1:8787/api/health`.

По умолчанию `LEAD_DELIVERY_MODE=disabled`: данные не уходят наружу.

Для безопасной локальной проверки формы:

```powershell
$env:LEAD_DELIVERY_MODE="mock"
npm run dev
```

## 5. Сборка и локальный production preview

```powershell
npm run typecheck
npm run build
npm audit --audit-level=moderate
npm run preview
```

`npm run build` создаёт prerendered static output в `dist/client`. SSR-бандл используется только при сборке и затем удаляется скриптом prerender.

`npm run preview` запускает Express на `127.0.0.1:8787`. Для контейнера или удалённого хоста разработчик должен вынести bind host в конфигурацию либо адаптировать сервер под существующую инфраструктуру.

## 6. Варианты интеграции

### В существующий сайт

1. Перенести React-компоненты, контент и CSS в текущий репозиторий сайта.
2. Сохранить четыре URL и уникальные meta/JSON-LD.
3. Подключить `/api/csrf` и `/api/leads` к server-side контуру сайта.
4. Не переносить webhook или токены в браузерный код.
5. После интеграции заново выполнить visual QA и end-to-end тест заявки.

### Как отдельное приложение

1. Собрать `npm ci && npm run build`.
2. Запускать Node-сервер за HTTPS reverse proxy.
3. Настроить `PUBLIC_ORIGIN`, `PORT`, delivery mode и секреты только в среде сервера.
4. Обеспечить same-origin доступ frontend → `/api/*`.
5. Заменить process-local idempotency store на общее постоянное хранилище, если будет больше одного server instance.

Статический CDN может отдать `dist/client`, но сам по себе не обслужит защищённую форму. Для формы всё равно нужен backend.

## 7. Контракт формы и Bitrix24

Полный контракт: `docs/AI-11-form-contract.md`.

- frontend получает CSRF через `GET /api/csrf`;
- отправляет `POST /api/leads` с CSRF и idempotency key;
- backend валидирует payload, origin, honeypot и rate limit;
- `BITRIX_WEBHOOK_URL` читается только на сервере;
- frontend не получает ответ Bitrix24, webhook, stack trace или внутреннюю карту полей.

Режимы:

- `disabled` — безопасный default;
- `mock` — локальный success без внешней передачи;
- `bitrix` — реальная серверная доставка после утверждения CRM-контракта.

## 8. Аналитика

Полный словарь: `docs/AI-12-analytics.md`.

Реализованы события `lp_view`, CTA, form start/step/success/error, контакты, calculator и pilot. Сейчас они пишутся в `window.dataLayer`; реальные счётчики не подключены. PII в analytics payload не передаётся.

## 9. Визуальные контракты

- **Производство:** тёмная индустриальная система; один заказ проходит путь ОТК → склад → отгрузка.
- **Заявки → 1С:** диспетчерская и бумажный артефакт; сообщение сканируется и превращается в проверяемый черновик.
- **Sales Intelligence:** тёмная звуковая лаборатория; playhead проходит по звонку и раскрывает договорённость, следующий шаг и риск.
- **Битрикс24:** диагностический атлас; симптомы сходятся к причине и ограниченному первому этапу.

Motion является поясняющим, одноразовым и не блокирует чтение. Для `prefers-reduced-motion` есть статическое конечное состояние.

## 10. Подтверждённые ограничения контента

- NDA-клиент страницы заявок остаётся анонимным.
- `30 000 BYN` — расчётный эквивалент рабочей ёмкости, не подтверждённая прямая экономия.
- `1 310 звонков` — внутренняя выборка RegiusLab, не универсальная гарантия точности.
- Производственная страница не обещает неподтверждённые проценты экономии или производительности.
- Демо-интерфейсы помечены как демонстрационные/иллюстративные.

## 11. Перед production

Обязательные решения и проверки:

1. Получить письменное утверждение финальных текстов, офферов, цены пилота и публикации кейсов.
2. Заменить `/privacy/` на утверждённую политику и согласовать версию consent.
3. Утвердить Bitrix24 field mapping, источник, ответственного, duplicate policy и минимальные права webhook.
4. Хранить webhook только в секретах backend; проверить и при необходимости ротировать ранее использовавшиеся credentials.
5. Подключить реальные analytics counters, test traffic и consent-поведение.
6. Подтвердить WhatsApp/Viber/booking URL либо убрать недоступные каналы.
7. Повторить проверку на целевом домене: CSP, cookie Secure, origin allowlist, canonical, sitemap, 404 и cache headers.
8. Провести form E2E в тестовом Bitrix24-контуре и убедиться, что лид создаётся ровно один раз.
9. Проверить iOS Safari, Android Chrome, Firefox/Edge, 200% zoom, Lighthouse и Web Vitals.
10. Получить финальный owner GO до подключения рекламного трафика.

## 12. Что проверено в локальной версии

- TypeScript и production build;
- prerender всех маршрутов;
- desktop 1440×900 и mobile 390×844 для трёх campaign-страниц;
- более ранняя desktop/mobile проверка производственной страницы;
- отсутствие horizontal overflow;
- один H1, доступные имена кнопок/ссылок, labels формы;
- mobile navigation и reduced-motion final state;
- отсутствие console errors/warnings в локальном просмотре;
- dependency audit без moderate/high vulnerabilities.

**Not verified:** реальный Bitrix24 lead, реальные analytics counters, production domain, физические мобильные устройства, полный browser matrix, 200% zoom и Lighthouse p75.

