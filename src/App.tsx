import { ArrowRight, Construction } from "lucide-react";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { pageList } from "./content";
import { BitrixLanding, OrdersLanding, SalesLanding } from "./components/CampaignLandings";
import { SiteLayout } from "./components/Layout";
import { ProductionLanding } from "./components/ProductionLanding";
import { Seo } from "./components/Seo";
import { captureUtm, track } from "./lib/analytics";
import type { PageContent } from "./types";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LocalIndex />} />
      {pageList.map((page) => (
        <Route key={page.path} path={page.path} element={<LandingPage page={page} />} />
      ))}
      <Route path="/privacy/" element={<PrivacyPlaceholder />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function LandingPage({ page }: { page: PageContent }) {
  useEffect(() => {
    captureUtm();
    track("lp_view", { offer_code: page.offerCode, page_path: page.path, block: "page" });
  }, [page.offerCode, page.path]);

  return (
    <SiteLayout page={page}>
      <Seo page={page} />
      {page.kind === "production" && <ProductionLanding page={page} />}
      {page.kind === "orders" && <OrdersLanding page={page} />}
      {page.kind === "sales" && <SalesLanding page={page} />}
      {page.kind === "bitrix" && <BitrixLanding page={page} />}
    </SiteLayout>
  );
}

function LocalIndex() {
  return (
    <div className="local-index">
      <Helmet>
        <title>RegiusLab — локальные посадочные страницы</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container local-index-inner">
        <div className="brand"><span className="brand-mark">R</span><span className="brand-name">REGIUSLAB</span></div>
        <span className="section-kicker">Локальная версия · не опубликована</span>
        <h1>Четыре посадочные страницы первой очереди</h1>
        <p>Выберите сценарий для локальной проверки текста, адаптива, формы и событий. Основной сайт не изменяется.</p>
        <div className="local-page-grid">
          {pageList.map((page) => (
            <Link to={page.path} key={page.path}>
              <span>{page.eyebrow}</span>
              <strong>{page.title}</strong>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacyPlaceholder() {
  return (
    <div className="local-index">
      <Helmet><title>Политика обработки данных — ожидает утверждения</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="container placeholder-page">
        <Construction aria-hidden="true" />
        <span className="section-kicker">OWNER DECISION</span>
        <h1>Текст политики ещё не предоставлен</h1>
        <p>Эта локальная страница не заменяет юридический документ. До публикации владелец должен утвердить политику, текст согласия и фактический состав аналитики.</p>
        <Link className="button button-primary" to={pageList[0].path}>Вернуться к прототипу</Link>
      </div>
    </div>
  );
}

function NotFound() {
  const location = useLocation();
  if (!location.pathname.endsWith("/") && pageList.some((page) => page.path === `${location.pathname}/`)) {
    return <Navigate replace to={`${location.pathname}/`} />;
  }

  return (
    <div className="local-index">
      <Helmet><title>Страница не найдена — RegiusLab</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="container placeholder-page">
        <span className="error-code">404</span>
        <h1>Такого маршрута нет</h1>
        <p>Вернитесь к локальному списку посадочных страниц.</p>
        <Link className="button button-primary" to="/">К списку страниц</Link>
      </div>
    </div>
  );
}
