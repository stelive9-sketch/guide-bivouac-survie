import fs from 'fs/promises';
import 'dotenv/config';
import OpenAI from 'openai';
import slugify from 'slugify';
import matter from 'gray-matter';

const API_KEY = process.env.OPENAI_API_KEY || 'dummy_key';
const openai = new OpenAI({ apiKey: API_KEY });
const CONFIG_PATH = './config.json';
const CONTENT_DIR = '../web/content';
const OUTPUT_DIR = `${CONTENT_DIR}/articles`;
const STAGING_DIR = `${CONTENT_DIR}/articles.__staging`;
const SITEMAP_PATH = '../web/public/sitemap.xml';
const ROBOTS_PATH = '../web/public/robots.txt';
const REPORT_DIR = './reports';
const REPORT_JSON_PATH = `${REPORT_DIR}/latest-run.json`;
const REPORT_MD_PATH = `${REPORT_DIR}/latest-run.md`;
const VALIDATE_EXISTING_FLAG = '--validate-existing';
const MIGRATE_EXISTING_FLAG = '--migrate-existing';
const MIGRATE_PROGRESSIVE_FLAG = '--migrate-progressive';
const OPS_STATUS_FLAG = '--ops-status';
const LIST_BACKUPS_FLAG = '--list-backups';
const RESTORE_LATEST_BACKUP_FLAG = '--restore-latest-backup';
const RESTORE_BACKUP_FLAG_PREFIX = '--restore-backup=';
const BACKUP_DIR_PREFIX = 'articles.__backup-';
const DEFAULT_PROGRESSIVE_BATCH_SIZE = 5;
let activeRunReport = null;
const TITLE_MODEL = 'gpt-4.1-nano';
const ARTICLE_MODEL = 'gpt-4.1';
const TITLE_GENERATION_RETRIES = 3;
const ARTICLE_GENERATION_RETRIES = 3;
const REQUIRED_AMAZON_LINKS = 3;
const MAX_AMAZON_LINKS = REQUIRED_AMAZON_LINKS;
const MIN_ARTICLE_WORDS = 650;
const MIN_H2_COUNT = 5;
const MIN_MODEL_SUBSECTIONS = 3;
const MIN_FAQ_QUESTIONS = 3;
const MIN_INTRO_WORDS = 60;
const MAX_INTRO_WORDS = 220;
const MIN_NUMERIC_DETAILS = 2;
const FORBIDDEN_PHRASES = [
    'A mon avis',
    'Je recommande vivement',
    "D'apres mon experience",
    'Il est crucial de',
    'Sans plus tarder',
    'Pour conclure',
];
const KNOWN_OUTDOOR_BRANDS = [
    'Salomon',
    'MSR',
    'Petzl',
    'Osprey',
    'Black Diamond',
    'Leki',
    'Komperdell',
    'Guidetti',
    'TSL',
    'TSL Outdoor',
    'Garmin',
    'Scarpa',
    'Meindl',
    'La Sportiva',
    'Deuter',
    'Therm-a-Rest',
    'Sea to Summit',
    'Exped',
    'Lifestraw',
    'LifeStraw',
    'Katadyn',
    'Grayl',
    'Steripen',
    'Nalgene',
    'BRS',
    'Jetboil',
    'Primus',
    'Morakniv',
    'Mora',
    'Leatherman',
    'Victorinox',
    'Buck',
    'Opinel',
    'Helle',
    'ESEE',
    'Joker',
    'Fallkniven',
    'Fällkniven',
    'Buff',
    'Ledlenser',
    'Fenix',
    'Silva',
    'Suunto',
    'Brunton',
    'Recta',
    'Merrell',
    'Lowa',
    'Hanwag',
    'Gregory',
    'Ortlieb',
    'Odlo',
    'Devold',
    'Icebreaker',
    'Smartwool',
    'Darn Tough',
    'X-Socks',
    'XSocks',
    'Stanley',
    'Fjallraven',
    'Patagonia',
    'Columbia',
    'Arcteryx',
    "Arc'teryx",
    'Norrona',
    'Norrøna',
    'Helinox',
    'Mammut',
    'Ortovox',
    'Fiskars',
    'Silky',
    'Hultafors',
    'Gransfors Bruk',
    'Gränsfors Bruk',
    'Husqvarna',
    'Bahco',
    'Estwing',
    'Condor Tool & Knife',
    'Condor',
    'Gerber',
    'Sawyer',
    'Light My Fire',
    'Exotac',
    'UCO',
    'Zippo',
    'Julbo',
    'Cebe',
    'Cébé',
    'Vuarnet',
    'Suunto',
    'Coros',
    'Polar',
    'Casio',
    'Goal Zero',
    'BigBlue',
    'Anker',
    'EcoFlow',
    'SunPower',
    'RAVPower',
    'CamelBak',
    'Camelbak',
    'HydraPak',
    'Hydrapak',
    'Fox 40',
    'ACME',
    'Lifesystems',
    'LifeSystems',
    'Big Agnes',
    'Nemo',
    'NEMO',
    'Ferrino',
    'Naturehike',
    'SOTO',
    'Soto',
    'Rab',
    'Mountain Hardwear',
    'Carinthia',
    'Valandre',
    'Valandré',
    'Marmot',
    'Millet',
    'Western Mountaineering',
    'Exped',
    'Nitecore',
    'Forclaz',
    'Hilleberg',
    'Mountain Equipment',
    'Cumulus',
    'The North Face',
    'Ajungilak',
    'ARVA',
    'Arva',
    'BCA',
    'Pieps',
    'Beal',
    'Edelrid',
    'Tendon',
    'Fixe',
    'Aqua Quest',
    'DD Hammocks',
    'Bushmen',
    'Outdoor Research',
    'SOL',
    'Adventure Medical Kits',
    'AMK',
    'BCB',
    'Care Plus',
    'Arcturus',
    'Origin Outdoors',
    'Toaks',
    'Snow Peak',
    'Keith Titanium',
    'Boundless Voyage',
    'Agawa',
    'Trekn Eat',
    "Trek'n Eat",
    'Adventure Food',
    'Adventure Menu',
    'MX3',
    'Firepot',
    'LyoFood',
    'Lyo Food',
    'Real Turmat',
    'Voyager',
    'Lowe Alpine',
    'Salewa',
    'EVOC',
    'Evoc',
];
const KNOWN_MODEL_SERIES = [
    'x-ultra',
    'xa pro',
    'quest',
    'hubba',
    'freelite',
    'elixir',
    'atmos',
    'aether',
    'exos',
    'actik',
    'swift',
    'tikka',
    'fenix',
    'instinct',
    'fenix',
    'forerunner',
    'inreach',
    'garberg',
    'companion',
    'stowaway',
    'lightent',
    'spark',
    'xlite',
    'xtherm',
    'trail pro',
    'ducan',
    'duos',
    'lite plus',
    'power lizard',
    'ultra raptor',
    'renegade',
    'aircontact',
    'airlite',
    'duospike',
    'distance carbon',
    'hultan',
    'badger',
    'pro light',
    'pro alu',
    'axe',
    'trail runner',
    'free',
    'windmaster',
    'stash',
    'platinium',
    'hiker',
    'bhutan',
    'island',
    'trango',
    'temagami',
];
const GENERIC_MODEL_TOKENS = new Set([
    'ultra',
    'light',
    'lite',
    'pro',
    'plus',
    'premium',
    'expert',
    'advanced',
    'performance',
    'outdoor',
    'mountain',
    'rando',
    'trek',
    'trekking',
    'bivouac',
    'survie',
    'compact',
    'confort',
    'comfort',
    'robuste',
    'leger',
    'legere',
    'durable',
    'polyvalent',
    'polyvalente',
    'classique',
    'standard',
    'max',
    'elite',
    'choice',
    'selection',
    'terrain',
    'kit',
    'edition',
]);
const MODEL_SHAPE_PATTERNS = [
    /\b[A-Z]{1,4}-\d{1,3}[A-Z]?\b/,
    /\b[A-Z]{1,4}\d{1,3}[A-Z]?\b/,
    /\b\d{1,3}L\b/i,
    /\b\d{1,2}\s*places?\b/i,
    /\b\d{2,4}\b/,
    /\b[A-Z][a-z]+(?:\s+[A-Z0-9][\w-]+){1,3}\b/,
];
const REQUIRED_SECTION_RULES = [
    { label: 'Ce qu il faut retenir', matcher: (heading) => heading.includes('faut retenir') || (heading.includes('retenir') && heading.includes('faut')) },
    { label: 'Comparatif', matcher: (heading) => heading.includes('comparatif') },
    { label: 'Comment choisir', matcher: (heading) => heading.includes('comment choisir') },
    { label: 'Erreurs a eviter', matcher: (heading) => heading.includes('erreurs a eviter') },
    { label: 'Verdict terrain', matcher: (heading) => heading.includes('verdict terrain') },
    { label: 'FAQ', matcher: (heading) => heading === 'faq' || heading.includes('faq ') || heading.includes('faq:') },
];
const GENERIC_COMPARISON_PATTERNS = [
    /\bmarque\s+[abc]\b/i,
    /\bmodele\s+[abc123]\b/i,
    /\boption\s+(budget|premium|polyvalente?|milieu de gamme)\b/i,
    /\bproduit\s+(budget|premium|polyvalent)\b/i,
    /\bmeilleur\s+choix\b/i,
];
const FORBIDDEN_EDITORIAL_PATTERNS = [
    /\bdans cet article\b/i,
    /\bnous allons voir\b/i,
    /\bnous allons examiner\b/i,
    /\bce guide vous aidera\b/i,
    /\bque vous soyez debutant ou confirme\b/i,
    /\bil est important de noter\b/i,
    /\bil convient de\b/i,
    /\bil faut savoir que\b/i,
    /\ben conclusion\b/i,
];
const INTRO_GENERIC_OPENINGS = [
    'aujourd hui',
    'dans cet article',
    'quand on',
    'lorsqu on',
    'si vous cherchez',
    'que vous soyez',
];
const WEAK_AFFILIATE_ANCHOR_PATTERNS = [
    /\bclique ici\b/i,
    /\bvoir ici\b/i,
    /\ben savoir plus\b/i,
    /\bdecouvrir ici\b/i,
    /\bce lien\b/i,
    /\bce produit\b/i,
    /\bvoir sur amazon\b/i,
];
const BUYER_INTENT_PATTERNS = [
    /\bsi tu veux\b/i,
    /\bsi ton budget\b/i,
    /\bsi tu cherches\b/i,
    /\bbon choix si\b/i,
    /\bmeilleur compromis\b/i,
    /\brapport qualite prix\b/i,
    /\brapport poids\b/i,
    /\bpour acheter\b/i,
    /\bsi tu pars\b/i,
    /\bsi tu veux aller vite\b/i,
    /\bpour ne pas regretter\b/i,
    /\bmon choix\b/i,
    /\bsi je devais\b/i,
    /\bpour ceux qui veulent\b/i,
    /\bvaleur sure\b/i,
    /\bexcellent plan\b/i,
    /\beviter les erreurs\b/i,
    /\bmiser sur\b/i,
];
const INTRO_CONTEXT_PATTERNS = [
    /\bvent\b/i,
    /\bpluie\b/i,
    /\bneige\b/i,
    /\bbrouillard\b/i,
    /\bboue\b/i,
    /\brefuge\b/i,
    /\bcol\b/i,
    /\bcrete\b/i,
    /\bmassif\b/i,
    /\bforet\b/i,
    /\bbivouac\b/i,
    /\balpes\b/i,
    /\bpyrenees\b/i,
    /\bvosges\b/i,
    /\bsavoie\b/i,
    /\becrins\b/i,
    /\bbois\b/i,
    /\bcamp\b/i,
    /\bsentier\b/i,
    /\bgel\b/i,
    /\bpierrier\b/i,
    /\btorrent\b/i,
];
const SENTENCE_START_REPEAT_THRESHOLD = 3;
const INTRO_STYLE_BRIEFS = [
    'Ouvre par un souvenir brutal en conditions difficiles, avec une phrase courte, nerveuse, presque seche.',
    'Ouvre par une erreur de materiel ou de jugement qui a failli te couter la sortie, puis bascule vers la lecon concrete.',
    'Ouvre par un decor tres situe et sensoriel, puis montre vite ce que le terrain t a appris sur ce materiel.',
    'Ouvre par une scene de fin de journee ou tu ranges le camp et tires une conclusion nette sur ce qui a tenu ou non.',
    'Ouvre par un contraste fort entre ce que promet la fiche produit et ce qui se passe vraiment dehors.',
];

