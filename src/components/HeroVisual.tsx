import { Check, FileText, MessageSquareText, PackageCheck, PhoneCall, ScanSearch } from "lucide-react";
import type { ReactNode } from "react";
import type { PageKind } from "../types";

export function HeroVisual({ kind }: { kind: PageKind }) {
  if (kind === "production") return <ProductionBoard />;
  if (kind === "orders") return <OrdersBoard />;
  if (kind === "sales") return <SalesBoard />;
  return <BitrixBoard />;
}

function BoardFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="hero-board" aria-label={label}>
      <figcaption className="board-topline">{label}</figcaption>
      {children}
    </figure>
  );
}

function ProductionBoard() {
  const steps = ["Заказ", "План", "Участок", "ОТК", "Склад"];
  return (
    <BoardFrame label="Как выглядит один маршрут заказа">
      <div className="order-ticket">
        <span>Заказ</span>
        <strong>№ 0248</strong>
        <em>отгрузка 3 сентября</em>
      </div>
      <div className="rail rail-production">
        {steps.map((step, index) => (
          <div className={`rail-node ${index < 3 ? "done" : index === 3 ? "current" : ""}`} key={step}>
            <span>{index < 3 ? <Check size={12} aria-hidden="true" /> : index + 1}</span>
            <b>{step}</b>
          </div>
        ))}
      </div>
      <div className="board-status-grid">
        <div><span>Сейчас</span><strong>Контроль качества</strong></div>
        <div><span>Кто отвечает</span><strong>Смена № 2</strong></div>
        <div><span>Срок</span><strong className="status-ok">без риска</strong></div>
      </div>
    </BoardFrame>
  );
}

function OrdersBoard() {
  return (
    <BoardFrame label="Пример: сообщение превращается в черновик заказа">
      <div className="message-card">
        <MessageSquareText aria-hidden="true" />
        <div><span>Сообщение клиента</span><strong>12 коробок, позиция 4481</strong></div>
      </div>
      <div className="document-flow">
        <div><ScanSearch aria-hidden="true" /><span>Разобрать</span></div>
        <i aria-hidden="true" />
        <div><FileText aria-hidden="true" /><span>Проверить</span></div>
        <i aria-hidden="true" />
        <div className="flow-final"><PackageCheck aria-hidden="true" /><span>Передать в 1С</span></div>
      </div>
      <div className="recognition-lines">
        <span style={{ width: "84%" }} />
        <span style={{ width: "61%" }} />
        <span style={{ width: "72%" }} />
      </div>
    </BoardFrame>
  );
}

function SalesBoard() {
  return (
    <BoardFrame label="Пример разбора звонка">
      <div className="call-heading">
        <PhoneCall aria-hidden="true" />
        <div><span>Разговор длился 4 минуты</span><strong>Клиент попросил расчёт и назвал срок</strong></div>
      </div>
      <div className="waveform" aria-hidden="true">
        {[16, 34, 22, 52, 30, 64, 24, 44, 18, 58, 31, 45, 20, 36, 14, 28, 10].map((height, index) => (
          <i key={index} style={{ height }} />
        ))}
      </div>
      <div className="sales-insight">
        <span>Что делать дальше</span>
        <strong>Отправить расчёт до четверга, 12:00</strong>
        <em><Check aria-hidden="true" size={14} /> найдено в разговоре</em>
      </div>
    </BoardFrame>
  );
}

function BitrixBoard() {
  const steps = ["Сбой", "Причина", "Изменение", "Проверка"];
  return (
    <BoardFrame label="С чего начинается полезная настройка">
      <div className="diagnostic-map">
        {steps.map((step, index) => (
          <div key={step} className={index === 3 ? "selected" : undefined}>
            <span>{index + 1}</span>
            <strong>{step}</strong>
            {index < steps.length - 1 && <i aria-hidden="true" />}
          </div>
        ))}
      </div>
      <div className="first-stage-card">
        <span>Первое изменение</span>
        <strong>Один поток обращений, понятный ответственный и проверяемый результат</strong>
      </div>
    </BoardFrame>
  );
}
