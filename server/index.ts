import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { z } from "zod";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(dirname, "..");
const clientRoot = path.join(projectRoot, "dist", "client");
const port = Number(process.env.PORT ?? 8787);
const deliveryMode = process.env.LEAD_DELIVERY_MODE ?? "disabled";
const isProduction = process.env.NODE_ENV === "production";
const allowedOrigins = new Set(
  (process.env.PUBLIC_ORIGIN ?? "http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:8787,http://localhost:8787")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
);
const useSecureCookie = isProduction && [...allowedOrigins].every((origin) => origin.startsWith("https://"));

const offerCodes = [
  "production_control",
  "order_1c_automation",
  "sales_intelligence",
  "bitrix24_business_result",
] as const;

const leadSchema = z.object({
  idempotencyKey: z.string().uuid(),
  csrfToken: z.string().min(20).max(200),
  offerCode: z.enum(offerCodes),
  pageUrl: z.string().url().max(500),
  market: z.enum(["BY", "RU", "unknown"]),
  name: z.string().trim().min(2).max(100),
  contact: z.string().trim().min(5).max(120),
  company: z.string().trim().min(2).max(160),
  position: z.string().trim().min(2).max(120),
  teamSize: z.string().trim().max(20).optional(),
  currentCrm: z.string().trim().max(120).optional(),
  preferredChannel: z.string().trim().max(40).optional(),
  comment: z.string().trim().max(1000).optional(),
  specific: z.record(z.string().max(80), z.string().trim().max(240)).default({}),
  utm: z.record(z.string().max(40), z.string().trim().max(200)).default({}),
  clientId: z.string().trim().max(160).optional(),
  consent: z.object({
    accepted: z.literal(true),
    version: z.string().trim().min(3).max(100),
    acceptedAt: z.string().datetime(),
  }),
  website: z.string().max(200).optional(),
}).strict();

type Lead = z.infer<typeof leadSchema>;
type StoredResult = { state: "pending" | "delivered"; requestId: string; expiresAt: number };

const idempotencyStore = new Map<string, StoredResult>();
const csrfTokens = new Map<string, number>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
const CSRF_TTL_MS = 30 * 60 * 1000;

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use((_request, response, next) => {
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  next();
});
app.use(express.json({ limit: "32kb", type: "application/json" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, deliveryMode });
});

app.get("/api/csrf", (request, response) => {
  pruneStores();
  const token = crypto.randomBytes(32).toString("base64url");
  csrfTokens.set(token, Date.now() + CSRF_TTL_MS);
  response.setHeader(
    "Set-Cookie",
    `regius_csrf=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=1800${useSecureCookie ? "; Secure" : ""}`,
  );
  response.setHeader("Cache-Control", "no-store");
  response.json({ token });
});

const leadRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (_request, response) => response.status(429).json({ ok: false, code: "rate_limited" }),
});

app.post("/api/leads", leadRateLimit, async (request, response) => {
  const requestId = crypto.randomUUID();
  response.setHeader("Cache-Control", "no-store");

  if (!originAllowed(request)) {
    return response.status(403).json({ ok: false, code: "origin_rejected", requestId });
  }

  const csrfHeader = request.get("X-CSRF-Token") ?? "";
  const csrfCookie = readCookie(request, "regius_csrf");
  const parsed = leadSchema.safeParse(request.body);

  if (!parsed.success) {
    safeLog("validation_rejected", requestId);
    return response.status(400).json({ ok: false, code: "invalid_request", requestId });
  }

  if (!validCsrf(csrfHeader, csrfCookie, parsed.data.csrfToken)) {
    safeLog("csrf_rejected", requestId);
    return response.status(403).json({ ok: false, code: "invalid_csrf", requestId });
  }

  if (parsed.data.website) {
    safeLog("spam_discarded", requestId);
    return response.status(202).json({ ok: true, requestId });
  }

  const idempotencyKey = request.get("Idempotency-Key") ?? parsed.data.idempotencyKey;
  if (idempotencyKey !== parsed.data.idempotencyKey) {
    return response.status(400).json({ ok: false, code: "idempotency_mismatch", requestId });
  }

  pruneStores();
  const existing = idempotencyStore.get(idempotencyKey);
  if (existing?.state === "delivered") {
    return response.status(200).json({ ok: true, requestId: existing.requestId, duplicate: true });
  }
  if (existing?.state === "pending") {
    return response.status(409).json({ ok: false, code: "submission_in_progress", requestId: existing.requestId });
  }

  idempotencyStore.set(idempotencyKey, {
    state: "pending",
    requestId,
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
  });

  try {
    const lead = sanitizeLead(parsed.data);
    await deliverLead(lead, requestId);
    idempotencyStore.set(idempotencyKey, {
      state: "delivered",
      requestId,
      expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
    });
    safeLog("lead_delivered", requestId, lead.offerCode);
    return response.status(201).json({ ok: true, requestId });
  } catch (error) {
    idempotencyStore.delete(idempotencyKey);
    const code = error instanceof DeliveryError ? error.code : "integration_failed";
    safeLog(code, requestId, parsed.data.offerCode);
    return response.status(code === "integration_disabled" ? 503 : 502).json({ ok: false, code, requestId });
  }
});

if (isProduction && fs.existsSync(clientRoot)) {
  app.use(express.static(clientRoot, { index: false, etag: true, maxAge: "1h" }));
  app.use((request, response, next) => {
    if (request.method !== "GET" || !request.accepts("html")) return next();
    return servePrerendered(request, response);
  });
}

app.use((_request, response) => {
  response.status(404).json({ ok: false, code: "not_found" });
});

