# NEW PROJECT - PROJECT BIBLE

> **VERSION :** v1.2.9 (2026-04-07)
> **STATUS :** Produit actif en production. Phase de portefeuille multi-sites lancee.
> **STACK :** Next.js, React, Node.js, Markdown, OpenAI API, GA4, Vercel.
> **DEPLOY :** Vercel.
> **OBJECTIF :** Construire un portefeuille de sites de niche SEO orientes affiliation Amazon a partir d'un generateur mutualise.

---

## 1. Vision du projet

- **Probleme adresse** : creer manuellement plusieurs sites de niche est trop lent pour un operateur solo.
- **Utilisateur cible** : le proprietaire du portefeuille, qui cherche un revenu d'affiliation scalable.
- **Proposition de valeur** : generer rapidement des sites de niche exploitables, rapides, instrumentes et orientes clic Amazon.
- **Resultat attendu** : un generateur reutilisable + un template front SSG + une methode de lancement et de pilotage CRO.

---

## 2. Perimetre

### In scope

- Generation de contenus SEO transactionnels en Markdown.
- Front statique Next.js avec templates home/article optimises pour le clic.
- Instrumentation analytics orientee business.
- Observabilite, validation, migration et rollback du corpus.
- Duplication du systeme sur de nouvelles niches avec configuration dediee.

### Out of scope

- E-commerce direct.
- Back-office graphique.
- Monnetisation hors affiliation sans decision explicite.

---

## 3. Architecture cible

| Domaine | Decision actuelle |
|---|---|
| Frontend | Next.js App Router, rendu statique |
| Backend | Scripts Node.js locaux |
| Stockage | Fichiers Markdown et JSON locaux |
| IA | OpenAI API pour generation et migration |
| Tracking | GA4 + dashboard local `/reporting` |
| Deploy | Vercel |

---

## 4. Donnees et integrations

- **Entites principales** : config de niche, articles, slugs, metadata SEO, events analytics.
- **Sources de donnees** : contenus generes via OpenAI, pages statiques locales.
- **Services externes** : OpenAI API, Vercel, Google Analytics 4, Amazon Partenaires.
- **Secrets / credentials** : `OPENAI_API_KEY`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, identifiants d'affiliation.

---

## 5. Contraintes

- **Business** : priorite a la monetisation affiliation et au ratio effort / potentiel.
- **Technique** : sites statiques, rapides, peu couteux, simples a redeployer.
- **Qualite** : contenu anti-blabla IA, comparatifs concrets, structure SEO stable.
- **Operations** : ne jamais casser le site en production en preparant un futur site.

---

## 6. Regles critiques

- Ne pas presenter une hypothese comme un fait.
- Toute nouvelle niche doit avoir sa propre configuration non active tant que son domaine et son deploiement ne sont pas fixes.
- Le site actif reste la reference de production jusqu'a lancement explicite d'un nouveau site.
- Toute modification structurelle doit etre refletee dans `ROADMAP.md`, `changelog.md` et ce document.

---

## 7. Etat actuel

- Le site ndeg1 bivouac est maintenant expose publiquement sur `guide-bivouac-survie.vercel.app`.
- Le projet Vercel actif du site ndeg1 est maintenant un projet propre `guide-bivouac-survie`, sans heritage d'un ancien projet `autoniche`.
- Le repo GitHub du site ndeg1 a ete renomme en `guide-bivouac-survie`.
- L'ancienne URL `autoniche-lovat.vercel.app` n'est plus exploitable publiquement et repond en `404`.
- Le projet Vercel legacy qui portait encore de vieilles metadonnees de marque a ete supprime.
- Les alias Vercel temporaires en `guide-bivouac-survie-clean*` ont ete supprimes et l'ancienne URL `guide-bivouac-survie-clean.vercel.app` repond maintenant en `404`.
- Les alias techniques `guide-bivouac-survie-autoniches-projects.vercel.app` et `guide-bivouac-survie-git-main-autoniches-projects.vercel.app` ont ete supprimes et repondent en `404`.
- Le generateur gere validation, migration, observabilite, rollback et dry-run.
- Le front integre CRO, CTA, maillage business et instrumentation GA4.
- Le tracking GA4 avec `G-35Y837QMT8` est actif en production.
- Le repo `main` est de nouveau aligne avec la version locale effectivement deployee du site bivouac.
- Le projet entre dans une logique de portefeuille multi-sites.

---

## 8. Decision portefeuille

- **Site ndeg1 actif** : niche survie / bivouac / plein air.
- **Site ndeg2 retenu** : `MaisonSansCorvee`.
- **Positionnement site ndeg2** : equipements qui font gagner du temps a la maison.
- **Etat site ndeg2** : blueprint et config d'exemple prepares, mais aucun domaine ni deploiement encore valides.

---

## 9. Definition of done actuelle

- Le site ndeg1 reste stable, traque et deployable.
- Chaque nouveau site a une config dediee, un plan editorial et un suivi distinct.
- Les futures decisions de niche sont documentees avant generation ou mise en ligne.
- Tout changement d'URL publique est confirme publiquement accessible avant mise a jour de `siteUrl` dans la config.
