# Prometheus

Plateforme web React + Express pour proposer des services informatiques, des formations personnalisees, un parcours de devis / reservation et un contact par formulaire ou telephone.

## Positionnement

Le site est pense pour:
- particuliers
- etudiants
- independants et TPE
- petites equipes

Le coeur de l'offre:
- aide sur Excel, Word, PowerPoint
- correction et structuration de documents, memoires, rapports
- creation ou refonte de CV
- accompagnement sur les outils IA, Canva et la productivite
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
4. Le site confirme la demande et permet un suivi par email ou par telephone.
5. Les modules premium sont debloques apres validation / paiement hors site.

Contact direct:
- formulaire de demande sur `/#/reservation`
- telephone: `+33 7 58 93 35 65`
- horaires d'appel: `12h30-13h30` et `19h-20h`

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
- page reservation avec formulaire clair et contact telephone
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
- `NODE_ENV`
- `PORT`
- `FRONTEND_ORIGINS`
- `TRUST_PROXY`
- `REQUIRE_HTTPS`
- `JSON_BODY_LIMIT`
- `API_RATE_LIMIT`
- `AI_RATE_LIMIT`
- `CONTACT_RATE_LIMIT`
- `ADMIN_RATE_LIMIT`
- `ADMIN_LOGIN_RATE_LIMIT`
- `LEADS_PERSIST_PATH`
- `CONTENT_OVERRIDES_PATH`
- `ADMIN_API_KEY`
- `ADMIN_SESSION_SECRET`
- `ADMIN_SESSION_TTL_HOURS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Admin visuels

L'administration est volontairement fermee si le backend securise n'est pas disponible.

Si `ADMIN_API_KEY` et `ADMIN_SESSION_SECRET` sont configures:
- la page `/#/connexion` permet une connexion admin
- le frontend recoit une session signee cote serveur
- les changements d'images peuvent etre sauvegardes via `PUT /api/admin/content`
- les leads peuvent etre consultes via `GET /api/admin/leads`

Si le backend admin n'est pas disponible:
- la page `/#/connexion` affiche un etat indisponible
- aucun mode demo public n'est autorise
- aucune edition locale n'est simulee dans le navigateur

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
- `NODE_ENV=production`
- `FRONTEND_ORIGINS=https://joelyk.github.io`
- `REQUIRE_HTTPS=true` si l'infra ne force pas deja HTTPS
- `ADMIN_API_KEY` avec une valeur longue aleatoire
- `ADMIN_SESSION_SECRET` avec une valeur longue aleatoire differente
- `OPENAI_API_KEY`
- `TRUST_PROXY=1` si necessaire

## Images

- dossier public: `frontend/public/images`
- image hero par defaut: `frontend/public/images/pexels-kampus-7551617.jpg`

## Notes de securite

Mesures deja en place:
- API keys jamais exposees dans React
- politique CSP et `referrer` restrictive sur le frontend statique
- `helmet` sur l'API avec HSTS en production
- suppression de `x-powered-by`
- CORS borne a une allow-list
- refus explicite des origines non autorisees
- limitation de debit generale, IA, contact, admin et login admin
- `Content-Type` JSON exige sur les routes d'ecriture
- validation stricte des emails, choix utilisateur et longueurs de champs
- pas de renvoi inutile des donnees sensibles du lead apres soumission
- sessions admin signees avec HMAC et comparaison temporelle sure
- secret de session admin exige et distinct de la cle admin
- cache des routes API sensibles desactive (`no-store`)
- mode admin demo retire du frontend public

Pour une mise en production encore plus sensible:
- base de donnees geree avec chiffrement au repos
- vrai fournisseur d'authentification admin
- journalisation centralisee et alerte sur les erreurs / abus
- sauvegarde securisee des leads et rotation des secrets
- stockage de documents avec antivirus et controle de type MIME

## Verification effectuee

- `npm run build` OK
- `node --check backend/src/server.js` OK
