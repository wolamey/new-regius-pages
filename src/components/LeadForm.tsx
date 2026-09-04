import { ArrowLeft, ArrowRight, CheckCircle2, Phone, RefreshCw, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { captureUtm, clearCapturedUtm, track } from "../lib/analytics";
import { getCsrfToken, submitLead } from "../lib/leadApi";
import type { PageContent, PageKind } from "../types";
import { PHONE_LINK, TELEGRAM_LINK } from "./Layout";
import { ResponsePromise } from "./Sections";

type FormValues = {
  name: string;
  contact: string;
  company: string;
  position: string;
  teamSize: string;
  currentCrm: string;
  preferredChannel: string;
  comment: string;
  consent: boolean;
  website: string;
  specific: Record<string, string>;
};

const initialValues: FormValues = {
  name: "",
  contact: "",
  company: "",
  position: "",
  teamSize: "",
  currentCrm: "",
  preferredChannel: "Телефон",
  comment: "",
  consent: false,
  website: "",
  specific: {},
};

const leadCopy: Record<PageKind, { kicker: string; title: string; text: string; submit: string }> = {
  production: {
    kicker: "Короткий разговор",
    title: "Расскажите, где заказ чаще всего застревает",
    text: "За 15 минут уточним путь заказа, участников и системы. Если задача нам подходит, предложим состав платного обследования.",
    submit: "Обсудить производство",
  },
  orders: {
    kicker: "О ваших заявках",
    title: "Покажите, как сегодня приходит заказ",
    text: "Уточним поток, каналы и конфигурацию 1С. После разговора будет понятно, какие примеры нужны для оценки.",
    submit: "Обсудить заявки",
  },
  sales: {
    kicker: "Пилот Sales Intelligence",
    title: "Проверим, подходит ли сервис вашему отделу",
    text: "Уточним телефонию, объём звонков и задачу РОПа. Если записи доступны, согласуем запуск пилота на 14 дней.",
    submit: "Обсудить пилот",
  },
  bitrix: {
    kicker: "О вашей ситуации",
    title: "Расскажите, где сейчас буксует работа",
    text: "Начнём с конкретного случая: потерянного обращения, ручного переноса или просрочки. На первом звонке не будем проектировать всю систему.",
    submit: "Обсудить задачу",
  },
};

export function LeadForm({ page }: { page: PageContent }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [systemMessage, setSystemMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const startedRef = useRef(false);
  const idempotencyKeyRef = useRef("");

  if (!idempotencyKeyRef.current && typeof crypto !== "undefined") {
    idempotencyKeyRef.current = crypto.randomUUID();
  }

  useEffect(() => {
    const controller = new AbortController();
    getCsrfToken(controller.signal).then(setCsrfToken).catch(() => undefined);
    return () => controller.abort();
  }, []);

  const markStarted = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("form_start", { offer_code: page.offerCode, page_path: page.path, block: "lead_form" });
  };

  const update = (field: keyof Omit<FormValues, "specific">, value: string | boolean) => {
    markStarted();
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const updateSpecific = (field: string, value: string) => {
    markStarted();
    setValues((current) => ({ ...current, specific: { ...current.specific, [field]: value } }));
  };

  const goToSecondStep = () => {
    const nextErrors = validateFirstStep(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSystemMessage("Проверьте отмеченные поля первого шага.");
      return;
    }
    setSystemMessage("");
    setStep(2);
    track("form_step_complete", { offer_code: page.offerCode, page_path: page.path, block: "lead_form" });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;

    const nextErrors = { ...validateFirstStep(values), ...validateSecondStep(values) };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSystemMessage("Проверьте отмеченные поля. Введённые данные сохранены.");
      return;
    }

    setStatus("submitting");
    setSystemMessage("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12_000);

    try {
      const token = csrfToken || (await getCsrfToken(controller.signal));
      const query = new URLSearchParams(window.location.search);
      const marketParam = query.get("market")?.toUpperCase();
      const market = marketParam === "BY" || marketParam === "RU" ? marketParam : "unknown";

      await submitLead(
        {
          idempotencyKey: idempotencyKeyRef.current || crypto.randomUUID(),
          csrfToken: token,
          offerCode: page.offerCode,
          pageUrl: window.location.href,
          market,
          name: values.name,
          contact: values.contact,
          company: values.company,
          position: values.position,
          teamSize: values.teamSize,
          currentCrm: values.currentCrm,
          preferredChannel: values.preferredChannel,
          comment: values.comment,
          specific: values.specific,
          utm: captureUtm(),
          clientId: undefined,
          consent: {
            accepted: true,
            version: "landing-consent-draft-2026-08-29",
            acceptedAt: new Date().toISOString(),
          },
          website: values.website,
        },
        controller.signal,
      );

      setStatus("success");
      clearCapturedUtm();
      track("form_submit_success", { offer_code: page.offerCode, page_path: page.path, block: "lead_form" });
    } catch (error) {
      const code = error instanceof Error ? (error.name === "AbortError" ? "AbortError" : error.message) : "submission_failed";
      setStatus("error");
      setSystemMessage(messageForError(code));
      track("form_submit_error", { offer_code: page.offerCode, page_path: page.path, block: "lead_form" });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  if (status === "success") {
    return (
      <section className="section lead-section" id="lead-form" aria-labelledby="form-success-title">
        <div className="container success-card" role="status">
          <CheckCircle2 aria-hidden="true" />
          <span className="section-kicker">Заявка принята</span>
          <h2 id="form-success-title">Спасибо. Свяжемся и договоримся о коротком разговоре</h2>
          <p>В рабочее время с 10:00 до 19:00 обычно отвечаем в течение 15 минут. Ваши ответы уже у менеджера — повторять их не придётся.</p>
          <div className="success-actions">
            <a className="button button-primary" href={TELEGRAM_LINK} onClick={() => track("telegram_click", { offer_code: page.offerCode, page_path: page.path, block: "success" })}>
              <Send aria-hidden="true" /> Написать в Telegram
            </a>
            <a className="button button-quiet" href={PHONE_LINK} onClick={() => track("phone_click", { offer_code: page.offerCode, page_path: page.path, block: "success" })}>
              <Phone aria-hidden="true" /> Позвонить
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section lead-section" id="lead-form" aria-labelledby="lead-title">
      <div className="container lead-layout">
        <div className="lead-copy">
          <span className="section-kicker">{leadCopy[page.kind].kicker}</span>
          <h2 id="lead-title">{leadCopy[page.kind].title}</h2>
          <p>{leadCopy[page.kind].text}</p>
          <ResponsePromise />
          <ul className="lead-checklist">
            <li><CheckCircle2 aria-hidden="true" /> разговор занимает около 15 минут;</li>
            <li><CheckCircle2 aria-hidden="true" /> заранее спросим только нужные данные;</li>
            <li><CheckCircle2 aria-hidden="true" /> продолжать проект необязательно.</li>
          </ul>
        </div>

        <form className="lead-form" onSubmit={onSubmit} noValidate>
          <div className="form-progress" aria-label={`Шаг ${step} из 2`}>
            <div><span className="active" /><span className={step === 2 ? "active" : ""} /></div>
            <p>Шаг {step} из 2 · {step === 1 ? "Контакт" : "Контекст процесса"}</p>
          </div>

          {step === 1 ? (
            <div className="form-step">
              <TextField required label="Имя" name="name" autoComplete="name" value={values.name} error={errors.name} onChange={(value) => update("name", value)} />
              <TextField required label="Рабочий телефон или Telegram" name="contact" autoComplete="tel" placeholder="+375… или @username" value={values.contact} error={errors.contact} onChange={(value) => update("contact", value)} />
              <TextField required label="Компания" name="company" autoComplete="organization" value={values.company} error={errors.company} onChange={(value) => update("company", value)} />
              <TextField required label="Должность" name="position" autoComplete="organization-title" value={values.position} error={errors.position} onChange={(value) => update("position", value)} />
              <label className={`consent-field ${errors.consent ? "has-error" : ""}`}>
                <input required type="checkbox" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : "consent-note"} />
                <span>Согласен на обработку персональных данных для обратной связи.</span>
              </label>
              <p className="field-note" id="consent-note"><a href="/privacy/">Черновик статуса политики</a>. Финальный текст должен быть предоставлен владельцем до публикации.</p>
              {errors.consent && <p className="field-error" id="consent-error">{errors.consent}</p>}
              {systemMessage && <div className="system-error" role="alert">{systemMessage}</div>}

              <button className="button button-primary form-next" type="button" onClick={goToSecondStep}>
                Продолжить <ArrowRight aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="form-step">
              <div className="two-column-fields">
                <TextField label="Размер команды" name="teamSize" inputMode="numeric" placeholder="Например, 25" value={values.teamSize} error={errors.teamSize} onChange={(value) => update("teamSize", value)} />
                <TextField label="Текущая CRM" name="currentCrm" placeholder="Битрикс24, Excel…" value={values.currentCrm} error={errors.currentCrm} onChange={(value) => update("currentCrm", value)} />
              </div>

              {page.formSpecificFields.map((field) => (
                field.type === "select" ? (
                  <label className="field" key={field.name}>
                    <span>{field.label}</span>
                    <select value={values.specific[field.name] ?? ""} onChange={(event) => updateSpecific(field.name, event.target.value)}>
                      <option value="">Выберите вариант</option>
                      {field.options?.map((option) => <option value={option} key={option}>{option}</option>)}
                    </select>
                  </label>
                ) : (
                  <TextField key={field.name} label={field.label} name={field.name} type={field.type ?? "text"} inputMode={field.type === "number" ? "numeric" : undefined} placeholder={field.placeholder} value={values.specific[field.name] ?? ""} onChange={(value) => updateSpecific(field.name, value)} />
                )
              ))}

              <label className="field">
                <span>Удобный канал связи</span>
                <select value={values.preferredChannel} onChange={(event) => update("preferredChannel", event.target.value)}>
                  <option>Телефон</option><option>Telegram</option><option>WhatsApp</option><option>Viber</option>
                </select>
              </label>
              <label className="field">
                <span>Комментарий <em>необязательно</em></span>
                <textarea rows={3} value={values.comment} onChange={(event) => update("comment", event.target.value)} placeholder="Что сейчас мешает процессу?" />
              </label>

              <label className="honeypot" aria-hidden="true">
                Ваш сайт
                <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} />
              </label>

              {systemMessage && <div className="system-error" role="alert">{systemMessage}</div>}
              <div className="form-actions">
                <button className="button button-back" type="button" onClick={() => setStep(1)}>
                  <ArrowLeft aria-hidden="true" /> Назад
                </button>
                <button className="button button-primary" type="submit" disabled={status === "submitting"}>
                  {status === "submitting" ? <><RefreshCw className="spin" aria-hidden="true" /> Отправляем…</> : leadCopy[page.kind].submit}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function TextField({ label, name, value, error, onChange, type = "text", ...props }: {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange" | "type">) {
  const errorId = `${name}-error`;
  return (
    <label className={`field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      <input name={name} type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />
      {error && <small className="field-error" id={errorId}>{error}</small>}
    </label>
  );
}

function validateFirstStep(values: FormValues) {
  const errors: Record<string, string> = {};
  if (values.name.trim().length < 2) errors.name = "Укажите имя — минимум 2 символа.";
  if (values.contact.trim().length < 5) errors.contact = "Укажите рабочий телефон или Telegram.";
  if (values.company.trim().length < 2) errors.company = "Укажите компанию.";
  if (values.position.trim().length < 2) errors.position = "Укажите вашу роль или должность.";
  if (!values.consent) errors.consent = "Нужно согласие на обработку данных для обратной связи.";
  return errors;
}

function validateSecondStep(values: FormValues) {
  const errors: Record<string, string> = {};
  if (values.teamSize && !/^\d{1,5}$/.test(values.teamSize.trim())) errors.teamSize = "Укажите количество цифрами.";
  if (values.currentCrm.length > 120) errors.currentCrm = "Сократите название до 120 символов.";
  return errors;
}

function messageForError(code: string) {
  if (code === "integration_disabled") return "Локальная форма работает, но отправка в Битрикс24 отключена. Данные сохранены в форме; включите тестовый режим API или подключите защищённый серверный webhook.";
  if (code === "csrf_unavailable" || code === "invalid_csrf") return "Не удалось подтвердить защищённую сессию. Обновите страницу и повторите отправку.";
  if (code === "rate_limited") return "Слишком много попыток за короткое время. Подождите несколько минут и повторите.";
  if (code === "AbortError") return "Сервер не ответил вовремя. Данные сохранены — повторите отправку.";
  return "Заявка не отправлена. Данные сохранены в форме — проверьте соединение и повторите.";
}
