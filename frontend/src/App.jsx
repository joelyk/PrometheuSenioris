import { useEffect, useMemo, useState } from "react";
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import SeniorChat from "./components/SeniorChat";
import { fallbackContent } from "./fallbackContent";

const API_BASE = import.meta.env.VITE_API_URL || "";
const BASE_URL = import.meta.env.BASE_URL || "/";
const ADMIN_SESSION_KEY = "prometheus-admin-session";
const CONTENT_OVERRIDES_KEY = "prometheus-content-overrides";
const DEMO_ADMIN_PASSWORD = "prometheus-demo";

const emptyForm = {
  name: "",
  email: "",
  whatsapp: "",
  requestType: "devis",
  service: "office",
  preferredSlot: "asap",
  goal: ""
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

function buildWhatsappUrl(content, message) {
  const baseUrl = content?.brand?.whatsappBaseUrl || "https://api.whatsapp.com/send";
  return `${baseUrl}?text=${encodeURIComponent(String(message || "").trim())}`;
}

function readStorageJson(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function readSessionJson(key) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function writeStorageJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function writeSessionJson(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(value));
}

function removeStorageKey(key, type = "local") {
  if (typeof window === "undefined") {
    return;
  }

  if (type === "session") {
    window.sessionStorage.removeItem(key);
    return;
  }

  window.localStorage.removeItem(key);
}

function applyImageOverrides(baseContent, overrides) {
  const content = JSON.parse(JSON.stringify(baseContent));
  if (!overrides || typeof overrides !== "object") {
    return content;
  }

  if (typeof overrides.heroImagePath === "string" && overrides.heroImagePath.trim()) {
    content.hero.imagePath = overrides.heroImagePath.trim();
  }

  if (overrides.moduleImages && typeof overrides.moduleImages === "object") {
    content.trainingModules = content.trainingModules.map((module) => ({
      ...module,
      imagePath:
        typeof overrides.moduleImages[module.id] === "string" && overrides.moduleImages[module.id].trim()
          ? overrides.moduleImages[module.id].trim()
          : module.imagePath
    }));
  }

  return content;
}

function createAdminDraft(content) {
  return {
    heroImagePath: content.hero.imagePath,
    moduleImages: Object.fromEntries(
      content.trainingModules.map((module) => [module.id, module.imagePath])
    )
  };
}

function findLabel(options, value) {
  return options.find((item) => item.value === value)?.label || value;
}

function buildReservationMessage(content, formData) {
  const requestTypeLabel = findLabel(fallbackContent.reservation.requestTypes, formData.requestType);
  const serviceLabel = findLabel(fallbackContent.reservation.services, formData.service);
  const slotLabel = findLabel(fallbackContent.reservation.slots, formData.preferredSlot);

  return [
    formData.requestType === "formation"
      ? content.brand.paymentMessage
      : formData.requestType === "creneau"
      ? content.brand.bookingMessage
      : content.brand.quoteMessage,
    `Nom: ${formData.name || "non renseigne"}`,
    `Email: ${formData.email || "non renseigne"}`,
    `WhatsApp: ${formData.whatsapp || "non renseigne"}`,
    `Type: ${requestTypeLabel}`,
    `Service: ${serviceLabel}`,
    `Disponibilite: ${slotLabel}`,
    `Besoin: ${formData.goal || "non renseigne"}`
  ].join("\n");
}
function HomePage({ bookingWhatsappUrl, content, quoteWhatsappUrl, resolveImage }) {
  const clarityBlocks = [
    {
      title: "Deleguer une tache",
      text: "Vous avez un document, un tableau, un CV ou une presentation a corriger ou finaliser."
    },
    {
      title: "Apprendre un outil",
      text: "Vous voulez comprendre Excel, Word, PowerPoint ou un outil IA avec une methode simple."
    },
    {
      title: "Reserver un accompagnement",
      text: "Vous avez besoin d'un devis rapide, d'un creneau de travail ou d'une formation personnalisee."
    }
  ];

  return (
    <main className="route-page">
      <section className="container hero">
        <div className="hero-grid hero-grid-wide">
          <div>
            <p className="eyebrow">{content.brand.promise}</p>
            <h1>{content.hero.headline}</h1>
            <p className="hero-copy">{content.hero.subheadline}</p>
            <div className="hero-actions">
              <Link to="/reservation" className="btn btn-primary">
                {content.hero.ctaPrimary}
              </Link>
              <a href={bookingWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
                {content.hero.ctaSecondary}
              </a>
            </div>
            <div className="hero-mini-grid">
              {content.hero.metrics.map((item) => (
                <article key={item.label} className="metric-card compact">
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="hero-media hero-media-tall">
            <img src={resolveImage(content.hero.imagePath)} alt={content.hero.imageAlt} loading="lazy" />
            <div className="hero-overlay-card">
              <strong>Devis et reservation</strong>
              <a href={quoteWhatsappUrl} className="link-button" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Comprendre en un regard</p>
          <h2>Trois facons simples de travailler avec Prometheus</h2>
        </div>
        <div className="home-clarity-grid">
          {clarityBlocks.map((block, index) => (
            <article key={block.title} className="clarity-card">
              <span className="clarity-index">0{index + 1}</span>
              <h3>{block.title}</h3>
              <p>{block.text}</p>
              <Link to="/reservation" className="link-button">
                Commencer
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Services</p>
          <h2>Ce que vous pouvez demander tout de suite</h2>
          <p className="hero-copy">
            L'offre couvre l'execution, la correction et la formation sur des besoins numeriques concrets.
          </p>
        </div>
        <div className="card-grid four">
          {content.serviceCategories.map((category) => (
            <article key={category.id} className="service-card">
              <div className="service-topline">{category.title}</div>
              <p className="service-summary">{category.summary}</p>
              <ul className="detail-list">
                {category.items.slice(0, 3).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link to="/services" className="link-button">
                Voir le detail
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Process</p>
          <h2>Comment demarrer sans perdre de temps</h2>
        </div>
        <div className="timeline process-grid">
          {content.workflow.map((step) => (
            <article key={step.step} className="timeline-item">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta-banner">
          <div>
            <p className="eyebrow">Confidentialite</p>
            <h2>{content.security.title}</h2>
            <p>{content.security.intro}</p>
          </div>
          <div className="cta-banner-actions">
            <Link to="/reservation" className="btn btn-primary">
              Envoyer un besoin
            </Link>
            <a href={quoteWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
              Devis sur WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Blog</p>
          <h2>Conseils pratiques avant de reserver</h2>
        </div>
        <div className="card-grid three">
          {content.blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <img src={resolveImage(post.imagePath)} alt={post.title} loading="lazy" />
              <div className="blog-card-body">
                <p className="blog-meta">
                  {post.category} - {post.readTime}
                </p>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <Link to="/blog" className="link-button">
                  Lire le blog
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section contact-section">
        <div className="section-heading">
          <p className="eyebrow">Retours</p>
          <h2>Des demandes bien cadrees et des livrables utiles</h2>
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
    </main>
  );
}

function ServicesPage({ content, quoteWhatsappUrl }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Services</p>
        <h1>Accompagnement informatique, documents, IA et productivite</h1>
        <p className="hero-copy">
          Ici, le coeur de l'offre est clair: resoudre une tache, remettre un support au propre, apprendre un outil, ou structurer un projet documentaire.
        </p>
      </section>

      <section className="container section">
        <div className="card-grid four">
          {content.serviceCategories.map((category) => (
            <article key={category.id} className="service-card service-card-accent">
              <div className="service-topline">{category.title}</div>
              <p className="service-summary">{category.summary}</p>
              <ul className="detail-list">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <p className="eyebrow">Outils IA</p>
          <h2>Les outils que Prometheus peut vous apprendre a utiliser utilement</h2>
        </div>
        <div className="card-grid three">
          {content.aiTools.map((tool) => (
            <article key={tool.name} className="tool-card">
              <h3>{tool.name}</h3>
              <p className="tool-role">{tool.role}</p>
              <p>{tool.usage}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section contact-section">
        <div className="split-grid">
          <article className="security-panel">
            <p className="eyebrow">Securite</p>
            <h2>{content.security.title}</h2>
            <p>{content.security.intro}</p>
            <ul className="detail-list">
              {content.security.commitments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="security-note">{content.security.note}</p>
          </article>

          <article className="vision-panel">
            <p className="eyebrow">Extension entreprise</p>
            <h2>{content.enterprise.title}</h2>
            <p>{content.enterprise.text}</p>
            <div className="vision-list">
              {content.enterprise.bullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>
            <a href={quoteWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
              Discuter d'un besoin equipe
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}

function BlogPage({ content, resolveImage }) {
  const [featuredPost, ...otherPosts] = content.blogPosts;

  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Blog</p>
        <h1>Articles pratiques pour mieux preparer vos demandes et vos outils</h1>
        <p className="hero-copy">
          Le blog explique comment cadrer un besoin, choisir un bon outil et corriger les erreurs les plus frequentes avant de lancer une mission ou une formation.
        </p>
      </section>

      {featuredPost ? (
        <section className="container section">
          <article className="blog-featured-panel">
            <img src={resolveImage(featuredPost.imagePath)} alt={featuredPost.title} loading="lazy" />
            <div>
              <p className="blog-meta">
                {featuredPost.category} - {featuredPost.readTime}
              </p>
              <h2>{featuredPost.title}</h2>
              <p>{featuredPost.intro}</p>
              <Link to="/reservation" className="btn btn-primary">
                Transformer ce besoin en demande concrete
              </Link>
            </div>
          </article>
        </section>
      ) : null}

      <section className="container section contact-section">
        <div className="blog-article-stack">
          {[featuredPost, ...otherPosts].filter(Boolean).map((post) => (
            <article key={post.id} className="blog-article-card">
              <div className="blog-article-head">
                <img src={resolveImage(post.imagePath)} alt={post.title} loading="lazy" />
                <div>
                  <p className="blog-meta">
                    {post.category} - {post.readTime}
                  </p>
                  <h2>{post.title}</h2>
                  <p>{post.intro}</p>
                </div>
              </div>

              <div className="blog-section-grid">
                {post.sections.map((section) => (
                  <article key={section.title} className="blog-section-card">
                    <h3>{section.title}</h3>
                    <p>{section.body}</p>
                  </article>
                ))}
              </div>

              <div className="blog-takeaway">
                <strong>A retenir</strong>
                <p>{post.takeaway}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function LessonCard({ lesson, onUnlock }) {
  if (lesson.locked) {
    return (
      <article className="lesson-card locked">
        <div className="lesson-lock">Cadenas</div>
        <strong>{lesson.title}</strong>
        <p>{lesson.summary}</p>
        <div className="lesson-meta">
          <span>{lesson.type}</span>
          <span>{lesson.duration}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={onUnlock}>
          Debloquer ce module
        </button>
      </article>
    );
  }

  return (
    <article className="lesson-card">
      <div className="lesson-meta">
        <span>{lesson.type}</span>
        <span>{lesson.duration}</span>
      </div>
      <strong>{lesson.title}</strong>
      <p>{lesson.summary}</p>
      {lesson.type === "Video" ? (
        <div className="video-placeholder">
          <span>Video preview</span>
          <strong>Capsule accessible dans l'apercu gratuit</strong>
        </div>
      ) : null}
    </article>
  );
}

function TrainingsPage({ content, onUnlockLesson, resolveImage }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Formations</p>
        <h1>Formations personnalisees avec apercu gratuit et contenus premium</h1>
        <p className="hero-copy">
          Chaque parcours montre une partie du contenu en libre consultation. Les exercices corriges, capsules complementaires et retours personnalises se debloquent ensuite.
        </p>
      </section>

      <section className="container section contact-section">
        <div className="module-stack">
          {content.trainingModules.map((module) => (
            <article key={module.id} className="training-module-card">
              <div className="training-module-header">
                <img src={resolveImage(module.imagePath)} alt={module.title} loading="lazy" />
                <div>
                  <p className="eyebrow">{module.format}</p>
                  <h2>{module.title}</h2>
                  <p className="training-meta">
                    {module.level} - {module.duration} - {module.price}
                  </p>
                  <p className="service-summary">{module.summary}</p>
                  <ul className="detail-list">
                    {module.outcomes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link to="/reservation" className="btn btn-outline">
                    Reserver une formation sur ce module
                  </Link>
                </div>
              </div>

              <div className="lesson-grid">
                {module.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onUnlock={() => onUnlockLesson({ module, lesson })}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PricingPage({ bookingWhatsappUrl, content, quoteWhatsappUrl }) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Tarifs</p>
        <h1>Des formules lisibles selon le type d'aide attendu</h1>
        <p className="hero-copy">
          Diagnostic, mission ciblee ou formation personnalisee: le site clarifie ce que vous achetez et comment la suite se passe.
        </p>
      </section>

      <section className="container section">
        <div className="card-grid three">
          {content.pricing.map((plan) => (
            <article key={plan.id} className={`pricing-card ${plan.highlight ? "featured" : ""}`}>
              {plan.highlight ? <span className="badge">Le plus direct</span> : null}
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
              <Link to="/reservation" className={plan.highlight ? "btn btn-primary" : "btn btn-outline"}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container section contact-section">
        <div className="split-grid split-grid-tight">
          <article className="whatsapp-panel">
            <p className="eyebrow">Devis</p>
            <h2>Besoin d'une estimation avant de lancer la mission</h2>
            <p>Le devis sert a cadrer l'objectif, le livrable, le delai et le bon format d'accompagnement.</p>
            <a href={quoteWhatsappUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
              Demander un devis sur WhatsApp
            </a>
          </article>
          <article className="whatsapp-panel secondary">
            <p className="eyebrow">Reservation</p>
            <h2>Besoin d'un creneau de travail ou de formation</h2>
            <p>Choisissez un moment, puis finalisez les details pratiques et le paiement sur WhatsApp.</p>
            <a href={bookingWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
              Reserver un creneau sur WhatsApp
            </a>
          </article>
        </div>
      </section>
    </main>
  );
}
function ReservationPage({
  apiAvailable,
  content,
  feedback,
  formData,
  handleSubmit,
  nextWhatsappUrl,
  sending,
  setFormData
}) {
  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Reservation et devis</p>
        <h1>Expliquez le besoin, puis poursuivez sur WhatsApp</h1>
        <p className="hero-copy">
          Le formulaire sert a cadrer proprement la demande. Ensuite, Prometheus vous redirige vers WhatsApp pour finaliser les details et le paiement si necessaire.
        </p>
      </section>

      <section className="container section contact-section">
        <div className="split-grid reservation-layout">
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
              placeholder="vous@exemple.com"
              required
            />

            <label htmlFor="whatsapp">Numero WhatsApp ou telephone</label>
            <input
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={(event) => setFormData((prev) => ({ ...prev, whatsapp: event.target.value }))}
              placeholder="Ex: +33 ..."
            />

            <label htmlFor="requestType">Type de demande</label>
            <select
              id="requestType"
              name="requestType"
              value={formData.requestType}
              onChange={(event) => setFormData((prev) => ({ ...prev, requestType: event.target.value }))}
            >
              {content.reservation.requestTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="service">Service concerne</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={(event) => setFormData((prev) => ({ ...prev, service: event.target.value }))}
            >
              {content.reservation.services.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="preferredSlot">Disponibilite</label>
            <select
              id="preferredSlot"
              name="preferredSlot"
              value={formData.preferredSlot}
              onChange={(event) => setFormData((prev) => ({ ...prev, preferredSlot: event.target.value }))}
            >
              {content.reservation.slots.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="goal">Votre besoin</label>
            <textarea
              id="goal"
              name="goal"
              rows={6}
              value={formData.goal}
              onChange={(event) => setFormData((prev) => ({ ...prev, goal: event.target.value }))}
              placeholder="Ex: corriger un memoire, refaire un CV, resoudre un tableau Excel, comprendre ChatGPT..."
              required
            />

            <button type="submit" className="btn btn-primary" disabled={sending}>
              {sending ? "Envoi en cours..." : "Envoyer ma demande"}
            </button>

            {feedback ? <p className="feedback">{feedback}</p> : null}

            {nextWhatsappUrl ? (
              <a href={nextWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
                Ouvrir WhatsApp
              </a>
            ) : null}
          </form>

          <div className="reservation-side">
            <article className="glass-card">
              <p className="eyebrow">Checklist</p>
              <h2>Ce qu'il faut preciser pour aller vite</h2>
              <ul className="detail-list">
                {content.reservation.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="security-panel compact-panel">
              <p className="eyebrow">Protection</p>
              <h2>{content.security.title}</h2>
              <ul className="detail-list">
                {content.security.commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="security-note">{content.security.note}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminPage({
  adminFeedback,
  adminLoading,
  adminMode,
  adminPassword,
  adminSaving,
  content,
  handleAdminFieldChange,
  handleAdminLogin,
  handleAdminSave,
  handleAdminLogout,
  isAdmin,
  isRemoteAdminAvailable,
  setAdminPassword
}) {
  const [draft, setDraft] = useState(() => createAdminDraft(content));

  useEffect(() => {
    setDraft(createAdminDraft(content));
  }, [content]);

  function updateHeroImage(value) {
    setDraft((prev) => ({ ...prev, heroImagePath: value }));
  }

  function updateModuleImage(moduleId, value) {
    setDraft((prev) => ({
      ...prev,
      moduleImages: {
        ...prev.moduleImages,
        [moduleId]: value
      }
    }));
  }

  function submitSave(event) {
    event.preventDefault();
    handleAdminFieldChange(draft);
    handleAdminSave(draft);
  }

  return (
    <main className="route-page">
      <section className="container hero page-intro">
        <p className="eyebrow">Connexion</p>
        <h1>Espace administrateur pour gerer les visuels des formations</h1>
        <p className="hero-copy">
          Cette zone permet de piloter l'image principale du site et les visuels des formations depuis une interface reservee a l'administration.
        </p>
      </section>

      <section className="container section contact-section">
        {!isAdmin ? (
          <div className="admin-card">
            <p className="eyebrow">Authentification</p>
            <h2>{isRemoteAdminAvailable ? "Connexion administrateur" : "Acces de configuration"}</h2>
            <p>
              {isRemoteAdminAvailable
                ? "Entrez vos informations d'administration pour gerer les visuels du site."
                : "Cette interface permet de preparer ou mettre a jour les visuels du site sur cet environnement."}
            </p>
            <form className="contact-form admin-login-form" onSubmit={handleAdminLogin}>
              <label htmlFor="adminPassword">Mot de passe admin</label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
                placeholder="Mot de passe admin"
                required
              />
              <button type="submit" className="btn btn-primary" disabled={adminLoading}>
                {adminLoading ? "Connexion..." : "Se connecter"}
              </button>
              {adminFeedback ? <p className="feedback">{adminFeedback}</p> : null}
            </form>
          </div>
        ) : (
          <div className="admin-stack">
            <div className="admin-card admin-card-toolbar">
              <div>
                <p className="eyebrow">Session active</p>
                <h2>Mode {adminMode === "remote" ? "synchronise" : "edition"}</h2>
              </div>
              <button type="button" className="btn btn-outline" onClick={handleAdminLogout}>
                Se deconnecter
              </button>
            </div>

            <form className="admin-card admin-form" onSubmit={submitSave}>
              <label htmlFor="heroImagePath">Image hero</label>
              <input
                id="heroImagePath"
                value={draft.heroImagePath}
                onChange={(event) => updateHeroImage(event.target.value)}
                placeholder="/images/pexels-kampus-7551617.jpg"
              />

              <div className="admin-grid">
                {content.trainingModules.map((module) => (
                  <div key={module.id} className="admin-grid-item">
                    <label htmlFor={`module-${module.id}`}>{module.title}</label>
                    <input
                      id={`module-${module.id}`}
                      value={draft.moduleImages[module.id] || ""}
                      onChange={(event) => updateModuleImage(module.id, event.target.value)}
                      placeholder="/images/..."
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary" disabled={adminSaving}>
                {adminSaving ? "Enregistrement..." : "Enregistrer les visuels"}
              </button>
              {adminFeedback ? <p className="feedback">{adminFeedback}</p> : null}
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

function LockedLessonModal({ bookingWhatsappUrl, item, onClose }) {
  if (!item) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <p className="eyebrow">Contenu premium</p>
        <h2>{item.lesson.title}</h2>
        <p>{item.lesson.summary}</p>
        <div className="lesson-meta modal-meta">
          <span>{item.module.title}</span>
          <span>{item.lesson.duration}</span>
        </div>
        <p>
          Ce contenu complet est reserve aux personnes qui prennent la formation ou demandent l'acces payant. La suite se finalise sur WhatsApp.
        </p>
        <div className="hero-actions">
          <Link to="/reservation" className="btn btn-primary" onClick={onClose}>
            Demander l'acces
          </Link>
          <a href={bookingWhatsappUrl} className="btn btn-outline" target="_blank" rel="noreferrer">
            Poursuivre sur WhatsApp
          </a>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [nextWhatsappUrl, setNextWhatsappUrl] = useState("");
  const [apiAvailable, setApiAvailable] = useState(true);
  const [lockedItem, setLockedItem] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminFeedback, setAdminFeedback] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminSession, setAdminSession] = useState(() => readSessionJson(ADMIN_SESSION_KEY));
  const [adminMode, setAdminMode] = useState(() => readSessionJson(ADMIN_SESSION_KEY)?.mode || "");
  const isGithubPagesDemo =
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("github.io") &&
    !API_BASE;

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      const localOverrides = readStorageJson(CONTENT_OVERRIDES_KEY) || {};

      if (isGithubPagesDemo) {
        setApiAvailable(false);
        setContent(applyImageOverrides(fallbackContent, localOverrides));
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
          throw new Error("Impossible de charger les donnees du site.");
        }

        const data = await response.json();
        setContent(data);
        setApiAvailable(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          setApiAvailable(false);
          setContent(applyImageOverrides(fallbackContent, localOverrides));
          setError("");
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();

    return () => controller.abort();
  }, [isGithubPagesDemo]);

  const activeContent = content || fallbackContent;
  const bookingWhatsappUrl = useMemo(
    () => buildWhatsappUrl(activeContent, activeContent.brand.bookingMessage),
    [activeContent]
  );
  const quoteWhatsappUrl = useMemo(
    () => buildWhatsappUrl(activeContent, activeContent.brand.quoteMessage),
    [activeContent]
  );
  const isAdmin = Boolean(adminSession?.token || adminSession?.mode === "demo");
  const isRemoteAdminAvailable = apiAvailable && !isGithubPagesDemo;

  function resolveImage(path) {
    return resolveAssetPath(path);
  }

  function updateVisibleContentWithOverrides(overrides) {
    setContent((prev) => applyImageOverrides(prev || fallbackContent, overrides));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const whatsappMessage = buildReservationMessage(activeContent, formData);
    const whatsappUrl = buildWhatsappUrl(activeContent, whatsappMessage);

    if (!apiAvailable) {
      setFeedback("Votre demande est prete. Vous pouvez poursuivre sur WhatsApp.");
      setNextWhatsappUrl(whatsappUrl);
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
      setNextWhatsappUrl(result.whatsappUrl || whatsappUrl);
      setFormData(emptyForm);
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSending(false);
    }
  }

  async function handleAdminLogin(event) {
    event.preventDefault();
    setAdminFeedback("");

    if (!adminPassword.trim()) {
      setAdminFeedback("Mot de passe requis.");
      return;
    }

    if (!isRemoteAdminAvailable) {
      if (adminPassword.trim() !== DEMO_ADMIN_PASSWORD) {
        setAdminFeedback("Mot de passe de configuration invalide.");
        return;
      }

      const session = { token: "demo", mode: "demo" };
      setAdminSession(session);
      setAdminMode("demo");
      writeSessionJson(ADMIN_SESSION_KEY, session);
      setAdminPassword("");
      setAdminFeedback("Acces de configuration ouvert.");
      return;
    }

    try {
      setAdminLoading(true);
      const response = await fetch(getApiPath("/api/admin/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: adminPassword.trim() })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Connexion admin impossible.");
      }

      const session = {
        token: result.token,
        mode: "remote",
        expiresAt: result.expiresAt || ""
      };
      setAdminSession(session);
      setAdminMode("remote");
      writeSessionJson(ADMIN_SESSION_KEY, session);
      setAdminPassword("");
      setAdminFeedback("Connexion admin reussie.");
    } catch (error) {
      setAdminFeedback(error.message);
    } finally {
      setAdminLoading(false);
    }
  }

  function handleAdminFieldChange(_draft) {
    setAdminFeedback("");
  }

  async function handleAdminSave(draft) {
    const overrides = {
      heroImagePath: draft.heroImagePath,
      moduleImages: draft.moduleImages
    };

    try {
      setAdminSaving(true);
      if (adminMode === "remote" && adminSession?.token) {
        const response = await fetch(getApiPath("/api/admin/content"), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminSession.token}`
          },
          body: JSON.stringify(overrides)
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Enregistrement impossible.");
        }

        setContent(result.content);
        setAdminFeedback("Visuels enregistres sur le backend.");
        return;
      }

      writeStorageJson(CONTENT_OVERRIDES_KEY, overrides);
      updateVisibleContentWithOverrides(overrides);
      setAdminFeedback("Visuels mis a jour.");
    } catch (error) {
      setAdminFeedback(error.message);
    } finally {
      setAdminSaving(false);
    }
  }

  function handleAdminLogout() {
    setAdminSession(null);
    setAdminMode("");
    setAdminPassword("");
    setAdminFeedback("Session fermee.");
    removeStorageKey(ADMIN_SESSION_KEY, "session");
  }

  if (loading) {
    return (
      <main className="app-shell loading-state">
        <div className="loader" />
        <p>Chargement de Prometheus...</p>
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
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/formations">Formations</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/tarifs">Tarifs</NavLink>
          <NavLink to="/reservation">Reservation</NavLink>
          <NavLink to="/connexion">Connexion</NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              bookingWhatsappUrl={bookingWhatsappUrl}
              content={content}
              quoteWhatsappUrl={quoteWhatsappUrl}
              resolveImage={resolveImage}
            />
          }
        />
        <Route
          path="/services"
          element={<ServicesPage content={content} quoteWhatsappUrl={quoteWhatsappUrl} />}
        />
        <Route
          path="/formations"
          element={
            <TrainingsPage
              content={content}
              onUnlockLesson={setLockedItem}
              resolveImage={resolveImage}
            />
          }
        />
        <Route path="/blog" element={<BlogPage content={content} resolveImage={resolveImage} />} />
        <Route
          path="/tarifs"
          element={
            <PricingPage
              bookingWhatsappUrl={bookingWhatsappUrl}
              content={content}
              quoteWhatsappUrl={quoteWhatsappUrl}
            />
          }
        />
        <Route
          path="/reservation"
          element={
            <ReservationPage
              apiAvailable={apiAvailable}
              content={content}
              feedback={feedback}
              formData={formData}
              handleSubmit={handleSubmit}
              nextWhatsappUrl={nextWhatsappUrl}
              sending={sending}
              setFormData={setFormData}
            />
          }
        />
        <Route
          path="/connexion"
          element={
            <AdminPage
              adminFeedback={adminFeedback}
              adminLoading={adminLoading}
              adminMode={adminMode}
              adminPassword={adminPassword}
              adminSaving={adminSaving}
              content={content}
              handleAdminFieldChange={handleAdminFieldChange}
              handleAdminLogin={handleAdminLogin}
              handleAdminLogout={handleAdminLogout}
              handleAdminSave={handleAdminSave}
              isAdmin={isAdmin}
              isRemoteAdminAvailable={isRemoteAdminAvailable}
              setAdminPassword={setAdminPassword}
            />
          }
        />
        <Route path="/outils-ia" element={<Navigate to="/services" replace />} />
        <Route path="/offres" element={<Navigate to="/tarifs" replace />} />
        <Route path="/contact" element={<Navigate to="/reservation" replace />} />
        <Route path="/vision" element={<Navigate to="/services" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="container footer footer-extended">
        <div>
          <p className="footer-title">Prometheus</p>
          <p>{content.brand.description}</p>
        </div>
        <div className="footer-links">
          <Link to="/services">Services</Link>
          <Link to="/formations">Formations</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/reservation">Reservation</Link>
          <a href={quoteWhatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </footer>

      <LockedLessonModal bookingWhatsappUrl={bookingWhatsappUrl} item={lockedItem} onClose={() => setLockedItem(null)} />
      <SeniorChat apiAvailable={apiAvailable} resolveApiPath={getApiPath} />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}

export default App;

