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

    // Créer et nettoyer le dossier de sortie (supprime les anciens articles)
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const existingFiles = await fs.readdir(OUTPUT_DIR);
    for (const file of existingFiles.filter(f => f.endsWith('.md'))) {
        await fs.unlink(`${OUTPUT_DIR}/${file}`);
    }
    console.log(`🧹 Dossier nettoyé : ${existingFiles.filter(f => f.endsWith('.md')).length} ancien(s) article(s) supprimé(s).`);

    // 2. Générer les titres
    console.log(`\n⏳ Génération de ${config.articleCount} titres SEO avec les mots clés : ${config.keywords.join(", ")}...`);
    const titlesPrompt = `Tu es un expert en contenu SEO spécialisé dans le plein air, la randonnée, le bivouac et la survie.
Génère ${config.articleCount} titres d'articles de blog COMPLÈTEMENT DIFFÉRENTS les uns des autres pour la niche : "${config.niche}".

Règles IMPÉRATIVES :
- Chaque titre DOIT couvrir un angle ou une thématique radicalement DIFFÉRENTE.
- TOUS les articles doivent parler d'ÉQUIPEMENTS et PRODUITS que l'on peut ACHETER (guides d'achat, comparatifs, top X, quel équipement choisir...). JAMAIS de techniques DIY sans matériel ni de "comment faire sans équipement".
- Utilise des angles variés : comparatif de produits, guide d'achat, top X des meilleurs modèles, comment choisir tel équipement...
- Distribue les sujets parmi ces mots-clés (utilise chacun au plus une fois) : ${config.keywords.join(', ')}.
- Les titres doivent être accrocheurs, précis et ultra-optimisés SEO.
- Renvoie uniquement les titres, un par ligne, sans tirets ni numéros, sans guillemets.`;
    
    let titles = [];
    if (API_KEY === "dummy_key" || !API_KEY) {
        console.warn("⚠️ Clé OpenAI absente. Génération de titres de test de secours.");
        titles = Array.from({length: config.articleCount}, (_, i) => `Le meilleur guide du ${config.keywords[0]} (Test ${i+1})`);
    } else {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4.1-nano",
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
        
        const articlePrompt = `Tu es Thomas Maillard, guide de montagne en Savoie depuis 12 ans, passionné de bivouac, survie et plein air. Tu tiens un blog personnel où tu partages tes expériences terrain authentiques. Rédige un article de blog de 900 à 1100 mots sur ce sujet : "${title}".

STYLE IMPÉRATIF (c'est ce qui rend le blog crédible) :
- Commence par une anecdote personnelle courte et précise (lieu réel en France/Alpes, conditions météo difficiles, situation vécue). Ex: "C'était en janvier dernier, bivouac sous la Pointe de la Galise à -14°C..."
- Utilise parfois "Je", "j'ai testé", "à mon avis", "d'après mon expérience", "je recommande vivement" pour rendre l'article personnel.
- Sois direct, honnête. Mentionne les points faibles si nécessaire pour la crédibilité.
- Évite le jargon marketing. Pas de "innovant", "révolutionnaire", "solution ultime".
- Pas d'hallucination de marques inventées. RÈGLE ABSOLUE : ne cite JAMAIS un nom de marque ni un modèle précis (pas de "Nemo Tensor", "Black Diamond Storm", "Lifestraw", etc.). Parle uniquement en termes de CATÉGORIES GÉNÉRIQUES : "un filtre à eau type squeeze", "un couteau à lame fixe de 10 cm", "un sac de couchage plume -15°C", "une lampe frontale 500 lumens". Cela garantit que tout ce dont tu parles est réellement disponible à l'achat.
- CRUCIAL : chaque section H2 DOIT parler d'un PRODUIT ou TYPE DE PRODUIT que l'on peut ACHETER sur internet (sac de couchage, couteau, tente, filtre \u00e0 eau, etc.). PAS de sections sur des techniques pures sans \u00e9quipement (\u00e9vite "Comment allumer un feu avec des pierres"). Si tu parles d'une technique, associe-la TOUJOURS \u00e0 un \u00e9quipement concret \u00e0 acqu\u00e9rir.
- Format Markdown avec des sous-titres H2 (##).
- LIENS AFFILI\u00c9S (R\u00c8GLE ABSOLUE) : Tu DOIS placer EXACTEMENT 2 marqueurs [[AMAZON:mot-cl\u00e9]] dans l'article. Ni 0, ni 1, ni 3. Choisis les 2 moments o\u00f9 tu d\u00e9cris un objet physique tr\u00e8s pr\u00e9cis et achetable (ex: "un sac de couchage -15\u00b0C en duvet", "un filtre \u00e0 eau type squeeze", "un couteau \u00e0 lame fixe de 10 cm"). Place le marqueur sur la ligne juste apr\u00e8s cette description. Le mot-cl\u00e9 doit \u00eatre COURT (2-3 mots max), G\u00c9N\u00c9RIQUE, avec un qualificatif outdoor (survie/randonnee/camping/bivouac/trek/montagne). Exemples : [[AMAZON:couteau-survie]], [[AMAZON:filtre-eau-randonnee]], [[AMAZON:sac-couchage-froid]], [[AMAZON:tente-bivouac-legere]].
- L'article se termine par une section ## Conclusion SANS aucun marqueur [[AMAZON:]].
- Ne répète PAS le titre H1 au début.
Renvoie uniquement le contenu Markdown.`;

        let content = "Ceci est un article généré en mode secours car la clé API n'était pas présente ou valide.\n\n## Un sous-titre de qualité\n\nVoici le contenu d'exemple utilisé pour simuler l'application. La structure fonctionne parfaitement et lira ce fichier MD.";
        
        if (API_KEY !== "dummy_key") {
            try {
                const articleRes = await openai.chat.completions.create({
                    model: "gpt-4.1-nano",
                    messages: [{ role: "user", content: articlePrompt }],
                    temperature: 0.7,
                });
                content = articleRes.choices[0].message.content;
            } catch(error) {
                console.error("⛔ Erreur API Article.", error.message);
            }
        }

        // Post-traitement : remplacer les marqueurs [[AMAZON:produit]] par de vrais liens affiliés
        // Qualificatifs outdoor reconnus — si aucun n'est présent dans le mot-clé, on en ajoute un
        const OUTDOOR_QUALIFIERS = ['randonnee', 'randonnee', 'camping', 'survie', 'bivouac', 'trek', 'montagne', 'outdoor', 'plein-air'];
        const nicheQualifier = (config.niche || 'randonnee')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .replace(/\s+/g, '-').split('-')[0]; // ex: "randonnée" → "randonnee"

        // Garde-fou absolu : on limite à MAX_AMAZON_LINKS liens affiliés en corps d'article
        const MAX_AMAZON_LINKS = 2;
        let amazonLinkCount = 0;

        content = content.replace(/\[\[AMAZON:([^\]]+)\]\]/g, (_, keyword) => {
            // Si on a déjà atteint la limite, on supprime le marqueur silencieusement
            if (amazonLinkCount >= MAX_AMAZON_LINKS) {
                return '';
            }
            amazonLinkCount++;

            let normalizedKeyword = keyword.trim().toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire les accents
                .replace(/[,;.!?]/g, '')                          // retire la ponctuation parasite (virgules, etc.)
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')                              // évite les double-tirets
                .replace(/-$/, '');                               // retire tiret final éventuel

            // Sécurité : forcer un qualificatif outdoor si aucun n'est présent
            const hasQualifier = OUTDOOR_QUALIFIERS.some(q => normalizedKeyword.includes(q));
            if (!hasQualifier) {
                normalizedKeyword = `${normalizedKeyword}-${nicheQualifier}`;
            }

            const encoded = normalizedKeyword.replace(/-/g, '+');
            const url = config.affiliateId
                ? `https://www.amazon.fr/s?k=${encoded}&s=review-rank&tag=${config.affiliateId}`
                : '#';
            const label = normalizedKeyword.replace(/-/g, ' ');
            return `\n> 🛒 **Notre sélection** → [Voir le meilleur ${label}](${url})\n`;
        });
        console.log(`   🔗 ${amazonLinkCount} lien(s) Amazon insérés (max ${MAX_AMAZON_LINKS}).`);

        // FILET DE SÉCURITÉ : si 0 lien Amazon dans le corps, on en injecte 1 automatiquement
        if (amazonLinkCount === 0) {
            const stopWords = new Set(['les','des','une','pour','comment','guide','top','meilleurs','meilleures','meilleur','meilleure','choisir','achat','complet','complete','toutes','situations','conditions','adapte','comparatif','indispensables','aventure','reussie','pleine','nature','votre','vos','sur','en','de','du','et','au','aux','par','avec','sans','dans','ultime','efficace','fiable','performant','pratique','leger','legere','adapter','selectionner','privilegier','incontournable','essentiel','important','idéal','ideal','laquelle','lequel','quel','quelle','notre','selection','criteres','modeles','phares','voyager','bivouac','hiver','randonnee','trekking','plein','nature','debutants','aventuriers','situations']);
            const titleWords = title.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 3 && !stopWords.has(w));
            const fallbackKeyword = (titleWords.slice(0, 2).join('-') + '-' + nicheQualifier)
                .replace(/[^a-z0-9-]/g, ''); // supprime tout caractère non valide (virgules, etc.)
            const fallbackEncoded = fallbackKeyword.replace(/-/g, '+');
            const fallbackUrl = config.affiliateId
                ? `https://www.amazon.fr/s?k=${fallbackEncoded}&s=review-rank&tag=${config.affiliateId}`
                : '#';
            const fallbackLabel = fallbackKeyword.replace(/-/g, ' ');
            const fallbackLink = `\n> 🛒 **Notre sélection** → [Voir le meilleur ${fallbackLabel}](${fallbackUrl})\n`;
            const firstBreak = content.indexOf('\n\n');
            content = firstBreak !== -1
                ? content.slice(0, firstBreak) + fallbackLink + content.slice(firstBreak)
                : fallbackLink + content;
            console.log(`   ⚡ Fallback : lien "${fallbackLabel}" injecté automatiquement.`);
        }

        // Ajouter le bloc de recommandation finale
        const rawKeyword = config.keywords[0] || config.niche;
        const searchKeyword = rawKeyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '+');
        content += `\n\n> 💡 **Recommandation de l'expert** : [Voir tout le matériel recommandé →](${config.affiliateId ? `https://www.amazon.fr/s?k=${searchKeyword}&s=review-rank&tag=${config.affiliateId}` : '#'})`;

        // 4. Formatter le Frontmatter Markdown
        // Date aléatoire entre aujourd'hui et 6 mois en arrière pour crédibiliser le site
        const msIn6Months = 6 * 30 * 24 * 60 * 60 * 1000;
        const randomPastDate = new Date(Date.now() - Math.random() * msIn6Months);
        const dateStr = randomPastDate.toISOString().split('T')[0];
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

    // 6. Générer le sitemap.xml
    console.log('\n⏳ Génération du sitemap.xml...');
    const BASE_URL = config.siteUrl || 'https://autoniche.vercel.app';
    const allArticles = await fs.readdir(OUTPUT_DIR);
    const sitemapEntries = allArticles
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const articleSlug = f.replace('.md', '');
            return `  <url>
    <loc>${BASE_URL}/articles/${articleSlug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${sitemapEntries.join('\n')}
</urlset>`;

    await fs.writeFile('../web/public/sitemap.xml', sitemap, 'utf-8');
    console.log(`✅ sitemap.xml généré avec ${sitemapEntries.length} article(s).`);
    
    console.log("\n🎉 Génération terminée ! Lancez `npm run dev` dans le dossier /web pour prévisualiser le site de niche !");
}

main().catch(console.error);