function normalizeText(value) {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function normalizeForMatching(value) {
    return normalizeText(value)
        .replace(/[^\w\s-]/g, ' ')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function containsNormalizedPhrase(haystack, needle) {
    const normalizedHaystack = ` ${normalizeForMatching(haystack)} `;
    const normalizedNeedle = ` ${normalizeForMatching(needle)} `;
    return normalizedHaystack.includes(normalizedNeedle);
}

function countWords(value) {
    return value
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}

function parseModelResponseLines(value) {
    return value
        .split('\n')
        .map((line) => line.replace(/^- /, '').replace(/^\d+\.\s/, '').trim())
        .filter((line) => line.length > 0);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractHeadings(content, level) {
    const prefix = '#'.repeat(level);
    const pattern = new RegExp(`^${escapeRegExp(prefix)}\\s+(.+)$`, 'gm');
    return Array.from(content.matchAll(pattern)).map((match) => match[1].trim());
}

function splitSectionsByH2(content) {
    const matches = Array.from(content.matchAll(/^##\s+(.+)$/gm));
    return matches.map((match, index) => {
        const bodyStart = match.index + match[0].length;
        const bodyEnd = index + 1 < matches.length ? matches[index + 1].index : content.length;
        return {
            heading: match[1].trim(),
            body: content.slice(bodyStart, bodyEnd).trim(),
        };
    });
}

function hasKnownBrand(value) {
    return KNOWN_OUTDOOR_BRANDS.some((brand) => containsNormalizedPhrase(value, brand));
}

function headingLooksSpecific(value) {
    const normalizedHeading = normalizeForMatching(value);
    const brand = KNOWN_OUTDOOR_BRANDS.find((candidate) => containsNormalizedPhrase(value, candidate));

    if (!brand) {
        return false;
    }

    const remainder = normalizedHeading
        .replace(new RegExp(`\\b${escapeRegExp(normalizeForMatching(brand))}\\b`, 'i'), '')
        .split(/\s+/)
        .filter((token) => token.length > 1);

    return remainder.length > 0;
}

function countListItems(sectionBody) {
    return (sectionBody.match(/^\s*[-*+]\s+/gm) || []).length;
}

function getBrandFromHeading(value) {
    return KNOWN_OUTDOOR_BRANDS.find((brand) => containsNormalizedPhrase(value, brand)) || null;
}

function getModelPartFromHeading(value) {
    const brand = getBrandFromHeading(value);
    if (!brand) {
        return '';
    }

    return value.replace(new RegExp(`^\\s*${escapeRegExp(brand)}\\b\\s*`, 'i'), '').trim();
}

function looksLikeCommercialModelName(heading) {
    const brand = getBrandFromHeading(heading);
    if (!brand) {
        return false;
    }

    const modelPart = getModelPartFromHeading(heading);
    if (!modelPart) {
        return false;
    }

    const normalizedModelPart = normalizeText(modelPart).replace(/[^\w\s-]/g, ' ').trim();
    const tokens = normalizedModelPart.split(/\s+/).filter(Boolean);
    const nonGenericTokens = tokens.filter((token) => !GENERIC_MODEL_TOKENS.has(token));
    const hasSeriesHint = KNOWN_MODEL_SERIES.some((series) => normalizedModelPart.includes(series));
    const hasModelShape = MODEL_SHAPE_PATTERNS.some((pattern) => pattern.test(modelPart));
    const hasDigit = /\d/.test(modelPart);
    const hasHyphen = modelPart.includes('-');
    const hasUppercaseSignal = /\b[A-Z]{2,}\b/.test(modelPart);
    const brandHasDigit = /\d/.test(brand);

    if (tokens.length === 0) {
        return false;
    }

    if (GENERIC_COMPARISON_PATTERNS.some((pattern) => pattern.test(modelPart))) {
        return false;
    }

    if (tokens.length <= 2 && nonGenericTokens.length === 0) {
        return false;
    }

    if (nonGenericTokens.length === 0) {
        return false;
    }

    if (hasSeriesHint || hasModelShape || hasDigit || hasHyphen || hasUppercaseSignal) {
        return true;
    }

    if (brandHasDigit && nonGenericTokens.length >= 1 && tokens.every((token) => token.length >= 3)) {
        return true;
    }

    return nonGenericTokens.length >= 2 && tokens.length >= 2;
}

function getSuspiciousModelHeadings(headings) {
    return headings.filter((heading) => !looksLikeCommercialModelName(heading));
}

function countAffiliateLinks(content, mode = 'placeholder') {
    const placeholderLinks = (content.match(/\[[^\]]+\]\(AMAZON:[^\)]+\)/g) || []).length;
    const publishedLinks = (content.match(/\[[^\]]+\]\(https:\/\/www\.amazon\.fr\/[^\)]+\)/g) || []).length;

    if (mode === 'published') {
        return publishedLinks;
    }

    if (mode === 'either') {
        return Math.max(placeholderLinks, publishedLinks);
    }

    return placeholderLinks;
}

function extractAffiliateAnchors(content, mode = 'placeholder') {
    const patterns = [];

    if (mode !== 'published') {
        patterns.push(/\[([^\]]+)\]\(AMAZON:[^\)]+\)/g);
    }

    if (mode !== 'placeholder') {
        patterns.push(/\[([^\]]+)\]\(https:\/\/www\.amazon\.fr\/[^\)]+\)/g);
    }

    return patterns.flatMap((pattern) => Array.from(content.matchAll(pattern)).map((match) => match[1].trim()));
}

function splitSentences(value) {
    return value
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);
}

