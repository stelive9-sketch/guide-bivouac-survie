import Link from 'next/link';
import { TrackedLink } from '@/components/TrackedLink';
import { getSortedArticlesData } from '@/lib/markdown';
import { moneySlugPriority, prioritizeBySlug, primaryMoneySlugs } from '@/lib/cro';
import { defaultDescription, defaultTitle, siteName } from '@/lib/site';

export const metadata = {
  title: defaultTitle,
  description: defaultDescription,
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function cleanDescription(value: string) {
  return value
    .replace('Decouvrez notre guide ultime et complet : ', '')
    .replace('Découvrez notre guide ultime et complet : ', '')
    .replace('DÃ©couvrez notre guide ultime et complet : ', '')
    .replace('DÃƒÂ©couvrez notre guide ultime et complet : ', '')
    .replace(/\.$/, '');
}

const s = {
  page: { minHeight: '100vh' },
  header: {
    background: 'rgba(16,22,17,0.96)',
    borderBottom: '1px solid rgba(90,124,92,0.18)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(16px)',
  },
  headerInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' as const },
  logoText: {
    fontFamily: 'var(--font-playfair), serif',
    fontWeight: 900,
    fontSize: '1.15rem',
    color: 'var(--cream)',
  },
  navLink: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    fontWeight: 500,
    textDecoration: 'none' as const,
    transition: 'color 0.2s',
  },
};

