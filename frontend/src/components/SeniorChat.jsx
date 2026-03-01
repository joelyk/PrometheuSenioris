import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const quickPrompts = [
  "Explique Excel en 3 etapes simples",
  "Reecris un email professionnel",
  "Comment faire un visuel simple sur Canva ?"
];

const modes = [
  { id: "tutor", label: "Tutorat" },
  { id: "guide_3_steps", label: "Guide 3 etapes" },
  { id: "rewrite_email", label: "Reecrire email" },
  { id: "next_course", label: "Prochaine action" }
];

function getRouteContext(pathname) {
  if (pathname.includes("formations")) return "formations Excel, Word, PowerPoint et Canva";
  if (pathname.includes("services")) return "services informatiques et documentaires";
  if (pathname.includes("tarifs")) return "tarifs, devis et missions";
  if (pathname.includes("reservation")) return "reservation, devis et telephone";
  if (pathname.includes("connexion")) return "espace administrateur et gestion de visuels";
  return "accompagnement informatique et productivite";
}

function buildOfflineReply(mode, message, context) {
  const text = String(message || "").toLowerCase();

  if (mode === "next_course") {
    return "1. Priorite conseillee: clarifier l'objectif exact.\n2. Ensuite: choisir entre mission ciblee ou formation.\n3. Enfin: reserver un creneau ou envoyer le support.\nProchaine action: voulez-vous un exemple concret ?";
  }

  if (mode === "rewrite_email") {
    return "1. Objet suggere: Demande d'accompagnement.\n2. Message propose: Bonjour, je souhaite votre aide pour ...\n3. Conseil: ajoutez le delai et le support a traiter.\nProchaine action: voulez-vous une version plus formelle ?";
  }

  if (text.includes("excel")) {
    return "1. Ouvrez votre fichier et identifiez le resultat attendu.\n2. Verifiez les colonnes, titres et formats.\n3. Appliquez ensuite la formule utile, par exemple SOMME ou pourcentage.\nProchaine action: voulez-vous un mini exercice ?";
  }

  if (text.includes("cv")) {
    return "1. Listez vos experiences les plus utiles.\n2. Gardez une page claire avec titres et resultats visibles.\n3. Faites relire la version finale avant envoi.\nProchaine action: voulez-vous une structure de CV simple ?";
  }

  return `1. Contexte detecte: ${context}.\n2. Je peux expliquer l'outil ou la tache en etapes courtes.\n3. Je peux aussi aider a formuler une demande claire.\nProchaine action: voulez-vous un exemple concret ?`;
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
        "Bonjour, je suis le Tuteur Prométhée. Posez votre question, je reponds avec des etapes claires."
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
              completedModules: ["Excel Essentiel", "Word Impact"],
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
      pushAssistantMessage(`${error.message} Je peux continuer en guide simple si vous le souhaitez.`);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="prometheus-chat">
      {isOpen ? (
        <section className="chat-panel" aria-live="polite">
          <header className="chat-header">
            <div>
              <strong>Tuteur Prométhée</strong>
              <p>{apiAvailable ? "Assistant IA actif" : "Assistant guide disponible"}</p>
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
              placeholder="Posez votre question (Excel, document, IA, CV...)"
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

