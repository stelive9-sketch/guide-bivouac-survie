import { getArticleData, getSortedArticlesData } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const articles = getSortedArticlesData();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  if (!articleData) return {};
  return {
    title: `${articleData.title} — Survie & Bivouac`,
    description: articleData.description,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  if (!articleData) notFound();

  const readingTime = estimateReadingTime(articleData!.contentHtml || '');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData!.title,
    description: articleData!.description,
    datePublished: articleData!.date,
    dateModified: articleData!.date,
    author: {
      '@type': 'Person',
      name: 'Thomas Maillard',
      jobTitle: 'Guide de montagne',
      address: { '@type': 'PostalAddress', addressRegion: 'Savoie', addressCountry: 'FR' },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Survie & Bivouac',
      url: 'https://autoniche.vercel.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://autoniche.vercel.app/articles/${slug}`,
    },
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Header ─── */}
      <header style={{ background: 'rgba(16,22,17,0.96)', borderBottom: '1px solid rgba(90,124,92,0.18)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.3rem' }}>🏔️</span>
            <span style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: '1.15rem', color: 'var(--cream)' }}>Survie & Bivouac</span>
          </Link>
          <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Retour aux guides
          </Link>
        </div>
      </header>

      {/* ─── Article Hero ─── */}
      <div style={{ background: 'linear-gradient(180deg, rgba(16,24,17,0.98) 0%, var(--forest-mid) 100%)', padding: '56px 24px 44px', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span style={{ background: 'rgba(164,200,106,0.1)', color: 'var(--moss)', padding: '4px 11px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}>GUIDE TERRAIN</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{formatDate(articleData!.date)}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: 'clamp(1.7rem, 4vw, 2.6rem)', color: 'var(--cream)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '28px' }}>
            {articleData!.title}
          </h1>

          {/* ─── Author bar ─── */}
          <div className="author-card">
            <div className="author-avatar">🧗</div>
            <div>
              <div className="author-name">Thomas Maillard</div>
              <div className="author-bio">Guide de montagne · Savoie · 12 ans de bivouacs</div>
            </div>
            <div className="reading-time">⏱ {readingTime} min de lecture</div>
          </div>
        </div>
      </div>

      {/* ─── Article Body ─── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '52px 24px 40px' }}>
        <div className="prose" dangerouslySetInnerHTML={{ __html: articleData!.contentHtml || '' }} />

        {/* ─── Author note en fin d'article ─── */}
        <div style={{ marginTop: '56px', padding: '28px 32px', background: 'rgba(30,45,32,0.5)', border: '1px solid var(--card-border)', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3a5c3c, var(--moss))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🧗</div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--cream)', fontSize: '0.92rem' }}>Thomas Maillard</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Guide de montagne, testeur de matériel outdoor</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic' }}>
            "Tous les équipements que je recommande sur ce blog ont été testés personnellement sur le terrain. Je ne publie que ce en quoi j'ai une confiance totale."
          </p>
        </div>

        {/* ─── Back link ─── */}
        <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--card-border)' }}>
          <Link href="/" style={{ color: 'var(--sage-light)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ← Retour à tous les guides
          </Link>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--card-border)', padding: '28px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.79rem', lineHeight: 1.7 }}>
        <p>© {new Date().getFullYear()} Survie & Bivouac par Thomas Maillard</p>
        <p style={{ marginTop: '4px', fontSize: '0.73rem', opacity: 0.65 }}>Ce site participe au programme d'affiliation Amazon EU. Les liens de recommandation peuvent générer une commission sans surcoût pour vous.</p>
      </footer>

    </div>
  );
}
