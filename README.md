# Prometheus Senioris

Plateforme web pour faciliter l'apprentissage des outils informatiques (Excel, Word, PowerPoint, IA) par les seniors.

## Demo (GitHub Pages)

- Le frontend est visible sur GitHub Pages (statique).
- Les routes sont en `/#/` (HashRouter). Exemples:
  - `/#/` (Accueil)
  - `/#/formations`
  - `/#/outils-ia`
  - `/#/offres`
  - `/#/vision`
  - `/#/contact`

Important: GitHub Pages ne peut pas heberger le backend. Pour activer les APIs (contact + IA) en ligne, il faut deployer le backend separément et configurer `VITE_API_URL`.

## Fonctionnalites

- Frontend multi-pages (UX senior-first): Accueil, Formations, Outils IA, Offres, Vision SaaS, Contact
- Tuteur IA (widget flottant) "Tuteur Prométhée" avec modes:
  - `Tutorat`
  - `Guide 3 etapes`
  - `Reecrire email`
  - `Prochain cours`
- API REST backend: contenu du site, contact leads, IA
- Persistance optionnelle des leads (fichier JSON)
- Endpoint admin optionnel pour lire les leads
- Securite backend: `helmet`, compression, CORS allow-list, rate limiting

## Stack

- Frontend: React + Vite + `react-router-dom`
- Backend: Node.js + Express
- Style: CSS (Poppins, theme bleu clair / blanc)
- IA: OpenAI via le backend (cle API jamais dans React)

## Structure du projet

- `frontend/`: application React (pages + styles + widget IA)
- `backend/`: API Express (contenu, contact, IA)
- `.github/workflows/deploy-pages.yml`: deploiement automatique du frontend sur GitHub Pages

## Prerequis

- Node.js 20+ recommande (meme version que GitHub Actions)
- npm

## Installation et lancement (local)

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`

Astuce: le frontend en dev appelle `/api/...` et Vite proxy vers le backend.

### Lancer frontend et backend separément (optionnel)

```bash
# terminal 1
npm run dev --workspace backend

# terminal 2
npm run dev --workspace frontend
```

## Configuration backend

Copiez `backend/.env.example` vers `backend/.env` et adaptez.

### Variables d'environnement (backend)

- `PORT`: port du backend (defaut `4000`)
- `FRONTEND_ORIGINS`: liste d'origines CORS separees par des virgules (ex: local + GitHub Pages)
- `TRUST_PROXY`: a activer si vous etes derriere un proxy (ex: Render). Exemple: `1`
- `API_RATE_LIMIT`: limite globale `/api` (par minute)
- `AI_RATE_LIMIT`: limite `/api/ai` (par 10 minutes)
- `CONTACT_RATE_LIMIT`: limite `/api/contact` (par heure)
- `LEADS_PERSIST_PATH`: chemin d'un fichier JSON pour sauvegarder les demandes contact (optionnel)
- `ADMIN_API_KEY`: active `GET /api/admin/leads` (optionnel)

### IA (OpenAI)

- `OPENAI_API_KEY`: cle API OpenAI (obligatoire pour activer l'IA)
- `OPENAI_MODEL`: modele (defaut: `gpt-4o-mini`)

Important: le frontend n'appelle jamais OpenAI directement. Il appelle uniquement le backend.

## Configuration frontend

### Variable d'environnement (frontend)

- `VITE_API_URL` (optionnel):
  - en local: inutile (Vite proxy suffit)
  - en production (GitHub Pages): doit pointer vers votre backend (ex: `https://prometheus-api.onrender.com`)

## Endpoints API

- `GET /api/health`
- `GET /api/content`
- `GET /api/pricing`
- `GET /api/ai/capabilities`
- `POST /api/contact`
- `POST /api/ai/tutor`
- `POST /api/ai/guide`
- `POST /api/ai/rewrite`
- `POST /api/ai/next-course`

### Admin (optionnel)

- `GET /api/admin/leads` (header requis: `x-admin-key: <ADMIN_API_KEY>`)
  - Si `ADMIN_API_KEY` n'est pas defini, l'endpoint renvoie `404`.

## Image de presentation

- Dossier images: `frontend/public/images`
- Hero image: `frontend/public/images/pexels-fauxels-3184291.jpg`

## Deploiement GitHub Pages (frontend)

Le workflow `.github/workflows/deploy-pages.yml` build et publie `frontend/dist` sur GitHub Pages.

Pour connecter le frontend a un backend en ligne:

1. GitHub -> Repo -> `Settings` -> `Secrets and variables` -> `Actions`
2. Onglet `Variables` -> `New repository variable`
3. Nom: `VITE_API_URL`
4. Valeur: l'URL de votre backend (ex: `https://prometheus-api.onrender.com`)
5. Faites un commit/push (ou relancez le workflow) pour redeployer le frontend.

## Deploiement backend (piste simple)

Hebergez `backend/` sur Render / Railway / Fly.io.

Points importants:

- Configurez `FRONTEND_ORIGINS` pour inclure:
  - `https://joelyk.github.io` (ou votre domaine)
- Configurez `OPENAI_API_KEY` pour activer l'IA
- Si vous etes derriere un proxy (souvent le cas), mettez `TRUST_PROXY=1`

## Depannage rapide

- GitHub Pages affiche le README au lieu du site:
  - `Settings` -> `Pages` -> `Source: GitHub Actions`
- L'image ne s'affiche pas sur Pages:
  - verifier que l'image est dans `frontend/public/images`
- Erreur CORS:
  - ajouter l'origine dans `FRONTEND_ORIGINS`
- IA renvoie `503`:
  - `OPENAI_API_KEY` manquant sur le backend
- Trop de requetes:
  - ajuster `API_RATE_LIMIT`, `AI_RATE_LIMIT`, `CONTACT_RATE_LIMIT`
