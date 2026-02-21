import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { siteContent } from "./data/site-content.js";
import { askAiTutor, getSupportedIntents, runAiAssistant } from "./services/ai-tutor.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const leads = [];

app.use(
  cors({
    origin: [allowedOrigin, "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  })
);
app.use(express.json());

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
    id: leads.length + 1,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    goal: String(goal).trim(),
    plan: plan ? String(plan).trim() : "hestia",
    createdAt: new Date().toISOString()
  };

  leads.push(newLead);

  res.status(201).json({
    success: true,
    message: "Votre demande a bien ete envoyee. Un conseiller vous recontacte sous 24h.",
    lead: newLead
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
