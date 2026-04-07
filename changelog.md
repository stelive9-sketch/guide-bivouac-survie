## v1.2.1 - [2026-04-07] "Renommage Vercel du site bivouac"
### Why (Pourquoi)
- **Image publique** : Le nom `autoniche` ne devait plus etre visible dans le projet cloud du site ndeg1.
- **Clarification** : Il fallait separer le nom technique interne du portefeuille et l'identite publique du site bivouac.
### How (Comment)
- **Vercel** : Renommage du projet `autoniche` en `guide-bivouac-survie`.
- **Alias** : Tentative de bascule vers de nouveaux alias `.vercel.app` sans `autoniche`, mais constat que ces nouveaux alias repondent en `401` sous la protection Vercel alors que `autoniche-lovat.vercel.app` reste la seule URL publique exploitable.
- **Documentation** : Synchronisation de la roadmap et du bible projet avec ce nouvel etat hybride.

## v1.2.0 - [2026-04-06] "Selection de la niche MaisonSansCorvee pour le site ndeg2"
### Why (Pourquoi)
- **Diversification** : Le projet entre dans une logique de portefeuille multi-sites pour multiplier les surfaces de capture SEO et les opportunites de clics Amazon.
- **Execution** : Il fallait figer une niche concrete avant de preparer un deuxieme site sans perturber la production actuelle.
### How (Comment)
- **Decision produit** : Validation de `MaisonSansCorvee` comme niche du site ndeg2, orientee equipements qui reduisent la corvee menagere.
- **Documentation** : Ajout d'un blueprint de niche dans `docs/niches/maison-sans-corvee.md`.
- **Configuration** : Ajout d'un fichier `generator/configs/maisonsanscorvee.example.json` pour preparer le futur site sans ecraser `generator/config.json`.

## v1.1.0 - [2026-04-02] "Scale de contenu, CRO et instrumentation du site ndeg1"
### Why (Pourquoi)
- **Croissance** : Il fallait transformer le MVP en site d'affiliation plus credible, plus cliquable et mesurable.
- **Operations** : Le generateur devait devenir fiable a grande echelle et exploitable en production.
### How (Comment)
- **Generation** : Passage a 29 articles valides avec validation anti-IA, migration progressive, rollback et observabilite.
- **Front** : Ajout de blocs decisionnels, CTA, maillage business, home conversion-first et dashboard `/reporting`.
- **Analytics** : Integration de GA4, documentation d'exploitation, smoke tests et verification en production.

## v1.0.0 - [2026-04-02] "Livraison du generateur AutoNiche"
### Why (Pourquoi)
- **Objectif Business** : Produire un premier actif SEO monnayable via l'affiliation Amazon.
- **Finalisation** : Il fallait disposer d'un pipeline complet generation -> rendu -> deploiement.
### How (Comment)
- **Architecture** : Mise en place d'un generateur Node.js et d'un front Next.js SSG.
- **Deploiement** : Publication du site sur Vercel avec corpus statique local.

## v0.1.0 - [2026-04-02] "Reset documentaire et cadrage"
### Why (Pourquoi)
- **Rupture de contexte** : Il fallait repartir d'une base propre pour le nouveau projet.
- **Pilotage** : Les documents de reference devaient etre reposes avant implementation.
### How (Comment)
- **Documentation** : Reinitialisation des regles, de la bible projet, de la roadmap et du changelog.
- **Strategie** : Choix d'un modele SEO programmatique oriente affiliation.
