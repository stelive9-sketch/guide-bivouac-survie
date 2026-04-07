# Plan D'Action CRO Mensuel

Ce document transforme les donnees GA4 et le dashboard local en decisions mensuelles concretes.

Il ne sert pas a "faire du reporting". Il sert a choisir quoi changer sur la home, les articles et les CTA pour augmenter les clics Amazon.

## Objectif Mensuel

A la fin de chaque mois, tu dois pouvoir repondre a ces 4 questions :

1. Quels slugs meritent plus de trafic interne ?
2. Quels slugs ont du trafic mais sous-performent commercialement ?
3. Quels emplacements CTA gagnent ou perdent ?
4. Quel chantier unique prioriser le mois suivant ?

## Les 4 KPIs Qui Comptent

Ne pilote pas le site avec 20 chiffres. Garde ces 4 indicateurs :

### 1. `Affiliate Clicks`

Definition :

- Nombre total de `affiliate_click`

Role :

- Mesure brute du potentiel de revenu

### 2. `Amazon CTR Par Slug`

Definition :

- `affiliate_click / page_view` sur un slug

Role :

- Mesure la capacite d'une page a transformer une visite en clic Amazon

### 3. `Guide Push Volume`

Definition :

- Nombre total de `guide_navigation_click`

Role :

- Mesure la capacite du site a pousser vers les bonnes pages money

### 4. `Top Placement Share`

Definition :

- Part du placement CTA dominant dans le total des `affiliate_click`

Role :

- Mesure si un emplacement fait la majorite du travail ou si la conversion est repartie

## Les 5 Segments A Sortir Chaque Mois

### Segment A. Les Gagnants A Nourrir

Critere :

- Fort `Amazon CTR Par Slug`
- Volume de pages vues encore moyen ou faible

Decision :

- Envoyer plus de trafic interne vers ces pages
- Les remonter sur la home
- Les lier depuis les autres pages du meme univers

### Segment B. Les Pages Qui Gaspillent Du Trafic

Critere :

- Fort volume de `page_view`
- CTR Amazon faible

Decision :

- Reprendre le haut d'article
- Revoir le `purchase_shortcut`
- Changer les labels CTA
- Repenser l'ordre des cartes decisionnelles

### Segment C. Les Pages Qui Ferment Mal Le Tunnel

Critere :

- Beaucoup de `guide_navigation_click` vers le slug
- Peu de `affiliate_click` une fois sur place

Decision :

- Le maillage fonctionne
- Le probleme est dans la page d'arrivee
- Priorite au contenu haut de page, au raccourci achat et au comparatif visible

### Segment D. Les Pages Cachees Mais Solides

Critere :

- Peu de trafic
- Bon CTR
- Bons clics sur `article_body` ou `purchase_shortcut`

Decision :

- Excellents candidats pour plus de liens internes
- A tester en `featured` ou `choix rapides`

### Segment E. Les Pages A Mettre En Pause

Critere :

- Peu de trafic
- Faible CTR
- Peu ou pas de clics sur tous les placements

Decision :

- Ne pas investir dessus tout de suite
- Les laisser vivre ou les reprendre plus tard si la thematique devient strategique

## La Revue Mensuelle En 30 Minutes

## Etape 1. Sortir Le Top 10 Pages Money

Rapport :

- `affiliate_click` par `article_slug`

Lecture :

- Quel est le top 10 du mois ?
- Les 3 slugs prioritaires sont-ils dedans ?
- Y a-t-il un outsider inattendu ?

Decision :

- Garder les 3 meilleurs comme slugs prioritaires du mois suivant

## Etape 2. Mesurer Le Rendement

Rapport :

- `page_view` + `affiliate_click` par `article_slug`

Lecture :

- Calculer `CTR Amazon article`

Decision :

- Classer les slugs en 4 groupes :
  - fort trafic / fort CTR
  - fort trafic / faible CTR
  - faible trafic / fort CTR
  - faible trafic / faible CTR

## Etape 3. Lire Les Placements CTA

Rapport :

- `affiliate_click` par `placement`

Lecture :

- Quel bloc gagne ?
- Quelle part prennent `purchase_shortcut`, `decision_card`, `comparison_model`, `article_body` ?

Decision :

- Si un seul bloc domine, exploiter sa logique
- Si tous les blocs sont faibles, le probleme est plus haut dans la promesse article

## Etape 4. Lire Le Maillage Interne

Rapport :

- `guide_navigation_click` par `target_slug`
- puis `guide_navigation_click` par `placement`

Lecture :

- Quels slugs recoivent vraiment du trafic interne ?
- La home fait-elle le gros du travail ?
- Les articles renvoient-ils bien vers les pages money ?

Decision :

- Reallouer les liens internes du mois suivant

## Etape 5. Choisir Un Seul Chantier Prioritaire