export default function Home() {
  const articles = getSortedArticlesData();
  const quickGuides = prioritizeBySlug(articles, moneySlugPriority);
  const topMoneyPages = prioritizeBySlug(articles, primaryMoneySlugs);
  const featured = quickGuides[0] || articles[0];
  const quickGuideSlugs = new Set(quickGuides.map((article) => article.slug));
  const library = articles.filter((article) => !quickGuideSlugs.has(article.slug));

  return (
    <main style={s.page}>
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link href="/" style={s.logo}>
            <span style={s.logoText}>Survie & Bivouac</span>
          </Link>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#choix-rapides" style={s.navLink}>Choix rapides</a>
            <a href="#guides" style={s.navLink}>Bibliotheque</a>
            <a href="#auteur" style={s.navLink}>A propos</a>
          </nav>
        </div>
      </header>

      <section
        style={{
          padding: '90px 24px 72px',
          background: 'linear-gradient(160deg, #0f1810 0%, var(--forest-mid) 60%, rgba(30,45,32,0.6) 100%)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(164,200,106,0.06) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(164,200,106,0.08)',
              border: '1px solid rgba(164,200,106,0.2)',
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '28px',
            }}
          >
            <span
              style={{
                color: 'var(--moss)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              Guide de montagne et selection materiel
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              color: 'var(--cream)',
              lineHeight: 1.12,
              marginBottom: '22px',
              letterSpacing: '-0.025em',
            }}
          >
            Moins de blabla.
            <br />
            <span style={{ color: 'var(--moss)' }}>Plus de bons achats</span> terrain.
          </h1>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1.08rem',
              lineHeight: 1.75,
              maxWidth: '620px',
              margin: '0 auto 16px',
            }}
          >
            Je teste du materiel outdoor en conditions reelles. Sur ce site, je te dirige d&apos;abord
            vers les comparatifs qui aident a choisir vite le bon produit, sans te perdre dans 20
            fiches inutiles.
          </p>
          <p
            style={{
              color: 'rgba(164,200,106,0.7)',
              fontSize: '0.88rem',
              fontStyle: 'italic',
              marginBottom: '36px',
            }}
          >
            Dernier bivouac: Massif des Ecrins, -12 C, neige lourde, tente et rechaud verifies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' as const }}>
            <a
              href="#choix-rapides"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--moss)',
                color: '#131f14',
                padding: '13px 26px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.93rem',
                textDecoration: 'none',
              }}
            >
              Voir les meilleurs achats
            </a>
            <a
              href="#guides"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(164,200,106,0.22)',
                color: 'var(--cream)',
                padding: '13px 26px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.93rem',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              Parcourir toute la bibliotheque
            </a>
          </div>
          {topMoneyPages.length > 0 && (
            <div
              style={{
                marginTop: '34px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '14px',
                textAlign: 'left',
              }}
            >
              {topMoneyPages.map((article, index) => (
                <TrackedLink
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  eventName="guide_navigation_click"
                  eventPayload={{
                    source_slug: 'home',
                    target_slug: article.slug,
                    placement: 'home_above_fold_money',
                    priority_rank: index + 1,
                  }}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div
                    style={{
                      height: '100%',
                      padding: '18px 18px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(164,200,106,0.18)',
                      background: 'rgba(16,24,17,0.48)',
                      boxShadow: '0 18px 34px rgba(0,0,0,0.16)',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '4px 9px',
                        borderRadius: '999px',
                        background: 'rgba(201,168,76,0.12)',
                        color: 'var(--gold-light)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Top {index + 1}
                    </div>
                    <div
                      style={{
                        color: 'var(--cream)',
                        fontFamily: 'var(--font-playfair), serif',
                        fontWeight: 800,
                        lineHeight: 1.25,
                        marginBottom: '8px',
                      }}
                    >
                      {article.title}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '14px' }}>
                      {cleanDescription(article.description)}
                    </div>
                    <div style={{ color: 'var(--moss)', fontSize: '0.84rem', fontWeight: 800 }}>
                      Ouvrir le comparatif
                    </div>
                  </div>
                </TrackedLink>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(90,124,92,0.35), transparent)',
          }}
        />
      </section>

      {quickGuides.length > 0 && (
        <section id="choix-rapides" style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span
              style={{
                background: 'rgba(164,200,106,0.08)',
                border: '1px solid rgba(164,200,106,0.2)',
                color: 'var(--moss)',
                padding: '4px 14px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              Choix rapides
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
          </div>
          <div style={{ maxWidth: '680px', marginBottom: '28px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 3vw, 2.3rem)',
                color: 'var(--cream)',
                marginBottom: '10px',
              }}
            >
              Commencer par les guides qui aident le plus a acheter juste
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8 }}>
              Ces pages repondent aux besoins qui reviennent le plus souvent: dormir, filtrer,
              cuisiner, marcher et porter sans regretter l&apos;achat.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {quickGuides.slice(0, 6).map((article, index) => (
              <TrackedLink
                key={article!.slug}
                href={`/articles/${article!.slug}`}
                eventName="guide_navigation_click"
                eventPayload={{
                  source_slug: 'home',
                  target_slug: article!.slug,
                  placement: 'home_quick_guides',
                  priority_rank: index + 1,
                }}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <article
                  style={{
                    height: '100%',
                    padding: '28px',
                    borderRadius: '18px',
                    border: '1px solid rgba(90,124,92,0.28)',
                    background:
                      index === 0
                        ? 'linear-gradient(135deg, rgba(45,66,40,0.88) 0%, rgba(25,37,27,0.95) 100%)'
                        : 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 18px 44px rgba(0,0,0,0.18)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                    <span
                      style={{
                        background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.22)',
                        color: 'var(--gold-light)',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textTransform: 'uppercase' as const,
                      }}
                    >
                      {index === 0 ? 'Priorite' : 'Achat malin'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(article!.date)}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontWeight: 800,
                      fontSize: '1.18rem',
                      color: 'var(--cream)',
                      lineHeight: 1.3,
                    }}
                  >
                    {article!.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, flex: 1 }}>
                    {cleanDescription(article!.description)}
                  </p>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--moss) 0%, #d4ea7f 100%)',
                      color: '#122015',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                    }}
                  >
                    Voir les modeles
                  </span>
                </article>
              </TrackedLink>
            ))}
          </div>
        </section>
      )}

      {featured && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span
              style={{
                background: 'rgba(201,168,76,0.12)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: 'var(--gold-light)',
                padding: '4px 14px',
                borderRadius: '100px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
              }}
            >
              Guide a ouvrir en premier
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
          </div>
          <TrackedLink
            href={`/articles/${featured.slug}`}
            eventName="guide_navigation_click"
            eventPayload={{
              source_slug: 'home',
              target_slug: featured.slug,
              placement: 'home_featured',
              priority_rank: 1,
            }}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(36,54,38,0.8) 0%, rgba(30,45,32,0.6) 100%)',
                border: '1px solid rgba(90,124,92,0.3)',
                borderRadius: '20px',
                padding: '40px 48px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' as const }}>
                <span
                  style={{
                    background: 'rgba(164,200,106,0.12)',
                    color: 'var(--moss)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                  }}
                >
                  GUIDE COMPLET
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(featured.date)}</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-playfair), serif',
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  color: 'var(--cream)',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                }}
              >
                {featured.title}
              </h2>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  maxWidth: '650px',
                  marginBottom: '24px',
                }}
              >
                {cleanDescription(featured.description)}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--moss) 0%, #d4ea7f 100%)',
                    color: '#122015',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                  }}
                >
                  Voir les modeles compares
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center' }}>
                  Resume decisionnel + CTA Amazon visibles
                </span>
              </div>
            </div>
          </TrackedLink>
        </section>
      )}

      <section id="guides" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontWeight: 700,
              fontSize: '1.6rem',
              color: 'var(--cream)',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Tous les guides
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
          {library.map(({ slug, title, description, date }) => (
            <TrackedLink
              key={slug}
              href={`/articles/${slug}`}
              eventName="guide_navigation_click"
              eventPayload={{
                source_slug: 'home',
                target_slug: slug,
                placement: 'home_library',
              }}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article className="article-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span
                    style={{
                      background: 'rgba(164,200,106,0.1)',
                      color: 'var(--moss)',
                      padding: '3px 9px',
                      borderRadius: '5px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                    }}
                  >
                    GUIDE
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(date)}</span>
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-playfair), serif',
                    fontWeight: 700,
                    fontSize: '1.08rem',
                    color: 'var(--cream)',
                    lineHeight: 1.35,
                    marginBottom: '10px',
                    flex: 1,
                  }}
                >
                  {title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '18px' }}>
                  {cleanDescription(description)}
                </p>
                <span className="card-link-text">Lire le guide</span>
              </article>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section id="auteur" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-playfair), serif',
              fontWeight: 700,
              fontSize: '1.6rem',
              color: 'var(--cream)',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Pourquoi me faire confiance ?
          </h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
        </div>
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            padding: '40px 48px',
            display: 'flex',
            gap: '40px',
            alignItems: 'flex-start',
            flexWrap: 'wrap' as const,
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #3a5c3c 0%, var(--moss) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#122015',
              flexShrink: 0,
            }}
          >
            TM
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontWeight: 900,
                fontSize: '1.5rem',
                color: 'var(--cream)',
                marginBottom: '4px',
              }}
            >
              Thomas Maillard
            </div>
            <div style={{ color: 'var(--moss)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              Guide de montagne | Savoie | 12 ans de bivouacs
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
              Je n&apos;empile pas des fiches produits. Je pars avec ce materiel, je le casse parfois,
              je le garde quand il tient, et je l&apos;ecarte quand il promet plus qu&apos;il ne fait.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Plus de <strong style={{ color: 'var(--cream)' }}>200 sorties</strong> documentees, du matos teste
              sous la pluie, dans le vent et par grand froid. Je ne pousse que ce que j&apos;accepterais
              de payer pour moi.
            </p>
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: '1px solid var(--card-border)',
          padding: '32px 24px',
          textAlign: 'center' as const,
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          lineHeight: 1.7,
        }}
      >
        <p>Copyright {new Date().getFullYear()} {siteName} par Thomas Maillard</p>
        <p style={{ marginTop: '6px', fontSize: '0.75rem', opacity: 0.7 }}>
          Ce site participe au programme d&apos;affiliation Amazon EU. Les liens de recommandation peuvent
          generer une commission sans surcout pour vous.
        </p>
      </footer>
    </main>
  );
}