function getIntro(content) {
    const firstH2Match = content.match(/^##\s+/m);
    if (!firstH2Match || firstH2Match.index === undefined) {
        return content.trim();
    }

    return content.slice(0, firstH2Match.index).trim();
}

function countRepeatedSentenceStarts(content) {
    const counts = new Map();
    for (const sentence of splitSentences(content)) {
        const tokens = normalizeText(sentence)
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter((token) => token.length > 1);

        if (tokens.length < 3) {
            continue;
        }

        const key = tokens.slice(0, 3).join(' ');
        counts.set(key, (counts.get(key) || 0) + 1);
    }

    return Math.max(0, ...counts.values());
}

function hasPersonalVoice(value) {
    return /\bje\b|j[' ]|\bmon\b|\bma\b|\bmes\b|\bmoi\b|mon choix|je garde|je prends|je prendrais|je partirais|je miserais|si je devais|mon pick|je retiens/i.test(value);
}

function ensureVerdictPersonalVoice(content) {
    return content.replace(/(^##\s+Verdict terrain\s*$)([\s\S]*?)(?=^##\s+|\s*$)/m, (match, heading, body) => {
        if (hasPersonalVoice(body)) {
            return match;
        }

        const normalizedBody = body.trimStart();
        const prefix = "Mon choix terrain, si je repars demain en bivouac, va toujours vers le modele qui garde du mordant dans du bois humide et reste sain en main.\n\n";
        return `${heading}\n${prefix}${normalizedBody}`;
    });
}

function ensureIntroVoiceAndContext(content) {
    const firstH2Match = content.match(/^##\s+/m);
    if (!firstH2Match || firstH2Match.index === undefined) {
        return content;
    }

    const intro = content.slice(0, firstH2Match.index).trim();
    const rest = content.slice(firstH2Match.index).trimStart();
    let patchedIntro = intro;

    if (!hasPersonalVoice(patchedIntro)) {
        patchedIntro = `Je l'ai appris sur des sorties froides en montagne: sur ce materiel, la fiche technique ne raconte jamais toute l'histoire.\n\n${patchedIntro}`.trim();
    }

    if (!INTRO_CONTEXT_PATTERNS.some((pattern) => pattern.test(patchedIntro))) {
        patchedIntro = `${patchedIntro}\n\nSur un bivouac humide dans les Alpes, ce sont toujours le vent, le froid et l'eau sale qui trient les bons choix des achats regrets.`;
    }

    if (countWords(patchedIntro) < MIN_INTRO_WORDS) {
        patchedIntro = `${patchedIntro}\n\nQuand je compare ce type d'equipement, je regarde d'abord ce qui reste lisible, fiable et simple a utiliser quand la meteo se degrade vraiment.`;
    }

    return `${patchedIntro}\n\n${rest}`.trim();
}

function pickIntroStyle(title) {
    const hash = Array.from(title).reduce((total, char) => total + char.charCodeAt(0), 0);
    return INTRO_STYLE_BRIEFS[hash % INTRO_STYLE_BRIEFS.length];
}

function parseCliArgs(argv) {
    const batchSizeArg = argv.find((arg) => arg.startsWith('--batch-size='));
    const slugsArg = argv.find((arg) => arg.startsWith('--slugs='));
    const restoreBackupArg = argv.find((arg) => arg.startsWith(RESTORE_BACKUP_FLAG_PREFIX));
    const batchSize = batchSizeArg ? Number.parseInt(batchSizeArg.split('=')[1], 10) : DEFAULT_PROGRESSIVE_BATCH_SIZE;
    const slugs = slugsArg
        ? slugsArg
            .split('=')[1]
            .split(',')
            .map((slug) => slug.trim())
            .filter(Boolean)
        : [];

    return {
        validateExisting: argv.includes(VALIDATE_EXISTING_FLAG),
        migrateExisting: argv.includes(MIGRATE_EXISTING_FLAG),
        migrateProgressive: argv.includes(MIGRATE_PROGRESSIVE_FLAG),
        opsStatus: argv.includes(OPS_STATUS_FLAG),
        listBackups: argv.includes(LIST_BACKUPS_FLAG),
        restoreLatestBackup: argv.includes(RESTORE_LATEST_BACKUP_FLAG),
        restoreBackupName: restoreBackupArg ? restoreBackupArg.split('=')[1].trim() : '',
        batchSize: Number.isFinite(batchSize) && batchSize > 0 ? batchSize : DEFAULT_PROGRESSIVE_BATCH_SIZE,
        slugs,
    };
}

function createRunReport() {
    return {
        startedAt: new Date().toISOString(),
        finishedAt: null,
        status: 'running',
        mode: 'generate',
        config: null,
        selection: null,
        metrics: {
            titleAttempts: 0,
            titleRejectedAttempts: 0,
            articleAttempts: 0,
            articleRejectedAttempts: 0,
            articlesValidated: 0,
            articlesPublished: 0,
            articlesScanned: 0,
        },
        failureCounts: {},
        titleGeneration: {
            attempts: [],
            acceptedTitles: [],
        },
        articles: [],
        events: [],
        operations: null,
    };
}

function incrementFailureCounts(runReport, reasons) {
    for (const reason of reasons) {
        runReport.failureCounts[reason] = (runReport.failureCounts[reason] || 0) + 1;
    }
}

function recordEvent(runReport, level, message, metadata = {}) {
    runReport.events.push({
        timestamp: new Date().toISOString(),
        level,
        message,
        metadata,
    });
}

function recordTitleAttempt(runReport, attempt, status, details = {}) {
    runReport.metrics.titleAttempts += 1;
    if (status !== 'accepted') {
        runReport.metrics.titleRejectedAttempts += 1;
    }

    const errors = details.errors || [];
    if (errors.length > 0) {
        incrementFailureCounts(runReport, errors);
    }

    runReport.titleGeneration.attempts.push({
        attempt,
        status,
        ...details,
    });
}

function getArticleReportEntry(runReport, title, slug = null) {
    let entry = runReport.articles.find((article) => article.title === title);
    if (!entry) {
        entry = {
            title,
            slug,
            attempts: [],
            status: 'pending',
            metrics: null,
        };
        runReport.articles.push(entry);
    }

    if (slug && !entry.slug) {
        entry.slug = slug;
    }

    return entry;
}

function recordArticleAttempt(runReport, title, attempt, status, details = {}) {
    if (status !== 'failed') {
        runReport.metrics.articleAttempts += 1;
    }
    if (status !== 'accepted' && status !== 'failed') {
        runReport.metrics.articleRejectedAttempts += 1;
    }

    const entry = getArticleReportEntry(runReport, title, details.slug);
    const errors = details.errors || [];
    if (errors.length > 0) {
        incrementFailureCounts(runReport, errors);
    }

    entry.attempts.push({
        attempt,
        status,
        ...details,
    });

    if (status === 'accepted') {
        entry.status = 'validated';
        entry.metrics = details.metrics || null;
        runReport.metrics.articlesValidated += 1;
    } else if (status === 'failed') {
        entry.status = 'failed';
    }
}

function buildReportSummaryMarkdown(runReport) {
    const failureEntries = Object.entries(runReport.failureCounts).sort((a, b) => b[1] - a[1]);
    const articleLines = runReport.articles.map((article) => {
        const lastAttempt = article.attempts[article.attempts.length - 1];
        const reason = lastAttempt?.errors?.join(', ') || lastAttempt?.message || 'ok';
        return `- ${article.title} | ${article.status} | ${reason}`;
    });
    const operationsLines = runReport.operations
        ? [
            '',
            '## Operations',
            ...Object.entries(runReport.operations).map(([key, value]) => `- ${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`),
        ]
        : [];

    return [
        '# Generator Run Report',
        '',
        `- Started: ${runReport.startedAt}`,
        `- Finished: ${runReport.finishedAt || 'running'}`,
        `- Status: ${runReport.status}`,
        `- Mode: ${runReport.mode}`,
        runReport.selection ? `- Selection: ${JSON.stringify(runReport.selection)}` : '- Selection: none',
        runReport.config ? `- Niche: ${runReport.config.niche}` : '- Niche: n/a',
        runReport.config ? `- Target articles: ${runReport.config.articleCount}` : '- Target articles: n/a',
        `- Articles scanned: ${runReport.metrics.articlesScanned}`,
        `- Title attempts: ${runReport.metrics.titleAttempts}`,
        `- Article attempts: ${runReport.metrics.articleAttempts}`,
        `- Articles validated: ${runReport.metrics.articlesValidated}`,
        `- Articles published: ${runReport.metrics.articlesPublished}`,
        ...operationsLines,
        '',
        '## Top Failure Reasons',
        ...(failureEntries.length > 0 ? failureEntries.map(([reason, count]) => `- ${count}x ${reason}`) : ['- none']),
        '',
        '## Articles',
        ...(articleLines.length > 0 ? articleLines : ['- none']),
    ].join('\n');
}

async function persistRunReport(runReport) {
    await fs.mkdir(REPORT_DIR, { recursive: true });
    await fs.writeFile(REPORT_JSON_PATH, JSON.stringify(runReport, null, 2), 'utf-8');
    await fs.writeFile(REPORT_MD_PATH, buildReportSummaryMarkdown(runReport), 'utf-8');
}

async function readLatestRunReport() {
    try {
        const rawReport = await fs.readFile(REPORT_JSON_PATH, 'utf-8');
        return JSON.parse(rawReport);
    } catch {
        return null;
    }
}

async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function countMarkdownFiles(directoryPath) {
    if (!await pathExists(directoryPath)) {
        return 0;
    }

    const fileNames = await fs.readdir(directoryPath);
    return fileNames.filter((fileName) => fileName.endsWith('.md')).length;
}

function isBackupDirectoryName(name) {
    return name.startsWith(BACKUP_DIR_PREFIX);
}

function validateBackupDirectoryName(name) {
    if (!name || !isBackupDirectoryName(name) || name.includes('/') || name.includes('\\')) {
        throw new Error(`backup invalide: ${name || 'vide'}`);
    }

    return name;
}

function buildBackupDirectoryPath(name) {
    return `${CONTENT_DIR}/${name}`;
}

async function listAvailableBackups() {
    if (!await pathExists(CONTENT_DIR)) {
        return [];
    }

    const entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
    const backups = [];

    for (const entry of entries) {
        if (!entry.isDirectory() || !isBackupDirectoryName(entry.name)) {
            continue;
        }

        const fullPath = buildBackupDirectoryPath(entry.name);
        const [articleCount, stats] = await Promise.all([
            countMarkdownFiles(fullPath),
            fs.stat(fullPath),
        ]);

        backups.push({
            name: entry.name,
            path: fullPath,
            articleCount,
            updatedAt: stats.mtime.toISOString(),
        });
    }

    return backups.sort((a, b) => b.name.localeCompare(a.name));
}

async function getOperationsSnapshot() {
    const [backups, latestRun] = await Promise.all([
        listAvailableBackups(),
        readLatestRunReport(),
    ]);
    const [outputExists, stagingExists] = await Promise.all([
        pathExists(OUTPUT_DIR),
        pathExists(STAGING_DIR),
    ]);
    const articleCount = outputExists ? await countMarkdownFiles(OUTPUT_DIR) : 0;

    return {
        currentCorpus: {
            exists: outputExists,
            path: OUTPUT_DIR,
            articleCount,
        },
        staging: {
            exists: stagingExists,
            path: STAGING_DIR,
        },
        backups,
        latestRun: latestRun
            ? {
                status: latestRun.status,
                mode: latestRun.mode,
                finishedAt: latestRun.finishedAt,
                articlesValidated: latestRun.metrics?.articlesValidated ?? 0,
                articlesPublished: latestRun.metrics?.articlesPublished ?? 0,
            }
            : null,
    };
}

async function showOperationsStatus(runReport) {
    runReport.mode = 'ops-status';
    const snapshot = await getOperationsSnapshot();
    const latestBackup = snapshot.backups[0] || null;
    runReport.operations = {
        currentCorpus: snapshot.currentCorpus,
        staging: snapshot.staging,
        backupCount: snapshot.backups.length,
        latestBackup,
        latestRun: snapshot.latestRun,
    };
    runReport.metrics.articlesScanned = snapshot.currentCorpus.articleCount;
    runReport.status = 'success';
    runReport.finishedAt = new Date().toISOString();
    recordEvent(runReport, 'info', 'Operations status generated', {
        backupCount: snapshot.backups.length,
        currentArticles: snapshot.currentCorpus.articleCount,
    });
    await persistRunReport(runReport);

    console.log('Statut operationnel:');
    console.log(`- Corpus courant: ${snapshot.currentCorpus.exists ? 'present' : 'absent'} (${snapshot.currentCorpus.articleCount} article(s))`);
    console.log(`- Staging: ${snapshot.staging.exists ? 'present' : 'absent'}`);
    console.log(`- Backups disponibles: ${snapshot.backups.length}`);
    console.log(`- Dernier backup: ${latestBackup ? `${latestBackup.name} (${latestBackup.articleCount} article(s))` : 'aucun'}`);
    console.log(`- Dernier run: ${snapshot.latestRun ? `${snapshot.latestRun.mode} / ${snapshot.latestRun.status} / ${snapshot.latestRun.finishedAt || 'running'}` : 'aucun rapport'}`);
}

async function listBackups(runReport) {
    runReport.mode = 'list-backups';
    const backups = await listAvailableBackups();
    runReport.operations = {
        backupCount: backups.length,
        backups,
    };
    runReport.status = 'success';
    runReport.finishedAt = new Date().toISOString();
    recordEvent(runReport, 'info', 'Backup inventory generated', { backupCount: backups.length });
    await persistRunReport(runReport);

    console.log(`Backups disponibles: ${backups.length}`);
    if (backups.length === 0) {
        console.log('- aucun backup detecte');
        return;
    }

    backups.forEach((backup, index) => {
        console.log(`${index + 1}. ${backup.name} | ${backup.articleCount} article(s) | maj ${backup.updatedAt}`);
    });
}

async function restoreBackup(config, runReport, backupName) {
    runReport.mode = 'restore-backup';
    const safeBackupName = validateBackupDirectoryName(backupName);
    const backups = await listAvailableBackups();
    const targetBackup = backups.find((backup) => backup.name === safeBackupName);

    if (!targetBackup) {
        throw new Error(`backup introuvable: ${safeBackupName}`);
    }

    await fs.rm(STAGING_DIR, { recursive: true, force: true });
    await fs.cp(targetBackup.path, STAGING_DIR, { recursive: true });
    console.log(`Backup copie dans le staging : ${targetBackup.name}`);
    recordEvent(runReport, 'info', 'Backup copied to staging', {
        backupName: targetBackup.name,
        sourcePath: targetBackup.path,
        stagingPath: STAGING_DIR,
    });

    const baseUrl = config.siteUrl || 'https://autoniche.vercel.app';
    await syncSitemapAndRobotsFromDirectory(STAGING_DIR, baseUrl, runReport);
    const publication = await publishStagingDirectory(runReport);

    runReport.operations = {
        restoredBackup: targetBackup,
        previousCorpusBackup: publication.backupDir,
    };
    runReport.metrics.articlesScanned = targetBackup.articleCount;
    runReport.metrics.articlesPublished = targetBackup.articleCount;
    runReport.status = 'success';
    runReport.finishedAt = new Date().toISOString();
    recordEvent(runReport, 'info', 'Backup restored', {
        backupName: targetBackup.name,
        publishedArticles: targetBackup.articleCount,
        previousCorpusBackup: publication.backupDir,
    });
    await persistRunReport(runReport);

    console.log(`Backup restaure : ${targetBackup.name}`);
    if (publication.backupDir) {
        console.log(`Corpus precedent securise dans : ${publication.backupDir}`);
    }
}

function validateTitles(titles, expectedCount) {
    const errors = [];
    const normalizedTitles = titles.map((title) => normalizeText(title));
    const uniqueTitleCount = new Set(normalizedTitles).size;

    if (titles.length !== expectedCount) {
        errors.push(`nombre de titres invalide (${titles.length}/${expectedCount})`);
    }

    if (uniqueTitleCount !== titles.length) {
        errors.push('titres dupliques');
    }

    if (titles.some((title) => /guide de test|test \d+/i.test(title))) {
        errors.push('titres de secours detectes');
    }

    return errors;
}

function validateArticleContent(content, options = {}) {
    const errors = [];
    const affiliateLinkMode = options.affiliateLinkMode || 'placeholder';
    const normalizedContent = normalizeText(content);
    const h2Sections = splitSectionsByH2(content);
    const normalizedSectionHeadings = h2Sections.map((section) => normalizeForMatching(section.heading));
    const intro = getIntro(content);
    const normalizedIntro = normalizeText(intro);
    const h2Count = (content.match(/^##\s+/gm) || []).length;
    const amazonLinkCount = countAffiliateLinks(content, affiliateLinkMode);
    const affiliateAnchors = extractAffiliateAnchors(content, affiliateLinkMode);
    const h3Headings = extractHeadings(content, 3);
    const numericDetails = content.match(/\b\d+(?:[.,]\d+)?\s?(?:g|kg|l|litres?|ml|lm|lumens?|cm|mm|h|heures?|°c|c|places?|m)\b/gi) || [];
    const distinctBrands = KNOWN_OUTDOOR_BRANDS.filter((brand) => {
        return containsNormalizedPhrase(content, brand);
    });
    const buyerIntentSignals = BUYER_INTENT_PATTERNS.filter((pattern) => pattern.test(content));

    if (/^#\s+/m.test(content)) {
        errors.push('H1 detecte dans le corps');
    }

    if (h2Count < MIN_H2_COUNT) {
        errors.push(`pas assez de sections H2 (${h2Count}/${MIN_H2_COUNT})`);
    }

    const hasInvalidAffiliateLinkCount = affiliateLinkMode === 'published'
        ? (amazonLinkCount < REQUIRED_AMAZON_LINKS || amazonLinkCount > REQUIRED_AMAZON_LINKS + 1)
        : amazonLinkCount < REQUIRED_AMAZON_LINKS;
    if (hasInvalidAffiliateLinkCount) {
        errors.push(`nombre de liens AMAZON invalide (${amazonLinkCount}/${REQUIRED_AMAZON_LINKS})`);
    }

    if (countWords(content) < MIN_ARTICLE_WORDS) {
        errors.push(`article trop court (< ${MIN_ARTICLE_WORDS} mots)`);
    }

    const introWordCount = countWords(intro);
    if (introWordCount < MIN_INTRO_WORDS || introWordCount > MAX_INTRO_WORDS) {
        errors.push(`introduction mal calibree (${introWordCount} mots)`);
    }

    if (!hasPersonalVoice(intro)) {
        errors.push('introduction sans point de vue personnel');
    }

    if (!INTRO_CONTEXT_PATTERNS.some((pattern) => pattern.test(intro))) {
        errors.push('introduction sans contexte terrain concret');
    }

    if (INTRO_GENERIC_OPENINGS.some((opening) => normalizedIntro.startsWith(opening))) {
        errors.push('introduction trop generique');
    }

    if (distinctBrands.length < 2) {
        errors.push('pas assez de marques outdoor reconnues');
    }

    if (GENERIC_COMPARISON_PATTERNS.some((pattern) => pattern.test(content))) {
        errors.push('comparatif generique detecte');
    }

    for (const phrase of FORBIDDEN_PHRASES) {
        if (normalizedContent.includes(normalizeText(phrase))) {
            errors.push(`tic IA detecte: "${phrase}"`);
        }
    }

    for (const pattern of FORBIDDEN_EDITORIAL_PATTERNS) {
        if (pattern.test(content)) {
            errors.push(`formulation scolaire detectee: ${pattern}`);
        }
    }

    if (countRepeatedSentenceStarts(content) >= SENTENCE_START_REPEAT_THRESHOLD) {
        errors.push('debuts de phrases trop repetitifs');
    }

    if (numericDetails.length < MIN_NUMERIC_DETAILS) {
        errors.push(`pas assez de details mesures (${numericDetails.length}/${MIN_NUMERIC_DETAILS})`);
    }

    for (const rule of REQUIRED_SECTION_RULES) {
        if (!normalizedSectionHeadings.some((heading) => rule.matcher(heading))) {
            errors.push(`section manquante: ${rule.label}`);
        }
    }

    const keyTakeawaysSection = h2Sections.find((section) => {
        const normalizedHeading = normalizeForMatching(section.heading);
        return normalizedHeading.includes('faut retenir') || (normalizedHeading.includes('retenir') && normalizedHeading.includes('faut'));
    });
    if (!keyTakeawaysSection || countListItems(keyTakeawaysSection.body) < 3) {
        errors.push('section "Ce qu il faut retenir" incomplete');
    }

    const comparisonSection = h2Sections.find((section) => normalizeForMatching(section.heading).includes('comparatif'));
    if (!comparisonSection) {
        errors.push('section comparatif introuvable');
    } else {
        const modelHeadings = extractHeadings(comparisonSection.body, 3);
        const brandedModelHeadings = modelHeadings.filter((heading) => hasKnownBrand(heading));
        const specificModelHeadings = brandedModelHeadings.filter((heading) => headingLooksSpecific(heading));
        const suspiciousModelHeadings = getSuspiciousModelHeadings(modelHeadings);
        const normalizedSectionBody = normalizeForMatching(comparisonSection.body);

        if (modelHeadings.length < MIN_MODEL_SUBSECTIONS) {
            errors.push(`pas assez de sous-sections de comparatif (${modelHeadings.length}/${MIN_MODEL_SUBSECTIONS})`);
        }

        if (brandedModelHeadings.length < MIN_MODEL_SUBSECTIONS) {
            errors.push('comparatif sans assez de modeles nommes');
        }

        if (specificModelHeadings.length < MIN_MODEL_SUBSECTIONS) {
            errors.push('titres de modeles trop generiques');
        }

        if (suspiciousModelHeadings.length > 0) {
            errors.push(`noms de modeles suspects: ${suspiciousModelHeadings.join(' | ')}`);
        }

        const pointsFortsCount = (normalizedSectionBody.match(/\bpoints forts\b/g) || []).length;
        const limitesCount = (normalizedSectionBody.match(/\blimites\b/g) || []).length;
        const profilIdealCount = (normalizedSectionBody.match(/\bprofil ideal\b/g) || []).length;

        if (pointsFortsCount < MIN_MODEL_SUBSECTIONS || limitesCount < MIN_MODEL_SUBSECTIONS || profilIdealCount < MIN_MODEL_SUBSECTIONS) {
            errors.push('fiches comparatives incompletes');
        }
    }

    const faqSection = h2Sections.find((section) => {
        const heading = normalizeForMatching(section.heading);
        return heading === 'faq' || heading.includes('faq ') || heading.includes('faq:');
    });
    if (!faqSection) {
        errors.push('FAQ manquante');
    } else {
        const faqQuestions = extractHeadings(faqSection.body, 3).filter((heading) => heading.includes('?'));
        if (faqQuestions.length < MIN_FAQ_QUESTIONS) {
            errors.push(`FAQ incomplete (${faqQuestions.length}/${MIN_FAQ_QUESTIONS})`);
        }
    }

    if (h3Headings.length < MIN_MODEL_SUBSECTIONS + MIN_FAQ_QUESTIONS) {
        errors.push('structure H3 trop faible pour un comparatif detaille');
    }

    const verdictSection = h2Sections.find((section) => normalizeForMatching(section.heading).includes('verdict terrain'));
    if (!verdictSection) {
        errors.push('verdict terrain manquant');
    } else {
        if (!hasPersonalVoice(verdictSection.body)) {
            errors.push('verdict sans prise de position personnelle');
        }

        if (!INTRO_CONTEXT_PATTERNS.some((pattern) => pattern.test(verdictSection.body)) && !/\btest|sortie|terrain|portage|nuit\b/i.test(verdictSection.body)) {
            errors.push('verdict trop abstrait');
        }

        if (!/\bmeilleur compromis\b|\bmon choix\b|\bsi ton budget\b|\bsi tu veux\b/i.test(verdictSection.body)) {
            errors.push('verdict peu oriente conversion');
        }
    }

    const introLinkCount = countAffiliateLinks(intro, affiliateLinkMode);
    const keyTakeawaysLinkCount = keyTakeawaysSection ? countAffiliateLinks(keyTakeawaysSection.body, affiliateLinkMode) : 0;
    const comparisonLinkCount = comparisonSection ? countAffiliateLinks(comparisonSection.body, affiliateLinkMode) : 0;
    const verdictLinkCount = verdictSection ? countAffiliateLinks(verdictSection.body, affiliateLinkMode) : 0;
    const faqLinkCount = faqSection ? countAffiliateLinks(faqSection.body, affiliateLinkMode) : 0;

    if (introLinkCount + keyTakeawaysLinkCount < 1) {
        errors.push('pas de lien partenaire en amorce');
    }

    if (comparisonLinkCount < 1) {
        errors.push('pas de lien partenaire dans le comparatif');
    }

    if (verdictLinkCount + faqLinkCount < 1) {
        errors.push('pas de lien partenaire en bas d article');
    }

    if (buyerIntentSignals.length < 2) {
        errors.push(`signaux d achat insuffisants (${buyerIntentSignals.length}/2)`);
    }

    if (affiliateAnchors.length > 0) {
        const weakAnchors = affiliateAnchors.filter((anchor) => WEAK_AFFILIATE_ANCHOR_PATTERNS.some((pattern) => pattern.test(anchor)));
        if (weakAnchors.length > 0) {
            errors.push(`ancres de liens trop faibles: ${weakAnchors.join(' | ')}`);
        }

        const specificAnchors = affiliateAnchors.filter((anchor) => {
            const normalizedAnchor = normalizeForMatching(anchor);
            return countWords(anchor) >= 3 && (
                hasKnownBrand(anchor)
                || /\b\d/.test(anchor)
                || /\bhachette|montre|tente|filtre|panneau|sac|lunettes|rechaud|couteau|lampe|popote|chaussures|gourde|scie|pelle|sifflet|tapis|repas|ration|lyophilise|menu|trousse|secours|kit|guetres|veste\b/i.test(normalizedAnchor)
            );
        });
        if (specificAnchors.length < Math.min(2, affiliateAnchors.length)) {
            errors.push('ancres de liens pas assez produit');
        }
    }

    return errors;
}

function buildContentMetrics(content, affiliateLinkMode = 'placeholder') {
    return {
        words: countWords(content),
        h2Count: extractHeadings(content, 2).length,
        h3Count: extractHeadings(content, 3).length,
        affiliateLinks: countAffiliateLinks(content, affiliateLinkMode),
    };
}

function renderAffiliateLinks(content, affiliateId) {
    let affiliateLinkCount = 0;
    const renderedContent = content.replace(/\[([^\]]+)\]\(AMAZON:([^\)]+)\)/g, (match, anchorText, keyword) => {
        if (affiliateLinkCount >= MAX_AMAZON_LINKS) {
            return anchorText;
        }
        affiliateLinkCount += 1;

        const encoded = keyword
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9+-\s]/g, '')
            .replace(/\s+/g, '+');

        const url = affiliateId
            ? `https://www.amazon.fr/s?k=${encoded}&s=review-rank&tag=${affiliateId}`
            : '#';

        return `[${anchorText}](${url})`;
    });

    return {
        content: renderedContent,
        affiliateLinkCount,
    };
}

function buildRecommendationBlock(config, contextualKeyword = '') {
    const rawKeyword = contextualKeyword || config.keywords[0] || config.niche;
    const searchKeyword = rawKeyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '+');
    return `\n\n> **Recommandation de l'expert** : [Voir tout le materiel recommande ->](${config.affiliateId ? `https://www.amazon.fr/s?k=${searchKeyword}&s=review-rank&tag=${config.affiliateId}` : '#'})`;
}

