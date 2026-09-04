import {
  ArrowDown,
  ArrowRight,
  Barcode,
  Boxes,
  Check,
  ClipboardCheck,
  Factory,
  PackageCheck,
  RotateCcw,
  Warehouse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { track } from "../lib/analytics";
import type { PageContent } from "../types";
import { LeadForm } from "./LeadForm";
import { FaqSection } from "./Sections";

const route = [
  {
    icon: Boxes,
    role: "Продажи",
    title: "Заказ принят",
    text: "Менеджер фиксирует состав и срок. Заказ получает один номер, который остаётся с ним до отгрузки.",
  },
  {
    icon: Factory,
    role: "Планирование",
    title: "Понятно, что производить",
    text: "Система проверяет склад и раскладывает недостающее изделие на производственные операции.",
  },
  {
    icon: Barcode,
    role: "Участок",
    title: "Работа отмечается штрихкодом",
    text: "Сотрудник видит задание на экране и подтверждает выполненную операцию без бумажного листа.",
  },
  {
    icon: ClipboardCheck,
    role: "ОТК",
    title: "Контроль относится к заказу",
    text: "Результат проверки, отклонение и ответственный остаются рядом с конкретной операцией.",
  },
  {
    icon: Warehouse,
    role: "Склад",
    title: "Готовность зафиксирована",
    text: "Склад принимает готовое изделие и подтверждает, что заказ можно передавать на отгрузку.",
  },
  {
    icon: PackageCheck,
    role: "Отгрузка",
    title: "Заказ передан клиенту",
    text: "Продажи видят факт отгрузки, а маршрут заказа закрывается последним подтверждённым этапом.",
  },
];

const passportStations = [
  { code: "01", label: "Заказ", className: "is-done" },
  { code: "02", label: "План", className: "is-done" },
  { code: "03", label: "Участок", className: "is-done" },
  { code: "04", label: "ОТК", className: "is-current" },
  { code: "05", label: "Склад", className: "" },
  { code: "06", label: "Отгрузка", className: "" },
];

function ProductionPassport({ cycle, onReplay }: { cycle: number; onReplay: () => void }) {
  const routePath = "M152 85 H443 Q475 85 475 117 V220 H706 V373 H425 H152 V330";

  return (
    <div className="prod-passport" key={cycle} aria-label="Иллюстративная маршрутная карта производственного заказа">
      <div className="prod-passport-holes" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => <i key={index} />)}
      </div>
      <div className="prod-passport-head">
        <div>
          <span>Маршрутная карта</span>
          <strong>Заказ № 0248</strong>
        </div>
        <div>
          <span>Схема</span>
          <strong>6 рабочих точек</strong>
        </div>
      </div>
      <div className="prod-passport-rule" aria-hidden="true"><span /></div>
      <div className="prod-passport-board">
        <svg viewBox="0 0 720 390" preserveAspectRatio="none" aria-hidden="true">
          <path className="passport-path-shadow" d={routePath} />
          <path className="passport-path-progress" pathLength="1" d={routePath} />
          <g className="passport-runner">
            <circle className="passport-runner-halo" r="15" />
            <circle className="passport-runner-body" r="8" />
            <circle className="passport-runner-core" r="3" />
          </g>
        </svg>
        {passportStations.map((station) => (
          <div className={`prod-passport-station station-${station.code} ${station.className}`} key={station.code}>
            <span>{station.code}</span>
            <strong>{station.label}</strong>
            <i aria-hidden="true" />
          </div>
        ))}
        <div className="prod-passport-stamp">
          <div className="prod-passport-status-static">
            <span>Текущий этап</span>
            <strong>ОТК</strong>
            <em>следом — склад и отгрузка</em>
          </div>
          <div className="prod-passport-status-motion" aria-hidden="true">
            <div className="prod-passport-phase phase-01"><span>Статус заказа</span><strong>Принят</strong><em>маршрут создан</em></div>
            <div className="prod-passport-phase phase-02"><span>Планирование</span><strong>В плане</strong><em>операции определены</em></div>
            <div className="prod-passport-phase phase-03"><span>Производство</span><strong>В работе</strong><em>участок подтвердил</em></div>
            <div className="prod-passport-phase phase-04"><span>Контроль качества</span><strong>ОТК</strong><em>результат зафиксирован</em></div>
            <div className="prod-passport-phase phase-05"><span>Готовая продукция</span><strong>На складе</strong><em>готово к передаче</em></div>
            <div className="prod-passport-phase phase-06"><span>Финальный статус</span><strong>Отгружен</strong><em>маршрут завершён</em></div>
          </div>
        </div>
      </div>
      <div className="prod-passport-foot">
        <div className="prod-barcode" aria-hidden="true">
          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3].map((width, index) => <i key={index} style={{ width }} />)}
        </div>
        <div className="prod-passport-footcopy">
          <button className="prod-passport-replay" type="button" onClick={onReplay}>
            <RotateCcw aria-hidden="true" /> Повторить маршрут
          </button>
          <p>Иллюстративная схема — не экран системы клиента</p>
        </div>
      </div>
    </div>
  );
}

