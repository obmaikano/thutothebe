import { lazy } from 'react';

// Lazy load protected pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Page404 = lazy(() => import('../pages/protected/404'));
const ProfileSettings = lazy(() => import('../pages/protected/ProfileSettings'));

const routes = [
    {
        path: '/dashboard',
        component: Dashboard,
    },
    {
        path: '/welcome',
        component: Welcome,
    },
    {
        path: '/settings-profile',
        component: ProfileSettings,
    },
    {
        path: '/404',
        component: Page404,
    }
];

export default routes; 