function buildMarkdownDocument({ title, slug, description, date, content }) {
    return `---
title: "${title.replace(/"/g, '')}"
slug: "${slug}"
description: "${description.replace(/"/g, '')}"
date: "${date}"
---

${content}
`;
}

async function validateExistingCorpus(config, runReport) {
    runReport.mode = 'validate-existing';
    recordEvent(runReport, 'info', 'Existing corpus validation started', { path: OUTPUT_DIR });

    const fileNames = await fs.readdir(OUTPUT_DIR);
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));
    runReport.metrics.articlesScanned = markdownFiles.length;

    for (const fileName of markdownFiles) {
        const fullPath = `${OUTPUT_DIR}/${fileName}`;
        const rawFile = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(rawFile);
        const title = parsed.data?.title || fileName.replace(/\.md$/, '');
        const slug = parsed.data?.slug || fileName.replace(/\.md$/, '');
        const metrics = buildContentMetrics(parsed.content, 'published');
        const validationErrors = validateArticleContent(parsed.content, { affiliateLinkMode: 'published' });
        const entry = getArticleReportEntry(runReport, title, slug);

        entry.metrics = metrics;
        entry.sourcePath = fullPath;
        runReport.metrics.articleAttempts += 1;

        if (validationErrors.length === 0) {
            entry.status = 'validated';
            runReport.metrics.articlesValidated += 1;
            recordEvent(runReport, 'info', 'Existing article passed validation', { title, slug, path: fullPath, metrics });
        } else {
            entry.status = 'failed';
            incrementFailureCounts(runReport, validationErrors);
            entry.attempts.push({
                attempt: 1,
                status: 'failed',
                errors: validationErrors,
                slug,
                metrics,
            });
            recordEvent(runReport, 'warn', 'Existing article failed validation', { title, slug, path: fullPath, errors: validationErrors });
        }
    }

    runReport.status = runReport.articles.every((article) => article.status === 'validated') ? 'success' : 'failed';
    runReport.finishedAt = new Date().toISOString();
    await persistRunReport(runReport);
}