app.listen(port, "127.0.0.1", () => {
  console.info(`[local-api] listening on http://127.0.0.1:${port}; delivery=${deliveryMode}`);
});

function originAllowed(request: Request) {
  const origin = request.get("Origin");
  return !origin || allowedOrigins.has(origin);
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.get("Cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === name);
  return match ? decodeURIComponent(match.slice(1).join("=")) : "";
}

function validCsrf(header: string, cookie: string, body: string) {
  if (!header || !cookie || !body || header !== cookie || header !== body) return false;
  const expiry = csrfTokens.get(header);
  if (!expiry || expiry < Date.now()) return false;
  return true;
}

function pruneStores() {
  const now = Date.now();
  for (const [key, value] of idempotencyStore) {
    if (value.expiresAt < now) idempotencyStore.delete(key);
  }
  for (const [key, expiry] of csrfTokens) {
    if (expiry < now) csrfTokens.delete(key);
  }
}

function clean(value: string | undefined) {
  return (value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeLead(lead: Lead): Lead {
  return {
    ...lead,
    name: clean(lead.name),
    contact: clean(lead.contact),
    company: clean(lead.company),
    position: clean(lead.position),
    teamSize: clean(lead.teamSize),
    currentCrm: clean(lead.currentCrm),
    preferredChannel: clean(lead.preferredChannel),
    comment: clean(lead.comment),
    specific: Object.fromEntries(Object.entries(lead.specific).map(([key, value]) => [clean(key), clean(value)])),
    utm: Object.fromEntries(Object.entries(lead.utm).map(([key, value]) => [clean(key), clean(value)])),
    clientId: clean(lead.clientId),
    website: "",
  };
}

async function deliverLead(lead: Lead, requestId: string) {
  if (deliveryMode === "disabled") {
    throw new DeliveryError("integration_disabled");
  }

  if (deliveryMode === "mock") {
    await new Promise((resolve) => setTimeout(resolve, 120));
    return;
  }

  if (deliveryMode !== "bitrix") {
    throw new DeliveryError("integration_misconfigured");
  }

  const webhookBase = process.env.BITRIX_WEBHOOK_URL;
  if (!webhookBase) throw new DeliveryError("integration_misconfigured");

  let webhookUrl: URL;
  try {
    webhookUrl = new URL(webhookBase);
  } catch {
    throw new DeliveryError("integration_misconfigured");
  }

  if (webhookUrl.protocol !== "https:" || !webhookUrl.pathname.includes("/rest/")) {
    throw new DeliveryError("integration_misconfigured");
  }

  webhookUrl.pathname = `${webhookUrl.pathname.replace(/\/+$/, "")}/crm.lead.add.json`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ fields: bitrixFields(lead, requestId) }),
      signal: controller.signal,
    });

    const body = (await response.json().catch(() => ({}))) as { result?: number; error?: string };
    if (!response.ok || !body.result || body.error) {
      throw new DeliveryError("integration_failed");
    }
  } catch (error) {
    if (error instanceof DeliveryError) throw error;
    throw new DeliveryError(error instanceof Error && error.name === "AbortError" ? "integration_timeout" : "integration_failed");
  } finally {
    clearTimeout(timeoutId);
  }
}

function bitrixFields(lead: Lead, requestId: string) {
  const isPhone = /\d{5,}/.test(lead.contact.replace(/\D/g, ""));
  const technicalContext = [
    `Offer: ${lead.offerCode}`,
    `Market: ${lead.market}`,
    `Page: ${lead.pageUrl}`,
    `Team size: ${lead.teamSize || "not provided"}`,
    `Current CRM: ${lead.currentCrm || "not provided"}`,
    `Preferred channel: ${lead.preferredChannel || "not provided"}`,
    ...Object.entries(lead.specific).map(([key, value]) => `${key}: ${value}`),
    `UTM: ${JSON.stringify(lead.utm)}`,
    `Consent: ${lead.consent.version} at ${lead.consent.acceptedAt}`,
    `Request ID: ${requestId}`,
    lead.comment ? `Comment: ${lead.comment}` : "",
  ].filter(Boolean).join("\n");

  return {
    TITLE: `Сайт: ${lead.offerCode}`,
    NAME: lead.name,
    COMPANY_TITLE: lead.company,
    POST: lead.position,
    PHONE: isPhone ? [{ VALUE: lead.contact, VALUE_TYPE: "WORK" }] : undefined,
    IM: !isPhone ? [{ VALUE: lead.contact, VALUE_TYPE: "TELEGRAM" }] : undefined,
    SOURCE_ID: "WEB",
    SOURCE_DESCRIPTION: `${lead.offerCode}; ${lead.market}; ${lead.utm.utm_source ?? "direct"}`,
    COMMENTS: technicalContext,
  };
}

function safeLog(event: string, requestId: string, offerCode?: string) {
  console.info(JSON.stringify({ event, requestId, offerCode, occurredAt: new Date().toISOString() }));
}

function servePrerendered(request: Request, response: Response) {
  const pathname = decodeURIComponent(request.path);
  const relative = pathname === "/" ? "index.html" : path.join(pathname.replace(/^\/+|\/+$/g, ""), "index.html");
  const candidate = path.resolve(clientRoot, relative);

  if (!candidate.startsWith(clientRoot) || !fs.existsSync(candidate)) {
    const notFound = path.join(clientRoot, "404", "index.html");
    return fs.existsSync(notFound) ? response.status(404).sendFile(notFound) : response.status(404).send("Not found");
  }

  return response.sendFile(candidate);
}

class DeliveryError extends Error {
  constructor(public code: string) {
    super(code);
  }
}
