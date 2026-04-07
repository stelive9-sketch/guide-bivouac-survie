'use client';

import type { MouseEvent } from 'react';
import { trackEvent } from '@/lib/analytics';

type TrackedHtmlContentProps = {
  html: string;
  slug: string;
  title: string;
  className?: string;
};

export function TrackedHtmlContent({ html, slug, title, className }: TrackedHtmlContentProps) {
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    const link = target?.closest('a') as HTMLAnchorElement | null;
    if (!link) return;

    if (!/amazon\.fr/i.test(link.href)) return;

    trackEvent('affiliate_click', {
      article_slug: slug,
      article_title: title,
      placement: 'article_body',
      cta_label: link.textContent?.trim() || 'article body link',
      destination_host: new URL(link.href).host,
    });
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} onClickCapture={handleClickCapture} />;
}
