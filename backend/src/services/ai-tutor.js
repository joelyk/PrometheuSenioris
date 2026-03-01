import OpenAI from "openai";

const systemPrompt = `Tu es Promethee, un assistant informatique francophone, calme et utile.
Tu aides des particuliers, etudiants, independants et petites equipes.
Regles:
- Reponds en francais simple.
- Evite le jargon inutile.
- Structure les reponses en etapes numerotees quand cela aide.
- Reste concret et oriente execution.
- Signale quand une verification humaine reste necessaire.
- Termine si possible par une prochaine action claire.`;

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
  if (value.includes("cv")) return "CV et candidature";
  if (value.includes("document")) return "documents et rapports";
  if (value.includes("ia")) return "outils IA et productivite";
  if (value.includes("reservation")) return "devis et reservation";
  return "accompagnement informatique general";
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
    throw createBadRequest("Le type de demande IA est invalide.");
  }

  if (intent === "guide_3_steps") {
    if (!safeMessage) {
      throw createBadRequest("Le message est requis pour le guide en 3 etapes.");
    }
    return `Mission: explique ce sujet en exactement 3 etapes utiles.
Sujet: ${safeMessage}
Contexte du site: ${topic}
Style: phrases courtes, une mise en garde finale si necessaire.`;
  }

  if (intent === "rewrite_email") {
    if (!safeMessage) {
      throw createBadRequest("Le message est requis pour la reecriture.");
    }
    return `Mission: reformule le texte en message ou email clair, poli et directement exploitable.
Texte de base:
${safeMessage}
Contexte du site: ${topic}
Format attendu:
1) Objet suggere si pertinent
2) Version finale
3) Mini conseil d'envoi`;
  }

  if (intent === "next_course") {
    const modulesText = safeModules.length ? safeModules.join(", ") : "Aucun module fourni";
    return `Mission: proposer la prochaine formation ou action la plus utile pour cet utilisateur.
Modules deja vus: ${modulesText}
Objectif declare: ${safeObjective || "ameliorer sa productivite informatique"}
Contexte du site: ${topic}
Format attendu:
1) Prochaine priorite
2) Pourquoi ce choix
3) Mini plan d'action`;
  }

  if (!safeMessage) {
    throw createBadRequest("Le message est requis.");
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
    const error = new Error("OPENAI_API_KEY n'est pas configuree.");
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
    temperature: intent === "rewrite_email" ? 0.2 : 0.35,
    max_tokens: 500,
    messages
  });

  const answer = completion.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    const error = new Error("La reponse IA est vide.");
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
