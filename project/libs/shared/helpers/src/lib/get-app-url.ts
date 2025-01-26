import { APP_PREFIX } from '@project/core';

export function getAppURL(base: string, url?: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPrefix = APP_PREFIX + '/';
  return new URL(url, normalizedBase + normalizedPrefix).toString();
}
