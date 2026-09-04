import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Database,
  FileInput,
  FileText,
  Headphones,
  Link2,
  MessageSquareText,
  PhoneCall,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { track, type AnalyticsEvent } from "../lib/analytics";
import type { PageContent } from "../types";
import { CapacityCalculator } from "./Calculator";
import { LeadForm } from "./LeadForm";
import { FaqSection, TrustSection } from "./Sections";

function cta(page: PageContent, block: string, event: AnalyticsEvent = "cta_click") {
  track(event, {
    offer_code: page.offerCode,
    page_path: page.path,
    block,
    cta_variant: "primary",
  });
}

function ProofNote({ children }: { children: ReactNode }) {
  return <p className="campaign-proof-note"><ShieldCheck aria-hidden="true" />{children}</p>;
}

export function OrdersLanding({ page }: { page: PageContent }) {
  return (
    <div className="campaign-root orders-campaign">
      <section className="orders-hero" aria-labelledby="orders-hero-title">
        <div className="container orders-hero-grid">
          <div className="orders-hero-copy">
            <p className="campaign-overline">Оптовые заявки · мессенджеры · 1С</p>
            <h1 id="orders-hero-title">Заказ уже написал клиент. <span>Не заставляйте сотрудника писать его второй раз.</span></h1>
            <p className="campaign-lead">Собираем заявки из чатов и почты, распознаём позиции и готовим черновик для 1С. Человек проверяет спорные места — система не додумывает данные.</p>
            <div className="campaign-actions">
              <a className="campaign-button orders-button-primary" href="#calculator-title" onClick={() => cta(page, "orders_hero_calculator")}>
                Посчитать ручную работу <ArrowDown aria-hidden="true" />
              </a>
              <a className="campaign-button campaign-button-quiet" href="#lead-form" onClick={() => cta(page, "orders_hero_talk")}>
                Показать свои заявки
              </a>
            </div>
            <ProofNote>Кейс под NDA: 400 заявок в день · обработка 3 → 1 минута · исправлений меньше на 98%</ProofNote>
          </div>

          <OrdersIntakeVisual />
        </div>
        <div className="orders-channel-rail" aria-label="Каналы заявок">
          <div className="container"><span>Telegram</span><span>WhatsApp</span><span>Viber</span><span>Почта</span><strong>→ одна очередь на проверку</strong></div>
        </div>
      </section>

      <section className="orders-proof" id="orders-case" aria-labelledby="orders-proof-title">
        <div className="container orders-proof-layout">
          <div className="orders-proof-copy">
            <p className="campaign-label">Подтверждённый NDA-кейс</p>
            <h2 id="orders-proof-title">Большой поток без второй перепечатки</h2>
            <p>Для оптовой компании система находит контрагента и номенклатуру, создаёт данные в 1С. Сотрудник проверяет результат и печатает накладную.</p>
            <p className="orders-nda"><ShieldCheck aria-hidden="true" /> Название и логотип клиента не раскрываются.</p>
          </div>
          <dl className="orders-proof-numbers">
            <div><dt>Поток</dt><dd>400</dd><span>заявок в день</span></div>
            <div><dt>Обработка</dt><dd>3 → 1</dd><span>минута на заявку</span></div>
            <div><dt>Исправления</dt><dd>−98%</dd><span>по принятой методике</span></div>
            <div><dt>Внедрение</dt><dd>6 мес.</dd><span>разработка и запуск</span></div>
          </dl>
        </div>
        <div className="container orders-limit">30 000 BYN в год — расчётный эквивалент высвобождённой рабочей ёмкости при заданных вводных, а не подтверждённая прямая экономия клиента.</div>
      </section>

      <section className="orders-process" id="orders-process" aria-labelledby="orders-process-title">
        <div className="container">
          <div className="orders-section-head">
            <p className="campaign-label">Где остаётся человек</p>
            <h2 id="orders-process-title">Автоматизируем перенос. Решение по исключению оставляем сотруднику.</h2>
          </div>
          <ol className="orders-process-line">
            <li><span>Вход</span><MessageSquareText aria-hidden="true" /><h3>Клиент пишет как привык</h3><p>Сообщение, таблица или файл попадает в контролируемую очередь.</p></li>
            <li><span>Разбор</span><ScanLine aria-hidden="true" /><h3>Система выделяет данные</h3><p>Контрагент, позиции, количество и адрес сопоставляются с правилами.</p></li>
            <li className="orders-process-human"><span>Проверка</span><UserCheck aria-hidden="true" /><h3>Спорное видит человек</h3><p>Неполная заявка не проводится автоматически и не заполняется догадками.</p></li>
            <li><span>Передача</span><Database aria-hidden="true" /><h3>Черновик уходит в 1С</h3><p>После проверки сотрудник выполняет согласованное финальное действие.</p></li>
          </ol>
        </div>
      </section>

      <section className="orders-exceptions" aria-labelledby="orders-exceptions-title">
        <div className="container orders-exceptions-grid">
          <div>
            <p className="campaign-label">Ручная очередь</p>
            <h2 id="orders-exceptions-title">Время съедает не ввод одной заявки, а поток повторяющихся действий</h2>
            <p>Каналы не сходятся, позицию перепечатывают, ошибку находят уже в документе. При росте объёма компания добавляет людей к механической работе.</p>
          </div>
          <div className="orders-queue" aria-label="Пример очереди обработки">
            {page.problems.slice(0, 4).map((problem, index) => (
              <article key={problem.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{problem.title}</h3><p>{problem.text}</p></div><em>{index === 2 ? "исключение" : "в очереди"}</em></article>
            ))}
          </div>
        </div>
      </section>

      <CapacityCalculator offerCode={page.offerCode} pagePath={page.path} />

      <section className="orders-start" aria-labelledby="orders-start-title">
        <div className="container orders-start-grid">
          <div><p className="campaign-label">Без большого проекта на старте</p><h2 id="orders-start-title">Один канал. Один тип заказа. Реальные исключения.</h2></div>
          <div><p>{page.firstStage}</p><a className="campaign-button orders-button-primary" href="#lead-form" onClick={() => cta(page, "orders_first_stage")}>Разобрать поток заявок <ArrowRight aria-hidden="true" /></a></div>
        </div>
      </section>

      <TrustSection />
      <FaqSection page={page} />
      <LeadForm page={page} />
    </div>
  );
}

function OrdersIntakeVisual() {
  return (
    <figure className="orders-intake" aria-label="Иллюстративная схема: сообщение клиента превращается в черновик для проверки перед 1С">
      <figcaption><span>Входящая заявка № 0482</span><em>демонстрационная схема</em></figcaption>
      <div className="orders-message">
        <div className="orders-avatar">К</div>
        <div><span>Клиент · Telegram</span><p>«На завтра 12 коробок позиции 4481 и 6 коробок 2210. Доставка на склад № 2»</p></div>
      </div>
      <div className="orders-scan-track" aria-hidden="true"><i /></div>
      <div className="orders-draft">
        <div className="orders-draft-head"><div><FileText aria-hidden="true" /><span>Черновик заказа</span></div><strong>1С</strong></div>
        <dl>
          <div className="extract-01"><dt>Позиция 4481</dt><dd>12 коробок</dd></div>
          <div className="extract-02"><dt>Позиция 2210</dt><dd>6 коробок</dd></div>
          <div className="extract-03"><dt>Доставка</dt><dd>Склад № 2</dd></div>
        </dl>
        <div className="orders-confirm"><ClipboardCheck aria-hidden="true" /><span>Сотрудник проверяет</span><strong>готово к передаче</strong></div>
      </div>
      <div className="orders-packet" aria-hidden="true"><FileInput /></div>
    </figure>
  );
}

export function SalesLanding({ page }: { page: PageContent }) {
  return (
    <div className="campaign-root sales-campaign">
      <section className="sales-hero" aria-labelledby="sales-hero-title">
        <div className="sales-orbit" aria-hidden="true" />
        <div className="container sales-hero-grid">
          <div className="sales-hero-copy">
            <p className="campaign-overline">Regius Sales Intelligence</p>
            <h1 id="sales-hero-title">Звонок закончился. <span>Что менеджер пообещал клиенту?</span></h1>
            <p className="campaign-lead">Сервис готовит короткое резюме, вытаскивает следующий шаг и помогает РОПу выбрать звонки для проверки. Не заменяет аудио — показывает, с чего начать.</p>
            <div className="campaign-actions">
              <a className="campaign-button sales-button-primary" href="#sales-pilot" onClick={() => cta(page, "sales_hero", "pilot_click")}>
                Проверить на 200 звонках <ArrowRight aria-hidden="true" />
              </a>
              <a className="campaign-button sales-button-quiet" href="#lead-form" onClick={() => cta(page, "sales_hero_question")}>
                Сначала задать вопрос
              </a>
            </div>
            <ProofNote>Платный пилот · 14 дней · до 200 звонков · 300 BYN</ProofNote>
          </div>
          <SalesSignalVisual />
        </div>
      </section>

      <section className="sales-pilot-strip" id="sales-pilot" aria-label="Условия пилота">
        <div className="container">
          <div><span>Срок</span><strong>14 дней</strong></div>
          <div><span>Объём</span><strong>до 200 звонков</strong></div>
          <div><span>Стоимость</span><strong>300 BYN</strong></div>
          <div><span>Решение</span><strong>после сверки с аудио</strong></div>
        </div>
      </section>

      <section className="sales-demo" id="sales-demo" aria-labelledby="sales-demo-title">
        <div className="container sales-demo-grid">
          <div className="sales-demo-copy">
            <p className="campaign-label">Демонстрационный пример</p>
            <h2 id="sales-demo-title">РОП получает не «оценку менеджера», а место, которое стоит проверить</h2>
            <p>Система не принимает кадровые решения и не объявляет разговор хорошим или плохим. Она отделяет содержание звонка от следующего действия.</p>
          </div>
          <div className="sales-transcript">
            <div className="sales-transcript-head"><Headphones aria-hidden="true" /><span>Фрагмент разговора</span><em>не запись клиента</em></div>
            <p><span>Клиент</span>«Пришлите расчёт до четверга. После обеда покажу директору».</p>
            <p><span>Менеджер</span>«Хорошо, подготовлю».</p>
          </div>
          <div className="sales-output">
            <div><span>Короткое резюме</span><p>Клиент ждёт расчёт для обсуждения с директором.</p></div>
            <div className="sales-output-focus"><span>Следующий шаг</span><strong>Отправить расчёт до четверга, до обеда</strong></div>
            <div className="sales-risk"><AlertTriangle aria-hidden="true" /><span>Проверить: задача со сроком не зафиксирована в CRM</span></div>
          </div>
        </div>
      </section>

      <section className="sales-queue-section" aria-labelledby="sales-queue-title">
        <div className="container sales-queue-grid">
          <div className="sales-queue-copy"><p className="campaign-label">Слепые зоны РОПа</p><h2 id="sales-queue-title">Воронка показывает этап. Разговор объясняет, почему сделка там осталась.</h2></div>
          <div className="sales-call-list" role="list">
            {page.problems.slice(0, 5).map((problem, index) => (
              <article role="listitem" key={problem.title}><span className="sales-call-index">0{index + 1}</span><div><h3>{problem.title}</h3><p>{problem.text}</p></div><span className={`sales-call-status ${index === 1 || index === 2 ? "risk" : "review"}`}>{index === 1 || index === 2 ? "риск" : "проверить"}</span></article>
            ))}
          </div>
        </div>
      </section>

      <section className="sales-evidence" id="sales-evidence" aria-labelledby="sales-evidence-title">
        <div className="container sales-evidence-grid">
          <div>
            <p className="campaign-label">Внутренняя проверка RegiusLab</p>
            <h2 id="sales-evidence-title">1 310 звонков сопоставили с аудиозаписями</h2>
            <p>{page.caseStudy.summary}</p>
            <p className="sales-limit"><ShieldCheck aria-hidden="true" /> {page.caseStudy.limitations}</p>
          </div>
          <dl>
            {page.caseStudy.metrics.map((metric) => <div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="sales-pilot-card" aria-labelledby="sales-pilot-title">
        <div className="container">
          <div className="sales-pilot-title"><p className="campaign-label">Пилот вместо обещания точности</p><h2 id="sales-pilot-title">Проверьте сервис на своих звонках — и только потом решайте</h2></div>
          <ol>
            <li><span>01</span><strong>Передаёте доступную выборку</strong><p>До 200 звонков с согласованными правилами доступа.</p></li>
            <li><span>02</span><strong>РОП сравнивает с аудио</strong><p>Проверяет резюме, договорённость и следующий шаг.</p></li>
            <li><span>03</span><strong>Фиксируем ограничения</strong><p>Качество записи, язык, телефония и реальные исключения.</p></li>
            <li><span>04</span><strong>Вы принимаете решение</strong><p>Продолжение не возникает автоматически.</p></li>
          </ol>
          <a className="campaign-button sales-button-primary" href="#lead-form" onClick={() => cta(page, "sales_pilot_card", "pilot_click")}>Обсудить пилот за 300 BYN <ArrowRight aria-hidden="true" /></a>
        </div>
      </section>

      <TrustSection />
      <FaqSection page={page} />
      <LeadForm page={page} />
    </div>
  );
}

function SalesSignalVisual() {
  const bars = [20, 34, 18, 52, 28, 66, 42, 24, 56, 72, 31, 48, 22, 64, 37, 18, 51, 27, 68, 34, 46, 24, 58, 32];
  return (
    <figure className="sales-signal" aria-label="Демонстрационный разбор звонка: аудиозапись, резюме и следующий шаг">
      <figcaption><div><PhoneCall aria-hidden="true" /><span>Звонок · 04:12</span></div><em>демо · без персональных данных</em></figcaption>
      <div className="sales-wave" aria-hidden="true">
        {bars.map((height, index) => <i key={index} style={{ height }} />)}
        <span className="sales-playhead" />
      </div>
      <div className="sales-signal-transcript"><span>03:28</span><p>«Пришлите расчёт до четверга…»</p></div>
      <div className="sales-signal-output">
        <div><Sparkles aria-hidden="true" /><span>Следующий шаг</span></div>
        <strong>Отправить расчёт до четверга, 12:00</strong>
        <p><CheckCircle2 aria-hidden="true" /> найдено в содержании разговора</p>
      </div>
      <div className="sales-signal-risk"><AlertTriangle aria-hidden="true" /><span>В CRM нет задачи со сроком</span></div>
    </figure>
  );
}

export function BitrixLanding({ page }: { page: PageContent }) {
  const firstProjects = [
    ["Входящие лиды", "Один поток обращений и понятное время ответа", FileInput],
    ["Следующий шаг", "Обещание клиенту превращается в действие со сроком", Target],
    ["Связь с 1С", "Передаём конкретные данные без повторного ввода", Link2],
    ["Производство", "Статус заказа виден продажам и руководителю", Boxes],
    ["Документы", "Согласование не теряется между почтой и чатами", FileText],
  ] as const;

  return (
    <div className="campaign-root bitrix-campaign">
      <section className="bitrix-hero" aria-labelledby="bitrix-hero-title">
        <div className="container bitrix-hero-copy">
          <p className="campaign-overline">Внедрение и доработка Битрикс24</p>
          <h1 id="bitrix-hero-title">Битрикс24 не чинит процесс сам. <span>Сначала найдём, где работа ломается.</span></h1>
          <div className="bitrix-hero-bottom">
            <p>{page.description}</p>
            <div className="campaign-actions">
              <a className="campaign-button bitrix-button-primary" href="#lead-form" onClick={() => cta(page, "bitrix_hero")}>Разобрать один сбой <ArrowRight aria-hidden="true" /></a>
              <a className="campaign-button bitrix-button-quiet" href="#bitrix-projects">Посмотреть первые этапы</a>
            </div>
          </div>
        </div>
        <BitrixDiagnosisMap />
      </section>

      <section className="bitrix-thesis" aria-label="Подход RegiusLab">
        <div className="container"><strong>Не начинаем с лицензий и списка функций.</strong><span>Начинаем с одного случая, который можно увидеть, изменить и принять.</span></div>
      </section>

      <section className="bitrix-diagnostic" id="bitrix-diagnostic" aria-labelledby="bitrix-diagnostic-title">
        <div className="container bitrix-diagnostic-grid">
          <div><p className="campaign-label">Диагностика до настройки</p><h2 id="bitrix-diagnostic-title">Три вопроса удерживают проект в границах реальной задачи</h2></div>
          <ol>
            <li><span>01</span><div><h3>Что происходит?</h3><p>Фиксируем конкретный сбой: потерянное обращение, повторный ввод, просрочку или отсутствие следующего шага.</p></div></li>
            <li><span>02</span><div><h3>Почему это происходит?</h3><p>Отделяем проблему процесса, данных, регламента и инструмента. CRM может быть только частью решения.</p></div></li>
            <li><span>03</span><div><h3>Что изменить первым?</h3><p>Выбираем небольшой участок с ответственным, входом, выходом и проверяемым критерием приёмки.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="bitrix-projects" id="bitrix-projects" aria-labelledby="bitrix-projects-title">
        <div className="container">
          <div className="bitrix-projects-head"><p className="campaign-label">Варианты первого проекта</p><h2 id="bitrix-projects-title">Не вся компания. Один рабочий контур.</h2><p>Состав зависит от текущих систем и людей. Эти примеры помогают выбрать разговор, а не обещают готовое решение без обследования.</p></div>
          <div className="bitrix-project-grid">
            {firstProjects.map(([title, text, Icon], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="bitrix-method" aria-labelledby="bitrix-method-title">
        <div className="container">
          <div className="bitrix-method-head"><p className="campaign-label">Как принимается первый этап</p><h2 id="bitrix-method-title">Настройка считается готовой, когда сотрудник проходит сценарий, а не когда заполнен список полей</h2></div>
          <ol>
            <li><span>Наблюдаем</span><strong>реальный случай</strong></li>
            <li><span>Описываем</span><strong>действия и данные</strong></li>
            <li><span>Ограничиваем</span><strong>первый этап</strong></li>
            <li><span>Запускаем</span><strong>на рабочем потоке</strong></li>
            <li><span>Принимаем</span><strong>по сценарию сотрудника</strong></li>
          </ol>
        </div>
      </section>

      <section className="bitrix-cases" id="bitrix-cases" aria-labelledby="bitrix-cases-title">
        <div className="container">
          <div className="bitrix-cases-head"><p className="campaign-label">Разные задачи — один принцип</p><h2 id="bitrix-cases-title">Три контура, которые нельзя свести к одной «настройке CRM»</h2></div>
          <div className="bitrix-case-links">
            <Link to="/solutions/production-control/"><span>Производство</span><strong>128 пользователей · 4 площадки</strong><p>Заказ связывает продажи, участки, ОТК и склад.</p><ArrowRight aria-hidden="true" /></Link>
            <Link to="/solutions/order-1c-automation/"><span>Оптовые заявки</span><strong>400 заявок в день</strong><p>Сообщение превращается в проверяемые данные для 1С.</p><ArrowRight aria-hidden="true" /></Link>
            <Link to="/products/sales-intelligence/"><span>Разговоры с клиентами</span><strong>1 310 звонков в выборке</strong><p>РОП проверяет резюме и следующий шаг по аудио.</p><ArrowRight aria-hidden="true" /></Link>
          </div>
          <p className="bitrix-cases-limit">Цифры относятся к разным проектам. Их нельзя складывать или переносить на новую компанию как обещание результата.</p>
        </div>
      </section>

      <section className="bitrix-start" aria-labelledby="bitrix-start-title">
        <div className="container bitrix-start-grid">
          <div><BadgeCheck aria-hidden="true" /><p className="campaign-label">Золотой партнёр Битрикс24 · ISO 9001</p><h2 id="bitrix-start-title">На первом разговоре выбираем, что действительно стоит разбирать</h2></div>
          <div><p>{page.firstStage}</p><a className="campaign-button bitrix-button-primary" href="#lead-form" onClick={() => cta(page, "bitrix_first_stage")}>Обсудить вашу ситуацию <ArrowRight aria-hidden="true" /></a></div>
        </div>
      </section>

      <TrustSection />
      <FaqSection page={page} />
      <LeadForm page={page} />
    </div>
  );
}

function BitrixDiagnosisMap() {
  return (
    <figure className="bitrix-map" aria-label="Иллюстративная карта диагностики: несколько симптомов сходятся в одну причину и ограниченный первый этап">
      <figcaption><span>Карта одного сбоя</span><em>диагностика до настройки</em></figcaption>
      <svg viewBox="0 0 1180 390" preserveAspectRatio="none" aria-hidden="true">
        <path className="bitrix-map-thread thread-01" pathLength="1" d="M170 90 C330 90 360 190 535 195" />
        <path className="bitrix-map-thread thread-02" pathLength="1" d="M170 195 H535" />
        <path className="bitrix-map-thread thread-03" pathLength="1" d="M170 300 C330 300 360 200 535 195" />
        <path className="bitrix-map-solution" pathLength="1" d="M650 195 H1010" />
      </svg>
      <div className="bitrix-symptom symptom-01"><AlertTriangle aria-hidden="true" /><span>Симптом</span><strong>Обращение потерялось</strong></div>
      <div className="bitrix-symptom symptom-02"><FileInput aria-hidden="true" /><span>Симптом</span><strong>Данные вводят повторно</strong></div>
      <div className="bitrix-symptom symptom-03"><Clock3 aria-hidden="true" /><span>Симптом</span><strong>Обещание просрочено</strong></div>
      <div className="bitrix-cause"><Workflow aria-hidden="true" /><span>Причина</span><strong>Нет единого рабочего сценария</strong><p>кто · что · когда · по каким данным</p></div>
      <div className="bitrix-scope"><Check aria-hidden="true" /><span>Первый этап</span><strong>Один поток обращений</strong><p>ответственный + срок ответа + критерий приёмки</p></div>
    </figure>
  );
}
