import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { siteContent } from "./data/site-content.js";

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Prometheus API running on http://localhost:${port}`);
});
