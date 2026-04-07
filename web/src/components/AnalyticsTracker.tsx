'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const search = window.location.search;
    const url = `${window.location.origin}${pathname}${search ? `?${search}` : ''}`;
    trackPageView(url);
  }, [pathname]);

  return null;
}
