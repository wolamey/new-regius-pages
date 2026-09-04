# Production integration checklist

Этот список заполняется разработчиком и владельцем перед публикацией. Локальный GO не равен production GO.

## Репозиторий и инфраструктура

- [ ] Определён целевой репозиторий и ответственная ветка.
- [ ] Выбран режим: интеграция в основной сайт или отдельное приложение.
- [ ] Настроены Node.js runtime/reverse proxy либо отдельный backend для `/api/*`.
- [ ] Frontend и form API работают same-origin.
- [ ] Настроены HTTPS, `PUBLIC_ORIGIN`, `PORT` и server bind host.
- [ ] Проверены CSP, cache headers, 404 и security headers.

## Контент и право публикации

- [ ] Утверждены все четыре H1, CTA, цены и формулировки первого этапа.
- [ ] Подтверждено право публикации именованного производственного кейса.
- [ ] NDA-клиент заявок остаётся анонимным.
- [ ] Все вычисляемые показатели помечены как расчёт, а не факт экономии.
- [ ] Утверждены политика обработки данных и consent version.
- [ ] Подтверждены контакты, Telegram и дополнительные каналы связи.

## Форма и CRM

- [ ] Утверждены CRM custom fields и их коды.
- [ ] Определены `SOURCE_ID`, ответственный и duplicate policy.
- [ ] Webhook имеет минимально необходимые права и хранится только в secret storage.
- [ ] Для multi-instance развертывания добавлено постоянное idempotency storage.
- [ ] Пройден тест success/error/timeout/duplicate без потери заполненных данных.
- [ ] Тестовый лид создан ровно один раз и проверен ответственным в Bitrix24.
- [ ] Логи не содержат PII, webhook или upstream body.

## Аналитика и реклама

- [ ] Подключён согласованный analytics container/counter.
- [ ] Настроены test traffic и исключение внутренних переходов.
- [ ] Проверено отсутствие PII в событиях.
- [ ] UTM корректно доходит до CRM.
- [ ] Согласована схема offline conversion.
- [ ] Рекламный трафик включается только после owner GO.

## QA

- [ ] Chrome, Edge, Firefox, Safari desktop.
- [ ] iOS Safari и Android Chrome на физических устройствах.
- [ ] 320, 360, 390, 768, 1024, 1440 px.
- [ ] 200% zoom/reflow без horizontal scroll.
- [ ] Keyboard-only, focus-visible, FAQ, form errors и success state.
- [ ] `prefers-reduced-motion` и системное увеличение текста.
- [ ] Lighthouse и Web Vitals на целевом хостинге.
- [ ] Canonical, robots, sitemap, JSON-LD и 404 после развертывания.

## Release gate

- [ ] QA/security GO.
- [ ] CRM-интегратор подтвердил доставку.
- [ ] Владелец утвердил тексты, юридические документы и публикацию.
- [ ] Назначен человек, который принимает и обрабатывает лиды.

