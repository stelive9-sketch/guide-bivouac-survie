import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content/articles');

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  date: string;
  contentHtml?: string;
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

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(matterResult.content);

  // Ouvrir tous les liens externes dans un nouvel onglet
  const contentHtml = processedContent
    .toString()
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; description: string }),
  };
}
