# Checklist Mise En Prod GA4

Utilise cette checklist juste avant et juste apres le deploiement.

## Avant Le Deploiement

- [ ] La variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` est renseignee sur l'hebergement
- [ ] La valeur correspond bien a la bonne propriete GA4
- [ ] Les dimensions custom listees dans `docs/ga4-reading-plan.md` sont creees dans GA4
- [ ] `affiliate_click` est marque comme `Key event`
- [ ] Le site build localement sans erreur
- [ ] La route `/reporting` fonctionne encore localement

## Juste Apres Le Deploiement

- [ ] Ouvrir la home en production
- [ ] Ouvrir un article
- [ ] Cliquer sur un CTA Amazon
- [ ] Cliquer sur un lien de maillage vers un autre guide
- [ ] Verifier dans GA4 DebugView que remontent :
  - `page_view`
  - `guide_navigation_click`
  - `affiliate_click`

## Verifications Des Parametres

- [ ] `affiliate_click` remonte bien avec `article_slug`
- [ ] `affiliate_click` remonte bien avec `placement`
- [ ] `guide_navigation_click` remonte bien avec `source_slug`
- [ ] `guide_navigation_click` remonte bien avec `target_slug`
- [ ] Les clics Amazon remontent avec un `cta_label`

## Verifications Metier

- [ ] Un clic sur le bloc `purchase_shortcut` remonte bien en `affiliate_click`
- [ ] Un clic sur une `decision_card` remonte bien en `affiliate_click`
- [ ] Un clic sur un bouton de `comparison_model` remonte bien en `affiliate_click`
- [ ] Un clic sur un lien Amazon dans le corps article remonte bien en `affiliate_click`
- [ ] Un clic sur un bloc `article_money_route` remonte bien en `guide_navigation_click`
- [ ] Un clic depuis la home vers un guide prioritaire remonte bien en `guide_navigation_click`

## 24 Heures Plus Tard

- [ ] Les premiers evenements sont visibles dans les rapports standards ou explorations GA4
- [ ] Les dimensions custom sont bien exploitables dans les rapports
- [ ] Les 3 slugs prioritaires apparaissent dans les premiers tests de navigation
- [ ] Aucun trou evident de tracking n'apparait sur les CTA principaux

## Si Quelque Chose Ne Remonte Pas

- [ ] Verifier que `NEXT_PUBLIC_GA_MEASUREMENT_ID` est bien present en production
- [ ] Verifier que le script GA4 est charge dans le HTML
- [ ] Verifier DebugView avant de conclure a un bug de tracking
- [ ] Verifier que les dimensions custom ont bien ete creees dans la bonne propriete
- [ ] Verifier que le clic teste passe bien par un composant instrumente ou par le body tracker

## Ordre De Priorite

Si tu manques de temps, verifie d'abord :

1. `affiliate_click`
2. `placement`
3. `article_slug`
4. `guide_navigation_click`
5. `source_slug` et `target_slug`