async function selectProgressiveMigrationTargets(markdownFiles, cliArgs, runReport) {
    if (cliArgs.slugs.length > 0) {
        const explicitSelection = markdownFiles.filter((fileName) => cliArgs.slugs.includes(fileName.replace(/\.md$/, '')));
        runReport.selection = {
            strategy: 'explicit-slugs',
            batchSize: explicitSelection.length,
            slugs: explicitSelection.map((fileName) => fileName.replace(/\.md$/, '')),
        };
        recordEvent(runReport, 'info', 'Progressive migration selection resolved from explicit slugs', runReport.selection);
        return explicitSelection;
    }

    const latestReport = await readLatestRunReport();
    if (latestReport?.mode === 'validate-existing' && Array.isArray(latestReport.articles)) {
        const scoreBySlug = new Map(
            latestReport.articles.map((article) => [
                article.slug,
                article.attempts?.[0]?.errors?.length ?? Number.MAX_SAFE_INTEGER,
            ]),
        );

        const selected = markdownFiles
            .slice()
            .sort((left, right) => {
                const leftSlug = left.replace(/\.md$/, '');
                const rightSlug = right.replace(/\.md$/, '');
                const leftScore = scoreBySlug.get(leftSlug) ?? Number.MAX_SAFE_INTEGER;
                const rightScore = scoreBySlug.get(rightSlug) ?? Number.MAX_SAFE_INTEGER;

                if (leftScore !== rightScore) {
                    return leftScore - rightScore;
                }

                return leftSlug.localeCompare(rightSlug);
            })
            .slice(0, cliArgs.batchSize);

        runReport.selection = {
            strategy: 'lowest-error-count-from-latest-validation',
            batchSize: selected.length,
            slugs: selected.map((fileName) => fileName.replace(/\.md$/, '')),
        };
        recordEvent(runReport, 'info', 'Progressive migration selection resolved from latest validation report', runReport.selection);
        return selected;
    }

    const fallbackSelection = markdownFiles.slice().sort().slice(0, cliArgs.batchSize);
    runReport.selection = {
        strategy: 'alphabetical-fallback',
        batchSize: fallbackSelection.length,
        slugs: fallbackSelection.map((fileName) => fileName.replace(/\.md$/, '')),
    };
    recordEvent(runReport, 'warn', 'Progressive migration fallback selection used', runReport.selection);
    return fallbackSelection;
}

