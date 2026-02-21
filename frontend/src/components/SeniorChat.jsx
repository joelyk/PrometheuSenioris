import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const quickPrompts = [
  "Explique Excel en 3 etapes simples",
  "Comment rediger un email professionnel ?",
  "Que faire pour debuter sur PowerPoint ?"
];

const modes = [
  { id: "tutor", label: "Tutorat" },
  { id: "guide_3_steps", label: "Guide 3 etapes" },
  { id: "rewrite_email", label: "Reecrire email" },
  { id: "next_course", label: "Prochain cours" }
];

function getRouteContext(pathname) {
  if (pathname.includes("formations")) return "formations Excel, Word, PowerPoint";
  if (pathname.includes("outils-ia")) return "outils IA pratiques";
  if (pathname.includes("offres")) return "tarifs et formules";
  if (pathname.includes("vision")) return "vision SaaS entreprise";
  if (pathname.includes("contact")) return "orientation de parcours";
  return "apprentissage numerique pour seniors";
}

function buildOfflineReply(mode, message, context) {
  const text = String(message || "").toLowerCase();

  if (mode === "next_course") {
    return "1. Prochain module recommande: Excel Graphiques.\n2. Pourquoi: vous consoliderez les bases tableau deja apprises.\n3. Mini plan 7 jours: 10 minutes/jour sur un mini fichier.\nSouhaitez-vous un exercice pratique ?";
  }

  if (mode === "rewrite_email") {
    return "1. Objet suggere: Demande d'information.\n2. Email propose: Bonjour, je vous contacte pour ...\n3. Relisez puis adaptez les noms et la date.\nSouhaitez-vous un exercice pratique ?";
  }

  if (text.includes("excel")) {
    return "1. Ouvrez Excel et choisissez un classeur vide.\n2. Ecrivez vos titres en ligne 1.\n3. Utilisez SOMME pour additionner une colonne.\nExemple: =SOMME(B2:B8).\nSouhaitez-vous un exercice pratique ?";
  }

  if (text.includes("word")) {
    return "1. Ouvrez Word et choisissez un modele simple.\n2. Ecrivez votre texte avec des phrases courtes.\n3. Utilisez les styles Titre et Normal.\nExemple: titre + 3 paragraphes max.\nSouhaitez-vous un exercice pratique ?";
  }

  return `1. Nous sommes sur: ${context}.\n2. Je peux vous expliquer l'outil en etapes courtes.\n3. Je peux aussi proposer un mini-exercice.\nExemple: objectif du jour en 10 minutes.\nSouhaitez-vous un exercice pratique ?`;
}

function SeniorChat({ apiAvailable, resolveApiPath }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("tutor");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Bonjour, je suis le Tuteur Prométhée. Posez votre question, je reponds en etapes simples."
    }
  ]);
  const inputRef = useRef(null);

  const context = useMemo(() => getRouteContext(location.pathname), [location.pathname]);

  function toggleChat() {
    setIsOpen((prev) => !prev);
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 80);
  }

  function pushAssistantMessage(content) {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  }

  async function sendMessage(rawMessage) {
    const message = String(rawMessage || "").trim();
    if (!message || isSending) return;

    const userEntry = { role: "user", content: message };
    setMessages((prev) => [...prev, userEntry]);
    setInput("");
    setIsSending(true);

    if (!apiAvailable) {
      pushAssistantMessage(buildOfflineReply(mode, message, context));
      setIsSending(false);
      return;
    }

    try {
      const history = messages.slice(-6).map((entry) => ({
        role: entry.role,
        content: entry.content
      }));

      const endpoint =
        mode === "guide_3_steps"
          ? "/api/ai/guide"
          : mode === "rewrite_email"
          ? "/api/ai/rewrite"
          : mode === "next_course"
          ? "/api/ai/next-course"
          : "/api/ai/tutor";

      const body =
        mode === "next_course"
          ? {
              objective: message,
              completedModules: ["Excel Base", "Word Base"],
              context
            }
          : {
              message,
              context,
              history,
              intent: mode
            };

      const response = await fetch(resolveApiPath(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Assistant IA indisponible.");
      }

      pushAssistantMessage(result.answer);
    } catch (error) {
      pushAssistantMessage(
        `${error.message} Je peux continuer en mode guide simple si vous le souhaitez.`
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="senior-chat">
      {isOpen ? (
        <section className="chat-panel" aria-live="polite">
          <header className="chat-header">
            <div>
              <strong>Tuteur Prométhée</strong>
              <p>{apiAvailable ? "Assistant IA actif" : "Mode demo local"}</p>
            </div>
            <button type="button" className="chat-close" onClick={toggleChat}>
              Fermer
            </button>
          </header>

          <div className="chat-modes">
            {modes.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`chat-mode-btn ${mode === entry.id ? "active" : ""}`}
                onClick={() => setMode(entry.id)}
                disabled={isSending}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <div className="chat-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="chat-prompt-btn"
                onClick={() => sendMessage(prompt)}
                disabled={isSending}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-messages">
            {messages.map((entry, index) => (
              <article
                key={`${entry.role}-${index}`}
                className={`chat-bubble ${entry.role === "user" ? "chat-user" : "chat-assistant"}`}
              >
                <p>{entry.content}</p>
              </article>
            ))}
            {isSending ? <p className="chat-wait">Le tuteur reflechit...</p> : null}
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Posez votre question (Excel, Word, IA...)"
              maxLength={800}
            />
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              Envoyer
            </button>
          </form>
        </section>
      ) : null}

      <button type="button" className="chat-toggle-btn" onClick={toggleChat}>
        Parler au Tuteur Prométhée
      </button>
    </div>
  );
}

export default SeniorChat;
