export const moneySlugPriority = [
  'tente-trekking-2-places-ultra-legere-et-impermeable-quel-modele-choisir-pour-la-pluie',
  'top-10-des-meilleurs-sacs-de-couchage-grand-froid-pour-bivouac-hivernal-a-decouvrir-absolument',
  'guide-dachat-complet-des-filtres-a-eau-ultra-legers-avec-gourde-integree-pour-la-randonnee',
  'rechaud-a-gaz-ultra-leger-et-compact-pour-bivouac-comparaison-des-modeles-performants',
  'chaussures-de-randonnee-montantes-gore-tex-pour-trek-notre-top-5-des-modeles-durables',
  'sac-a-dos-de-randonnee-50-litres-avec-systeme-dhydratation-integre-top-modeles-a-connaitre',
  'les-meilleures-lampes-frontales-rechargeables-pour-le-trail-en-montagne-notre-top-5',
  'gourde-filtrante-purifiante-pour-randonnee-nature-laquelle-choisir-pour-une-eau-toujours-saine',
];

export const primaryMoneySlugs = moneySlugPriority.slice(0, 3);

export function prioritizeBySlug<T extends { slug: string }>(articles: T[], slugs: string[]) {
  return slugs
    .map((slug) => articles.find((article) => article.slug === slug))
    .filter((article): article is T => Boolean(article));
}
