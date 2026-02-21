# Prometheus Senioris

Plateforme web React + backend Express pour faciliter l'apprentissage de l'informatique par les seniors.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Style: Poppins, palette bleu clair / blanc, design responsive
- Navigation: multi-pages React (Accueil, Formations, Outils IA, Offres, Vision, Contact)

## Lancement local

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:4000`

## Scripts

- `npm run dev`: lance frontend + backend
- `npm run build`: build du frontend
- `npm run start`: lance le backend

## Endpoints API

- `GET /api/health`
- `GET /api/content`
- `GET /api/pricing`
- `POST /api/contact`

## Image de presentation

- Dossier images frontend: `frontend/public/images`
- Image utilisee dans le hero: `frontend/public/images/pexels-fauxels-3184291.jpg`

## GitHub Pages

Oui, c'est possible de visualiser le site via GitHub Pages.

- Workflow configure: `.github/workflows/deploy-pages.yml`
- Le frontend React est deployee automatiquement sur `main`
- Le mode demo GitHub Pages utilise un contenu fallback si l'API backend n'est pas disponible

### Important

GitHub Pages heberge seulement du statique (frontend).  
Le backend Express (`/api`) doit etre deploye separement (ex: Render, Railway, Fly.io), puis renseigne via `VITE_API_URL`.
