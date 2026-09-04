# AI-13. QA, безопасность и release gate

**Последнее обновление:** 01.09.2026  
**Локальный результат:** GO  
**Production-публикация:** NO-GO

## 1. Проверенные команды

| Проверка | Результат |
|---|---|
| `npm run typecheck` | PASS |
| `npm run build` | PASS |
| client build | 309.82 KB JS / 95.11 KB gzip; 124.88 KB CSS / 24.54 KB gzip |
| SSR build + prerender | PASS; 7 маршрутов |
| `npm audit --audit-level=moderate` | 0 уязвимостей |

## 2. Маршруты и SEO

Все четыре маршрута в production-preview вернули HTTP 200, `data-prerendered="true"`, уникальные title и H1 в исходном HTML:

- `/solutions/production-control/`;
- `/solutions/order-1c-automation/`;
- `/products/sales-intelligence/`;
- `/solutions/bitrix24-business-result/`.

Дополнительно:

- `/robots.txt`: 200, `text/plain`;
- `/sitemap.xml`: 200, `application/xml`;
- случайный отсутствующий маршрут: 404;
- production hydration: PASS, console errors/warnings отсутствуют.

## 3. Responsive и visual QA

Проверено визуально в локальном браузере:

- production page: desktop/mobile visual pass из предыдущего цикла;
- orders, Sales Intelligence и Bitrix24: desktop 1440×900;
- orders, Sales Intelligence и Bitrix24: mobile 390×844 (фактическая content viewport 375 px со scrollbar).

Результат:

- горизонтального overflow нет;
- H1 и CTA читаются и не обрезаются;
- process board адаптируется;
- меню переключается на mobile;
- закреплённый CTA не закрывает форму;
- labels формы видимы;
- первый и второй шаг помещаются в одну колонку;
- calculator и proof metrics не выходят за viewport.
- три campaign-страницы имеют разные визуальные системы и сценарные first-screen illustrations;
- reduced-motion показывает понятное конечное состояние без скрытого контента;
- console errors/warnings при текущем локальном проходе отсутствуют.

Not verified: iOS Safari, Android Chrome на физических устройствах, Firefox, Edge, Safari desktop, 200% browser zoom, Lighthouse p75.

## 4. Форма и backend

| Сценарий | Результат |
|---|---|
| Первый шаг с валидными полями | PASS |
| Переход на второй шаг | PASS |
| `mock` success | PASS |
| Повтор с одним idempotency key | PASS; тот же request ID, `duplicate=true` |
| `disabled` integration | PASS; нейтральная ошибка |
| Сохранение значений после error | PASS (`teamSize=20`, `currentCrm=Excel`) |
| Повторная доступность submit | PASS |
| CSRF cookie/header/body | PASS |
| Rate limit/honeypot/schema | реализовано; отдельный нагрузочный тест not verified |
| Реальный Bitrix24 lead | NOT VERIFIED; намеренно не подключался |

## 5. Security

Локальный production-preview отдаёт:

- `Content-Security-Policy`;
- `Strict-Transport-Security`;
- `X-Content-Type-Options`;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `X-Frame-Options`.

Клиент не содержит реального `BITRIX_WEBHOOK_URL`. Server logs не содержат PII и секреты. Source maps в production build не генерируются.

## 6. Контент и claims

- NDA-клиент анонимен.
- 30 000 BYN не названо прямой экономией.
- Производственная страница не содержит придуманных процентов.
- Sales Intelligence не содержит универсального обещания 100% точности.
- 1 310 звонков обозначены внутренней выборкой RegiusLab.
- Демонстрационный UI Sales Intelligence явно помечен.

## 7. Дефекты / блокеры

### P0

1. Основной `regiuslab.by` всё ещё раскрывает два Bitrix24 REST webhook в публичном bundle. Значения не фиксировались. До production-релиза требуется ротация и server-side перенос.

### P1

1. Нет исходного репозитория/ветки текущего сайта для безопасного переноса.
2. Не утверждены политика обработки данных и финальный текст consent.
3. Не утверждён CRM field mapping и persistent idempotency store.
4. Не предоставлены брендбук, proof assets, реальные обезличенные screenshots.
5. Не подтверждены WhatsApp, Viber и booking URL.
6. Не подтверждены поддерживаемые CRM/телефонии/языки/formats Sales Intelligence.
7. Реальные analytics counters, test traffic и offline conversion не подключены.

### P2

1. Physical-device/browser matrix, Lighthouse и Web Vitals.
2. A/B tests и country-specific content.

## 8. Gate

**Local GO:** код можно просматривать, обсуждать, тестировать и дорабатывать в `local-landing-pages`; основной сайт не изменён.

**Production NO-GO:** нельзя переносить в production и включать рекламный трафик, пока Денис Стрежнев не утвердит тексты/офферы/кейсы/цену/политику, технический владелец не передаст repository path и CRM contract, P0 webhook не будет устранён, а повторный AI-13 не подтвердит end-to-end лид в тестовом Bitrix24-контуре.
