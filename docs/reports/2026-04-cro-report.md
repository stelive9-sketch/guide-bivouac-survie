# Revue CRO Mensuelle

## Periode

- Mois : 2026-04
- Date de revue : 2026-04-03
- Personne responsable : Steph

## Resume Executif

- Ce mois-ci a surtout servi a construire la machine de conversion et de mesure, pas encore a lire une serie de donnees stable.
- Le site a maintenant `29` articles publies, une home plus orientee pages money, des CTA Amazon visibles et une instrumentation exploitable.
- Les 3 slugs les plus importants a pousser sont la tente trekking 2 places, le sac de couchage grand froid et le guide des filtres a eau.
- Le principal bloc CTA a surveiller en premier est `purchase_shortcut`, parce que c'est le raccourci le plus direct vers le clic Amazon.
- Le chantier prioritaire du mois suivant est de brancher GA4 en production et de laisser courir assez de trafic pour sortir un vrai classement de performance.

## KPIs Du Mois

| KPI | Valeur | Variation vs mois precedent | Commentaire |
|---|---:|---:|---|
| Affiliate Clicks | N/A | N/A | Instrumentation en place, collecte GA4 pas encore confirmee en production. |
| Page Views | N/A | N/A | A lire quand `NEXT_PUBLIC_GA_MEASUREMENT_ID` sera branche. |
| Amazon CTR | N/A | N/A | Pas de base de comparaison exploitable a ce stade. |
| Guide Navigation Clicks | N/A | N/A | Le tracking est en place, lecture reelle a venir. |
| Top Placement Share | N/A | N/A | A calculer apres les premiers jours de trafic reel. |

## Top 10 Slugs Par Clic Amazon

Baseline sans donnees GA4 consolidees. Ordre theorique base sur la priorite business actuelle.

| Rang | Slug | Affiliate Clicks | Page Views | Amazon CTR | Commentaire |
|---:|---|---:|---:|---:|---|
| 1 | tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie | N/A | N/A | N/A | Page money prioritaire la plus exposee. |
| 2 | top-10-des-meilleurs-sacs-de-couchage-grand-froid-pour-bivouac-hivernal-a-decouvrir-absolument | N/A | N/A | N/A | Sujet tres transactionnel et gros potentiel panier. |
| 3 | guide-dachat-complet-des-filtres-a-eau-ultra-legers-avec-gourde-integree-pour-la-randonnee | N/A | N/A | N/A | Forte promesse utilitaire et univers facile a comparer. |
| 4 | rechaud-a-gaz-ultra-leger-et-compact-pour-bivouac-comparaison-des-modeles-performants | N/A | N/A | N/A | Bon candidat a surveiller des que GA4 tourne. |
| 5 | chaussures-de-randonnee-montantes-gore-tex-pour-trek-notre-top-5-des-modeles-durables | N/A | N/A | N/A | Intention d'achat forte, panier plus eleve. |
| 6 | sac-a-dos-de-randonnee-50-litres-avec-systeme-dhydratation-integre-top-modeles-a-connaitre | N/A | N/A | N/A | Page a fort potentiel maillage. |
| 7 | les-meilleures-lampes-frontales-rechargeables-pour-le-trail-en-montagne-notre-top-5 | N/A | N/A | N/A | Produit facile a comparer et a cliquer vite. |
| 8 | gourde-filtrante-purifiante-pour-randonnee-nature-laquelle-choisir-pour-une-eau-toujours-saine | N/A | N/A | N/A | Bon angle produit, a suivre. |
| 9 | tapis-isolant-gonflable-pour-neige-hiver-comment-choisir-le-meilleur-pour-votre-bivouac | N/A | N/A | N/A | Deja migree proprement, potentiel a verifier. |
| 10 | hachette-de-camp-compacte-pour-coupe-bois-bushcraft-notre-guide-dachat-des-meilleures-marques | N/A | N/A | N/A | Peut surprendre si le traffic bushcraft suit. |

## Slugs A Pousser Le Mois Suivant

Critere :

- fort potentiel business
- deja exposes par la home et le maillage
- categories claires pour un premier apprentissage GA4

