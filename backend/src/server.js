import crypto from "node:crypto";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { buildSiteContent } from "./data/site-content.js";
import { askAiTutor, getSupportedIntents, runAiAssistant } from "./services/ai-tutor.js";
import { createContentOverridesStore } from "./storage/content-overrides-store.js";
import { createLeadsStore } from "./storage/leads-store.js";
import { createAdminSessionToken, verifyAdminSessionToken } from "./utils/admin-session.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const isProduction = process.env.NODE_ENV === "production";

const leadsStore = createLeadsStore({
  persistPath: process.env.LEADS_PERSIST_PATH
});
const contentOverridesStore = createContentOverridesStore({
  persistPath: process.env.CONTENT_OVERRIDES_PATH
});

function parseTrustProxy(value) {
  if (!value) return undefined;
  if (value === "true") return 1;
  if (value === "false") return false;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  return value;
}

function sanitizeText(value, maxLength = 500) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function sanitizePhoneLike(value, maxLength = 40) {
  return String(value || "")
    .replace(/[^\d+()\-\s]/g, "")
    .trim()
    .slice(0, maxLength);
}

function timingSafeEqualString(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "utf8");
  const rightBuffer = Buffer.from(String(right || ""), "utf8");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createHttpError(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  return error;
}

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function requireJson(req, res, next) {
  if (!req.is("application/json")) {
    res.status(415).json({
      success: false,
      message: "Content-Type application/json requis."
    });
    return;
  }

  next();
}

function setNoStore(res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function validateChoice(options, value, fieldName) {
  const allowed = new Set(options.map((item) => item.value));
  const safeValue = sanitizeText(value, 80);

  if (!safeValue || !allowed.has(safeValue)) {
    throw createHttpError(400, `${fieldName} est invalide.`);
  }

  return safeValue;
}

function validateContactPayload(payload, content) {
  const name = sanitizeText(payload?.name, 120);
  const email = sanitizeText(payload?.email, 180).toLowerCase();
  const phone = sanitizePhoneLike(payload?.phone, 80);
  const goal = sanitizeText(payload?.goal, 2000);

  if (name.length < 2) {
    throw createHttpError(400, "Le nom est requis.");
  }

  if (!validateEmail(email)) {
    throw createHttpError(400, "L'email est invalide.");
  }

  if (goal.length < 10) {
    throw createHttpError(400, "Le besoin est trop court.");
  }

  return {
    name,
    email,
    phone,
    requestType: validateChoice(content.reservation.requestTypes, payload?.requestType || "devis", "requestType"),
    service: validateChoice(content.reservation.services, payload?.service || "office", "service"),
    preferredSlot: validateChoice(content.reservation.slots, payload?.preferredSlot || "asap", "preferredSlot"),
    goal
  };
}

function validateAiTextField(value, fieldName, maxLength = 2000) {
  const safeValue = sanitizeText(value, maxLength);

  if (!safeValue) {
    throw createHttpError(400, `${fieldName} est requis.`);
  }

  return safeValue;
}

function validateAiArray(values, maxItems = 8, maxLength = 120) {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((item) => sanitizeText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function getAdminKey() {
  return String(process.env.ADMIN_API_KEY || "").trim();
}

function getAdminSecret() {
  return String(process.env.ADMIN_SESSION_SECRET || "").trim();
}

async function readCurrentContent() {
  await contentOverridesStore.loadIfNeeded();
  return buildSiteContent(contentOverridesStore.get());
}

function verifyAdminRequest(req) {
  const adminKey = getAdminKey();
  if (!adminKey) {
    return { ok: false, status: 404, message: "Introuvable." };
  }

  const providedKey = sanitizeText(req.header("x-admin-key"), 500);
  if (providedKey && timingSafeEqualString(providedKey, adminKey)) {
    return { ok: true, mode: "key" };
  }

  const authHeader = req.header("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const verification = verifyAdminSessionToken(token, getAdminSecret());
  if (verification.valid) {
    return { ok: true, mode: "session", expiresAt: verification.expiresAt };
  }

  return { ok: false, status: 401, message: "Acces non autorise." };
}

function validateSecurityConfiguration(allowedOrigins) {
  const adminKey = getAdminKey();
  const adminSecret = getAdminSecret();
  const issues = [];

  if (isProduction && allowedOrigins.length === 0) {
    issues.push("FRONTEND_ORIGINS must be configured in production.");
  }

  if (adminKey) {
    if (adminKey.length < 16) {
      issues.push("ADMIN_API_KEY must be at least 16 characters.");
    }

    if (!adminSecret) {
      issues.push("ADMIN_SESSION_SECRET is required when ADMIN_API_KEY is configured.");
    } else {
      if (adminSecret.length < 32) {
        issues.push("ADMIN_SESSION_SECRET must be at least 32 characters.");
      }

      if (timingSafeEqualString(adminSecret, adminKey)) {
        issues.push("ADMIN_SESSION_SECRET must be different from ADMIN_API_KEY.");
      }
    }
  }

  if (issues.length === 0) {
    return;
  }

  const message = `Security configuration error: ${issues.join(" ")}`;
  if (isProduction) {
    throw new Error(message);
  }

  // eslint-disable-next-line no-console
  console.warn(message);
}

const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);
if (trustProxy !== undefined) {
  app.set("trust proxy", trustProxy);
}

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "no-referrer" },
    hsts: isProduction
      ? {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        }
      : false
  })
);
app.use(compression());

