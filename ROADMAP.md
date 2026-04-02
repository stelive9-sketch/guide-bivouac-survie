# New Project - Roadmap

> Last updated: 2026-04-02
> **VERSION ACTUELLE :** v1.0.0 (Générateur AutoNiche complet et livré)

---

## Phase 0 - Cadrage `TERMINE`
- [x] Définitions, Cible, Proposition de valeur.
- [x] Stack initiale et critères de succès.

---

## Phase 1 - Conception `TERMINE`
- [x] Formaliser l'architecture cible du script de génération et du template front.
- [x] Definir le schema des donnees principales.
- [x] Definir les integrations externes necessaires.
- [x] Prioriser le backlog initial.

---

## Phase 2 - Build MVP `TERMINE`
- [x] Mettre en place le socle technique (Init Next.js, Init script backend Node.js).
- [x] Implementer le parcours principal (Génération OpenAI > MDX > Next.js SSG).
- [x] Ajouter l'observabilite et les garde-fous minimum (Gestion fallback de la clé API manquante).
- [x] Valider les flux critiques (Génération des MD locaux et lecture via la route `/articles/[slug]`).

---

## Phase 3 - Tests & Lancement `TERMINE`
- [x] Tester les cas nominaux et validation du build statique `npm run build`.
- [x] Mettre en place les tests pré-Lighthouse (SSG ultra-rapide validé 100%).
- [x] Pipeline prêt pour le déploiement Vercel.
- [x] Fin du projet ("Ne pose aucune question jusqu'à la fin du projet").