| Slug | Pourquoi le pousser | Action concrete |
|---|---|---|
| tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie | Intention d'achat forte et besoin simple a qualifier | Le garder top 1 sur la home et le lier depuis les pages bivouac/froid/pluie |
| top-10-des-meilleurs-sacs-de-couchage-grand-froid-pour-bivouac-hivernal-a-decouvrir-absolument | Univers panieres eleves et decision anxieuse | Le garder dans les choix rapides et le pousser depuis les pages montagne/froid |
| guide-dachat-complet-des-filtres-a-eau-ultra-legers-avec-gourde-integree-pour-la-randonnee | Sujet utile, clic facile, bonne promesse de comparatif | Le pousser depuis les pages survie/eau/randonnee |

## Slugs A Reparer

A ce stade, pas de donnees GA4 fiables pour designer des "pages a reparer" sur resultat observe.
La liste ci-dessous est donc une watchlist de surveillance et non un verdict.

| Slug | Probleme observe | Hypothese | Action concrete |
|---|---|---|---|
| rechaud-a-gaz-ultra-leger-et-compact-pour-bivouac-comparaison-des-modeles-performants | Potentiel fort mais pas encore mesure | Peut bien mailler mais convertir moins si le choix n'est pas assez tranche | Verifier en priorite `purchase_shortcut` et `decision_card` des que GA4 remonte |
| sac-a-dos-de-randonnee-50-litres-avec-systeme-dhydratation-integre-top-modeles-a-connaitre | Sujet large et risque de comparaison trop diffuse | Le visiteur peut hesiter plus longtemps avant le clic | Surveiller le poids de `comparison_model` vs `article_body` |
| chaussures-de-randonnee-montantes-gore-tex-pour-trek-notre-top-5-des-modeles-durables | Panier fort mais besoin tres personnel | Le CTR peut etre freine par trop d'hesitation ou une promesse trop generale | Renforcer le meilleur choix si le `purchase_shortcut` reste faible |

## Lecture Des Placements CTA

Lecture baseline theorique avant donnees reelles.

| Placement | Clicks | Part du total | Lecture | Decision |
|---|---:|---:|---|---|
| purchase_shortcut | N/A | N/A | Bloc le plus critique a mesurer en premier | En faire l'indicateur prioritaire des 3 slugs money |
| decision_card | N/A | N/A | Devrait bien fonctionner sur les comparatifs denses | Le conserver comme seconde porte d'entree |
| comparison_model | N/A | N/A | Utile si le visiteur veut comparer avant de cliquer | A simplifier si les clics restent faibles |
| article_body | N/A | N/A | Peut surprendre si le texte vend mieux que les blocs | Reutiliser ses ancres si ce placement domine |

## Lecture Du Maillage Interne

### Top cibles

Baseline theorique selon le maillage actuel.

| Target Slug | Guide Navigation Clicks | Lecture |
|---|---:|---|
| tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie | N/A | Doit ressortir vite dans les premiers jours de donnees. |
| top-10-des-meilleurs-sacs-de-couchage-grand-froid-pour-bivouac-hivernal-a-decouvrir-absolument | N/A | Cible prioritaire de la home et de l'univers froid. |
| guide-dachat-complet-des-filtres-a-eau-ultra-legers-avec-gourde-integree-pour-la-randonnee | N/A | Cible tres lisible pour tester la qualite du maillage. |

### Top sources

| Source Slug | Guide Navigation Clicks | Lecture |
|---|---:|---|
| home | N/A | La home doit rester la source dominante au debut. |
| articles divers | N/A | A observer une fois le bloc `article_money_route` alimente en trafic reel. |
| reporting non applicable | N/A | Le dashboard n'est pas une source business. |

### Placements de maillage

| Placement | Guide Navigation Clicks | Lecture | Decision |
|---|---:|---|---|
| home_above_fold_money | N/A | Devrait sortir premier si la promesse hero est bonne | Si faible, refaire la home |
| home_quick_guides | N/A | Devrait confirmer l'intention d'achat | Si faible, revoir l'ordre ou le wording |
| home_featured | N/A | Bloc de renfort, pas de pilotage principal | Le garder secondaire |
| home_library | N/A | Sert de fond de catalogue, pas de moteur principal | S'il domine, la home n'oriente pas assez |
| article_money_route | N/A | Signal cle pour la boucle de monetisation inter-articles | Priorite de mesure du mois suivant |

