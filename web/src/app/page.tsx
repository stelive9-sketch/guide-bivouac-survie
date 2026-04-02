import Link from 'next/link';
import { getSortedArticlesData } from '@/lib/markdown';

export const metadata = {
  title: "Survie & Bivouac — Le Journal de Thomas Maillard",
  description: "Guide de montagne passionné, Thomas partage ses 12 ans d'expérience : sélection de matériel, techniques de survie et récits de bivouac.",
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
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
    maxWidth: '1100px', margin: '0 auto', padding: '14px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' as const },
  logoText: {
    fontFamily: 'var(--font-playfair), serif',
    fontWeight: 900, fontSize: '1.15rem', color: 'var(--cream)',
  },
  navLink: {
    color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none' as const,
    transition: 'color 0.2s',
  },
};

export default function Home() {
  const articles = getSortedArticlesData();
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main style={s.page}>

      {/* ─── Header ─── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <Link href="/" style={s.logo}>
            <span style={{ fontSize: '1.35rem' }}>🏔️</span>
            <span style={s.logoText}>Survie & Bivouac</span>
          </Link>
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <a href="#guides" style={s.navLink}>Guides</a>
            <a href="#auteur" style={s.navLink}>À propos</a>
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section style={{
        padding: '90px 24px 72px',
        background: 'linear-gradient(160deg, #0f1810 0%, var(--forest-mid) 60%, rgba(30,45,32,0.6) 100%)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(164,200,106,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(164,200,106,0.08)', border: '1px solid rgba(164,200,106,0.2)', borderRadius: '100px', padding: '6px 16px', marginBottom: '28px' }}>
            <span style={{ color: 'var(--moss)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>✦ Guide de montagne & survivalist</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3.6rem)', color: 'var(--cream)', lineHeight: 1.12, marginBottom: '22px', letterSpacing: '-0.025em' }}>
            12 ans de bivouacs.<br />
            <span style={{ color: 'var(--moss)' }}>Le matériel</span> qui m'a sauvé.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto 16px' }}>
            Je m'appelle Thomas. Guide de montagne en Savoie, j'ai testé des centaines d'équipements par tous les temps. Ici, je partage uniquement ce qui tient vraiment la route.
          </p>
          <p style={{ color: 'rgba(164,200,106,0.7)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '36px' }}>
            — Dernier bivouac : Massif des Écrins, -12°C, tempête de neige. Le matériel a tenu.
          </p>
          <a href="#guides" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--moss)', color: '#131f14', padding: '13px 26px', borderRadius: '10px', fontWeight: 700, fontSize: '0.93rem', textDecoration: 'none' }}>
            Voir mes guides terrain →
          </a>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(90,124,92,0.35), transparent)' }} />
      </section>

      {/* ─── Article en vedette ─── */}
      {featured && (
        <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold-light)', padding: '4px 14px', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>⭐ Guide du moment</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
          </div>
          <Link href={`/articles/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(36,54,38,0.8) 0%, rgba(30,45,32,0.6) 100%)', border: '1px solid rgba(90,124,92,0.3)', borderRadius: '20px', padding: '40px 48px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ background: 'rgba(164,200,106,0.12)', color: 'var(--moss)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em' }}>GUIDE COMPLET</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(featured.date)}</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--cream)', lineHeight: 1.25, marginBottom: '16px' }}>
                {featured.title}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '600px', marginBottom: '24px' }}>
                {featured.description.replace("Découvrez notre guide ultime et complet : ", "").replace(/\.$/, "")}
              </p>
              <span style={{ color: 'var(--moss)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Lire le guide complet →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ─── Grille des articles ─── */}
      <section id="guides" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '1.6rem', color: 'var(--cream)', whiteSpace: 'nowrap' as const }}>Tous les guides</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '22px' }}>
          {rest.map(({ slug, title, description, date }) => (
            <Link key={slug} href={`/articles/${slug}`} style={{ textDecoration: 'none', display: 'block' }}>
              <article className="article-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ background: 'rgba(164,200,106,0.1)', color: 'var(--moss)', padding: '3px 9px', borderRadius: '5px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em' }}>GUIDE</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatDate(date)}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '1.08rem', color: 'var(--cream)', lineHeight: 1.35, marginBottom: '10px', flex: 1 }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '18px' }}>
                  {description.replace("Découvrez notre guide ultime et complet : ", "").replace(/\.$/, "")}
                </p>
                <span className="card-link-text">Lire le guide →</span>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── À propos de l'auteur ─── */}
      <section id="auteur" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '36px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 700, fontSize: '1.6rem', color: 'var(--cream)', whiteSpace: 'nowrap' as const }}>Qui suis-je ?</h2>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
        </div>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '20px', padding: '40px 48px', display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap' as const }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #3a5c3c 0%, var(--moss) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.8rem', flexShrink: 0 }}>
            🧗
          </div>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ fontFamily: 'var(--font-playfair), serif', fontWeight: 900, fontSize: '1.5rem', color: 'var(--cream)', marginBottom: '4px' }}>Thomas Maillard</div>
            <div style={{ color: 'var(--moss)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>Guide de montagne • Savoie • 12 ans de bivouacs</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '16px' }}>
              Ce blog est né d'une frustration : les sites spécialisés testent rarement le matériel dans des conditions réelles. Moi, je pars. Par -15°C en hiver, sous la pluie battante en été, en haute altitude. Ce que tu lis ici, je l'ai vécu.
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Plus de <strong style={{ color: 'var(--cream)' }}>200 sorties</strong> documentées, des centaines de kilos d'équipement testés. Je ne recommande que ce que j'emmènerais avec moi pour ma propre vie.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--card-border)', padding: '32px 24px', textAlign: 'center' as const, color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.7 }}>
        <p>© {new Date().getFullYear()} Survie & Bivouac par Thomas Maillard</p>
        <p style={{ marginTop: '6px', fontSize: '0.75rem', opacity: 0.7 }}>Ce site participe au programme d'affiliation Amazon EU. Les liens de recommandation peuvent générer une commission sans surcoût pour vous.</p>
      </footer>

    </main>
  );
}
