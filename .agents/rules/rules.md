---
trigger: always_on
---

# NEW PROJECT - SYSTEM RULES v0.1.0

## SOURCES DE VERITE (lire dans cet ordre a chaque session)
1. `ROADMAP.md` - phase en cours, priorites, prochaines etapes
2. `changelog.md` - historique des versions et decisions effectives
3. `PROJECT_BIBLE.md` - vision, architecture, contraintes, regles critiques

**CONTEXTE :** Nouveau projet en phase de cadrage.
**VERSION ACTUELLE :** v0.1.0
**ETAT ACTUEL :** Base documentaire remise a zero. Aucun domaine, stack, workflow ou hypothese du projet precedent ne doit etre considere comme valide.

---

## 0. PROTOCOLE LINGUISTIQUE

- **DEV (FRANCAIS)** : echanges, plans, syntheses et documentation projet.
- **CODE / CONFIG / PROMPTS** : langue libre selon le besoin technique, avec priorite a la clarte et a la coherence.

---

## 1. PROTOCOLE DE SESSION

**Au debut de chaque session :**
1. Lire `ROADMAP.md`
2. Lire l'entree la plus recente de `changelog.md`
3. Lire `PROJECT_BIBLE.md`

**Apres chaque changement structurel, produit ou architecture :**
- Mettre a jour `changelog.md`
- Mettre a jour `ROADMAP.md` si la priorite ou la phase change
- Mettre a jour `PROJECT_BIBLE.md` si une decision devient officielle

**En fin de session :**
- Verifier que `ROADMAP.md`, `changelog.md` et `PROJECT_BIBLE.md` racontent le meme etat du projet

---

## 2. TRACABILITE

Toute modification effective du projet doit generer une entree dans `changelog.md`.

Format obligatoire :

```md
## vX.X.X - [YYYY-MM-DD] "Titre"
### Why (Pourquoi)
- **Sujet** : explication
### How (Comment)
- **Sujet** : explication
```

---

## 3. PRINCIPE DE TABLE RASE

- Ne rien reprendre implicitement du projet precedent.
- Toute nouvelle hypothese doit etre ecrite explicitement dans `PROJECT_BIBLE.md`.
- Tout element marque `A DEFINIR` ou equivalent est considere non valide tant qu'une decision n'a pas ete prise.

---

## 4. GARDE-FOUS

- Ne pas presenter une hypothese comme un fait.
- Ne pas annoncer une fonctionnalite comme terminee sans verification.
- Documenter les dependances externes, secrets et environnements avant de s'appuyer dessus.
- Si une decision modifie le scope, synchroniser `ROADMAP.md`, `PROJECT_BIBLE.md` et `changelog.md`.

---

## 5. HANDOFF MINIMAL

A la fin de chaque modification significative, fournir ce bloc :

```txt
PLAN D'ACTION REQUIS :
1. Prochaine etape logique : 3 etapes suivantes prioritaires.
2. Etat actuel : resume bref du projet et niveau d'avancement.
```

---

## 6. GIT

Apres chaque lot coherent de changements documentes :

```bash
git add <fichiers modifies>
git commit -m "vX.X.X: [Titre du Changelog]"
git push origin main
```

---

## 7. STYLE DE REPONSE

- Ton direct, factuel, oriente execution.
- Toujours signaler la prochaine etape utile.
- Rendre visibles les hypotheses, risques et points non valides.
