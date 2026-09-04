import { ArrowRight, Check, Factory, FileCheck2, Headphones, MessageSquareText, UsersRound } from "lucide-react";
import type { PageContent } from "../types";

export function PageFeature({ page }: { page: PageContent }) {
  if (page.kind === "production") return <ProductionFeature />;
  if (page.kind === "orders") return <OrdersFeature />;
  if (page.kind === "sales") return <SalesFeature />;
  return <BitrixFeature />;
}

function ProductionFeature() {
  return (
    <section className="page-feature production-feature" aria-labelledby="production-feature-title">
      <div className="container">
        <div className="feature-intro">
          <span className="section-kicker">Один заказ, три взгляда</span>
          <h2 id="production-feature-title">Каждому нужна своя информация. Источник должен быть один.</h2>
        </div>
        <div className="production-roles">
          <article>
            <UsersRound aria-hidden="true" />
            <span>Продажи</span>
            <h3>Можно ли обещать дату клиенту?</h3>
            <p>Менеджер видит фактический этап и согласованный срок, не отвлекая мастера звонком.</p>
          </article>
          <article className="role-focus">
            <Factory aria-hidden="true" />
            <span>Производство</span>
            <h3>Что делать сейчас и что будет дальше?</h3>
            <p>На участке есть очередь заданий, состав работ и отметка о выполнении.</p>
          </article>
          <article>
            <FileCheck2 aria-hidden="true" />
            <span>Руководитель</span>
            <h3>Где появляется риск задержки?</h3>
            <p>Отклонение видно на конкретном заказе, этапе и ответственном.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function OrdersFeature() {
  return (
    <section className="page-feature orders-feature" aria-labelledby="orders-feature-title">
      <div className="container orders-demo">
        <div className="feature-intro">
          <span className="section-kicker">На одном примере</span>
          <h2 id="orders-feature-title">Клиент пишет как привык. Оператор получает понятный черновик.</h2>
          <p>Формат сообщения не превращается в новый шаблон для клиента. Система извлекает данные, а спорные места оставляет человеку.</p>
        </div>
        <div className="message-example">
          <span className="example-note">Пример сообщения</span>
          <MessageSquareText aria-hidden="true" />
          <blockquote>«Добрый день. На завтра 12 коробок позиции 4481 и 6 коробок 2210. Доставка на склад № 2»</blockquote>
        </div>
        <ArrowRight className="demo-arrow" aria-hidden="true" />
        <div className="order-draft">
          <span className="example-note">Черновик для проверки</span>
          <dl>
            <div><dt>Позиция 4481</dt><dd>12 коробок</dd></div>
            <div><dt>Позиция 2210</dt><dd>6 коробок</dd></div>
            <div><dt>Доставка</dt><dd>Склад № 2</dd></div>
          </dl>
          <p><Check aria-hidden="true" /> Сотрудник подтверждает данные перед передачей в 1С</p>
        </div>
      </div>
    </section>
  );
}

function SalesFeature() {
  return (
    <section className="page-feature sales-feature" aria-labelledby="sales-feature-title">
      <div className="container sales-feature-grid">
        <div className="feature-intro">
          <span className="section-kicker">Не ещё один отчёт</span>
          <h2 id="sales-feature-title">РОПу нужен момент, где сделка может остановиться</h2>
          <p>Сервис не заменяет прослушивание спорного звонка. Он помогает понять, какую запись открыть первой и что в ней проверить.</p>
        </div>
        <div className="call-excerpt">
          <Headphones aria-hidden="true" />
          <p><span>Клиент</span> «Пришлите расчёт до четверга. После обеда покажу его директору».</p>
          <p><span>Менеджер</span> «Хорошо, подготовлю».</p>
          <small>Демонстрационный пример, не запись клиента</small>
        </div>
        <div className="call-conclusion">
          <span>Что увидит РОП</span>
          <strong>Отправить расчёт до четверга, до обеда</strong>
          <p>Если задача не появилась в CRM, разговор стоит проверить.</p>
        </div>
      </div>
    </section>
  );
}

function BitrixFeature() {
  const questions = [
    ["Что происходит?", "Обращение теряется между сайтом, мессенджером и менеджером."],
    ["Почему?", "Нет единой очереди и понятного ответственного."],
    ["Что менять первым?", "Собрать один входящий поток и договориться о времени ответа."],
  ];

  return (
    <section className="page-feature bitrix-feature" aria-labelledby="bitrix-feature-title">
      <div className="container bitrix-feature-grid">
        <div className="feature-intro">
          <span className="section-kicker">Диагностика до настройки</span>
          <h2 id="bitrix-feature-title">Иногда Битрикс24 — часть решения. Иногда начинать нужно не с него.</h2>
          <p>Сначала разбираем конкретный сбой. Так становится видно, нужна ли настройка CRM, интеграция, изменение регламента или всё вместе.</p>
        </div>
        <ol className="diagnostic-questions">
          {questions.map(([question, answer], index) => (
            <li key={question}>
              <span>{index + 1}</span>
              <div><h3>{question}</h3><p>{answer}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