const configuredOrigins = (
  process.env.FRONTEND_ORIGINS ||
  process.env.FRONTEND_ORIGIN ||
  (isProduction ? "" : "http://localhost:5173")
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const allowedOrigins = [...configuredOrigins];
const defaultDevOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];
if (!isProduction) {
  for (const origin of defaultDevOrigins) {
    if (!allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  }
}

validateSecurityConfiguration(allowedOrigins);

function isAllowedOrigin(origin) {
  return !origin || allowedOrigins.includes(origin);
}

app.use((req, res, next) => {
  if (process.env.REQUIRE_HTTPS === "true" && !req.secure) {
    res.status(400).json({
      success: false,
      message: "HTTPS est requis."
    });
    return;
  }

  if (req.path.startsWith("/api/")) {
    setNoStore(res);
  }

  const origin = req.header("origin");
  if (origin && !isAllowedOrigin(origin)) {
    res.status(403).json({
      success: false,
      message: "Origine non autorisee."
    });
    return;
  }

  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ["GET", "POST", "PUT"],
    optionsSuccessStatus: 204
  })
);
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || "32kb" }));

const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: Number(process.env.API_RATE_LIMIT) || 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de requetes. Merci de reessayer dans une minute."
  }
});

const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: Number(process.env.AI_RATE_LIMIT) || 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de demandes IA. Merci de reessayer dans quelques minutes."
  }
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: Number(process.env.CONTACT_RATE_LIMIT) || 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de demandes. Merci de reessayer plus tard."
  }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.ADMIN_RATE_LIMIT) || 40,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de requetes sur la zone admin. Merci de reessayer plus tard."
  }
});

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.ADMIN_LOGIN_RATE_LIMIT) || 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives de connexion admin. Merci de reessayer plus tard."
  }
});

app.use("/api", generalApiLimiter);
app.use("/api/ai", aiLimiter);
app.use("/api/contact", contactLimiter);
app.use("/api/admin", adminLimiter);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "prometheus-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/content", asyncHandler(async (_req, res) => {
  res.json(await readCurrentContent());
}));

app.get("/api/pricing", asyncHandler(async (_req, res) => {
  const content = await readCurrentContent();
  res.json(content.pricing);
}));

app.post("/api/admin/login", adminLoginLimiter, requireJson, (req, res) => {
  const adminKey = getAdminKey();
  if (!adminKey) {
    res.status(404).json({ success: false, message: "Introuvable." });
    return;
  }

  const password = sanitizeText(req.body?.password, 500);
  if (!password || !timingSafeEqualString(password, adminKey)) {
    res.status(401).json({ success: false, message: "Identifiants invalides." });
    return;
  }

  const session = createAdminSessionToken(
    getAdminSecret(),
    Number(process.env.ADMIN_SESSION_TTL_HOURS) || 12
  );

  res.json({
    success: true,
    token: session.token,
    expiresAt: session.expiresAt
  });
});

app.get("/api/admin/leads", asyncHandler(async (req, res) => {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    res.status(auth.status).json({ success: false, message: auth.message });
    return;
  }

  await leadsStore.loadIfNeeded();
  res.json({
    success: true,
    leads: leadsStore.list()
  });
}));

app.get("/api/admin/content", asyncHandler(async (req, res) => {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    res.status(auth.status).json({ success: false, message: auth.message });
    return;
  }

  await contentOverridesStore.loadIfNeeded();
  res.json({
    success: true,
    overrides: contentOverridesStore.get(),
    content: await readCurrentContent()
  });
}));

