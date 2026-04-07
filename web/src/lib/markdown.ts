import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content/articles');

export interface AffiliateLink {
  anchor: string;
  url: string;
}

export interface ComparisonModel {
  name: string;
  pros: string;
  cons: string;
  profile: string;
  note: string;
  ctaUrl: string;
  ctaLabel: string;
}

export interface DecisionCard {
  label: string;
  modelName: string;
  reason: string;
  ctaUrl: string;
  ctaLabel: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  date: string;
  rawContent?: string;
  contentHtml?: string;
  comparisonModels?: ComparisonModel[];
  decisionCards?: DecisionCard[];
  affiliateLinks?: AffiliateLink[];
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

function extractAmazonLinks(content: string): AffiliateLink[] {
  return Array.from(content.matchAll(/\[([^\]]+)\]\((https:\/\/www\.amazon\.fr\/[^)]+)\)/g)).map((match) => ({
    anchor: stripMarkdown(match[1]),
    url: match[2],
  }));
}

function getAffiliateTag(links: AffiliateLink[]): string {
  for (const link of links) {
    try {
      const url = new URL(link.url);
      const tag = url.searchParams.get('tag');
      if (tag) return tag;
    } catch {
      continue;
    }
  }

  return '';
}

function buildAmazonSearchUrl(query: string, affiliateTag: string): string {
  const encoded = normalizeText(query).replace(/\s+/g, '+');
  const tagSuffix = affiliateTag ? `&tag=${affiliateTag}` : '';
  return `https://www.amazon.fr/s?k=${encoded}&s=review-rank${tagSuffix}`;
}

