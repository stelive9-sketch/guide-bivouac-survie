# Template Looker Studio

Ce document decrit un dashboard Looker Studio logique pour piloter le site affiliation.

Le but n'est pas de faire un beau dashboard. Le but est de voir rapidement :

1. quelles pages generent le plus de clics Amazon
2. quels emplacements CTA font le travail
3. comment le maillage interne pousse vers les pages money
4. quelles pages doivent etre poussees ou reparees

## Source De Donnees

Source recommandee :

- Google Analytics 4

Prerequis :

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` branche
- dimensions custom deja creees selon [ga4-reading-plan.md](/C:/Users/steph/Desktop/Argent2/docs/ga4-reading-plan.md)

## Dimensions A Importer

Dimensions GA4 a utiliser dans Looker Studio :

- `Date`
- `Event name`
- `Page path + query string`
- `Page location`
- `Article Slug`
- `Article Title`
- `Placement`
- `CTA Label`
- `Model Name`
- `Decision Label`
- `Source Slug`
- `Target Slug`
- `Destination Host`

## Metriques A Importer

- `Event count`
- `Total users`
- `Sessions`

Si disponible dans ta connexion GA4 :

- `Views`

Sinon, `page_view` via `Event count` suffit pour le pilotage initial.

## Champs Calcules A Creer

## 1. `Affiliate Clicks`

```text
CASE
  WHEN Event name = "affiliate_click" THEN Event count
  ELSE 0
END
```

## 2. `Guide Navigation Clicks`

```text
CASE
  WHEN Event name = "guide_navigation_click" THEN Event count
  ELSE 0
END
```

## 3. `Page Views`

```text
CASE
  WHEN Event name = "page_view" THEN Event count
  ELSE 0
END
```

## 4. `Amazon CTR`

```text
SAFE_DIVIDE(SUM(Affiliate Clicks), SUM(Page Views))
```

Si `SAFE_DIVIDE` n'est pas disponible selon le connecteur, faire :

```text
CASE
  WHEN SUM(Page Views) = 0 THEN 0
  ELSE SUM(Affiliate Clicks) / SUM(Page Views)
END
```

## 5. `Guide Push Rate`

```text
CASE
  WHEN SUM(Page Views) = 0 THEN 0
  ELSE SUM(Guide Navigation Clicks) / SUM(Page Views)
END
```

## 6. `Money Page Flag`

Champ utile pour isoler les pages prioritaires.

```text
CASE
  WHEN Article Slug = "tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie" THEN "Yes"
  WHEN Article Slug = "top-10-des-meilleurs-sacs-de-couchage-grand-froid-pour-bivouac-hivernal-a-decouvrir-absolument" THEN "Yes"
  WHEN Article Slug = "guide-dachat-complet-des-filtres-a-eau-ultra-legers-avec-gourde-integree-pour-la-randonnee" THEN "Yes"
  ELSE "No"
