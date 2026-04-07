'use client';

import Link from 'next/link';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { trackEvent, type AnalyticsPayload } from '@/lib/analytics';

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  eventName: string;
  eventPayload?: AnalyticsPayload;
  className?: string;
  style?: CSSProperties;
  target?: string;
  rel?: string;
};

function handleTrackedClick(
  eventName: string,
  eventPayload: AnalyticsPayload | undefined,
  onClickEvent: MouseEvent<HTMLAnchorElement>,
) {
  if (onClickEvent.defaultPrevented) return;
  trackEvent(eventName, eventPayload);
}

export function TrackedLink({
  href,
  children,
  eventName,
  eventPayload,
  className,
  style,
  target,
  rel,
}: TrackedLinkProps) {
  const isExternal = /^https?:\/\//i.test(href);

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        style={style}
        target={target}
        rel={rel}
        onClick={(event) => handleTrackedClick(eventName, eventPayload, event)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(event) => handleTrackedClick(eventName, eventPayload, event)}
    >
      {children}
    </Link>
  );
}