app.put("/api/admin/content", requireJson, asyncHandler(async (req, res) => {
  const auth = verifyAdminRequest(req);
  if (!auth.ok) {
    res.status(auth.status).json({ success: false, message: auth.message });
    return;
  }

  const overrides = await contentOverridesStore.replace(req.body ?? {});
  res.json({
    success: true,
    overrides,
    content: await readCurrentContent()
  });
}));

app.get("/api/ai/capabilities", (_req, res) => {
  res.json({
    available: Boolean(process.env.OPENAI_API_KEY),
    intents: getSupportedIntents()
  });
});

app.post("/api/contact", requireJson, async (req, res, next) => {
  try {
    const content = await readCurrentContent();
    const validatedLead = validateContactPayload(req.body ?? {}, content);
    const newLead = {
      ...validatedLead,
      createdAt: new Date().toISOString()
    };

    leadsStore
      .add(newLead)
      .then(() => {
        res.status(201).json({
          success: true,
          message:
            "Votre demande a bien ete envoyee. Prometheus revient vers vous par email ou par telephone."
        });
      })
      .catch(() => {
        res.status(201).json({
          success: true,
          message:
            "Votre demande a bien ete envoyee. Prometheus revient vers vous par email ou par telephone."
        });
      });
  } catch (error) {
    next(error);
  }
});
app.post("/api/ai/tutor", requireJson, async (req, res) => {
  try {
    const { history, intent } = req.body ?? {};
    const message = validateAiTextField(req.body?.message, "message");
    const context = sanitizeText(req.body?.context, 300);
    const result =
      intent && intent !== "tutor"
        ? await runAiAssistant({ intent, message, history, context })
        : await askAiTutor({ message, history, context });
    res.json({
      success: true,
      answer: result.answer,
      model: result.model,
      intent: result.intent
    });
  } catch (error) {
    const statusCode = Number(error.statusCode) || 500;
    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 503
          ? "Assistant IA indisponible: configurez OPENAI_API_KEY sur le backend."
          : error.message || "Erreur IA temporaire."
    });
  }
});

app.post("/api/ai/guide", requireJson, async (req, res) => {
  try {
    const message = validateAiTextField(req.body?.message, "message");
    const context = sanitizeText(req.body?.context, 300);
    const result = await runAiAssistant({
      intent: "guide_3_steps",
      message,
      context
    });
    res.json({
      success: true,
      answer: result.answer,
      model: result.model,
      intent: result.intent
    });
  } catch (error) {
    const statusCode = Number(error.statusCode) || 500;
    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 503
          ? "Assistant IA indisponible: configurez OPENAI_API_KEY sur le backend."
          : error.message || "Erreur IA temporaire."
    });
  }
});

app.post("/api/ai/rewrite", requireJson, async (req, res) => {
  try {
    const message = validateAiTextField(req.body?.message, "message");
    const context = sanitizeText(req.body?.context, 300);
    const result = await runAiAssistant({
      intent: "rewrite_email",
      message,
      context
    });
    res.json({
      success: true,
      answer: result.answer,
      model: result.model,
      intent: result.intent
    });
  } catch (error) {
    const statusCode = Number(error.statusCode) || 500;
    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 503
          ? "Assistant IA indisponible: configurez OPENAI_API_KEY sur le backend."
          : error.message || "Erreur IA temporaire."
    });
  }
});

app.post("/api/ai/next-course", requireJson, async (req, res) => {
  try {
    const objective = validateAiTextField(req.body?.objective, "objective", 800);
    const completedModules = validateAiArray(req.body?.completedModules, 8, 120);
    const context = sanitizeText(req.body?.context, 300);
    const result = await runAiAssistant({
      intent: "next_course",
      objective,
      completedModules,
      context
    });
    res.json({
      success: true,
      answer: result.answer,
      model: result.model,
      intent: result.intent
    });
  } catch (error) {
    const statusCode = Number(error.statusCode) || 500;
    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 503
          ? "Assistant IA indisponible: configurez OPENAI_API_KEY sur le backend."
          : error.message || "Erreur IA temporaire."
    });
  }
});

app.use("/api", (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Introuvable."
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    res.status(400).json({
      success: false,
      message: "JSON invalide."
    });
    return;
  }

  const statusCode = Number(error?.statusCode) || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Erreur serveur." : error.message || "Requete invalide."
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Prometheus API running on http://localhost:${port}`);
});
