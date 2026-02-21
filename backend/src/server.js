import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { siteContent } from "./data/site-content.js";
import { askAiTutor, getSupportedIntents, runAiAssistant } from "./services/ai-tutor.js";
import { createLeadsStore } from "./storage/leads-store.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

const leadsStore = createLeadsStore({
  persistPath: process.env.LEADS_PERSIST_PATH
});

function parseTrustProxy(value) {
  if (!value) return undefined;
  if (value === "true") return 1;
  if (value === "false") return false;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  return value;
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
    methods: ["GET", "POST"],
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

app.get("/api/content", (_req, res) => {
  res.json(siteContent);
});

app.get("/api/pricing", (_req, res) => {
  res.json(siteContent.pricing);
});

app.get("/api/admin/leads", async (req, res) => {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) {
    res.status(404).json({ success: false, message: "Not found." });
    return;
  }

  const providedKey = req.header("x-admin-key");
  if (providedKey !== adminKey) {
    res.status(401).json({ success: false, message: "Unauthorized." });
    return;
  }

  await leadsStore.loadIfNeeded();
  res.json({
    success: true,
    leads: leadsStore.list()
  });
});

app.get("/api/ai/capabilities", (_req, res) => {
  res.json({
    provider: "openai",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    intents: getSupportedIntents()
  });
});

app.post("/api/contact", (req, res) => {
  const { name, email, goal, plan } = req.body ?? {};
  if (!name || !email || !goal) {
    res.status(400).json({
      success: false,
      message: "name, email and goal are required."
    });
    return;
  }

  const newLead = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    goal: String(goal).trim(),
    plan: plan ? String(plan).trim() : "hestia",
    createdAt: new Date().toISOString()
  };

  leadsStore
    .add(newLead)
    .then((savedLead) => {
      res.status(201).json({
        success: true,
        message:
          "Votre demande a bien ete envoyee. Un conseiller vous recontacte sous 24h.",
        lead: savedLead
      });
    })
    .catch((_error) => {
      res.status(201).json({
        success: true,
        message:
          "Votre demande a bien ete envoyee. Un conseiller vous recontacte sous 24h.",
        lead: { id: -1, ...newLead }
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
