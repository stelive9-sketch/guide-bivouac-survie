# Plan De Lecture GA4

Ce document traduit l'instrumentation du site en plan de lecture concret pour piloter les clics Amazon.

## Objectif

Le but n'est pas de suivre du trafic "pour faire joli". Le but est de repondre a trois questions :

1. Quelles pages envoient le plus de clics Amazon ?
2. Quels emplacements CTA convertissent le mieux ?
3. Quel maillage interne pousse vraiment les visiteurs vers les pages qui monetisent ?

## Ce Que Le Site Envoie

Le site emet actuellement trois familles d'evenements :

- `page_view`
- `affiliate_click`
- `guide_navigation_click`

Les principaux parametres envoyes sont :

- `article_slug`
- `article_title`
- `placement`
- `cta_label`
- `model_name`
- `decision_label`
- `source_slug`
- `target_slug`
- `priority_rank`
- `destination_host`
- `page_location`

## Setup GA4 Minimal

1. Renseigner `NEXT_PUBLIC_GA_MEASUREMENT_ID` sur l'hebergement.
2. Publier le site.
3. Dans GA4, aller dans `Admin > Events`.
4. Marquer `affiliate_click` comme `Key event`.
5. Dans `Admin > Custom definitions`, creer les dimensions custom ci-dessous.
6. Suivre ensuite `docs/ga4-production-checklist.md`.

Important :

- Les dimensions custom GA4 ne sont pas retroactives.
- Il faut les creer avant de vouloir exploiter les rapports.
- Le dashboard local `/reporting` reste utile comme controle rapide pendant ce delai.

## Dimensions Custom A Creer

Toutes les dimensions ci-dessous sont a creer en scope `Event`.

| Nom GA4 | Parametre |
|---|---|
| `Article Slug` | `article_slug` |
| `Article Title` | `article_title` |
| `Placement` | `placement` |
| `CTA Label` | `cta_label` |
| `Model Name` | `model_name` |
| `Decision Label` | `decision_label` |
| `Source Slug` | `source_slug` |
| `Target Slug` | `target_slug` |
| `Priority Rank` | `priority_rank` |
| `Destination Host` | `destination_host` |

Tu n'as pas besoin de creer `page_location` : GA4 le gere deja.

## Evenements Et Lecture Business

### `affiliate_click`

C'est l'evenement le plus important.

Lecture :

- Si `affiliate_click` monte, ton potentiel revenu monte.
- Si le volume est fort sur un slug, cette page merite plus de trafic interne.
- Si un `placement` domine, il faut reproduire sa logique ailleurs.

Placements actuellement suivis :

- `purchase_shortcut`
- `decision_card`
- `comparison_model`
- `article_body`

### `guide_navigation_click`

C'est ton indicateur de circulation interne vers les pages money.

Lecture :

- Si les visiteurs cliquent beaucoup depuis la home mais peu vers Amazon ensuite, le maillage est bon mais les pages d'arrivee vendent mal.
- Si les clics vers les guides viennent surtout d'articles, le site commence a construire une vraie boucle de monetisation.

Placements actuellement suivis :

- `home_above_fold_money`
- `home_quick_guides`
- `home_featured`
- `home_library`
- `article_money_route`

### `page_view`

A utiliser comme denominateur, pas comme objectif.

Lecture :

- Une page vue seule ne vaut rien.
- Une page avec moins de vues mais plus de `affiliate_click` peut etre meilleure commercialement qu'une page plus traffiquee.

## Les 5 Rapports A Lire Chaque Semaine

## 1. Top Pages Money

But : savoir quelles pages produisent le plus de clics Amazon.

Configuration :

- Rapport detaille ou exploration libre
- Filtre `event_name = affiliate_click`
- Dimension principale : `Article Slug`
- Dimension secondaire : `Placement`
- Metrique : `Event count`

Questions a poser :

- Quels slugs sortent dans le top 5 ?
- Est-ce que les 3 pages prioritaires sont bien presentes ?
- Y a-t-il une page "surprise" qui merite d'etre remontee sur la home ?

Action type :

- Si un slug convertit bien, lui envoyer plus de trafic interne.
- Si un slug attire du trafic mais clique peu, revoir son haut de page.

## 2. Top Emplacements CTA

But : savoir ou les visiteurs cliquent vraiment.

Configuration :

- Filtre `event_name = affiliate_click`
- Dimension : `Placement`
- Dimension secondaire : `CTA Label`
- Metrique : `Event count`

Lecture attendue :

- `purchase_shortcut` doit performer sur les pages avec un choix evident.
- `decision_card` doit rester fort sur les comparatifs denses.
- `article_body` qui ecrase tout peut vouloir dire que le contenu vend mieux que les blocs.

