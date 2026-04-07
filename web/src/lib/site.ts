const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://guide-bivouac-survie.vercel.app";

export const siteUrl = rawSiteUrl.replace(/\/$/, "");
export const siteName = "Survie & Bivouac";
export const defaultTitle = "Survie & Bivouac | Guides Experts Terrain";
export const defaultDescription =
  "Guides d’experts pour survivre, bivouaquer et explorer la nature en toute sécurité. Sélections de matériel testées et approuvées.";

