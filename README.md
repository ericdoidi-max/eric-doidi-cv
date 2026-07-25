<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0fd9132f-79bb-4941-93e9-aa3c9b48867c

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Module "FC Chien" (fréquence cardiaque estimée à partir de la respiration)

Ce module (onglet "FC CHIEN" du dashboard) estime la fréquence cardiaque d'un chien à partir de sa fréquence
respiratoire (ratio FC:FR ajustable selon le gabarit), avec un historique des relevés affiché sous forme de courbe.
C'est une estimation indicative, pas un dispositif médical.

Un Google Sheet "Suivi Fréquence Cardiaque - Chien" a été créé dans le Drive pour centraliser les relevés :
https://docs.google.com/spreadsheets/d/1PJdCWN0_MDNRWU_wPrpC7JFIYvTprh0NL6R8jj2ebes/edit

Pour connecter l'application à ce Google Sheet (synchronisation automatique à chaque enregistrement) :

1. Ouvrez le Google Sheet ci-dessus, puis **Extensions > Apps Script**.
2. Collez le contenu de [`docs/google-apps-script.gs`](docs/google-apps-script.gs) dans `Code.gs`, puis enregistrez.
3. **Déployer > Nouveau déploiement**, type "Application Web", exécuter en tant que "Moi", accès "Tout le monde".
4. Copiez l'URL du déploiement dans la variable `VITE_DOG_SHEET_WEBHOOK_URL` (`.env.local` en local, variables
   d'environnement Vercel en production).

Sans cette configuration, les relevés restent enregistrés localement dans le navigateur (localStorage) et la courbe
d'historique reste fonctionnelle.
