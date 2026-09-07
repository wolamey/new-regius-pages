import { ArrowDown, ArrowRight, BadgeCheck, Check, ChevronDown, Clock3, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { track } from "../lib/analytics";
import type { PageContent } from "../types";
import { TELEGRAM_LINK } from "./Layout";
import { HeroVisual } from "./HeroVisual";

export function Hero({ page }: { page: PageContent }) {
  const primaryEvent = page.kind === "sales" ? "pilot_click" : "cta_click";
 
  return (
    <section className="hero">
      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="eyebrow"><span />{page.eyebrow}</div>
          <h1>{page.title}</h1>
          <p className="hero-description">{page.description}</p>
          <div className="hero-actions">
            <a
              href={page.kind === "orders" ? "#calculator-title" : "#lead-form"}
              className="button button-primary"
              onClick={() => track(primaryEvent, { offer_code: page.offerCode, page_path: page.path, block: "hero", cta_variant: "primary" })}
            >
              {page.primaryCta}
              <ArrowRight aria-hidden="true" />
            </a>
            <a
              href={page.kind === "production" ? TELEGRAM_LINK : "#lead-form"}
              className="button button-quiet"
              onClick={() => track(page.kind === "production" ? "telegram_click" : "cta_click", { offer_code: page.offerCode, page_path: page.path, block: "hero", cta_variant: "secondary" })}
            >
              {page.secondaryCta}
            </a>
          </div>
          <p className="trust-line"><BadgeCheck aria-hidden="true" /> {page.trustLine}</p>
        </div>
        <HeroVisual kind={page.kind} />
      </div>
      <a className="scroll-cue" href="#problem-section" aria-label="Перейти к признакам проблемы">
        <span>Узнать свой процесс</span><ArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}

export function ProblemSection({ page }: { page: PageContent }) {
  const headings = {
    production: ["Где теряется видимость", "На этих участках заказ чаще всего пропадает из поля зрения"],
    orders: ["Ручная работа", "Что на самом деле занимает время оператора"],
    sales: ["Слепые зоны РОПа", "Чего не видно в обычном отчёте по продажам"],
    bitrix: ["До настройки CRM", "Почему команда всё равно возвращается в чаты и таблицы"],
  } as const;
  const [kicker, title] = headings[page.kind];

  return (
    <section className="section problem-section" id="problem-section" aria-labelledby="problem-title">
      <div className="container">
        <div className="section-heading split-heading">
          <span className="section-kicker">{kicker}</span>
          <h2 id="problem-title">{title}</h2>
          <p>{page.problemLead}</p>
        </div>
        <div className="problem-grid">
          {page.problems.map((problem, index) => (
            <article className="problem-item" key={problem.title}>
              <span className="problem-index">{String(index + 1).padStart(2, "0")}</span>
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BeforeAfterSection({ page }: { page: PageContent }) {
  const headings = {
    production: ["Работа по фактам", "Что меняется для продаж, мастера и руководителя"],
    orders: ["От перепечатки к проверке", "Оператор больше не набирает заказ заново"],
    sales: ["После разговора", "Договорённость не остаётся только в памяти менеджера"],
    bitrix: ["Порядок работы", "CRM повторяет реальный процесс, а не живёт отдельно"],
  } as const;
  const [kicker, title] = headings[page.kind];

  return (
    <section className="section process-section" aria-labelledby="process-title">
      <div className="container process-layout">
        <div className="section-heading sticky-copy">
          <span className="section-kicker">{kicker}</span>
          <h2 id="process-title">{title}</h2>
          <p>{page.costLead}</p>
          <a className="text-link" href="#lead-form" onClick={() => track("cta_click", { offer_code: page.offerCode, page_path: page.path, block: "process", cta_variant: "inline" })}>
            Обсудить похожую задачу <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="comparison-list">
          <div className="comparison-head"><span>Сейчас</span><span>После изменения</span></div>
          {page.beforeAfter.map((row) => (
            <div className="comparison-row" key={row.before}>
              <div><i aria-hidden="true" />{row.before}</div>
              <ArrowRight aria-hidden="true" />
              <div><Check aria-hidden="true" />{row.after}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseSection({ page }: { page: PageContent }) {
  return (
    <section className="section case-section" aria-labelledby="case-title">
      <div className="container">
        <div className="case-shell">
          <div className="case-copy">
            <span className="section-kicker">{page.caseStudy.label}</span>
            <h2 id="case-title">{page.caseStudy.title}</h2>
            <p>{page.caseStudy.summary}</p>
            <a
              href="#lead-form"
              className="text-link case-trigger"
              onClick={() => track("case_open", { offer_code: page.offerCode, page_path: page.path, block: "case" })}
            >
              Обсудить похожую задачу <ArrowRight aria-hidden="true" />
            </a>
          </div>
          <div className="metrics-grid">
            {page.caseStudy.metrics.map((metric) => (
              <div className="metric" key={`${metric.value}-${metric.label}`}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                {metric.note && <em>{metric.note}</em>}
              </div>
            ))}
          </div>
          <div className="case-limit">
            <ShieldCheck aria-hidden="true" />
            <p><strong>Граница утверждения.</strong> {page.caseStudy.limitations}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FirstStageSection({ page }: { page: PageContent }) {
  const variants = {
    production: {
      kicker: "Первый маршрут",
      title: "Начинаем с одного типа заказа, а не со всего завода",
      stages: [
        ["Выбираем заказ", "Берём типовой путь с понятным началом и отгрузкой."],
        ["Идём по участкам", "Смотрим, кто меняет статус и где данные расходятся."],
        ["Проектируем", "Фиксируем экраны, обмен с 1С и критерии приёмки."],
        ["Проверяем", "Запускаем решение на ограниченном участке работы."],
      ],
    },
    orders: {
      kicker: "Проверка на реальных сообщениях",
      title: "Один канал и один тип заказа дают честный ответ",
      stages: [
        ["Берём примеры", "Смотрим реальные сообщения, файлы и фотографии."],
        ["Разбираем правила", "Проверяем номенклатуру, контрагентов и исключения."],
        ["Связываем с 1С", "Выбираем способ передачи и точку проверки сотрудником."],
        ["Считаем пилот", "Фиксируем объём, срок и критерии качества."],
      ],
    },
    sales: {
      kicker: "Пилот вместо обещаний",
      title: "Проверяем качество разбора на ваших записях",
      stages: [
        ["Подключаем выборку", "До 200 звонков из вашей телефонии."],
        ["Сравниваем с аудио", "РОП проверяет резюме и найденные договорённости."],
        ["Ищем пользу", "Смотрим, какие риски становятся заметны раньше."],
        ["Принимаем решение", "Продолжаем только если результат полезен отделу."],
      ],
    },
    bitrix: {
      kicker: "С чего начать",
      title: "Небольшое изменение проще запустить и принять",
      stages: [
        ["Называем проблему", "Не функцию CRM, а конкретный сбой в работе."],
        ["Проверяем причину", "Отделяем настройку, данные и регламент."],
        ["Выбираем участок", "Ограничиваем первую задачу и договариваемся о приёмке."],
        ["Запускаем", "Обучаем людей на реальном рабочем сценарии."],
      ],
    },
  } as const;
  const variant = variants[page.kind];

  return (
    <section className="section stage-section" aria-labelledby="stage-title">
      <div className="container">
        <div className="section-heading split-heading">
          <span className="section-kicker">{variant.kicker}</span>
          <h2 id="stage-title">{variant.title}</h2>
          <p>{page.firstStage}</p>
        </div>
        <ol className="stage-rail">
          {variant.stages.map(([title, text], index) => (
            <li key={title}>
              <span>{index + 1}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TrustSection() {
  const items = [
    ["Битрикс24", "Статус золотого партнёра"],
    ["ISO 9001", "Система менеджмента качества"],
    ["Одна команда", "Битрикс24, 1С, AI и разработка"],
    ["По частям", "Сначала проверка, потом расширение"],
  ];

  return (
    <section className="trust-section" aria-label="Почему RegiusLab">
      <div className="container trust-grid">
        {items.map(([title, text]) => (
          <div key={title}><strong>{title}</strong><span>{text}</span></div>
        ))}
      </div>
    </section>
  );
}

export function SalesPilot({ page }: { page: PageContent }) {
  if (page.kind !== "sales") return null;
  return (
    <section className="section pilot-section" aria-labelledby="pilot-title">
      <div className="container pilot-card">
        <div>
          <span className="section-kicker">Платный пилот</span>
          <h2 id="pilot-title">Две недели, чтобы проверить сервис на своих звонках</h2>
          <p>Не просим верить общей цифре точности. РОП сравнивает разбор с аудио и сам решает, помогает ли результат в работе.</p>
        </div>
        <dl>
          <div><dt>Срок</dt><dd>14 дней</dd></div>
          <div><dt>Объём</dt><dd>до 200 звонков</dd></div>
          <div><dt>Стоимость</dt><dd>300 BYN</dd></div>
          <div><dt>Результат</dt><dd>вывод о применимости</dd></div>
        </dl>
        <a className="button button-primary" href="#lead-form" onClick={() => track("pilot_click", { offer_code: page.offerCode, page_path: page.path, block: "pilot", cta_variant: "primary" })}>
          Обсудить пилот <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export function FaqSection({ page }: { page: PageContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section faq-section" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="section-heading sticky-copy">
          <span className="section-kicker">Перед разговором</span>
          <h2 id="faq-title">Коротко о том, что обычно спрашивают</h2>
          <p>Точные сроки и состав работ зависят от ваших систем и данных. Здесь — ответы, с которых удобно начать.</p>
        </div>
        <div className="faq-list">
          {page.faq.map((item, index) => {
            const open = openIndex === index;
            return (
              <article className={`faq-item ${open ? "open" : ""}`} key={item.question}>
                <h3>
                  <button type="button" aria-expanded={open} aria-controls={`faq-panel-${index}`} onClick={() => setOpenIndex(open ? null : index)}>
                    {item.question}<ChevronDown aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-panel-${index}`} className="faq-answer" hidden={!open}>
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ResponsePromise() {
  return (
    <div className="response-promise">
      <Clock3 aria-hidden="true" />
      <p><strong>Ответим в течение 15 минут</strong><span>в рабочее время с 10:00 до 19:00</span></p>
    </div>
  );
}