function ProductionCaseMap() {
  return (
    <div className="prod-case-map" aria-label="Схема связи подразделений в кейсе Изоком Пласт">
      <svg viewBox="0 0 620 430" preserveAspectRatio="none" aria-hidden="true">
        <path d="M310 214 L118 92 M310 214 L502 92 M310 214 L118 338 M310 214 L502 338" />
      </svg>
      <div className="prod-case-core"><span>единый</span><strong>заказ</strong><em>Битрикс24 + 1С</em></div>
      <div className="prod-case-node node-sales"><span>Продажи</span><strong>срок и состав</strong></div>
      <div className="prod-case-node node-shop"><span>Участок</span><strong>операция и штрихкод</strong></div>
      <div className="prod-case-node node-quality"><span>ОТК</span><strong>проверка и отклонение</strong></div>
      <div className="prod-case-node node-stock"><span>Склад</span><strong>готовность к отгрузке</strong></div>
      <p>Схема взаимодействия по материалам опубликованного кейса</p>
    </div>
  );
}

export function ProductionLanding({ page }: { page: PageContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const passportRef = useRef<HTMLDivElement>(null);
  const [passportCycle, setPassportCycle] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const heroText = heroTextRef.current;
    const passport = passportRef.current;
    if (!root || !heroText || !passport) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    root.classList.add("motion-ready");
    heroText.classList.remove("is-shown");
    passport.classList.remove("is-active");
    void heroText.offsetHeight;
    void passport.offsetHeight;

    const entranceFrame = window.requestAnimationFrame(() => {
      heroText.classList.add("is-shown");
      passport.classList.add("is-active");
    });

    const revealTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="reveal"]'));
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.18, rootMargin: "0px 0px -8%" });
      revealTargets.forEach((target) => observer?.observe(target));
    } else {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
    }

    return () => {
      window.cancelAnimationFrame(entranceFrame);
      observer?.disconnect();
    };
  }, []);

  const cta = (block: string) => track("cta_click", {
    offer_code: page.offerCode,
    page_path: page.path,
    block,
    cta_variant: "primary",
  });

  return (
    <div className="production-v2" ref={rootRef}>
      <section className="prod-hero" aria-labelledby="prod-hero-title">
        <div className="prod-hero-grid container">
          <div className="prod-hero-copy t-stagger is-shown" ref={heroTextRef}>
            <p className="prod-overline t-stagger-line t-stagger-line--1">Для производственных компаний · Битрикс24 + 1С</p>
            <h1 className="t-stagger-line t-stagger-line--2" id="prod-hero-title">Статус заказа <span>без звонков в цех.</span></h1>
            <p className="prod-hero-text t-stagger-line t-stagger-line--3">
              Связываем продажи, производство, ОТК, склад и отгрузку одним маршрутом. Менеджер отвечает клиенту по факту, а руководитель видит, на каком этапе застрял заказ.
            </p>
            <div className="prod-actions t-stagger-line t-stagger-line--4">
              <a className="prod-button prod-button-primary" href="#lead-form" onClick={() => cta("production_hero")}>
                Разобрать один заказ <ArrowRight aria-hidden="true" />
              </a>
              <a className="prod-button prod-button-secondary" href="#production-case">
                Посмотреть кейс
              </a>
            </div>
            <p className="prod-proofline t-stagger-line t-stagger-line--5"><Check aria-hidden="true" /> Раскрытый производственный кейс · 128 пользователей · 4 участка</p>
          </div>

          <div className="prod-artifact is-active" ref={passportRef}>
            <ProductionPassport cycle={passportCycle} onReplay={() => setPassportCycle((value) => value + 1)} />
          </div>
        </div>

        <div className="prod-hero-trace" aria-label="Ключевые свойства решения">
          <div className="container">
            <div><span>01</span><strong>Один номер заказа</strong></div>
            <div><span>02</span><strong>Фактический этап</strong></div>
            <div><span>03</span><strong>Ответственный виден</strong></div>
          </div>
        </div>

        <a className="prod-scroll" href="#production-problem"><ArrowDown aria-hidden="true" /><span>Почему статус теряется</span></a>
      </section>

      <section className="prod-problem" id="production-problem" aria-labelledby="prod-problem-title">
        <div className="container prod-problem-grid">
          <div>
            <p className="prod-section-label">Знакомая ситуация</p>
            <h2 id="prod-problem-title">«Где заказ?» — вопрос, на который компания отвечает руками</h2>
          </div>
          <div className="prod-call-chain">
            <p><span>01</span><strong>Клиент спрашивает менеджера</strong><em>«Успеете к пятнице?»</em></p>
            <p><span>02</span><strong>Менеджер звонит мастеру</strong><em>«На каком сейчас этапе?»</em></p>
            <p><span>03</span><strong>Мастер уточняет на участке</strong><em>«Задание уже закончили?»</em></p>
            <p><span>04</span><strong>Статус возвращается обратно</strong><em>Но за это время он мог измениться.</em></p>
          </div>
        </div>
        <div className="container prod-problem-statement">
          <p>Каждый такой звонок выглядит мелочью.</p>
          <strong>Вместе они скрывают простой, задержку и неверное обещание клиенту.</strong>
        </div>
      </section>

      <section className="prod-route" id="production-route" aria-labelledby="prod-route-title">
        <div className="container prod-route-heading">
          <p className="prod-section-label">Как меняется работа</p>
          <h2 id="prod-route-title">От заявки до отгрузки — один маршрут заказа.</h2>
          <p>На каждом этапе есть понятный статус, ответственный и следующий шаг. Продажи не собирают эту картину по телефону.</p>
        </div>

        <div className="container prod-route-list">
          {route.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="prod-route-step" data-motion="reveal" key={step.title}>
                <div className="prod-route-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="prod-route-node"><Icon aria-hidden="true" /></div>
                <div className="prod-route-copy">
                  <span>{step.role}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="prod-case" id="production-case" aria-labelledby="prod-case-title">
        <div className="container prod-case-grid">
          <div className="prod-case-copy" data-motion="reveal">
            <p className="prod-section-label">ООО «Изоком Пласт» · раскрытый кейс</p>
            <h2 id="prod-case-title">Заказ, производство, ОТК и склад связаны через Битрикс24 и 1С</h2>
            <p>Система проверяет остатки, раскладывает изделие на операции и показывает задания на экранах. Сотрудники отмечают работу штрихкодами. Руководство и продажи видят текущий этап заказа.</p>
            <ul>
              <li><Check aria-hidden="true" /> бумажные задания заменены рабочими экранами;</li>
              <li><Check aria-hidden="true" /> результат ОТК и отклонения связаны с заказом;</li>
              <li><Check aria-hidden="true" /> подразделения работают с одним фактическим статусом.</li>
            </ul>
            <p className="prod-case-limit">Не публикуем проценты экономии, производительности или сокращения отходов: утверждённой методики измерения этих показателей нет.</p>
          </div>
          <div className="prod-case-visual" data-motion="reveal">
            <div className="prod-case-numbers" aria-label="Масштаб проекта">
              <div><strong>128</strong><span>пользователей системы</span></div>
              <div><strong>4</strong><span>производственных участка</span></div>
            </div>
            <ProductionCaseMap />
          </div>
        </div>
      </section>

      <section className="prod-start" aria-labelledby="prod-start-title">
        <div className="container prod-start-grid">
          <div>
            <p className="prod-section-label">С чего начать</p>
            <h2 id="prod-start-title">Не со всего завода. С одного типового заказа.</h2>
          </div>
          <div>
            <p>За 15 минут уточним, как заказ появляется, через какие участки проходит и где сегодня теряется статус. Если задача нам подходит, предложим состав платного обследования.</p>
            <a className="prod-button prod-button-primary" href="#lead-form" onClick={() => cta("production_start")}>
              Разобрать один заказ <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="prod-trust" aria-label="Подтверждения Regiuslab">
        <div className="container">
          <span>Золотой партнёр Битрикс24</span>
          <span>ISO 9001</span>
          <span>Битрикс24 + 1С + собственная разработка</span>
        </div>
      </section>

      <FaqSection page={page} />
      <LeadForm page={page} />
    </div>
  );
}
