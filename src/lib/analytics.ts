import type { OfferCode } from "../types";

export type AnalyticsEvent =
  | "lp_view" 
  | "cta_click"
  | "form_start"
  | "form_step_complete"
  | "form_submit_success"
  | "form_submit_error"
  | "phone_click"
  | "telegram_click"
  | "whatsapp_click"
  | "viber_click"
  | "booking_click"
  | "case_open"
  | "calculator_complete"
  | "pilot_click";

type EventPayload = {
  offer_code: OfferCode;
  page_path: string;
  block?: string;
  cta_variant?: string;
  market?: "BY" | "RU" | "unknown";
  test_traffic?: boolean;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const UTM_STORAGE_KEY = "regiuslab_landing_utm_v1";
const EVENT_DEDUPE_WINDOW_MS = 750;
const recentEvents = new Map<string, number>();

export function captureUtm() {
  if (typeof window === "undefined") return {};

  const current = new URLSearchParams(window.location.search);
  const captured = Object.fromEntries(
    UTM_KEYS.flatMap((key) => {
      const value = current.get(key)?.slice(0, 200);
      return value ? [[key, value]] : [];
    }),
  );

  if (Object.keys(captured).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
    return captured;
  }

  try {
    return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function clearCapturedUtm() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(UTM_STORAGE_KEY);
  }
}

export function track(event: AnalyticsEvent, payload: EventPayload) {
  if (typeof window === "undefined") return;

  const signature = `${event}:${payload.offer_code}:${payload.block ?? ""}:${payload.cta_variant ?? ""}`;
  const now = Date.now();
  const lastSentAt = recentEvents.get(signature) ?? 0;

  if (now - lastSentAt < EVENT_DEDUPE_WINDOW_MS) return;
  recentEvents.set(signature, now);

  const safePayload = {
    event,
    ...payload,
    page_path: payload.page_path.slice(0, 240),
    occurred_at: new Date(now).toISOString(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(safePayload);

  if (import.meta.env.DEV) {
    console.info("[analytics:test]", safePayload);
  }
}