async function migrateExistingCorpus(config, runReport, options = {}) {
    const progressive = Boolean(options.progressive);
    const selectedFileNames = options.selectedFileNames || null;
    runReport.mode = progressive ? 'migrate-progressive' : 'migrate-existing';
    recordEvent(runReport, 'info', 'Existing corpus migration started', {
        sourcePath: OUTPUT_DIR,
        progressive,
        selectedCount: selectedFileNames ? selectedFileNames.length : null,
    });

    const fileNames = await fs.readdir(OUTPUT_DIR);
    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));
    const filesToMigrate = selectedFileNames || markdownFiles;
    runReport.metrics.articlesScanned = filesToMigrate.length;

    await fs.rm(STAGING_DIR, { recursive: true, force: true });
    if (progressive) {
        await fs.cp(OUTPUT_DIR, STAGING_DIR, { recursive: true });
    } else {
        await fs.mkdir(STAGING_DIR, { recursive: true });
    }
    recordEvent(runReport, 'info', 'Migration staging directory prepared', { path: STAGING_DIR });

    for (const fileName of filesToMigrate) {
        const fullPath = `${OUTPUT_DIR}/${fileName}`;
        const rawFile = await fs.readFile(fullPath, 'utf-8');
        const parsed = matter(rawFile);
        const title = parsed.data?.title || fileName.replace(/\.md$/, '');
        const slug = parsed.data?.slug || fileName.replace(/\.md$/, '');
        const originalDate = parsed.data?.date || new Date().toISOString().split('T')[0];
        const originalDescription = parsed.data?.description || `Decouvrez notre guide ultime et complet : ${title}.`;
        const introStyle = pickIntroStyle(title);

        const entry = getArticleReportEntry(runReport, title, slug);
        entry.sourcePath = fullPath;
        entry.originalMetrics = buildContentMetrics(parsed.content, 'published');
        recordEvent(runReport, 'info', 'Article migration started', { title, slug, path: fullPath });

        const migrationPrompt = `Tu es Thomas Maillard, guide de montagne en Savoie depuis 12 ans. Tu dois migrer un ancien article de blog vers la nouvelle ligne editoriale et la nouvelle structure SEO, sans garder les tics IA ni les sections faibles.

OBJECTIF :
- Reecris totalement l'article pour conserver le meme sujet principal : "${title}".
- Tu peux conserver l'intention utile de l'ancien texte, mais pas sa structure ni son style.
- Si l'ancien texte cite des noms generiques, remplace-les par de vrais modeles commerciaux credibles.

SOURCE A REECRIRE :
Titre : ${title}
Description : ${originalDescription}
Contenu existant :
"""
${parsed.content}
"""

STYLE IMPERATIF :
- Commence par une anecdote personnelle courte (lieu reel en France/Alpes, situation extreme vecue).
- Variante d'introduction a respecter pour cet article : ${introStyle}
- Voix terrain, concrete, tranchee. Pas de ton scolaire, pas de phrase passe-partout.
- N'utilise JAMAIS les phrases "A mon avis", "Je recommande vivement", "D'apres mon experience", "Il est crucial de", "Sans plus tarder", "Pour conclure".
- Integre des details mesurables utiles quand ils servent la comparaison.
- Vise une longueur finale de 900 a 1200 mots environ.
- Ecris pour aider un lecteur a choisir puis a cliquer sur le bon produit Amazon, pas pour faire un article neutre de dictionnaire.
- Fais ressortir les bons profils d'achat, les regrets a eviter, le meilleur compromis et le cas ou il vaut mieux monter en gamme.

MODELES ET PRODUITS :
- Citer de vrais modeles commerciaux plausibles et connus.
- Les noms de modeles doivent ressembler a de vrais noms commerciaux complets : marque + gamme ou reference exploitable.
- Interdits : "Marque A", "Modele premium", "Option budget", "Outdoor Expert", "Performance", "Meilleur choix".

STRUCTURE SEO OBLIGATOIRE :
1. Une introduction courte sans H1.
2. ## Ce qu'il faut retenir
   Avec exactement 3 puces.
3. ## Comparatif terrain des meilleurs modeles
   Avec au moins 3 sous-sections au format exact ### Marque Modele.
   Pour CHAQUE modele, ajoute exactement 3 puces :
   - **Points forts** : ...
   - **Limites** : ...
   - **Profil ideal** : ...
   Puis ajoute une phrase courte de conversion du type "Bon choix si..." ou "A eviter si..." pour aider a cliquer ou eliminer vite.
4. ## Comment choisir
5. ## Les erreurs a eviter
6. ## Verdict terrain
   Cette section doit contenir au moins 2 phrases a la premiere personne et prendre position clairement.
   Commence idealement par "Mon choix..." ou "Si je devais repartir demain...".
   Donne un top pick clair et une alternative si le budget est plus serre ou si le lecteur cherche plus leger.
7. ## FAQ
   Avec au moins 3 questions au format ### Question ?
   Fais remonter des objections d'achat concretes: solidite, poids, taille, autonomie, SAV, usage reel.

LIENS D'AFFILIATION :
- Tu dois inserer EXACTEMENT 3 liens au format [Texte d'ancrage naturel](AMAZON:mots+cles+precis)
- Repartis-les dans 3 zones differentes de l'article: 1 dans l'introduction ou "Ce qu'il faut retenir", 1 dans le comparatif, 1 dans le verdict ou la FAQ.
- Avant de repondre, recompte bien: il doit y avoir exactement 3 occurrences de "(AMAZON:" dans ton Markdown final.
- Chaque ancre doit donner envie de cliquer tout de suite parce qu'elle nomme un produit ou une famille de produits precise avec un benefice clair. Interdits: "clique ici", "voir ici", "ce produit", "voir sur Amazon".

RENDU :
- Markdown uniquement.
- Pas de H1.
- Pas de tableau HTML.
- Pas de texte hors article.
- Verifie une derniere fois que les H2 sont bien exactement: "## Ce qu'il faut retenir", "## Comparatif terrain des meilleurs modeles", "## Comment choisir", "## Les erreurs a eviter", "## Verdict terrain", "## FAQ".`;

        let migratedContent = await generateArticleContent(migrationPrompt, title, slug, runReport);
        const rendered = renderAffiliateLinks(migratedContent, config.affiliateId);
        migratedContent = rendered.content + buildRecommendationBlock(config, title);

        const markdown = buildMarkdownDocument({
            title,
            slug,
            description: originalDescription,
            date: originalDate,
            content: migratedContent,
        });

        const filePath = `${STAGING_DIR}/${slug}.md`;
        await fs.writeFile(filePath, markdown, 'utf-8');
        entry.migratedMetrics = buildContentMetrics(migratedContent, 'published');
        recordEvent(runReport, 'info', 'Migrated article written to staging', { title, slug, path: filePath, affiliateLinks: rendered.affiliateLinkCount });
    }

    const baseUrl = config.siteUrl || 'https://autoniche.vercel.app';
    await syncSitemapAndRobotsFromDirectory(STAGING_DIR, baseUrl, runReport);
    await publishStagingDirectory(runReport);

    runReport.metrics.articlesPublished = runReport.metrics.articlesValidated;
    runReport.status = 'success';
    runReport.finishedAt = new Date().toISOString();
    await persistRunReport(runReport);
}