Action type :

- Si `purchase_shortcut` est faible, retravailler la promesse et le bouton.
- Si `comparison_model` est faible, simplifier la grille ou reduire le bruit.
- Si `article_body` domine largement, reutiliser les ancres qui marchent dans les CTA visuels.

## 3. Circulation Interne Vers Les Pages Rentables

But : verifier que la home et les articles poussent bien vers les bons guides.

Configuration :

- Filtre `event_name = guide_navigation_click`
- Dimension principale : `Target Slug`
- Dimension secondaire : `Placement`
- Metrique : `Event count`

Lecture attendue :

- Les slugs prioritaires doivent ressortir regulierement.
- `home_above_fold_money` et `home_quick_guides` doivent faire le gros du travail.
- `article_money_route` doit commencer a prendre du poids au fur et a mesure du maillage.

Action type :

- Si `home_library` surperforme `home_above_fold_money`, ta proposition au-dessus de la ligne de flottaison n'est pas assez nette.
- Si `article_money_route` est nul, le bloc de relance n'est pas assez convaincant.

## 4. CTR Article Vers Amazon

But : juger les pages sur leur rendement, pas seulement sur leur volume.

Configuration recommandee :

- Exploration libre
- Lignes : `Article Slug`
- Colonnes : `Event name`
- Metrique : `Event count`
- Garder uniquement `page_view` et `affiliate_click`

Lecture :

- Calcul manuel ou dans Looker Studio :
  `CTR Amazon article = affiliate_click / page_view`

Decision :

- Priorite 1 : pages avec fort CTR et faible trafic
  -> leur envoyer plus de liens internes
- Priorite 2 : pages avec fort trafic et faible CTR
  -> retravailler le haut de page et les CTA

## 5. Home Vers Pages Money

But : mesurer si la home pousse vers les bons comparatifs.

Configuration :

- Filtre `event_name = guide_navigation_click`
- Filtre secondaire `source_slug = home`
- Dimension : `Placement`
- Dimension secondaire : `Target Slug`
- Metrique : `Event count`

Lecture :

- `home_above_fold_money` doit etre tres visible.
- `home_quick_guides` doit confirmer l'intention.
- `home_featured` doit servir de renfort, pas de cache-misere.

## Les Seuils A Surveiller

Ce ne sont pas des "verites universelles", mais de bons signaux d'alerte :

- Si `home_above_fold_money` fait moins de clics que `home_library`, la home n'oriente pas assez.
- Si `purchase_shortcut` reste tres faible sur une page avec gagnant clair, le bloc d'achat rapide n'est pas credibile.
- Si un slug a beaucoup de `guide_navigation_click` comme cible mais peu de `affiliate_click`, la promesse de la page n'aboutit pas.
- Si `article_body` concentre l'essentiel des clics, tester une reduction du nombre de cartes au-dessus.

## Le Rituel Hebdo

Chaque semaine :

1. Ouvrir le rapport `Top Pages Money`.
2. Sortir les 5 slugs avec le plus de `affiliate_click`.
3. Ouvrir `Top Emplacements CTA`.
4. Comparer `purchase_shortcut`, `decision_card`, `comparison_model`, `article_body`.
5. Ouvrir `Circulation Interne`.
6. Verifier si les 3 slugs prioritaires gagnent bien du trafic.
7. Decider un seul chantier pour la semaine :
   - home
   - haut d'article
   - maillage interne
   - wording des CTA

## Lecture Prioritaire Pour Ce Projet

Vu la strategie actuelle du site, l'ordre de lecture recommande est :

1. `affiliate_click` par `article_slug`
2. `affiliate_click` par `placement`
3. `guide_navigation_click` par `target_slug`
4. `guide_navigation_click` par `placement`
5. `CTR Amazon article`

## Quand Passer A Looker Studio

GA4 suffit pour demarrer. Passe a Looker Studio si tu veux :

- calculer automatiquement le CTR par slug
- comparer plusieurs semaines plus vite
- construire un top 10 des pages money
- isoler un dashboard "revenu potentiel affiliation"

Dans ce cas, garde exactement les memes dimensions.

## Complement Local

Le site embarque deja un dashboard de verification locale :

- Route : `/reporting`

Utilise-le pour :

- tester les parcours a la main
- verifier qu'un nouvel emplacement CTA remonte bien des clics
- valider rapidement le tagging avant lecture dans GA4

## Suite Logique

Quand la lecture GA4 est en place, utilise aussi :

- `docs/cro-monthly-action-plan.md`

Ce document sert a transformer les chiffres du mois en decisions concretes sur :

- la home
- le haut des articles
- les CTA
- le maillage interne
