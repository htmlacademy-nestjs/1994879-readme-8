import { APP_PREFIX } from '@project/core';

export function getAppURL(base: string, ...args: string[]): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const url = args.length > 0 ? args.join('/') : '';

  return new URL(url, normalizedBase).toString();
}
