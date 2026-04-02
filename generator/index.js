import fs from 'fs/promises';
import 'dotenv/config';
import OpenAI from 'openai';
import slugify from 'slugify';

const API_KEY = process.env.OPENAI_API_KEY || "dummy_key";
const openai = new OpenAI({ apiKey: API_KEY });
const CONFIG_PATH = './config.json';
const OUTPUT_DIR = '../web/content/articles';

async function main() {
    console.log("Démarrage du générateur AutoNiche...");
    
    // 1. Lire config
    let configStr;
    try {
        configStr = await fs.readFile(CONFIG_PATH, 'utf-8');
    } catch(e) {
        console.error("Erreur de lecture du fichier config.json", e.message);
        return;
    }
    const config = JSON.parse(configStr);
    console.log(`📍 Niche ciblée : ${config.niche}`);

    // Créer dossier de sortie
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 2. Générer les titres
    console.log(`\n⏳ Génération de ${config.articleCount} titres SEO avec les mots clés : ${config.keywords.join(", ")}...`);
    const titlesPrompt = `Génère ${config.articleCount} titres d'articles SEO ultra-optimisés pour la niche : "${config.niche}". Utilise ces mots clés: ${config.keywords.join(", ")}. Renvoie uniquement les titres, un par ligne, sans tirets ni numéros, sans guillemets au début.`;
    
    let titles = [];
    if (API_KEY === "dummy_key" || !API_KEY) {
        console.warn("⚠️ Clé OpenAI absente. Génération de titres de test de secours.");
        titles = Array.from({length: config.articleCount}, (_, i) => `Le meilleur guide du ${config.keywords[0]} (Test ${i+1})`);
    } else {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: titlesPrompt }],
                temperature: 0.7,
            });
            titles = response.choices[0].message.content.split('\n').map(t => t.replace(/^- /, '').replace(/^\d+\.\s/, '').trim()).filter(t => t.length > 0);
        } catch (error) {
            console.error("⛔ Erreur API OpenAI (Titres). Fallback sur mode test.", error.message);
            titles = Array.from({length: config.articleCount}, (_, i) => `Guide de test ${i+1}`);
        }
    }

    // 3. Générer le contenu pour chaque titre
    console.log("\n⏳ Génération du contenu...");
    for (const title of titles.slice(0, config.articleCount)) {
        console.log(`\n-> Rédaction de l'article : "${title}"`);
        const slug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        
        const articlePrompt = `Tu es un expert SEO et rédacteur web. Rédige un article complet de 1000 mots sur ce sujet : "${title}".
Règles IMPÉRATIVES:
- Pas d'hallucination de marques inventées.
- Ton direct et professionnel, format Markdown.
- Structure avec des sous-titres H2 (##).
Renvoie uniquement le contenu en Markdown, sans répéter le titre H1 principal.`;

        let content = "Ceci est un article généré en mode secours car la clé API n'était pas présente ou valide.\n\n## Un sous-titre de qualité\n\nVoici le contenu d'exemple utilisé pour simuler l'application. La structure fonctionne parfaitement et lira ce fichier MD.";
        
        if (API_KEY !== "dummy_key") {
            try {
                const articleRes = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: articlePrompt }],
                    temperature: 0.7,
                });
                content = articleRes.choices[0].message.content;
            } catch(error) {
                console.error("⛔ Erreur API Article.", error.message);
            }
        }

        // Ajouter le bloc d'affiliation
        content += `\n\n> 💡 **Recommandation de l'expert** : [Cliquez ici pour obtenir le meilleur équipement adapté](${config.affiliateId ? `https://amzn.to/test?tag=${config.affiliateId}` : '#'})`;

        // 4. Formatter le Frontmatter Markdown
        const dateStr = new Date().toISOString().split('T')[0];
        const markdown = `---
title: "${title.replace(/"/g, '')}"
slug: "${slug}"
description: "Découvrez notre guide ultime et complet : ${title.replace(/"/g, '')}."
date: "${dateStr}"
---

${content}
`;

        // 5. Sauvegarder
        const filePath = `${OUTPUT_DIR}/${slug}.md`;
        await fs.writeFile(filePath, markdown, 'utf-8');
        console.log(`✅ Fichier sauvegardé : ${filePath}`);
    }
    
    console.log("\n🎉 Génération terminée ! Lancez `npm run dev` dans le dossier /web pour prévisualiser le site de niche !");
}

main().catch(console.error);
