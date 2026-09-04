import type { OfferCode } from "../types";

export interface LeadPayload {
  idempotencyKey: string;
  csrfToken: string;
  offerCode: OfferCode;
  pageUrl: string;
  market: "BY" | "RU" | "unknown";
  name: string;
  contact: string;
  company: string;
  position: string;
  teamSize?: string;
  currentCrm?: string;
  preferredChannel?: string;
  comment?: string;
  specific: Record<string, string>;
  utm: Record<string, string>;
  clientId?: string;
  consent: {
    accepted: true;
    version: string;
    acceptedAt: string;
  };
  website?: string;
}

export async function getCsrfToken(signal?: AbortSignal) {
  const response = await fetch("/api/csrf", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) throw new Error("csrf_unavailable");
  const body = (await response.json()) as { token?: string };
  if (!body.token) throw new Error("csrf_unavailable");
  return body.token;
}

export async function submitLead(payload: LeadPayload, signal?: AbortSignal) {
  const response = await fetch("/api/leads", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-CSRF-Token": payload.csrfToken,
      "Idempotency-Key": payload.idempotencyKey,
    },
    body: JSON.stringify(payload),
    signal,
  });

  const body = (await response.json().catch(() => ({}))) as {
    ok?: boolean;
    code?: string;
    requestId?: string;
  };

  if (!response.ok || !body.ok) {
    throw new Error(body.code ?? "submission_failed");
  }

  return body;
}
