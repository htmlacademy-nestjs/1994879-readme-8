import { AppHeader } from '@project/core';

export function getAppHeaders(req: Request, ...keys: string[]) {
  if (!keys) {
    return;
  }
  const headers = {};

  keys.forEach((key) => {
    headers[key] = req.headers[key];
  });

  return headers;
}
