import OpenAI from "openai";

const systemPrompt = `Tu es Promethee, un formateur informatique patient pour seniors francophones.
Regles:
- Reponds en francais simple, phrases courtes.
- Evite le jargon technique.
- Structure toujours en etapes numerotees.
- Donne un exemple concret apres les etapes.
- Termine par une question de verification: "Souhaitez-vous un exercice pratique ?".`;

const supportedIntents = new Set(["tutor", "guide_3_steps", "rewrite_email", "next_course"]);

function sanitizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (entry) =>
        entry &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string"
    )
    .slice(-6)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.trim().slice(0, 1500)
    }));
}

function inferTopic(context) {
  const value = String(context || "").toLowerCase();
  if (value.includes("excel")) return "Excel";
  if (value.includes("word")) return "Word";
  if (value.includes("powerpoint")) return "PowerPoint";
  if (value.includes("ia")) return "outils IA";
  if (value.includes("contact")) return "orientation de programme";
  return "initiation numerique";
}

function sanitizeText(value, maxLength = 2000) {
  return String(value || "").trim().slice(0, maxLength);
}

function createBadRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function buildTaskInstruction({ intent, topic, message, objective, completedModules }) {
  const safeMessage = sanitizeText(message);
  const safeObjective = sanitizeText(objective, 800);
  const safeModules = Array.isArray(completedModules)
    ? completedModules.map((item) => sanitizeText(item, 120)).filter(Boolean).slice(0, 8)
    : [];

  if (!supportedIntents.has(intent)) {
    throw createBadRequest("intent is invalid.");
  }

  if (intent === "guide_3_steps") {
    if (!safeMessage) {
      throw createBadRequest("message is required for guide_3_steps.");
    }
    return `Mission: explique ce sujet en exactement 3 etapes.
Sujet: ${safeMessage}
Contexte du site: ${topic}
Style: phrases courtes, mots simples, une phrase de securite a la fin.`;
  }

  if (intent === "rewrite_email") {
    if (!safeMessage) {
      throw createBadRequest("message is required for rewrite_email.");
    }
    return `Mission: reformule le texte en email clair et poli.
Texte de base:
${safeMessage}
Contexte du site: ${topic}
Format attendu:
1) Objet suggere
2) Email final pret a copier`;
  }

  if (intent === "next_course") {
    const modulesText = safeModules.length ? safeModules.join(", ") : "Aucun module fourni";
    return `Mission: proposer le prochain cours ideal pour ce senior.
Modules termines: ${modulesText}
Objectif declare: ${safeObjective || "ameliorer la maitrise informatique"}
Contexte du site: ${topic}
Format attendu:
1) Prochain module recommande
2) Pourquoi ce choix
3) Mini plan 7 jours`;
  }

  if (!safeMessage) {
    throw createBadRequest("message is required.");
  }

  return `Question utilisateur: ${safeMessage}
Contexte du site: ${topic}`;
}

function buildMessages({ intent, history, taskInstruction }) {
  if (intent === "tutor") {
    return [
      {
        role: "system",
        content: systemPrompt
      },
      ...sanitizeHistory(history),
      {
        role: "user",
        content: taskInstruction
      }
    ];
  }

  return [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: taskInstruction
    }
  ];
}

export async function runAiAssistant({
  intent = "tutor",
  context,
  history,
  message,
  objective,
  completedModules,
  model = process.env.OPENAI_MODEL || "gpt-4o-mini",
  apiKey = process.env.OPENAI_API_KEY
}) {
  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const client = new OpenAI({ apiKey });
  const topic = inferTopic(context);
  const taskInstruction = buildTaskInstruction({
    intent,
    topic,
    message,
    objective,
    completedModules
  });
  const messages = buildMessages({
    intent,
    history,
    taskInstruction
  });

  const completion = await client.chat.completions.create({
    model,
    temperature: intent === "rewrite_email" ? 0.2 : 0.3,
    max_tokens: 500,
    messages
  });

  const answer = completion.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    const error = new Error("AI response was empty.");
    error.statusCode = 502;
    throw error;
  }

  return {
    answer,
    model,
    intent,
    usage: completion.usage || null
  };
}

export async function askAiTutor(params) {
  return runAiAssistant({ intent: "tutor", ...params });
}

export function getSupportedIntents() {
  return Array.from(supportedIntents);
}
