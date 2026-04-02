# AutoNiche - AI Affiliate SEO Generator

AutoNiche est un outil de génération de sites de niche automatisés pour l'affiliation. Il combine un script Node.js générant le contenu via l'API OpenAI et un front-end statique Next.js pour un rendu ultra-performant.

## Architecture

- **/generator** : Script Node.js qui orchestre les requêtes OpenAI, construit les cocons sémantiques et exporte les articles au format Markdown (Frontmatter).
- **/web** : Frontend Next.js (App Router, SSG) qui ingère les fichiers Markdown locaux et génère un site statique SEO-ready.

## Comment utiliser le projet

### 1. Configuration (Générateur)
1. Ouvrez le dossier `generator/`.
2. Éditez le fichier `.env` en y insérant votre clé API : `OPENAI_API_KEY="sk-..."`
3. Éditez le fichier `config.json` pour cibler votre niche :
   - `niche` : Le marché global (ex: "Bivouac").
   - `keywords` : Mots-clés principaux pour le SEO.
   - `affiliateId` : Votre tag partenaire (ex: Amazon `mon-tag-21`).
   - `articleCount` : Le nombre d'articles à générer.

### 2. Génération du contenu
Toujours dans le dossier `generator/`, ouvrez un terminal et lancez le script :
```bash
npm install   # (Si ce n'est pas déjà fait)
node index.js
```
*Le script va générer les fichiers `.md` directement dans le dossier `web/content/articles/`.*

### 3. Lancement du site (Web)
1. Ouvrez le dossier `web/`.
2. Lancez le serveur local pour tester :
```bash
npm run dev
```
3. Visitez `http://localhost:3000` pour naviguer sur votre site.
4. Pour déployer le site en production, utilisez :
```bash
npm run build
```
*(Vous pouvez lier le dossier `/web` directement sur une plateforme gratuite comme Vercel qui exécutera le build de manière transparente).*
