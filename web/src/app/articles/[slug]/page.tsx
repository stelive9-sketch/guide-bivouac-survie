import { getArticleData, getSortedArticlesData } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const articles = getSortedArticlesData();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  if (!articleData) return {};
  return {
    title: articleData.title,
    description: articleData.description,
  }
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  
  if (!articleData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium mb-8 inline-block">
          &larr; Retour à l'accueil
        </Link>
        <article className="markdown-body max-w-none">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{articleData.title}</h1>
          <div className="text-gray-500 mb-8 pb-4 border-b border-gray-100">{articleData.date}</div>
          <div className="mt-8 text-gray-800 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: articleData.contentHtml || "" }} />
        </article>
      </div>
    </div>
  );
}