Ne jamais lancer 4 chantiers en meme temps.

Choisir un seul axe :

- home
- haut d'article
- comparatif / cartes CTA
- maillage interne

## La Matrice De Decision

### Cas 1. La Home Pousse Mal

Signal :

- `home_above_fold_money` et `home_quick_guides` faibles
- `home_library` ou le trafic organique fait presque tout

Action du mois :

- Revoir la promesse hero
- Refaire l'ordre des pages remontees
- Reduire le bruit au-dessus des cartes money

### Cas 2. Les Articles Attirent Mais Ne Font Pas Cliquer

Signal :

- `page_view` bon
- `affiliate_click` faible

Action du mois :

- Reprendre `purchase_shortcut`
- Reecrire les labels CTA
- Mettre le meilleur choix plus haut
- Simplifier la partie comparee visible

### Cas 3. Le Raccourci Achat Ne Sert A Rien

Signal :

- `purchase_shortcut` faible
- `article_body` ou `decision_card` font mieux

Action du mois :

- Changer la promesse du raccourci
- Tester un bouton plus transactionnel
- Mettre une phrase plus tranchante sur le meilleur choix

### Cas 4. Les Cartes Decisionnelles Sont Trop Faibles

Signal :

- `decision_card` faible
- `comparison_model` ou `article_body` dominent

Action du mois :

- Reduire le texte
- Rendre les labels plus acheteurs
- Mettre un vrai angle : meilleur choix, achat malin, usage terrain

### Cas 5. Le Maillage Article Vers Article Est Trop Faible

Signal :

- `article_money_route` quasi nul

Action du mois :

- Remonter ce bloc plus haut
- Rendre ses titres plus nets
- Lier vers des pages plus proches du sujet lu

## Les Actions Possibles Par Zone

### Home

Actions a tester :

- Changer les 3 slugs au-dessus de la ligne de flottaison
- Changer les labels des cartes
- Changer le guide vedette
- Renforcer le message "comparatif pour acheter vite"

### Haut D'Article

Actions a tester :

- Modifier le texte du `purchase_shortcut`
- Modifier le label principal
- Changer le modele mis en avant
- Ajouter plus de conviction au premier bloc

### Cartes CTA

Actions a tester :

- Raccourcir les raisons
- Durcir les labels
- Changer l'ordre des cartes
- Supprimer une carte faible

### Corps D'Article

Actions a tester :

- Mieux placer les liens Amazon
- Rendre les ancres plus produit
- Ajouter un lien plus tot dans le comparatif

### Maillage Interne

Actions a tester :

- Lier davantage vers les 3 meilleurs slugs du mois
- Changer les cibles du bloc `A lire ensuite`
- Ajouter des liens entre pages proches

## Regle D'Arbitrage

Quand plusieurs problemes existent, priorite a :

1. Ce qui touche les pages deja proches de convertir
2. Ce qui touche les slugs avec deja du trafic
3. Ce qui peut se deployer sur plusieurs pages a la fois

Donc :

- Mieux vaut optimiser 3 pages deja prometteuses que refaire 10 pages moyennes
- Mieux vaut corriger le bloc CTA dominant que retoucher un detail faible

## Template De Synthese Mensuelle

Copie ce format a la fin de chaque mois :

### 1. Top 5 slugs par clic Amazon

- slug 1
- slug 2
- slug 3
- slug 4
- slug 5

### 2. Slugs a pousser le mois prochain

- slug 1
- slug 2
- slug 3

### 3. Slugs a reparer

- slug 1 : fort trafic, CTR faible
- slug 2 : bon maillage entrant, peu de clics Amazon
- slug 3 : bloc CTA faible

### 4. Placement CTA gagnant du mois

- Ex : `purchase_shortcut`

### 5. Placement CTA faible du mois

- Ex : `comparison_model`

### 6. Chantier unique du mois suivant

- Ex : retravailler le haut des 3 pages les plus lues mais les moins cliquantes

## Rythme Recommande

Chaque mois :

1. Faire la lecture GA4
2. Classer les slugs
3. Choisir 1 chantier
4. Lancer les changements
5. Attendre assez de donnees
6. Refaire la lecture

Ne pas changer la home, les CTA, les slugs prioritaires et le maillage en meme temps si tu veux comprendre ce qui a marche.

## Complement Avec Le Dashboard Local

Utilise `/reporting` pour :

- verifier qu'un nouveau bloc remonte bien des events
- tester rapidement le wording d'un CTA
- valider les placements avant lecture dans GA4

Utilise GA4 pour :

- juger les tendances reelles
- comparer les slugs entre eux
- decider les priorites du mois suivant

Utilise aussi :

- `docs/looker-studio-template.md`
- `docs/monthly-cro-report-template.md`

pour construire un dashboard mensuel lisible a partir des memes evenements.
