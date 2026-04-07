# New Project - Roadmap

> Last updated: 2026-04-07
> **VERSION ACTUELLE :** v1.2.9

---

## Phase 0 - Cadrage `TERMINE`
- [x] Definir la cible, la proposition de valeur et le mode de monetisation.
- [x] Fixer la stack et les contraintes critiques.

---

## Phase 1 - Build MVP `TERMINE`
- [x] Mettre en place le generateur Node.js.
- [x] Mettre en place le template Next.js SSG.
- [x] Valider le flux generation -> Markdown -> rendu article.

---

## Phase 2 - Lancement du site ndeg1 `TERMINE`
- [x] Generer le premier corpus.
- [x] Deployer sur Vercel.
- [x] Valider `lint` et `build`.

---

## Phase 3 - Durcissement contenu et operations `TERMINE`
- [x] Ajouter validation anti-IA et anti-hallucination.
- [x] Ajouter migration progressive et rollback.
- [x] Ajouter observabilite et dry-run sur corpus existant.

---

## Phase 4 - CRO et tracking `TERMINE`
- [x] Recentrer la home sur les pages money.
- [x] Ajouter CTA et blocs decisionnels dans les articles.
- [x] Brancher l'instrumentation GA4 et le dashboard local `/reporting`.
- [x] Valider le tracking en production.

---

## Phase 5 - Diversification du portefeuille `EN COURS`
- [x] Valider la strategie multi-sites.
- [x] Choisir la niche du site ndeg2 : `MaisonSansCorvee`.
- [x] Documenter la niche et preparer une config dediee non active.
- [ ] Definir le domaine ou sous-domaine du site ndeg2.
- [ ] Deriver une configuration de deploiement et de tracking propre au site ndeg2.
- [ ] Generer le premier batch de contenus du site ndeg2.
- [ ] Deployer le site ndeg2.

---

## Phase 5 bis - Hygiene de marque du site ndeg1 `TERMINE`
- [x] Renommer le projet Vercel du site bivouac en `guide-bivouac-survie`.
- [x] Basculer l'URL publique vers un alias sans `autoniche`.
  URL publique retenue : `https://guide-bivouac-survie.vercel.app`
- [x] Renommer le repo GitHub du site bivouac pour supprimer `autoniche`.
- [x] Migrer le site bivouac vers un projet Vercel propre sans heritage d'alias `autoniche`.
- [x] Supprimer le projet Vercel legacy et rendre l'URL publique propre accessible en `200`.
- [x] Supprimer les alias Vercel residuels en `-clean` du site bivouac.
- [x] Recreer le projet final `guide-bivouac-survie` avec ce nom des la creation pour eliminer durablement le retour automatique de `-clean`.
- [x] Synchroniser `main` avec la vraie version locale amelioree du site bivouac pour eviter tout retour arriere au prochain deploiement Git.
- [x] Supprimer les alias techniques `guide-bivouac-survie-autoniches-projects` et `guide-bivouac-survie-git-main-autoniches-projects`.

## Phase 6 - Acquisition `A VENIR`
- [ ] Soumettre les sites actifs a Google Search Console.
- [ ] Soumettre les sitemaps des sites actifs.
- [ ] Suivre les premiers clics et les pages qui emergent.
