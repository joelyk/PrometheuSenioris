# Prometheus

Plateforme web React + Express pour proposer des services informatiques, des formations personnalisees, un parcours de devis / reservation puis une reprise sur WhatsApp.

## Positionnement

Prometheus n'est plus reserve aux seniors.
Le site est maintenant pense pour:
- particuliers
- etudiants
- independants et TPE
- petites equipes

Le coeur de l'offre:
- aide sur Excel, Word, PowerPoint
- correction et structuration de documents, memoires, rapports
- creation ou refonte de CV
- accompagnement sur les outils IA et la productivite
- formations avec apercu gratuit et contenus premium verrouilles

## Stack

- Frontend: React + Vite + `react-router-dom`
- Backend: Node.js + Express
- Style: CSS custom + Poppins
- IA: OpenAI via backend uniquement
- Deploy frontend: GitHub Pages

## Parcours utilisateur

1. Le visiteur decouvre les services et les formations.
2. Il remplit un devis ou une reservation.
3. Le backend enregistre la demande.
4. Le site propose ensuite une continuation sur WhatsApp.
5. Les modules premium sont debloques apres validation / paiement hors site.

## Pages frontend

Routes principales en `HashRouter`:
- `/#/` Accueil
- `/#/services`
- `/#/formations`
- `/#/tarifs`
- `/#/reservation`
- `/#/connexion`

Redirections legacy encore supportees:
- `/#/outils-ia` -> `/#/services`
- `/#/offres` -> `/#/tarifs`
- `/#/contact` -> `/#/reservation`
- `/#/vision` -> `/#/services`

## Fonctionnalites implementees

### Frontend

- hero clarifie sur les services reels vendus
- navigation simplifiee
- page services orientee execution + IA + securite
- page formations avec contenu gratuit + modules verrouilles
- modal de debloquage premium
- page tarifs avec devis et reservation
- page reservation avec reprise WhatsApp
- espace connexion / admin pour modifier les visuels
- widget IA flottant `Tuteur Promethee`

### Backend

- `GET /api/content`
- `GET /api/pricing`
- `POST /api/contact`
- `GET /api/ai/capabilities`
- `POST /api/ai/tutor`
- `POST /api/ai/guide`
- `POST /api/ai/rewrite`
- `POST /api/ai/next-course`
- `POST /api/admin/login`
- `GET /api/admin/content`
- `PUT /api/admin/content`
- `GET /api/admin/leads`

Le backend gere aussi:
- `helmet`
- `compression`
- CORS allow-list
- rate limiting
- stockage optionnel des leads
- stockage optionnel des overrides d'images

## Installation locale

```bash
npm install
npm run dev
```

Applications:
- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`

## Build frontend

```bash
npm run build
```

## Variables d'environnement backend

Copier `backend/.env.example` vers `backend/.env`.

Variables principales:
- `PORT`
- `FRONTEND_ORIGINS`
- `TRUST_PROXY`
- `API_RATE_LIMIT`
- `AI_RATE_LIMIT`
- `CONTACT_RATE_LIMIT`
- `LEADS_PERSIST_PATH`
- `CONTENT_OVERRIDES_PATH`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_TTL_HOURS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Admin visuels

### Mode backend

Si `ADMIN_API_KEY` est configure:
- la page `/#/connexion` permet une connexion admin
- le frontend recoit une session signee
- les changements d'images peuvent etre sauvegardes via `PUT /api/admin/content`
- les leads peuvent etre consultes via `GET /api/admin/leads`

### Mode demo local

Si le backend admin n'est pas disponible:
- la page `/#/connexion` reste utilisable en demo locale
- mot de passe demo: `prometheus-demo`
- les changements sont stockes en `localStorage` seulement

## GitHub Pages

Le frontend statique est publie via `.github/workflows/deploy-pages.yml`.

Important:
- GitHub Pages n'heberge pas le backend
- pour activer les formulaires et l'IA en ligne, il faut deployer le backend ailleurs
- en production statique, configurer `VITE_API_URL` vers l'URL du backend

Exemple:
- `https://prometheus-api.onrender.com`

## Deploiement backend

Cibles simples:
- Render
- Railway
- Fly.io

A configurer au minimum:
- `FRONTEND_ORIGINS=https://joelyk.github.io`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `OPENAI_API_KEY`
- `TRUST_PROXY=1` si necessaire

## Images

- dossier public: `frontend/public/images`
- image hero par defaut: `frontend/public/images/pexels-fauxels-3184291.jpg`

## Notes de securite

Le site pose deja une base correcte:
- API keys jamais exposees dans React
- rate limiting
- CORS borne
- admin signe cote serveur

Mais pour une vraie mise en production sensible, l'etape suivante logique est:
- vraie base de donnees
- authentification robuste
- stockage chiffre ou securise des documents
- audit des journaux et du flux d'upload

## Verification effectuee

- `npm run build` OK
- `node --check backend/src/server.js` OK
