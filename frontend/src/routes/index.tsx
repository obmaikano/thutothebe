import { lazy } from 'react';

// Lazy load pages
 const Dashboard = lazy(() => import('../pages/protected/Dashboard'));

// Wrap lazy components with Suspense


const routes = [
  {
    path: '/dashboard',
    component: Dashboard
  }
]

export default routes;
