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
  return String(value || "").trim().slice(0, maxLength);
}

function getAdminKey() {
  return String(process.env.ADMIN_API_KEY || "").trim();
}

function getAdminSecret() {
  return String(process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_API_KEY || "").trim();
}

async function readCurrentContent() {
  await contentOverridesStore.loadIfNeeded();
  return buildSiteContent(contentOverridesStore.get());
}

function buildWhatsappUrl(content, message) {
  const baseUrl = content?.brand?.whatsappBaseUrl || "https://api.whatsapp.com/send";
  const params = new URLSearchParams();
  const phone = String(content?.brand?.whatsappNumberLink || "")
    .replace(/\D/g, "")
    .trim();

  if (phone) {
    params.set("phone", phone);
  }

  if (message) {
    params.set("text", String(message).trim());
  }

  const query = params.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
}

function findLabel(options, value) {
  return options.find((item) => item.value === value)?.label || value;
}

function buildLeadWhatsappMessage(content, lead) {
  const requestTypeLabel = findLabel(content.reservation.requestTypes, lead.requestType || "devis");
  const serviceLabel = findLabel(content.reservation.services, lead.service || "office");
  const slotLabel = findLabel(content.reservation.slots, lead.preferredSlot || "asap");

  const intro =
    lead.requestType === "formation"
      ? content.brand.paymentMessage
      : lead.requestType === "creneau"
      ? content.brand.bookingMessage
      : content.brand.quoteMessage;

  return [
    intro,
    `Nom: ${lead.name}`,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.whatsapp || "non renseigne"}`,
    `Type: ${requestTypeLabel}`,
    `Service: ${serviceLabel}`,
    `Disponibilite: ${slotLabel}`,
    `Besoin: ${lead.goal}`
  ].join("\n");
}

function verifyAdminRequest(req) {
  const adminKey = getAdminKey();
  if (!adminKey) {
    return { ok: false, status: 404, message: "Not found." };
  }

  const providedKey = sanitizeText(req.header("x-admin-key"), 500);
  if (providedKey && providedKey === adminKey) {
    return { ok: true, mode: "key" };
  }

  const authHeader = req.header("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const verification = verifyAdminSessionToken(token, getAdminSecret());
  if (verification.valid) {
    return { ok: true, mode: "session", expiresAt: verification.expiresAt };
  }

  return { ok: false, status: 401, message: "Unauthorized." };
}

const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);
if (trustProxy !== undefined) {
  app.set("trust proxy", trustProxy);
}

app.disable("x-powered-by");
app.use(helmet());
app.use(compression());

const allowedOrigins = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const defaultDevOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"];
for (const origin of defaultDevOrigins) {
  if (!allowedOrigins.includes(origin)) {
    allowedOrigins.push(origin);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.includes(origin));
    },
    methods: ["GET", "POST", "PUT"],
    optionsSuccessStatus: 204
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.API_RATE_LIMIT) || 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Trop de requetes. Merci de reessayer dans une minute."
    }
  })
);

app.use(
  "/api/ai",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: Number(process.env.AI_RATE_LIMIT) || 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Trop de demandes IA. Merci de reessayer dans quelques minutes."
    }
  })
);

app.use(
  "/api/contact",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: Number(process.env.CONTACT_RATE_LIMIT) || 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Trop de demandes. Merci de reessayer plus tard."
    }
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "prometheus-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/content", async (_req, res) => {
  res.json(await readCurrentContent());
});

app.get("/api/pricing", async (_req, res) => {
  const content = await readCurrentContent();
  res.json(content.pricing);
});

app.post("/api/admin/login", (req, res) => {
  const adminKey = getAdminKey();
  if (!adminKey) {
    res.status(404).json({ success: false, message: "Not found." });
    return;
  }

  const password = sanitizeText(req.body?.password, 500);
  if (!password || password !== adminKey) {
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

app.get("/api/admin/leads", async (req, res) => {
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
});

app.get("/api/admin/content", async (req, res) => {
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
});

app.put("/api/admin/content", async (req, res) => {
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
});

app.get("/api/ai/capabilities", (_req, res) => {
  res.json({
    provider: "openai",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    intents: getSupportedIntents()
  });
});

app.post("/api/contact", async (req, res) => {
  const { name, email, whatsapp, requestType, service, preferredSlot, goal } = req.body ?? {};
  if (!name || !email || !goal) {
    res.status(400).json({
      success: false,
      message: "name, email and goal are required."
    });
    return;
  }

  const newLead = {
    name: sanitizeText(name, 120),
    email: sanitizeText(email, 180).toLowerCase(),
    whatsapp: sanitizeText(whatsapp, 80),
    requestType: sanitizeText(requestType, 40) || "devis",
    service: sanitizeText(service, 80) || "office",
    preferredSlot: sanitizeText(preferredSlot, 40) || "asap",
    goal: sanitizeText(goal, 2000),
    createdAt: new Date().toISOString()
  };

  const content = await readCurrentContent();
  const whatsappUrl = buildWhatsappUrl(content, buildLeadWhatsappMessage(content, newLead));

  leadsStore
    .add(newLead)
    .then((savedLead) => {
      res.status(201).json({
        success: true,
        message:
          "Votre demande a bien ete envoyee. Vous pouvez maintenant poursuivre sur WhatsApp.",
        lead: savedLead,
        whatsappUrl
      });
    })
    .catch((_error) => {
      res.status(201).json({
        success: true,
        message:
          "Votre demande a bien ete envoyee. Vous pouvez maintenant poursuivre sur WhatsApp.",
        lead: { id: -1, ...newLead },
        whatsappUrl
      });
    });
});
app.post("/api/ai/tutor", async (req, res) => {
  const { message, history, context, intent } = req.body ?? {};

  try {
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

app.post("/api/ai/guide", async (req, res) => {
  const { message, context } = req.body ?? {};

  try {
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

app.post("/api/ai/rewrite", async (req, res) => {
  const { message, context } = req.body ?? {};

  try {
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

app.post("/api/ai/next-course", async (req, res) => {
  const { objective, completedModules, context } = req.body ?? {};

  try {
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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Prometheus API running on http://localhost:${port}`);
});