## Gagnants Du Mois

### 1. Pages cachees mais solides

- Slug : pas encore mesurable
- Pourquoi : pas de recul GA4 suffisant
- Action : attendre la premiere fenetre de donnees puis classer les slugs a fort CTR / faible trafic

### 2. Bloc CTA gagnant

- Placement : a mesurer, avec avantage theorique a `purchase_shortcut`
- Pourquoi : c'est la voie la plus courte vers le clic Amazon
- Comment le repliquer : si ce bloc gagne, renforcer sa logique sur les 3 pages money en premier

### 3. Source de trafic interne gagnante

- Source : home
- Pourquoi : c'est actuellement le point d'orchestration principal du site
- Action : mesurer si elle pousse bien vers les 3 slugs prioritaires

## Pertes Ou Signaux Faibles

### 1. Page qui gaspille du trafic

- Slug : non determine
- Signal : donnees insuffisantes
- Hypothese : a identifier via le duo `page_view` fort / `affiliate_click` faible
- Action : faire ce tri des que le premier mois complet remonte

### 2. Bloc CTA faible

- Placement : non determine
- Signal : donnees insuffisantes
- Hypothese : `comparison_model` peut devenir trop faible si trop de cartes se ressemblent
- Action : surveiller sa part des `affiliate_click`

### 3. Maillage faible

- Zone : `article_money_route`
- Signal : bloc recent, pas encore prouve
- Hypothese : la promesse peut etre trop generique si les cibles ne sont pas assez proches du sujet lu
- Action : verifier vite si ce placement envoie des clics reels

## Decision Du Mois Suivant

- Chantier choisi : mise en observation GA4 et lecture des premiers vrais signaux CRO
- Pourquoi celui-ci : le site est maintenant instrumente, mais aucune priorite business solide ne doit etre decidee sans les premiers retours reels
- Ce qu'on ne touche pas ce mois-ci : pas de grand remaniement home, pas de refonte massive article, pas de multiplication des tests en parallele

## Plan D'Execution

| Priorite | Action | Zone | Effort | Date cible |
|---:|---|---|---|---|
| 1 | Brancher `NEXT_PUBLIC_GA_MEASUREMENT_ID` en production | infra / analytics | faible | des que possible |
| 2 | Creer les dimensions custom GA4 listees dans `docs/ga4-reading-plan.md` | GA4 | faible | des que possible |
| 3 | Attendre une premiere fenetre de trafic exploitable puis sortir le vrai classement des slugs | reporting | moyen | fin avril 2026 |

## Hypotheses A Tester

| Hypothese | Signal attendu | Comment mesurer |
|---|---|---|
| Le `purchase_shortcut` sera le bloc CTA le plus efficace sur les 3 pages money | `affiliate_click` majoritairement sur `purchase_shortcut` | GA4 par `placement` |
| La home poussera d'abord vers les 3 slugs prioritaires | `guide_navigation_click` fort sur `home_above_fold_money` et `home_quick_guides` | GA4 par `placement` et `target_slug` |
| Le bloc `article_money_route` peut devenir une vraie boucle de monetisation | hausse de `guide_navigation_click` sur `article_money_route` | GA4 par `placement` |

## Resultat Attendu Le Mois Suivant

- Ce qui devrait monter : volume de donnees exploitables, trafic pousse vers les 3 slugs prioritaires, premiers clics Amazon qualifies
- Ce qui devrait se stabiliser : structure CRO du site, ordre des pages money et architecture de tracking
- Ce qui doit etre surveille de pres : poids reel de `purchase_shortcut`, qualite du maillage article -> article, emergence d'un slug surprise performant

## Notes

- Corpus courant : `29` articles publies
- Instrumentation locale disponible via `/reporting`
- Le mois suivant devra etre le premier vrai mois de lecture business, pas seulement de mise en place technique
