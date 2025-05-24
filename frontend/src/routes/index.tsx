import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Subjects = lazy(() => import('../pages/protected/Subjects'));
const SubjectDetail = lazy(() => import('../pages/protected/SubjectDetail'));

const NotFoundPage = lazy(() => import('../pages/protected/404'));

// App routes - nested under /app path
export const appRoutes = [
  {
    path: 'dashboard',
    element: Dashboard
  },
  {
    path: 'subjects',
    element: Subjects
  },
  {
    path: 'subjects/:id',
    element: SubjectDetail
  },
  // Default redirect
  {
    path: '',
    element: () => <Navigate to="dashboard" replace />
  },
  // 404 for protected routes
  {
    path: '*',
    element: NotFoundPage
  }
];

export default appRoutes;

