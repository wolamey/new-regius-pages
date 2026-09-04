# Статус пакетов AI-00 — AI-13

| Пакет | Локальный результат | Статус |
|---|---|---|
| AI-00 | Канон, claims registry, missing materials, decision log | готов |
| AI-01 | Повторный read-only аудит live-сайта и safe implementation plan | готов; production blocker открыт |
| AI-02 | Общая CRO-цепочка и уникальная последовательность четырёх страниц | реализовано в компонентах и контенте |
| AI-03 | H1, подзаголовки, блоки, CTA, form/error/success copy, FAQ | реализовано в `src/content.ts` и компонентах |
| AI-04 | Уникальные title/description/H1-H3, canonical, JSON-LD, sitemap, robots, prerender | реализовано локально |
| AI-05 | Desktop/mobile система, process visuals, calculator, pilot, component states | реализовано и визуально проверено |
| AI-06 | Общая React-основа, responsive, keyboard semantics, loading/success/error | реализовано |
| AI-07 | Страница производства + «Изоком Пласт» + form-specific fields | реализовано |
| AI-08 | Страница заявок/1С + NDA-кейс + calculator/caveat | реализовано |
| AI-09 | Sales Intelligence + demo UI + pilot + evidence limitation | реализовано |
| AI-10 | Битрикс24 через problem/diagnosis/first stage + three proof contours | реализовано |
| AI-11 | Единый endpoint, CSRF, rate limit, honeypot, validation, idempotency, server-only secret | реализовано локально; CRM mapping не утверждён |
| AI-12 | Словарь событий, UTM persistence, dedupe, offer/market context | реализовано локально; реальные counters not verified |
| AI-13 | Build, visual QA, route/SEO/security/form smoke | Local GO; Production NO-GO |

## Реализованная CRO-цепочка

На каждой странице:

`конкретная проблема → узнаваемые признаки → цена разрыва → сейчас/после → доказательство с ограничением → безопасный первый этап → доверие → FAQ → форма`

Отличия:

- производство продаёт видимость заказа и одного производственного маршрута;
- заявки/1С начинает с резерва времени и собственного расчёта посетителя;
- Sales Intelligence делает пилот основным действием, а разговор — вторичным;
- Битрикс24 начинает с сформированного спроса, но переводит выбор с функций на экономическое последствие и первый этап.

## SEO/GEO

- Четыре URL имеют уникальные title, description, H1 и содержательный prerendered HTML.
- JSON-LD содержит только видимые `Organization`, `Service`/`Product`, `FAQPage`, `BreadcrumbList`.
- Ограничения кейсов находятся рядом с числами.
- `robots.txt` и `sitemap.xml` являются реальными техническими файлами.
- Корневой локальный экран и незавершённая privacy-страница имеют `noindex`.
- IP-redirect и копии BY/RU не реализованы.

## Неприменённые P2

- A/B варианты hero/CTA;
- отдельные country pages;
- отраслевые варианты;
- дополнительные калькуляторы;
- персонализация по рекламному источнику;
- production offline conversion sync.
