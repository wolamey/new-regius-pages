import { ArrowRight, Menu, Phone, Send, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { pageList } from "../content";
import { track } from "../lib/analytics";
import type { PageContent } from "../types";

const PHONE_DISPLAY = "+375 44 798-04-98";
const PHONE_LINK = "tel:+375447980498";
const TELEGRAM_LINK = "https://t.me/RegiuslabBot";
const productionAnchors = [
  { href: "#production-problem", label: "Проблема" },
  { href: "#production-route", label: "Как работает" },
  { href: "#production-case", label: "Кейс" },
  { href: "#lead-form", label: "Обсудить" },
];

const pageAnchors: Record<PageContent["kind"], { href: string; label: string }[]> = {
  production: productionAnchors,
  orders: [
    { href: "#orders-case", label: "Кейс" },
    { href: "#orders-process", label: "Как работает" },
    { href: "#calculator-title", label: "Расчёт" },
    { href: "#lead-form", label: "Обсудить" },
  ],
  sales: [
    { href: "#sales-demo", label: "Что найдёт" },
    { href: "#sales-pilot", label: "Пилот" },
    { href: "#sales-evidence", label: "Проверка" },
    { href: "#lead-form", label: "Обсудить" },
  ],
  bitrix: [
    { href: "#bitrix-diagnostic", label: "Диагностика" },
    { href: "#bitrix-projects", label: "Первый этап" },
    { href: "#bitrix-cases", label: "Примеры" },
    { href: "#lead-form", label: "Обсудить" },
  ],
};

export function SiteLayout({ page, children }: { page: PageContent; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const anchors = pageAnchors[page.kind];

  useEffect(() => {
    setMenuOpen(false);
  }, [page.path]);

  const channelClick = (channel: "phone_click" | "telegram_click", block: string) => {
    track(channel, { offer_code: page.offerCode, page_path: page.path, block });
  };

  return (
    <div className={`site-shell page-${page.kind}`}>
      <a className="skip-link" href="#main-content">
        Перейти к содержанию
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to={pageList[0].path} aria-label="RegiusLab — решения для бизнеса">
            {page.kind === "production" ? (
              <img className="brand-production-logo" src="/brand/regiuslab-logo.png" alt="" aria-hidden="true" />
            ) : (
              <><span className="brand-mark" aria-hidden="true">R</span><span className="brand-name">REGIUSLAB</span></>
            )}
          </Link>

          <nav className="desktop-nav" aria-label="Посадочные страницы">
            {anchors.map((item) => (
              <a key={item.href} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <a className="header-contact" href={PHONE_LINK} onClick={() => channelClick("phone_click", "header")}>
            <Phone aria-hidden="true" size={16} />
            {PHONE_DISPLAY}
          </a>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Мобильная навигация">
            <div className="container">
              {anchors.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                  <ArrowRight aria-hidden="true" size={18} />
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main id="main-content">{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark" aria-hidden="true">R</span>
              <span className="brand-name">REGIUSLAB</span>
            </div>
            <p>Помогаем убрать ручную работу и связать Битрикс24, 1С, телефонию и мессенджеры там, где это действительно нужно бизнесу.</p>
          </div>
          <div>
            <p className="footer-label">Связаться</p>
            <a href={PHONE_LINK} onClick={() => channelClick("phone_click", "footer")}>{PHONE_DISPLAY}</a>
            <a href="mailto:sales@regiuslab.by">sales@regiuslab.by</a>
            <a href={TELEGRAM_LINK} onClick={() => channelClick("telegram_click", "footer")}>Telegram</a>
          </div>
          <div>
            <p className="footer-label">Документы</p>
            <Link className="muted-link" to="/privacy/">Политика обработки данных — ожидает утверждения</Link>
            <span className="muted-link">Локальный прототип · не опубликован</span>
          </div>
        </div>
      </footer>

      <div className="mobile-action-bar" aria-label="Быстрые действия">
        <a
          className="button button-primary"
          href="#lead-form"
          onClick={() => track("cta_click", { offer_code: page.offerCode, page_path: page.path, block: "mobile_bar", cta_variant: "primary" })}
        >
          {page.kind === "sales" ? "Обсудить пилот" : page.kind === "orders" ? "Обсудить заявки" : page.kind === "production" ? "Разобрать заказ" : "Обсудить задачу"}
        </a>
        <a className="icon-action" href={TELEGRAM_LINK} aria-label="Написать в Telegram" onClick={() => channelClick("telegram_click", "mobile_bar")}>
          <Send aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

export { PHONE_LINK, TELEGRAM_LINK };
