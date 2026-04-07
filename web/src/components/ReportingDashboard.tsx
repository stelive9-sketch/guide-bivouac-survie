'use client';

import Link from 'next/link';
import { useState } from 'react';
import { clearStoredEvents, readStoredEvents, type AnalyticsValue, type StoredAnalyticsEvent } from '@/lib/analytics';

type RankedItem = {
  label: string;
  value: number;
};

function rankBy(records: StoredAnalyticsEvent[], getKey: (event: StoredAnalyticsEvent) => string | undefined, limit = 8) {
  const counts = new Map<string, number>();

  for (const event of records) {
    const key = getKey(event);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function payloadValue(payload: Record<string, AnalyticsValue>, key: string) {
  const value = payload[key];
  return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
}

function formatDate(value?: string) {
  if (!value) return 'Aucune donnee';
  return new Date(value).toLocaleString('fr-FR');
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        background: 'rgba(30,45,32,0.7)',
      }}
    >
      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
        {label}
      </div>
      <div style={{ color: 'var(--cream)', fontSize: '2rem', fontWeight: 900, marginBottom: '6px' }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{detail}</div>
    </div>
  );
}

function RankedList({ title, items }: { title: string; items: RankedItem[] }) {
  return (
    <section
      style={{
        padding: '24px',
        borderRadius: '18px',
        border: '1px solid var(--card-border)',
        background: 'rgba(16,24,17,0.62)',
      }}
    >
      <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: 'var(--cream)', fontSize: '1.35rem', marginBottom: '16px' }}>
        {title}
      </h2>
      {items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7 }}>
          Pas assez de donnees pour ce classement.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(90,124,92,0.18)',
              }}
            >
              <div style={{ color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.5 }}>{item.label}</div>
              <div style={{ color: 'var(--moss)', fontWeight: 800, whiteSpace: 'nowrap' }}>{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ReportingDashboard() {
  const [events, setEvents] = useState<StoredAnalyticsEvent[]>(() => readStoredEvents());
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  function refresh() {
    setEvents(readStoredEvents());
  }

  function reset() {
    clearStoredEvents();
    refresh();
  }

  const affiliateClicks = events.filter((event) => event.eventName === 'affiliate_click');
  const guideClicks = events.filter((event) => event.eventName === 'guide_navigation_click');
  const pageViews = events.filter((event) => event.eventName === 'page_view');

  const lastEvent = events[events.length - 1];
  const topAffiliateSlugs = rankBy(affiliateClicks, (event) => payloadValue(event.payload, 'article_slug'));
  const topAffiliatePlacements = rankBy(affiliateClicks, (event) => payloadValue(event.payload, 'placement'));
  const topModels = rankBy(affiliateClicks, (event) => payloadValue(event.payload, 'model_name'));
  const topGuideTargets = rankBy(guideClicks, (event) => payloadValue(event.payload, 'target_slug'));
  const topGuidePlacements = rankBy(guideClicks, (event) => payloadValue(event.payload, 'placement'));

  return (
    <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ color: 'var(--moss)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            Reporting CRO
          </div>
          <h1 style={{ fontFamily: 'var(--font-playfair), serif', color: 'var(--cream)', fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.1, marginBottom: '16px' }}>
            Les clics qui comptent vraiment
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.8 }}>
            Ce tableau de bord lit la copie locale des evenements de tracking capturee dans ton navigateur.
            Il est utile pour tester les parcours, comparer les emplacements CTA et voir quels slugs attirent
            le plus les clics Amazon.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={refresh}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(164,200,106,0.2)',
              background: 'rgba(255,255,255,0.03)',
              color: 'var(--cream)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Rafraichir
          </button>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(201,168,76,0.2)',
              background: 'rgba(201,168,76,0.08)',
              color: 'var(--gold-light)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Vider l&apos;historique local
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid var(--card-border)',
              background: 'rgba(30,45,32,0.7)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Retour au site
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '18px', color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.7 }}>
        Dernier evenement: {formatDate(lastEvent?.timestamp)}. Total conserve localement: {events.length} evenements.
      </div>

      <div style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.7 }}>
        Playbook GA4 disponible dans le depot: docs/ga4-reading-plan.md
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '28px' }}>
        <MetricCard label="Clics Amazon" value={String(affiliateClicks.length)} detail="Tous les clics vers Amazon, tous emplacements confondus." />
        <MetricCard label="Clics Vers Guides" value={String(guideClicks.length)} detail="Maillage interne vers les pages comparatives prioritaires." />
        <MetricCard label="Pages Vues" value={String(pageViews.length)} detail="Pageviews remontees par la navigation dans l'application." />
        <MetricCard
          label="Top Placement"
          value={topAffiliatePlacements[0]?.label || '-'}
          detail={`Meilleur emplacement observe: ${topAffiliatePlacements[0]?.value || 0} clic(s).`}
        />
      </section>

      <section
        style={{
          marginTop: '18px',
          padding: '20px',
          borderRadius: '16px',
          border: `1px solid ${measurementId ? 'rgba(164,200,106,0.24)' : 'rgba(201,168,76,0.24)'}`,
          background: measurementId ? 'rgba(164,200,106,0.06)' : 'rgba(201,168,76,0.08)',
        }}
      >
        <div style={{ color: measurementId ? 'var(--moss)' : 'var(--gold-light)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
          Statut GA4
        </div>
        <div style={{ color: 'var(--cream)', fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
          {measurementId ? `Configure: ${measurementId}` : 'Non configure dans ce build'}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
          {measurementId
            ? 'Le script GA4 doit se charger sur cette build. Verifie ensuite les evenements dans DebugView.'
            : 'Ajoute NEXT_PUBLIC_GA_MEASUREMENT_ID sur l hebergement ou dans un .env local pour activer GA4.'}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '28px' }}>
        <RankedList title="Top slugs par clic Amazon" items={topAffiliateSlugs} />
        <RankedList title="Top emplacements CTA Amazon" items={topAffiliatePlacements} />
        <RankedList title="Top modeles cliques" items={topModels} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '18px' }}>
        <RankedList title="Guides les plus rejoints" items={topGuideTargets} />
        <RankedList title="Placements de maillage les plus actifs" items={topGuidePlacements} />
      </section>

      <section
        style={{
          marginTop: '18px',
          padding: '24px',
          borderRadius: '18px',
          border: '1px solid var(--card-border)',
          background: 'rgba(16,24,17,0.62)',
        }}
      >
        <h2 style={{ fontFamily: 'var(--font-playfair), serif', color: 'var(--cream)', fontSize: '1.35rem', marginBottom: '16px' }}>
          Comment lire ce dashboard
        </h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.8 }}>
          Si `purchase_shortcut` domine, ton raccourci achat fait le travail. Si `article_body` domine,
          le contenu comparatif vend mieux que les cartes. Si `home_above_fold_money` et `home_quick_guides`
          performent mal, la promesse home est encore trop faible. Pour une lecture cross-utilisateurs,
          branche maintenant `NEXT_PUBLIC_GA_MEASUREMENT_ID` en production et reproduis les memes dimensions
          dans GA4.
        </div>
      </section>
    </main>
  );
}
