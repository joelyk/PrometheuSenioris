import { useEffect, useMemo, useState } from "react";
import { fallbackContent } from "./fallbackContent";

const API_BASE = import.meta.env.VITE_API_URL || "";

const emptyForm = {
  name: "",
  email: "",
  goal: "",
  plan: "athena"
};

function getApiPath(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function App() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [apiAvailable, setApiAvailable] = useState(true);
  const isGithubPagesDemo =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("github.io") &&
    !API_BASE;

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      if (isGithubPagesDemo) {
        setApiAvailable(false);
        setContent(fallbackContent);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await fetch(getApiPath("/api/content"), {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Impossible de charger les donnees de la page.");
        }

        const data = await response.json();
        setContent(data);
        setApiAvailable(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setApiAvailable(false);
          setContent(fallbackContent);
          setError("");
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();

    return () => controller.abort();
  }, [isGithubPagesDemo]);

  const pricingOptions = useMemo(
    () =>
      content?.pricing?.map((plan) => ({
        value: plan.id,
        label: `${plan.name} (${plan.price})`
      })) || [],
    [content]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    if (!apiAvailable) {
      setFeedback(
        "Mode demo GitHub Pages: le formulaire est desactive. Utilisez la version complete avec backend."
      );
      return;
    }

    try {
      setSending(true);
      setFeedback("");
      const response = await fetch(getApiPath("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Envoi impossible pour le moment.");
      }

      setFeedback(result.message);
      setFormData(emptyForm);
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="app-shell loading-state">
        <div className="loader" />
        <p>Chargement de Prometheus Senioris...</p>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="app-shell loading-state">
        <p>{error || "Une erreur est survenue."}</p>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => window.location.reload()}
        >
          Reessayer
        </button>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <div className="background-glow background-glow-a" />
      <div className="background-glow background-glow-b" />

      <header className="container topbar">
        <a href="#accueil" className="brand">
          <span className="brand-mark">{content.brand.greekSignature}</span>
          <strong>{content.brand.name}</strong>
        </a>
        <nav>
          <a href="#public">Pour qui</a>
          <a href="#parcours">Parcours</a>
          <a href="#formations">Formations</a>
          <a href="#outils">Outils IA</a>
          <a href="#offres">Offres</a>
          <a href="#vision">Vision SaaS</a>
        </nav>
      </header>

      {!apiAvailable ? (
        <div className="container demo-banner">
          Version demo statique active. Connectez un backend pour activer le formulaire.
        </div>
      ) : null}

      <main>
        <section id="accueil" className="container hero">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">{content.brand.promise}</p>
              <h1>{content.hero.headline}</h1>
              <p className="hero-copy">{content.hero.subheadline}</p>
              <div className="hero-actions">
                <a href="#offres" className="btn btn-primary">
                  {content.hero.ctaPrimary}
                </a>
                <a href="#contact" className="btn btn-outline">
                  {content.hero.ctaSecondary}
                </a>
              </div>
            </div>
            <aside className="hero-media">
              <img
                src={content.hero.imagePath}
                alt={content.hero.imageAlt}
                loading="lazy"
              />
              <p className="hero-media-chip">Coaching humain + pratique concrete</p>
            </aside>
          </div>

          <div className="metric-grid">
            {content.hero.metrics.map((item) => (
              <article key={item.label} className="metric-card">
                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="public" className="container section">
          <div className="section-heading">
            <p className="eyebrow">Pour qui</p>
            <h2>Un parcours utile pour la maison, les projets et l'entreprise</h2>
          </div>
          <div className="card-grid three">
            {content.audiences.map((audience) => (
              <article key={audience.title} className="audience-card">
                <p className="audience-kicker">Profil</p>
                <h3>{audience.title}</h3>
                <p>{audience.detail}</p>
                <p className="audience-benefit">{audience.benefit}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container section">
          <div className="section-heading">
            <p className="eyebrow">Pourquoi Prometheus</p>
            <h2>Un accompagnement numerique pense pour les seniors</h2>
          </div>
          <div className="card-grid three">
            {content.pillars.map((pillar) => (
              <article key={pillar.title} className="glass-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="parcours" className="container section">
          <div className="section-heading">
            <p className="eyebrow">Parcours 7 jours</p>
            <h2>Une progression claire, jour par jour</h2>
          </div>
          <div className="timeline">
            {content.weeklyPath.map((step) => (
              <article key={step.day} className="timeline-item">
                <span>{step.day}</span>
                <h3>{step.focus}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="formations" className="container section">
          <div className="section-heading">
            <p className="eyebrow">Formations de base</p>
            <h2>Excel, Word et PowerPoint avec une methode pas a pas</h2>
          </div>
          <div className="card-grid three">
            {content.coreTrainings.map((training) => (
              <article key={training.id} className="training-card">
                <h3>{training.title}</h3>
                <p className="training-meta">
                  {training.level} - {training.duration}
                </p>
                <p className="training-price">{training.price}</p>
                <ul>
                  {training.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="outils" className="container section">
          <div className="section-heading">
            <p className="eyebrow">Outils IA</p>
            <h2>Les outils vraiment utiles au quotidien</h2>
          </div>
          <div className="card-grid four">
            {content.aiTools.map((tool) => (
              <article key={tool.name} className="tool-card">
                <h3>{tool.name}</h3>
                <p className="tool-role">{tool.role}</p>
                <p>{tool.usage}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="offres" className="container section">
          <div className="section-heading">
            <p className="eyebrow">Tarifs en euros</p>
            <h2>Des offres simples, de l'initiation au niveau premium</h2>
          </div>
          <div className="card-grid three">
            {content.pricing.map((plan) => (
              <article
                key={plan.id}
                className={`pricing-card ${plan.highlight ? "featured" : ""}`}
              >
                {plan.highlight ? <span className="badge">Le plus choisi</span> : null}
                <h3>{plan.name}</h3>
                <p className="price">
                  {plan.price}
                  <span>{plan.period}</span>
                </p>
                <p className="price-desc">{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={plan.highlight ? "btn btn-primary" : "btn btn-outline"}
                  onClick={() =>
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth"
                    })
                  }
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="vision" className="container section">
          <article className="vision-panel">
            <p className="eyebrow">Prometheus demain</p>
            <h2>{content.enterprise.title}</h2>
            <p>{content.enterprise.text}</p>
            <div className="vision-list">
              {content.enterprise.bullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>
          </article>
        </section>

        <section id="contact" className="container section contact-section">
          <div className="section-heading">
            <p className="eyebrow">Demande de rappel</p>
            <h2>Parlons de votre progression numerique</h2>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Nom</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              placeholder="Votre nom"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
              placeholder="votre@email.com"
              required
            />

            <label htmlFor="plan">Offre souhaitee</label>
            <select
              id="plan"
              name="plan"
              value={formData.plan}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, plan: event.target.value }))
              }
            >
              {pricingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="goal">Votre objectif</label>
            <textarea
              id="goal"
              name="goal"
              rows={5}
              value={formData.goal}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, goal: event.target.value }))
              }
              placeholder="Ex: devenir autonome sur Excel et comprendre ChatGPT."
              required
            />

            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>

            {feedback ? <p className="feedback">{feedback}</p> : null}
          </form>
        </section>
      </main>

      <footer className="container footer">
        <p>Prometheus Senioris - Nous n'offrons pas la lune, nous construisons votre autonomie.</p>
      </footer>
    </div>
  );
}

export default App;
