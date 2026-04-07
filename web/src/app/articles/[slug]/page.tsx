import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrackedHtmlContent } from '@/components/TrackedHtmlContent';
import { TrackedLink } from '@/components/TrackedLink';
import { prioritizeBySlug, primaryMoneySlugs } from '@/lib/cro';
import { getArticleData, getSortedArticlesData } from '@/lib/markdown';
import { siteName, siteUrl } from '@/lib/site';

export async function generateStaticParams() {
  const articles = getSortedArticlesData();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  if (!articleData) return {};

  return {
    title: `${articleData.title} | ${siteName}`,
    description: articleData.description,
    alternates: {
      canonical: `/articles/${slug}`,
    },
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

function cleanDescription(value: string) {
  return value
    .replace('Decouvrez notre guide ultime et complet : ', '')
    .replace('Découvrez notre guide ultime et complet : ', '')
    .replace('DÃ©couvrez notre guide ultime et complet : ', '')
    .replace('DÃƒÂ©couvrez notre guide ultime et complet : ', '')
    .replace(/\.$/, '');
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articleData = await getArticleData(slug);
  if (!articleData) notFound();

  const allArticles = getSortedArticlesData();
  const readingTime = estimateReadingTime(articleData.contentHtml || '');
  const decisionCards = articleData.decisionCards || [];
  const comparisonModels = articleData.comparisonModels || [];
  const primaryDecision = decisionCards[0];
  const moneyRoutes = prioritizeBySlug(allArticles, primaryMoneySlugs)
    .filter((article) => article.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleData.title,
    description: articleData.description,
    datePublished: articleData.date,
    dateModified: articleData.date,
    author: {
      '@type': 'Person',
      name: 'Thomas Maillard',
      jobTitle: 'Guide de montagne',
      address: { '@type': 'PostalAddress', addressRegion: 'Savoie', addressCountry: 'FR' },
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${slug}`,
    },
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header
        style={{
          background: 'rgba(16,22,17,0.96)',
          borderBottom: '1px solid rgba(90,124,92,0.18)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: '1.15rem', color: 'var(--cream)' }}>
              Survie & Bivouac
            </span>
          </Link>
          <Link
            href="/"
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Retour aux guides
          </Link>
        </div>
      </header>

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(16,24,17,0.98) 0%, var(--forest-mid) 100%)',
          padding: '56px 24px 44px',
          borderBottom: '1px solid var(--card-border)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <span
              style={{
                background: 'rgba(164,200,106,0.1)',
                color: 'var(--moss)',
                padding: '4px 11px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
              }}
            >
              GUIDE TERRAIN
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{formatDate(articleData.date)}</span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontWeight: 900,
              fontSize: 'clamp(1.7rem, 4vw, 2.6rem)',
              color: 'var(--cream)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '28px',
            }}
          >
            {articleData.title}
          </h1>

          <div className="author-card">
            <div className="author-avatar">TM</div>
            <div>
              <div className="author-name">Thomas Maillard</div>
              <div className="author-bio">Guide de montagne | Savoie | 12 ans de bivouacs</div>
            </div>
            <div className="reading-time">{readingTime} min de lecture</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '52px 24px 40px' }}>
        {primaryDecision && (
          <section className="purchase-shortcut">
            <div className="purchase-shortcut-copy">
              <span className="decision-kicker">Raccourci Achat</span>
              <h2>Si tu veux aller droit au but</h2>
              <p>
                Mon premier clic irait vers <strong>{primaryDecision.modelName}</strong>. C&apos;est
                le point de depart le plus simple pour verifier le prix, la dispo et les avis sans
                relire tout le comparatif.
              </p>
            </div>
            <div className="purchase-shortcut-actions">
              <TrackedLink
                href={primaryDecision.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="amazon-cta amazon-cta-primary"
                eventName="affiliate_click"
                eventPayload={{
                  article_slug: slug,
                  article_title: articleData.title,
                  placement: 'purchase_shortcut',
                  cta_label: primaryDecision.ctaLabel,
                  model_name: primaryDecision.modelName,
                }}
              >
                {primaryDecision.ctaLabel}
              </TrackedLink>
              <span className="cta-note">Ouvre Amazon dans un nouvel onglet.</span>
            </div>
          </section>
        )}

        {decisionCards.length > 0 && (
          <section className="decision-strip">
            <div className="decision-strip-head">
              <span className="decision-kicker">Choix Rapides</span>
              <h2>Cliquer sans perdre du temps</h2>
              <p>Trois options a regarder en premier selon le terrain, le budget ou le poids dans le sac.</p>
            </div>
            <div className="decision-grid">
              {decisionCards.map((card) => (
                <article key={card.label} className="decision-card">
                  <div className="decision-label">{card.label}</div>
                  <h3>{card.modelName}</h3>
                  <p>{card.reason}</p>
                  <TrackedLink
                    href={card.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="amazon-cta"
                    eventName="affiliate_click"
                    eventPayload={{
                      article_slug: slug,
                      article_title: articleData.title,
                      placement: 'decision_card',
                      cta_label: card.ctaLabel,
                      model_name: card.modelName,
                      decision_label: card.label,
                    }}
                  >
                    {card.ctaLabel}
                  </TrackedLink>
                </article>
              ))}
            </div>
          </section>
        )}

        {comparisonModels.length > 0 && (
          <section className="comparison-cta-strip">
            <div className="decision-strip-head">
              <span className="decision-kicker">Modeles Compares</span>
              <h2>Voir les modeles cites</h2>
              <p>Chaque fiche renvoie vers une recherche Amazon affiliee sur le modele ou la gamme la plus proche.</p>
            </div>
            <div className="model-cta-grid">
              {comparisonModels.map((model) => (
                <article key={model.name} className="model-cta-card">
                  <h3>{model.name}</h3>
                  <p>{model.pros || model.note || model.profile}</p>
                  {model.profile && <div className="model-chip">Pour: {model.profile}</div>}
                  <TrackedLink
                    href={model.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="amazon-cta"
                    eventName="affiliate_click"
                    eventPayload={{
                      article_slug: slug,
                      article_title: articleData.title,
                      placement: 'comparison_model',
                      cta_label: model.ctaLabel,
                      model_name: model.name,
                    }}
                  >
                    {model.ctaLabel}
                  </TrackedLink>
                </article>
              ))}
            </div>
          </section>
        )}

        <TrackedHtmlContent
          className="prose"
          html={articleData.contentHtml || ''}
          slug={slug}
          title={articleData.title}
        />

        {moneyRoutes.length > 0 && (
          <section className="money-route-strip">
            <div className="decision-strip-head">
              <span className="decision-kicker">A lire ensuite</span>
              <h2>Trois guides a fort potentiel achat</h2>
              <p>
                Si tu equipes ton bivouac plus largement, commence par ces comparatifs. Ce sont les
                pages les plus utiles pour passer d&apos;une idee a un panier concret.
              </p>
            </div>
            <div className="money-route-grid">
              {moneyRoutes.map((article) => (
                <TrackedLink
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  className="money-route-card"
                  eventName="guide_navigation_click"
                  eventPayload={{
                    source_slug: slug,
                    target_slug: article.slug,
                    placement: 'article_money_route',
                  }}
                >
                  <span className="money-route-label">Guide prioritaire</span>
                  <h3>{article.title}</h3>
                  <p>{cleanDescription(article.description)}</p>
                  <span className="money-route-link">Ouvrir ce comparatif</span>
                </TrackedLink>
              ))}
            </div>
          </section>
        )}

        <div
          style={{
            marginTop: '56px',
            padding: '28px 32px',
            background: 'rgba(30,45,32,0.5)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3a5c3c, var(--moss))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: '#122015',
              }}
            >
              TM
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--cream)', fontSize: '0.92rem' }}>Thomas Maillard</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Guide de montagne, testeur de materiel outdoor</div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic' }}>
            &ldquo;Tous les equipements que je recommande sur ce blog ont ete testes personnellement sur le terrain.
            Je ne publie que ce en quoi j&apos;ai une confiance totale.&rdquo;
          </p>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid var(--card-border)' }}>
          <Link
            href="/"
            style={{
              color: 'var(--sage-light)',
              fontWeight: 600,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Retour a tous les guides
          </Link>
        </div>
      </div>

      <footer
        style={{
          borderTop: '1px solid var(--card-border)',
          padding: '28px 24px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.79rem',
          lineHeight: 1.7,
        }}
      >
        <p>Copyright {new Date().getFullYear()} {siteName} par Thomas Maillard</p>
        <p style={{ marginTop: '4px', fontSize: '0.73rem', opacity: 0.65 }}>
          Ce site participe au programme d&apos;affiliation Amazon EU. Les liens de recommandation peuvent
          generer une commission sans surcout pour vous.
        </p>
      </footer>
    </div>
  );
}