END
```

Tu pourras mettre a jour cette liste chaque mois selon [cro-monthly-action-plan.md](/C:/Users/steph/Desktop/Argent2/docs/cro-monthly-action-plan.md).

## Structure Du Dashboard

Le template recommande 4 pages.

## Page 1. Vue Executif

But :

- lecture en 2 minutes
- savoir si le mois est bon ou non

Blocs a mettre :

1. Scorecards

- `Affiliate Clicks`
- `Page Views`
- `Amazon CTR`
- `Guide Navigation Clicks`

2. Courbe temporelle

- Dimension : `Date`
- Metriques :
  - `Affiliate Clicks`
  - `Guide Navigation Clicks`
  - `Page Views`

3. Tableau Top 10 slugs money

- Dimension : `Article Slug`
- Metriques :
  - `Affiliate Clicks`
  - `Page Views`
  - `Amazon CTR`
- Tri :
  - `Affiliate Clicks` decroissant

4. Tableau Top placements CTA

- Dimension : `Placement`
- Metriques :
  - `Affiliate Clicks`
  - `Amazon CTR`

Filtres en haut :

- plage de dates
- `Money Page Flag`

## Page 2. Pages Money

But :

- savoir quelles pages pousser
- savoir quelles pages reparer

Blocs a mettre :

1. Tableau detaille des slugs

- Dimension principale : `Article Slug`
- Dimension secondaire : `Article Title`
- Metriques :
  - `Affiliate Clicks`
  - `Page Views`
  - `Amazon CTR`
  - `Guide Navigation Clicks`
  - `Guide Push Rate`

2. Scatter chart

- Dimension : `Article Slug`
- Axe X : `Page Views`
- Axe Y : `Amazon CTR`
- Taille : `Affiliate Clicks`

Lecture :

- haut gauche : pages cachees mais fortes
- bas droite : pages lues mais faibles commercialement

3. Tableau "pages a pousser"

- Filtre :
  - `Amazon CTR` eleve
  - `Page Views` faibles ou moyens

4. Tableau "pages a reparer"

- Filtre :
  - `Page Views` elevees
  - `Amazon CTR` faible

## Page 3. CTA Et Conversion

But :

- comprendre quels blocs font cliquer

Blocs a mettre :

1. Tableau placements CTA

- Dimension : `Placement`
- Metriques :
  - `Affiliate Clicks`

2. Tableau labels CTA

- Dimension : `CTA Label`
- Metriques :
  - `Affiliate Clicks`

3. Tableau modeles

- Dimension : `Model Name`
- Metriques :
  - `Affiliate Clicks`

4. Tableau decisions

- Dimension : `Decision Label`
- Metriques :
  - `Affiliate Clicks`

5. Tableau croise

- Dimension principale : `Article Slug`
- Dimension secondaire : `Placement`
- Metrique :
  - `Affiliate Clicks`

Lecture :

- savoir si `purchase_shortcut`, `decision_card`, `comparison_model` ou `article_body` dominent

## Page 4. Maillage Interne

But :

- voir si la home et les articles poussent bien vers les comparatifs rentables

Blocs a mettre :

1. Tableau des cibles

- Dimension : `Target Slug`
- Metrique :
  - `Guide Navigation Clicks`

2. Tableau des sources

- Dimension : `Source Slug`
- Metrique :
  - `Guide Navigation Clicks`

3. Tableau des placements de maillage

- Dimension : `Placement`
- Metrique :
  - `Guide Navigation Clicks`

4. Tableau croise source -> cible

- Dimension principale : `Source Slug`
- Dimension secondaire : `Target Slug`
- Metrique :
  - `Guide Navigation Clicks`

Lecture :

- quelles pages envoient le plus
- quelles pages recoivent le plus
- quels blocs de navigation font le travail

## Filtres A Ajouter Sur Toutes Les Pages

- plage de dates
- `Article Slug`
- `Placement`
- `Source Slug`
- `Target Slug`

## Mise En Forme Recommandee

- vert/moss pour les metriques de clic
- or pour les blocs CTA
- un code couleur simple :
  - vert = performant
  - ambre = a surveiller
  - rouge = a reparer

Ne surcharge pas le dashboard avec trop de widgets. Il doit rester lisible en moins de 3 minutes.

## Lecture Recommandee

Chaque debut de mois :

1. Ouvrir `Vue Executif`
2. Identifier les 3 meilleurs slugs
3. Ouvrir `Pages Money`
4. Sortir les pages a pousser et les pages a reparer
5. Ouvrir `CTA Et Conversion`
6. Identifier le placement gagnant et le placement faible
7. Ouvrir `Maillage Interne`
8. Verifier si les bons slugs recoivent bien du trafic
9. Appliquer le process de [cro-monthly-action-plan.md](/C:/Users/steph/Desktop/Argent2/docs/cro-monthly-action-plan.md)

## Tableau Minimal Si Tu Veux Aller Vite

Si tu ne veux faire qu'une seule page au debut, prends :

1. scorecards :
   - `Affiliate Clicks`
   - `Amazon CTR`
   - `Guide Navigation Clicks`
2. tableau des slugs :
   - `Article Slug`
   - `Affiliate Clicks`
   - `Page Views`
   - `Amazon CTR`
3. tableau des placements :
   - `Placement`
   - `Affiliate Clicks`
4. tableau du maillage :
   - `Target Slug`
   - `Guide Navigation Clicks`

Cette version suffit deja pour prendre de vraies decisions.

## Regle D'Or

Le dashboard ne remplace pas la decision.

Il doit t'aider a choisir :

- quelles 3 pages pousser plus fort
- quelles 3 pages reparer
- quel bloc CTA modifier
- quel chantier prioriser le mois suivant
