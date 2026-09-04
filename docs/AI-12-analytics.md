# AI-12. События, UTM и рекламные контуры

## 1. Единый словарь

| Event | Trigger |
|---|---|
| `lp_view` | первое отображение страницы |
| `cta_click` | основной/вторичный CTA |
| `form_start` | первое взаимодействие с формой |
| `form_step_complete` | валидно завершён первый шаг |
| `form_submit_success` | backend подтвердил доставку |
| `form_submit_error` | validation/network/integration failure без PII |
| `phone_click` | телефон |
| `telegram_click` | Telegram |
| `whatsapp_click` | WhatsApp после подключения ссылки |
| `viber_click` | Viber после подключения ссылки |
| `booking_click` | онлайн-запись после подключения ссылки |
| `case_open` | действие в proof-блоке |
| `calculator_complete` | явный расчёт калькулятора |
| `pilot_click` | primary CTA Sales Intelligence |

## 2. Разрешённый payload

```json
{
  "event": "cta_click",
  "offer_code": "production_control",
  "page_path": "/solutions/production-control/",
  "block": "hero",
  "cta_variant": "primary",
  "market": "unknown",
  "test_traffic": false,
  "occurred_at": "ISO-8601"
}
```

Имя, контакт, компания, должность, комментарий, содержимое заявки и другие PII в события не передаются.

## 3. UTM

Сохраняются в `sessionStorage` при первом входе:

- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `utm_term`.

Значения переносятся между четырьмя страницами в пределах вкладки, передаются только в backend формы и очищаются после подтверждённой успешной доставки.

## 4. Dedupe

Одинаковое событие с тем же offer/block/variant не отправляется повторно в течение 750 ms. Это защищает от двойного клика и повторного React-render, но не подменяет dedupe на стороне аналитической системы.

## 5. Рынки

Автоматический IP-redirect не используется. Market принимает `BY`, `RU` или `unknown` из согласованного query/рекламного контура и передаётся вместе с offer code.

## 6. Test traffic

Локальные события пишутся только в `window.dataLayer`; реальные счётчики не подключены. Перед production нужно определить правило test traffic и идентификаторы Яндекс Метрики/других систем без передачи PII.

## 7. Offline conversion readiness

`requestId`, offer code и UTM позволяют позднее связать лид с оплатой аудита или пилота. Фактическая передача офлайн-статуса требует отдельного CRM/analytics mapping и не входит в локальный контур.

## 8. Проверка

В dev QA подтверждены вызовы событий просмотра, CTA, формы, калькулятора и результата. Структура функции `track` разрешает только технический контекст. Production-счётчики и рекламные кабинеты не проверены и остаются `Not verified`.
