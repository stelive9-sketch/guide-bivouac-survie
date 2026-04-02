import Link from 'next/link';
import { getSortedArticlesData } from '@/lib/markdown';

export const metadata = {
  title: 'AutoNiche - Les meilleurs guides SEO',
  description: 'Généré automatiquement via AutoNiche.',
}

export default function Home() {
  const articles = getSortedArticlesData();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
           Le Blog SEO Ultime
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">Découvrez nos guides d'experts, ultra-optimisés pour de l'affiliation sans effort.</p>
        
        <div className="grid gap-6">
          {articles.length === 0 && (
            <div className="text-center p-8 bg-white rounded-xl text-gray-500 shadow-sm">Aucun article trouvé. Lancez le générateur Node.js.</div>
          )}
          {articles.map(({ slug, title, description, date }) => (
            <Link key={slug} href={`/articles/${slug}`} className="block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <div className="text-sm text-gray-500 mt-2 mb-4">{date}</div>
                <p className="text-gray-700">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
