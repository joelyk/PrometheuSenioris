import OpenAI from "openai";

const systemPrompt = `Tu es Prometheus, un formateur informatique patient pour seniors francophones.
Regles:
- Reponds en francais simple, phrases courtes.
- Evite le jargon technique.
- Structure toujours en etapes numerotees.
- Donne un exemple concret apres les etapes.
- Termine par une question de verification: "Souhaitez-vous un exercice pratique ?".`;

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

export async function askAiTutor({
  context,
  history,
  message,
  model = process.env.OPENAI_MODEL || "gpt-4o-mini",
  apiKey = process.env.OPENAI_API_KEY
}) {
  const trimmedMessage = String(message || "").trim();

  if (!trimmedMessage) {
    const error = new Error("message is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.statusCode = 503;
    throw error;
  }

  const client = new OpenAI({ apiKey });
  const safeHistory = sanitizeHistory(history);
  const topic = inferTopic(context);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "system",
        content: `Contexte actuel du site: ${topic}.`
      },
      ...safeHistory,
      {
        role: "user",
        content: trimmedMessage.slice(0, 2000)
      }
    ]
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
    usage: completion.usage || null
  };
}
