# AI-11. Контракт формы и Bitrix24

## 1. Endpoint

`POST /api/leads`

Headers:

- `Content-Type: application/json`
- `X-CSRF-Token: <token from GET /api/csrf>`
- `Idempotency-Key: <UUID>`

Cookie `regius_csrf` выдаётся `GET /api/csrf`, имеет `HttpOnly`, `SameSite=Strict` и `Secure` в HTTPS-контуре.

## 2. Общий payload

```json
{
  "idempotencyKey": "uuid",
  "csrfToken": "opaque-token",
  "offerCode": "production_control",
  "pageUrl": "https://regiuslab.by/solutions/production-control/",
  "market": "BY",
  "name": "Имя",
  "contact": "+375... или @telegram",
  "company": "Компания",
  "position": "Должность",
  "teamSize": "25",
  "currentCrm": "Битрикс24",
  "preferredChannel": "Телефон",
  "comment": "Необязательный комментарий",
  "specific": {},
  "utm": {},
  "consent": {
    "accepted": true,
    "version": "landing-consent-draft-2026-08-29",
    "acceptedAt": "ISO-8601"
  },
  "website": ""
}
```

## 3. Page-specific fields

- `production_control`: `sites`, `uses1c`, `participants`.
- `order_1c_automation`: `ordersPerDay`, `channels`, `oneC`, `operators`.
- `sales_intelligence`: `salesTeam`, `callsPerMonth`, `telephony`.
- `bitrix24_business_result`: `bitrixType`, `processTeam`, `mainProblem`.

## 4. Responses

Success:

```json
{ "ok": true, "requestId": "uuid" }
```

Duplicate success:

```json
{ "ok": true, "requestId": "same-uuid", "duplicate": true }
```

Neutral error:

```json
{ "ok": false, "code": "integration_failed", "requestId": "uuid" }
```

Frontend never receives the Bitrix24 response, webhook path, token, stack trace or internal field map.

## 5. Validation and protection

- request body limit: 32 KB;
- strict Zod schema with length/type constraints;
- origin allowlist;
- CSRF token in header + body + HttpOnly cookie;
- 8 attempts per IP per 10 minutes;
- honeypot field `website`;
- control-character and angle-bracket removal;
- request timeout to Bitrix24: 8 seconds;
- process-local idempotency store: 24 hours.

## 6. Delivery modes

- `disabled`: default; returns `integration_disabled`, no external request.
- `mock`: returns a local success for end-to-end QA.
- `bitrix`: uses server-only `BITRIX_WEBHOOK_URL` and calls `crm.lead.add.json`.

## 7. CRM mapping needing owner approval

Current local reference uses standard lead fields (`TITLE`, `NAME`, `COMPANY_TITLE`, `POST`, `PHONE`/`IM`, `SOURCE_ID`, `SOURCE_DESCRIPTION`, `COMMENTS`). Offer, market, UTM, consent and page context are retained in the lead description/comments until the CRM integrator provides approved custom field codes.

Before production the owner/CRM integrator must confirm:

1. exact custom fields for offer code, market, page URL, UTM and consent;
2. whether Telegram belongs in `IM`, a custom field or phone field;
3. duplicate-search policy in the existing CRM;
4. minimum webhook rights;
5. responsible person/source ID without changing stages or robots;
6. persistent idempotency storage shared by all server instances.

## 8. Logging and retry boundary

Logs contain only `event`, `requestId`, `offerCode` and timestamp. Automatic retry after an ambiguous upstream timeout is intentionally disabled: without a persistent external idempotency marker it can create a second lead. Frontend preserves data and allows a controlled retry with the same idempotency key.
