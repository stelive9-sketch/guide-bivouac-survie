'use client';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

export type AnalyticsValue = string | number | boolean;

export type AnalyticsPayload = Record<string, AnalyticsValue | undefined>;

export type StoredAnalyticsEvent = {
  id: string;
  eventName: string;
  payload: Record<string, AnalyticsValue>;
  timestamp: string;
  path: string;
};

const STORAGE_KEY = 'autoniche-analytics-events';
const MAX_STORED_EVENTS = 500;

function compactPayload(payload: AnalyticsPayload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Record<string, AnalyticsValue>;
}

function readStoredEventsUnsafe(): StoredAnalyticsEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredAnalyticsEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistEvent(eventName: string, payload: Record<string, AnalyticsValue>) {
  if (typeof window === 'undefined') return;

  const nextEvent: StoredAnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    eventName,
    payload,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };

  const events = readStoredEventsUnsafe();
  const nextEvents = [...events, nextEvent].slice(-MAX_STORED_EVENTS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
  } catch {
    return;
  }
}

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === 'undefined') return;

  const cleaned = compactPayload(payload);

  persistEvent(eventName, cleaned);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...cleaned });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, cleaned);
  }

  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props: cleaned });
  }

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', eventName, cleaned);
  }
}

export function trackPageView(url: string) {
  trackEvent('page_view', { page_location: url });
}

export function readStoredEvents() {
  return readStoredEventsUnsafe();
}

export function clearStoredEvents() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
