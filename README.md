# Eric Doidi — System Interface (CV Interactif)

Application React + Vite avec assistant IA Gemini.

---

## Déploiement Vercel

### 1. Pré-requis
- Compte Vercel connecté au dépôt Git
- Clé API Gemini : https://aistudio.google.com/apikey

### 2. Configuration dans Vercel
Dans **Settings → Environment Variables**, ajouter :

| Nom               | Valeur                  | Environnement                       |
|-------------------|-------------------------|-------------------------------------|
| `GEMINI_API_KEY`  | *(votre clé Gemini)*    | Production, Preview, Development    |

### 3. Déploiement
Vercel détecte automatiquement Vite et utilise :
- `buildCommand` : `vite build`
- `outputDirectory` : `dist`
- Les fonctions dans `/api/*` sont déployées en serverless

Aucune configuration manuelle nécessaire au-delà des variables d'environnement.

---

## Développement local

```bash
npm install
echo "GEMINI_API_KEY=votre_cle" > .env.local
npm run dev
```

Ouvrir http://localhost:3000

Pour tester `/api/gemini/generate` en local, utiliser Vercel CLI :

```bash
npm i -g vercel
vercel dev
```

---

## Structure

```
.
├── api/
│   └── gemini/
│       └── generate.ts      # Serverless function Vercel
├── components/              # Composants React
├── services/                # Client API (fetch /api/gemini/generate)
├── App.tsx                  # Composant racine
├── index.html               # Entrée HTML + Tailwind CDN
├── index.tsx                # Bootstrap React
├── vercel.json              # Config Vercel (rewrites SPA)
└── vite.config.ts           # Config Vite
```