function summarizeReason(value: string): string {
  const cleaned = stripMarkdown(value).replace(/\s+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned.length > 150 ? `${cleaned.slice(0, 147).trim()}...` : cleaned;
}

function extractComparisonSection(content: string): string {
  const match = content.match(/^##\s+Comparatif[^\n]*\n([\s\S]*?)(?=^##\s+|\s*$)/m);
  return match?.[1]?.trim() || '';
}

function extractBulletedField(body: string, field: string): string {
  const pattern = new RegExp(`^-\\s+\\*\\*${field}\\*\\*\\s*:\\s*(.+)$`, 'im');
  return stripMarkdown(body.match(pattern)?.[1] || '');
}

function extractTrailingNote(body: string): string {
  const lines = body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const narrativeLine = lines.find((line) => !line.startsWith('- **'));
  return stripMarkdown(narrativeLine || '');
}

function resolveModelCtaUrl(modelName: string, sectionBody: string, allLinks: AffiliateLink[], affiliateTag: string): string {
  const localLinks = extractAmazonLinks(sectionBody);
  if (localLinks[0]?.url) {
    return localLinks[0].url;
  }

  const normalizedModel = normalizeText(modelName);
  const modelTokens = normalizedModel.split(' ').filter((token) => token.length > 2);
  const matchingLink = allLinks.find((link) => {
    const haystack = `${normalizeText(link.anchor)} ${normalizeText(link.url)}`;
    return modelTokens.some((token) => haystack.includes(token));
  });

  if (matchingLink?.url) {
    return matchingLink.url;
  }

  return buildAmazonSearchUrl(modelName, affiliateTag);
}

function buildCtaLabel(): string {
  return 'Verifier prix et avis';
}

function extractComparisonModels(content: string, affiliateLinks: AffiliateLink[]): ComparisonModel[] {
  const comparisonSection = extractComparisonSection(content);
  if (!comparisonSection) return [];

  const affiliateTag = getAffiliateTag(affiliateLinks);
  const matches = Array.from(comparisonSection.matchAll(/^###\s+(.+)$/gm));

  return matches.map((match, index) => {
    const name = stripMarkdown(match[1]);
    const bodyStart = (match.index || 0) + match[0].length;
    const bodyEnd = index + 1 < matches.length ? (matches[index + 1].index || comparisonSection.length) : comparisonSection.length;
    const body = comparisonSection.slice(bodyStart, bodyEnd).trim();
    const pros = extractBulletedField(body, 'Points forts');
    const cons = extractBulletedField(body, 'Limites');
    const profile = extractBulletedField(body, 'Profil ideal') || extractBulletedField(body, 'Profil idéal');
    const note = extractTrailingNote(body);

    return {
      name,
      pros,
      cons,
      profile,
      note,
      ctaUrl: resolveModelCtaUrl(name, body, affiliateLinks, affiliateTag),
      ctaLabel: buildCtaLabel(),
    };
  }).filter((model) => model.name.length > 0);
}

function pickDifferentModel(models: ComparisonModel[], excludedNames: string[], matcher: (model: ComparisonModel) => boolean): ComparisonModel | null {
  return models.find((model) => !excludedNames.includes(model.name) && matcher(model)) || null;
}

function buildDecisionReason(model: ComparisonModel): string {
  return summarizeReason(
    model.note || model.profile || model.pros || model.cons || 'Voir le modele le plus pertinent pour ton usage.',
  );
}

function buildDecisionCards(models: ComparisonModel[]): DecisionCard[] {
  if (models.length === 0) return [];

  const cards: DecisionCard[] = [];
  const topPick = models[0];
  cards.push({
    label: 'Meilleur Choix',
    modelName: topPick.name,
    reason: buildDecisionReason(topPick),
    ctaUrl: topPick.ctaUrl,
    ctaLabel: 'Voir le prix Amazon',
  });

  const bestValue = pickDifferentModel(
    models,
    cards.map((card) => card.modelName),
    (model) => /budget|prix|compromis|contenu|accessible|rentable|rapport/i.test(`${model.profile} ${model.note} ${model.cons} ${model.pros}`),
  ) || models[1];

  if (bestValue) {
    cards.push({
      label: 'Rapport Prix / Terrain',
      modelName: bestValue.name,
      reason: buildDecisionReason(bestValue),
      ctaUrl: bestValue.ctaUrl,
      ctaLabel: 'Verifier prix et dispo',
    });
  }

  const budgetOrLightweight = pickDifferentModel(
    models,
    cards.map((card) => card.modelName),
    (model) => /budget|leger|l[ée]ger|compact|minimal|ultra|poids|accessible/i.test(`${model.profile} ${model.note} ${model.pros}`),
  ) || models.find((model) => !cards.map((card) => card.modelName).includes(model.name));

  if (budgetOrLightweight) {
    cards.push({
      label: 'Achat Malin',
      modelName: budgetOrLightweight.name,
      reason: buildDecisionReason(budgetOrLightweight),
      ctaUrl: budgetOrLightweight.ctaUrl,
      ctaLabel: 'Comparer sur Amazon',
    });
  }

  return cards.slice(0, 3);
}

export function getSortedArticlesData(): ArticleData[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const fileNames = fs.readdirSync(contentDirectory);
  const allArticlesData = fileNames.filter(f => f.endsWith('.md')).map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      slug,
      ...(matterResult.data as { date: string; title: string; description: string }),
    };
  });

  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleData(slug: string): Promise<ArticleData | null> {
  const fullPath = path.join(contentDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const affiliateLinks = extractAmazonLinks(matterResult.content);
  const comparisonModels = extractComparisonModels(matterResult.content, affiliateLinks);
  const decisionCards = buildDecisionCards(comparisonModels);

  const processedContent = await remark()
    .use(html, { sanitize: true })
    .process(matterResult.content);

  // Ouvrir tous les liens externes dans un nouvel onglet
  const contentHtml = processedContent
    .toString()
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return {
    slug,
    rawContent: matterResult.content,
    contentHtml,
    comparisonModels,
    decisionCards,
    affiliateLinks,
    ...(matterResult.data as { date: string; title: string; description: string }),
  };
}
