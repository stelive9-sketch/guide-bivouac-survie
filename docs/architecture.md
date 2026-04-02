# Architecture AutoNiche

## Vue d'ensemble
AutoNiche est composé de deux briques indépendantes :
1. **Generator (Node.js)** : Script backend local chargé d'appeler l'API OpenAI pour générer du contenu (titres, articles, métadonnées SEO) et les écrire sous forme de fichiers Markdown locaux.
2. **Web (Next.js)** : Frontend statique ultra-performant, lisant les fichiers Markdown locaux (SSG - Static Site Generation) pour exposer les pages de contenu SEO avec liens d'affiliation.

## Schémas de données

### 1. Configuration Niche (`config.json`)
```json
{
  "niche": "Randonnée en montagne",
  "keywords": ["matériel randonnée", "chaussures rando", "bivouac"],
  "affiliateId": "AMAZON-PARTNER-ID",
  "articleCount": 5
}
```

### 2. Article (Frontmatter Markdown)
Chaque article généré aura le format YAML Frontmatter suivant :
```yaml
---
title: "Comment bien choisir ses chaussures de randonnée"
slug: "comment-choisir-chaussures-randonnee"
description: "Découvrez notre guide complet pour choisir les meilleures chaussures de randonnée adaptées à vos besoins."
date: "2026-04-02"
---
[Contenu de l'article en Markdown, incluant les balises SEO et liens affiliés formatés de manière transparente...]
```

## Intégrations externes
- **OpenAI API** (`gpt-4-turbo` ou `gpt-3.5-turbo`) : Génération des cocons sémantiques et de la rédaction sans "hallucinations". Le prompt doit exiger une structure stricte (titres H2, paragraphes, liste à puces).

## Backlog technique
1. Scaffolder Next.js app avec lecture Markdown. (Phase 2)
2. Développer script `generator/index.js` avec OpenAI. (Phase 2)
3. Automatiser la pipeline `npm run generate` -> `npm run build` dans Web. (Phase 3)
