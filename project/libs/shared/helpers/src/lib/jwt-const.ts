export const TokenName = {
  Access: 'accessToken',
  Refresh: 'refreshToken',
};

export const BearerAuthOptions = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
} as const;
