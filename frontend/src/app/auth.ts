// Define public routes that don't require authentication
export const PUBLIC_ROUTES: string[] = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/help',
  '/404'
];

// Helper function to check if a route is public
export const isPublicRoute = (path: string): boolean => {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
}; 