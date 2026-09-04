# RegiusLab — четыре посадочные страницы

Локальная реализация четырёх страниц из ТЗ. Папка не связана с production-доменом и по умолчанию не отправляет заявки в Битрикс24.

Перед интеграцией обязательно прочитайте [`HANDOFF-DEVELOPERS.md`](HANDOFF-DEVELOPERS.md) и [`docs/PRODUCTION-INTEGRATION-CHECKLIST.md`](docs/PRODUCTION-INTEGRATION-CHECKLIST.md).

## Маршруты

- `/solutions/production-control/`
- `/solutions/order-1c-automation/`
- `/products/sales-intelligence/`
- `/solutions/bitrix24-business-result/`

Корневой маршрут `/` — локальный экран выбора и имеет `noindex`.

## Запуск

```powershell
npm ci
npm run dev
```

Сайт: `http://127.0.0.1:4173/`  
API: `http://127.0.0.1:8787/api/health`

## Режимы формы

`LEAD_DELIVERY_MODE`:

- `disabled` — значение по умолчанию; API валидирует запрос, но не отправляет лид;
- `mock` — локальная end-to-end проверка успешного сценария без внешней передачи;
- `bitrix` — серверная отправка в Битрикс24 через `BITRIX_WEBHOOK_URL`.

Для `bitrix` webhook хранится только в `.env` среды сервера. Реальное значение нельзя добавлять в исходники, клиентский bundle, логи или сообщения.

## Проверки

```powershell
npm run typecheck
npm run build
```

Production-публикация запрещена до утверждения владельцем текстов, контактов, политики обработки данных, подтверждающих материалов, CRM-полей, условий Sales Intelligence и AI-13 GO.