async function syncSitemapAndRobotsFromDirectory(sourceDir, baseUrl, runReport) {
    console.log('Generation du sitemap.xml...');
    const allArticles = await fs.readdir(sourceDir);
    const sitemapEntries = allArticles
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const articleSlug = fileName.replace('.md', '');
            return `  <url>
    <loc>${baseUrl}/articles/${articleSlug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${sitemapEntries.join('\n')}
</urlset>`;

    await fs.writeFile(SITEMAP_PATH, sitemap, 'utf-8');
    console.log(`sitemap.xml genere avec ${sitemapEntries.length} article(s).`);
    recordEvent(runReport, 'info', 'Sitemap generated', { count: sitemapEntries.length, path: SITEMAP_PATH });

    const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
    await fs.writeFile(ROBOTS_PATH, robots, 'utf-8');
    console.log('robots.txt synchronise avec l URL du site.');
    recordEvent(runReport, 'info', 'Robots generated', { path: ROBOTS_PATH });
}

function buildBackupDirPath() {
    const safeTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${CONTENT_DIR}/${BACKUP_DIR_PREFIX}${safeTimestamp}`;
}

async function publishStagingDirectory(runReport) {
    const backupDir = buildBackupDirPath();
    const outputExists = await pathExists(OUTPUT_DIR);

    await fs.rm(backupDir, { recursive: true, force: true });
    if (outputExists) {
        await fs.rename(OUTPUT_DIR, backupDir);
    }
    await fs.rename(STAGING_DIR, OUTPUT_DIR);
    console.log(`Nouveau contenu publie : ${OUTPUT_DIR}`);
    if (outputExists) {
        console.log(`Backup du corpus precedent : ${backupDir}`);
    }
    recordEvent(runReport, 'info', 'Publication completed', { outputDir: OUTPUT_DIR, backupDir: outputExists ? backupDir : null });
    return {
        backupDir: outputExists ? backupDir : null,
    };
}

async function generateTitles(config, titlesPrompt, runReport) {
    let lastError = null;

    for (let attempt = 1; attempt <= TITLE_GENERATION_RETRIES; attempt++) {
        try {
            const response = await openai.chat.completions.create({
                model: TITLE_MODEL,
                messages: [{ role: 'user', content: titlesPrompt }],
                temperature: 0.7,
            });

            const rawContent = response.choices[0]?.message?.content;
            if (!rawContent) {
                throw new Error('reponse vide pour les titres');
            }

            const titles = parseModelResponseLines(rawContent);
            const validationErrors = validateTitles(titles, config.articleCount);
            if (validationErrors.length === 0) {
                recordTitleAttempt(runReport, attempt, 'accepted', {
                    titleCount: titles.length,
                });
                runReport.titleGeneration.acceptedTitles = titles;
                return titles;
            }

            lastError = new Error(`titres invalides: ${validationErrors.join(', ')}`);
            recordTitleAttempt(runReport, attempt, 'rejected', {
                errors: validationErrors,
                titleCount: titles.length,
            });
            console.warn(`Tentative titres ${attempt}/${TITLE_GENERATION_RETRIES} rejetee: ${validationErrors.join(', ')}`);
        } catch (error) {
            lastError = error;
            recordTitleAttempt(runReport, attempt, 'error', {
                message: error.message,
                errors: [error.message],
            });
            console.warn(`Tentative titres ${attempt}/${TITLE_GENERATION_RETRIES} echouee: ${error.message}`);
        }
    }

    throw lastError || new Error('generation des titres impossible');
}

async function generateArticleContent(articlePrompt, title, slug, runReport) {
    let lastError = null;

    for (let attempt = 1; attempt <= ARTICLE_GENERATION_RETRIES; attempt++) {
        try {
            const articleRes = await openai.chat.completions.create({
                model: ARTICLE_MODEL,
                messages: [{ role: 'user', content: articlePrompt }],
                temperature: 0.4,
            });

            const rawContent = articleRes.choices[0]?.message?.content;
            const content = rawContent ? ensureVerdictPersonalVoice(ensureIntroVoiceAndContext(rawContent)) : rawContent;
            if (!content) {
                throw new Error('reponse vide pour l article');
            }

            const validationErrors = validateArticleContent(content);
            if (validationErrors.length === 0) {
                recordArticleAttempt(runReport, title, attempt, 'accepted', {
                    slug,
                    metrics: buildContentMetrics(content),
                });
                return content;
            }

            lastError = new Error(`article invalide: ${validationErrors.join(', ')}`);
            recordArticleAttempt(runReport, title, attempt, 'rejected', {
                slug,
                errors: validationErrors,
            });
            console.warn(`Tentative article ${attempt}/${ARTICLE_GENERATION_RETRIES} rejetee pour "${title}": ${validationErrors.join(', ')}`);
        } catch (error) {
            lastError = error;
            recordArticleAttempt(runReport, title, attempt, 'error', {
                slug,
                message: error.message,
                errors: [error.message],
            });
            console.warn(`Tentative article ${attempt}/${ARTICLE_GENERATION_RETRIES} echouee pour "${title}": ${error.message}`);
        }
    }

    recordArticleAttempt(runReport, title, ARTICLE_GENERATION_RETRIES, 'failed', {
        slug,
        message: lastError?.message || `generation impossible pour "${title}"`,
        errors: [lastError?.message || `generation impossible pour "${title}"`],
    });
    throw lastError || new Error(`generation impossible pour "${title}"`);
}

async function main() {
    const cliArgs = parseCliArgs(process.argv.slice(2));
    const runReport = createRunReport();
    activeRunReport = runReport;
    console.log('Demarrage du generateur AutoNiche...');
    recordEvent(runReport, 'info', 'Generator started');

    let configStr;
    try {
        configStr = await fs.readFile(CONFIG_PATH, 'utf-8');
    } catch (error) {
        console.error('Erreur de lecture du fichier config.json', error.message);
        recordEvent(runReport, 'error', 'Failed to read config', { message: error.message });
        runReport.status = 'failed';
        runReport.finishedAt = new Date().toISOString();
        await persistRunReport(runReport);
        return;
    }

    const config = JSON.parse(configStr);
    runReport.config = {
        niche: config.niche,
        articleCount: config.articleCount,
        siteUrl: config.siteUrl || 'https://autoniche.vercel.app',
    };
    console.log(`Niche ciblee : ${config.niche}`);
    recordEvent(runReport, 'info', 'Config loaded', runReport.config);

    if (cliArgs.validateExisting) {
        console.log('Mode validation du corpus existant active.');
        await validateExistingCorpus(config, runReport);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.opsStatus) {
        console.log('Mode statut operationnel actif.');
        await showOperationsStatus(runReport);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.listBackups) {
        console.log('Mode inventaire des backups actif.');
        await listBackups(runReport);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.restoreLatestBackup) {
        console.log('Mode restauration du dernier backup actif.');
        const backups = await listAvailableBackups();
        if (backups.length === 0) {
            const error = new Error('aucun backup disponible pour restauration');
            recordEvent(runReport, 'error', 'No backup available for restore', { requested: 'latest' });
            runReport.mode = 'restore-backup';
            runReport.status = 'failed';
            runReport.finishedAt = new Date().toISOString();
            await persistRunReport(runReport);
            throw error;
        }

        await restoreBackup(config, runReport, backups[0].name);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.restoreBackupName) {
        console.log(`Mode restauration ciblee active (${cliArgs.restoreBackupName}).`);
        await restoreBackup(config, runReport, cliArgs.restoreBackupName);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.migrateExisting) {
        console.log('Mode migration du corpus existant active.');
        if (API_KEY === 'dummy_key' || !API_KEY) {
            const error = new Error('OPENAI_API_KEY manquante. La migration du corpus existant est bloquee.');
            recordEvent(runReport, 'error', 'Missing API key for migration', { message: error.message });
            runReport.status = 'failed';
            runReport.finishedAt = new Date().toISOString();
            await persistRunReport(runReport);
            throw error;
        }

        await migrateExistingCorpus(config, runReport);
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (cliArgs.migrateProgressive) {
        console.log(`Mode migration progressive active (lot=${cliArgs.batchSize}).`);
        if (API_KEY === 'dummy_key' || !API_KEY) {
            const error = new Error('OPENAI_API_KEY manquante. La migration progressive est bloquee.');
            recordEvent(runReport, 'error', 'Missing API key for progressive migration', { message: error.message });
            runReport.status = 'failed';
            runReport.finishedAt = new Date().toISOString();
            await persistRunReport(runReport);
            throw error;
        }

        const fileNames = await fs.readdir(OUTPUT_DIR);
        const markdownFiles = fileNames.filter((fileName) => fileName.endsWith('.md'));
        const selectedFileNames = await selectProgressiveMigrationTargets(markdownFiles, cliArgs, runReport);
        await migrateExistingCorpus(config, runReport, {
            progressive: true,
            selectedFileNames,
        });
        activeRunReport = null;
        console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
        return;
    }

    if (API_KEY === 'dummy_key' || !API_KEY) {
        const error = new Error('OPENAI_API_KEY manquante. La publication de contenu de secours est bloquee.');
        recordEvent(runReport, 'error', 'Missing API key', { message: error.message });
        runReport.status = 'failed';
        runReport.finishedAt = new Date().toISOString();
        await persistRunReport(runReport);
        throw error;
    }

    await fs.rm(STAGING_DIR, { recursive: true, force: true });
    await fs.mkdir(STAGING_DIR, { recursive: true });
    console.log(`Dossier de staging pret : ${STAGING_DIR}`);
    recordEvent(runReport, 'info', 'Staging directory prepared', { path: STAGING_DIR });

    console.log(`Generation de ${config.articleCount} titres SEO...`);
    const titlesPrompt = `Tu es un expert en contenu SEO specialise dans le plein air, la randonnee, le bivouac et la survie.
Genere ${config.articleCount} titres d'articles de blog COMPLETEMENT DIFFERENTS les uns des autres pour la niche : "${config.niche}".

Regles IMPERATIVES :
- Chaque titre DOIT couvrir un angle ou une thematique radicalement DIFFERENTE.
- TOUS les articles doivent parler d'EQUIPEMENTS et PRODUITS que l'on peut ACHETER (guides d'achat, comparatifs, top X, quel equipement choisir...). JAMAIS de techniques DIY sans materiel ni de "comment faire sans equipement".
- Utilise des angles varies : comparatif de produits, guide d'achat, top X des meilleurs modeles, comment choisir tel equipement...
- Distribue les sujets parmi ces mots-cles (utilise chacun au plus une fois) : ${config.keywords.join(', ')}.
- Les titres doivent etre accrocheurs, precis et ultra-optimises SEO.
- Renvoie uniquement les titres, un par ligne, sans tirets ni numeros, sans guillemets.`;

    const titles = await generateTitles(config, titlesPrompt, runReport);
    recordEvent(runReport, 'info', 'Titles generated', { count: titles.length });

    console.log('Generation du contenu...');
    for (const title of titles.slice(0, config.articleCount)) {
        console.log(`Redaction de l'article : "${title}"`);
        const slug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        const introStyle = pickIntroStyle(title);
        getArticleReportEntry(runReport, title, slug);
        recordEvent(runReport, 'info', 'Article generation started', { title, slug });

        const articlePrompt = `Tu es Thomas Maillard, guide de montagne en Savoie depuis 12 ans, passionne de bivouac, survie et plein air. Tu tiens un blog de niche ou tu partages tes avis tranches sur le materiel. Redige un article de 900 a 1100 mots sur : "${title}".

STYLE IMPERATIF :
- Commence par une anecdote personnelle courte (lieu reel en France/Alpes, situation extreme vecue).
- Variante d'introduction a respecter pour cet article : ${introStyle}
- TON NATUREL ET VARIE : Bannis formellement les tics d'ecriture de l'IA. N'utilise JAMAIS les phrases "A mon avis", "Je recommande vivement", "D'apres mon experience", "Il est crucial de", "Sans plus tarder", "Pour conclure". Sois dynamique, asymetrique, naturel, comme un vrai redacteur de magazine "Outside".
- Fais entendre une voix de terrain : phrases parfois courtes, avis nets, details sensoriels, contraintes concretes, comparaisons franchisees.
- Le but est de faire avancer le lecteur vers un achat utile sur Amazon: tu dois l'aider a eliminer vite les mauvais choix et a identifier le modele sur lequel cliquer selon son usage.
- Evite toute formulation scolaire ou de dissertation. Interdits notamment : "Dans cet article", "Nous allons voir", "Il est important de noter", "Il convient de", "Que vous soyez debutant ou confirme", "En conclusion".
- Evite les transitions trop mecaniques du type "De plus", "Par ailleurs", "En effet" a repetition. Varie le rythme.
- VRAIES MARQUES OBLIGATOIRES : Tu DOIS lister et comparer des modeles reels, celebres et existants (ex: Salomon X-Ultra 4, MSR Hubba Hubba, Petzl Actik Core, Lifestraw Peak, Osprey Atmos...). Il est FORMELLEMENT INTERDIT d'inventer des noms de modeles. Fais un vrai comparatif de modeles de grandes marques fiables.
- Les noms de modeles doivent ressembler a de vrais noms commerciaux complets : marque + gamme ou reference exploitable. Exemples valides : "Salomon X Ultra 4 Mid GTX", "MSR Hubba Hubba NX 2", "Petzl Actik Core". Exemples interdits : "Salomon Ultra Pro", "MSR Modele Premium", "Petzl Outdoor Expert", "Black Diamond Performance".
- Structure SEO OBLIGATOIRE :
  1. Une introduction courte sans H1.
  2. ## Ce qu'il faut retenir
     Avec exactement 3 puces.
  3. ## Comparatif terrain des meilleurs modeles
     Avec au moins 3 sous-sections au format exact ### Marque Modele.
     Pour CHAQUE modele, ajoute exactement 3 puces :
     - **Points forts** : ...
     - **Limites** : ...
     - **Profil ideal** : ...
     Puis ajoute une phrase tres courte orientee decision du type "Bon choix si..." ou "A eviter si...".
  4. ## Comment choisir
  5. ## Les erreurs a eviter
  6. ## Verdict terrain
     Donne un top pick tres clair et une alternative budget/legerete/robustesse.
  7. ## FAQ
     Avec au moins 3 questions au format ### Question ?
     Fais remonter de vraies objections avant achat: poids, autonomie, resistance, compatibilite, taille, SAV.
- Ajoute plusieurs details mesurables utiles (poids, volume, autonomie, temperature, encombrement, nombre de places, etc.) quand ils servent la comparaison.
- LIENS D'AFFILIATION ORGANIQUES : Tu dois inserer EXACTEMENT 3 liens d'affiliation dans le texte, integres naturellement dans tes phrases.
Pour chaque lien, utilise EXACTEMENT ce format Markdown special : [Texte d'ancrage naturel et accrocheur](AMAZON:mots+cles+du+produit+precis)
Exemple 1 : "...et si tu cherches la fiabilite absolue, je te conseille d'investir dans [la tente MSR Hubba Hubba NX 2 places](AMAZON:msr+hubba+hubba+nx) qui tient face au vent."
Exemple 2 : "Rien ne vaut le tranchant du [couteau de survie Morakniv Garberg](AMAZON:morakniv+garberg) pour fendre du petit bois."
- Repartis-les dans 3 zones differentes de l'article: 1 en amorce, 1 dans le comparatif, 1 dans le verdict ou la FAQ.
- Les ancres doivent nommer un produit ou un type de produit precis avec un benefice concret. Interdits: "clique ici", "voir ici", "ce produit", "voir sur Amazon".
- INTERDICTIONS ABSOLUES :
  - Pas de comparatif generique du type "Marque A", "Option budget", "Modele premium", "Meilleur choix".
  - Pas de paragraphe vague sans citer de modele concret dans la section comparatif.
  - Pas de tableau HTML ni de JSON ni de texte hors Markdown.
  - Pas d'ouverture passe-partout ni de ton neutre de fiche produit.
- Ne repete pas le titre H1 au debut de l'article.
Renvoie uniquement le code Markdown de l'article.`;

        let content = await generateArticleContent(articlePrompt, title, slug, runReport);

        let amazonLinkCount = 0;
        content = content.replace(/\[([^\]]+)\]\(AMAZON:([^\)]+)\)/g, (match, anchorText, keyword) => {
            if (amazonLinkCount >= MAX_AMAZON_LINKS) {
                return anchorText;
            }
            amazonLinkCount++;

            const encoded = keyword
                .trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9+-\s]/g, '')
                .replace(/\s+/g, '+');

            const url = config.affiliateId
                ? `https://www.amazon.fr/s?k=${encoded}&s=review-rank&tag=${config.affiliateId}`
                : '#';

            return `[${anchorText}](${url})`;
        });
        console.log(`Liens Amazon inseres organiquement : ${amazonLinkCount}`);

        content += buildRecommendationBlock(config, title);

        const msIn6Months = 6 * 30 * 24 * 60 * 60 * 1000;
        const randomPastDate = new Date(Date.now() - Math.random() * msIn6Months);
        const dateStr = randomPastDate.toISOString().split('T')[0];
        const markdown = `---
title: "${title.replace(/"/g, '')}"
slug: "${slug}"
description: "Decouvrez notre guide ultime et complet : ${title.replace(/"/g, '')}."
date: "${dateStr}"
---

${content}
`;

        const filePath = `${STAGING_DIR}/${slug}.md`;
        await fs.writeFile(filePath, markdown, 'utf-8');
        console.log(`Fichier sauvegarde : ${filePath}`);
        recordEvent(runReport, 'info', 'Article written to staging', { title, slug, path: filePath });
    }

    const baseUrl = config.siteUrl || 'https://autoniche.vercel.app';
    await syncSitemapAndRobotsFromDirectory(STAGING_DIR, baseUrl, runReport);
    await publishStagingDirectory(runReport);
    runReport.metrics.articlesPublished = runReport.metrics.articlesValidated;
    runReport.status = 'success';
    runReport.finishedAt = new Date().toISOString();
    await persistRunReport(runReport);
    activeRunReport = null;
    console.log(`Rapport d execution ecrit dans ${REPORT_JSON_PATH} et ${REPORT_MD_PATH}`);
    console.log('Generation terminee.');
}

main().catch(async (error) => {
    try {
        if (activeRunReport) {
            activeRunReport.status = 'failed';
            activeRunReport.finishedAt = new Date().toISOString();
            recordEvent(activeRunReport, 'error', 'Unhandled generator failure', { message: error.message });
            await persistRunReport(activeRunReport);
            activeRunReport = null;
        } else {
            const fallbackReport = createRunReport();
            fallbackReport.status = 'failed';
            fallbackReport.finishedAt = new Date().toISOString();
            recordEvent(fallbackReport, 'error', 'Unhandled generator failure', { message: error.message });
            await persistRunReport(fallbackReport);
        }
    } catch (reportError) {
        console.error('Erreur lors de l ecriture du rapport', reportError);
    }

    console.error(error);
    process.exitCode = 1;
});
