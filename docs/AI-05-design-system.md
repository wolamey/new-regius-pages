# AI-05. UX/UI-система локальных посадочных страниц

## 1. Дизайн-направление

**Название:** «Операционный маршрут».

Страница выглядит как точный рабочий контур руководителя: чёрно-золотая фирменная основа, тонкие измерительные линии, спокойная типографика и один главный процессный артефакт на первом экране. Декор не имитирует AI; визуализация объясняет движение заказа, заявки, звонка или первого этапа внедрения.

## 2. Токены

| Роль | Значение |
|---|---|
| Ink | `#11100E` |
| Raised ink | `#232019` |
| Paper | `#F3F0E9` |
| Bright paper | `#FFFDF8` |
| Gold action | `#D1A84A` |
| Gold highlight | `#F0CB70` |
| Success | `#32745E` |
| Error | `#B44232` |

Типографика использует системные шрифты с кириллицей и без внешнего трекинга:

- display: Bahnschrift → Arial Narrow → Segoe UI;
- body: Segoe UI Variable → Segoe UI → Arial;
- data/utility: Cascadia Mono → Consolas.

Сетка: max-width 1180 px, fluid gutter 20–48 px, mobile gutter 18 px. Радиусы почти отсутствуют; интерактивность считывается через линии, контраст и focus, а не через одинаковые «плавающие карточки».

## 3. Общий desktop wireframe

```text
┌ header: brand | four routes | phone ──────────────────────────┐
│ H1 + promise + CTA        │ process-specific operating board  │
├───────────────────────────────────────────────────────────────┤
│ recognition signs: 6 observed situations                     │
├───────────────────────────────────────────────────────────────┤
│ sticky explanation        │ current → future operating rows   │
├───────────────────────────────────────────────────────────────┤
│ proof copy                │ 4 measured facts + limitation     │
├───────────────────────────────────────────────────────────────┤
│ safe first stage: 1 → 2 → 3 → 4 → 5                          │
├───────────────────────────────────────────────────────────────┤
│ trust rail                                                    │
├───────────────────────────────────────────────────────────────┤
│ sticky FAQ intro          │ accessible accordion              │
├───────────────────────────────────────────────────────────────┤
│ next-step promise        │ two-step form + all states         │
└ footer ────────────────────────────────────────────────────────┘
```

Для заявок/1С между проблемой и процессом расположен калькулятор. Для Sales Intelligence между кейсом и этапами расположен отдельный блок платного пилота.

## 4. Mobile wireframe

```text
┌ brand                         menu ┐
│ eyebrow                            │
│ H1                                 │
│ explanation                        │
│ [primary CTA]                      │
│ [secondary CTA]                    │
│ trust                              │
│ operating board                    │
├ sections in one reading column ────┤
│ form: step 1 → step 2              │
└ sticky CTA + Telegram ──────────────┘
```

На 360 px нет горизонтального overflow. Закреплённая панель учитывает safe area и не перекрывает поля: контент получает нижний отступ.

## 5. Уникальные первые экраны

- Производство: статус заказа №0248 на линии `Заказ → План → Участок → ОТК → Склад`.
- Заявки и 1С: сообщение превращается в распознанный и проверенный документ 1С.
- Sales Intelligence: демонстрационная waveform, резюме и найденный следующий шаг.
- Битрикс24: карта `Проблема → Последствие → Диагностика → Первый этап`.

Все интерфейсные данные на первом экране являются демонстрационными, если не совпадают с утверждённым case registry.

## 6. Компоненты и состояния

- Header: desktop nav, mobile menu, active route, keyboard focus.
- CTA: primary, quiet, inline, disabled/loading.
- FAQ: native button, `aria-expanded`, `aria-controls`, no motion dependency.
- Form: два шага, labels, inline errors, system error, loading, success, disabled, persistence after failure.
- Calculator: six inputs, live result only after explicit action, caveat near numbers.
- Case: source label, measured facts, limitation in the same visual block.
- Mobile action bar: primary CTA + Telegram, minimum 48 px height.

## 7. Motion policy

- Один краткий entrance первого экрана: 430–520 ms только при первом появлении.
- Hover/focus: 150–170 ms.
- Никакой анимации при вводе, частом переходе между полями и расчёте.
- Нет blur/parallax/continuous loop.
- `prefers-reduced-motion` сводит duration к 0.01 ms и отключает smooth scroll.

## 8. Материалы на замену

До публикации процессные графики можно сохранить как самостоятельную визуальную систему. Демонстрационные блоки заменяются реальными обезличенными скриншотами только после проверки разрешений, PII, размеров, alt-текстов и влияния на LCP/CLS.
