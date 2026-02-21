import { useEffect, useMemo, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import { fallbackContent } from "./fallbackContent";
import SeniorChat from "./components/SeniorChat";

const API_BASE = import.meta.env.VITE_API_URL || "";
const BASE_URL = import.meta.env.BASE_URL || "/";

const emptyForm = {
  name: "",
  email: "",
  goal: "",
  plan: "athena"
};

function getApiPath(path) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

function resolveAssetPath(path) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    const cleanBase = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${cleanBase}${path}`;
  }

  return `${BASE_URL}${path}`;
}

function HomePage({ content, heroImagePath }) {
  return (
    <main className="route-page">
      <section className="container hero">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">{content.brand.promise}</p>
            <h1>{content.hero.headline}</h1>
            <p className="hero-copy">{content.hero.subheadline}</p>
            <div className="hero-actions">
              <Link to="/offres" className="btn btn-primary">
                {content.hero.ctaPrimary}
              </Link>
              <Link to="/contact" className="btn btn-outline">
                {content.hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <aside className="hero-media">
            <img src={heroImagePath} alt={content.hero.imageAlt} loading="lazy" />
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

      <section className="container section">
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

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Temoignages</p>
          <h2>Des resultats concrets, semaine apres semaine</h2>
        </div>
        <div className="card-grid three">
          {content.testimonials.map((review) => (
            <article key={review.name} className="quote-card">
              <p className="quote-text">"{review.quote}"</p>
              <p className="quote-author">
                {review.name} - {review.profile}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section contact-section">
        <div className="section-heading">
          <p className="eyebrow">Questions frequentes</p>
          <h2>Les reponses essentielles avant de commencer</h2>
        </div>
        <div className="faq-list">
          {content.faq.map((item) => (
            <article key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function TrainingsPage({ content }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Formations</p>
        <h1>Formations de base: Excel, Word, PowerPoint</h1>
        <p className="hero-copy">
          Des parcours concrets pour progresser rapidement, avec une approche simple
          et rassurante.
        </p>
      </section>

      <section className="container section">
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

      <section className="container section contact-section">
        <div className="section-heading">
          <p className="eyebrow">Formations de base</p>
          <h2>Choisissez votre module principal</h2>
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
    </main>
  );
}

function AiToolsPage({ content }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Outils IA</p>
        <h1>Apprendre les bons outils IA pour le quotidien et l'entreprise</h1>
        <p className="hero-copy">
          Nous vous montrons comment utiliser l'IA en restant simple, utile et
          verifiable.
        </p>
      </section>

      <section className="container section contact-section">
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
    </main>
  );
}

function PricingPage({ content }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Tarifs en euros</p>
        <h1>Choisissez la formule qui correspond a votre rythme</h1>
        <p className="hero-copy">
          De la decouverte gratuite a l'accompagnement premium, tout est pense pour
          avancer sans stress.
        </p>
      </section>

      <section className="container section contact-section">
        <div className="card-grid three">
          {content.pricing.map((plan) => (
            <article key={plan.id} className={`pricing-card ${plan.highlight ? "featured" : ""}`}>
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
              <Link to="/contact" className={plan.highlight ? "btn btn-primary" : "btn btn-outline"}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function VisionPage({ content }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Vision SaaS</p>
        <h1>Prometheus evolue vers une solution entreprise</h1>
        <p className="hero-copy">
          Notre ambition: rendre les equipes plus autonomes sur les logiciels et
          accelerer l'adoption numerique.
        </p>
      </section>

      <section className="container section contact-section">
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
    </main>
  );
}

function ContactPage({
  apiAvailable,
  content,
  feedback,
  formData,
  handleSubmit,
  pricingOptions,
  sending,
  setFormData
}) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Demande de rappel</p>
        <h1>Parlons de votre progression numerique</h1>
        <p className="hero-copy">
          Un conseiller vous aide a choisir la meilleure formule selon votre objectif.
        </p>
      </section>

      <section className="container section contact-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Votre nom"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="votre@email.com"
            required
          />

          <label htmlFor="plan">Offre souhaitee</label>
          <select
            id="plan"
            name="plan"
            value={formData.plan}
            onChange={(event) => setFormData((prev) => ({ ...prev, plan: event.target.value }))}
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
            onChange={(event) => setFormData((prev) => ({ ...prev, goal: event.target.value }))}
            placeholder="Ex: devenir autonome sur Excel et comprendre ChatGPT."
            required
          />

          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? "Envoi en cours..." : "Envoyer ma demande"}
          </button>

          {feedback ? <p className="feedback">{feedback}</p> : null}
          {!apiAvailable ? (
            <p className="feedback">
              Mode demo GitHub Pages: le formulaire est informatif. Activez le backend
              pour traiter les demandes.
            </p>
          ) : null}
        </form>

        <div className="section-heading">
          <p className="eyebrow">Pourquoi nous contacter</p>
          <h2>Un plan clair avant de commencer</h2>
          <p className="hero-copy">
            Vous recevez une recommandation de parcours sur mesure selon votre niveau
            et vos besoins (maison ou entreprise).
          </p>
        </div>

        <div className="card-grid three">
          {content.audiences.map((audience) => (
            <article key={audience.title} className="glass-card">
              <h3>{audience.title}</h3>
              <p>{audience.benefit}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
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

  const heroImagePath = useMemo(
    () => resolveAssetPath(content?.hero?.imagePath || fallbackContent.hero.imagePath),
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
        <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
          Reessayer
        </button>
      </main>
    );
  }

  return (
    <HashRouter>
      <div className="app-shell">
        <div className="background-glow background-glow-a" />
        <div className="background-glow background-glow-b" />

        <header className="container topbar">
          <Link to="/" className="brand">
            <span className="brand-mark">{content.brand.greekSignature}</span>
            <strong>{content.brand.name}</strong>
          </Link>
          <nav className="main-nav">
            <NavLink to="/" end>
              Accueil
            </NavLink>
            <NavLink to="/formations">Formations</NavLink>
            <NavLink to="/outils-ia">Outils IA</NavLink>
            <NavLink to="/offres">Offres</NavLink>
            <NavLink to="/vision">Vision SaaS</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
        </header>

        {!apiAvailable ? (
          <div className="container demo-banner">
            Version demo statique active. Le formulaire est informatif tant que le backend
            n'est pas deploye.
          </div>
        ) : null}

        <Routes>
          <Route path="/" element={<HomePage content={content} heroImagePath={heroImagePath} />} />
          <Route path="/formations" element={<TrainingsPage content={content} />} />
          <Route path="/outils-ia" element={<AiToolsPage content={content} />} />
          <Route path="/offres" element={<PricingPage content={content} />} />
          <Route path="/vision" element={<VisionPage content={content} />} />
          <Route
            path="/contact"
            element={
              <ContactPage
                apiAvailable={apiAvailable}
                content={content}
                feedback={feedback}
                formData={formData}
                handleSubmit={handleSubmit}
                pricingOptions={pricingOptions}
                sending={sending}
                setFormData={setFormData}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="container footer">
          <p>
            Prometheus Senioris - Nous n'offrons pas la lune, nous construisons votre
            autonomie.
          </p>
        </footer>

        <SeniorChat apiAvailable={apiAvailable} resolveApiPath={getApiPath} />
      </div>
    </HashRouter>
  );
}

export default App;
