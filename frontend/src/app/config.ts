export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  app: {
    name: 'GeoLite',
    version: '1.0.0',
  },
} as const; 