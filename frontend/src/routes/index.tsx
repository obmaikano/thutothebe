import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Subjects = lazy(() => import('../pages/protected/Subjects'));
const SubjectDetail = lazy(() => import('../pages/protected/SubjectDetail'));
const Regions = lazy(() => import('../pages/protected/Regions'));
const RegionDetail = lazy(() => import('../pages/protected/RegionDetail'));
const Schools = lazy(() => import('../pages/protected/Schools'));
const Users = lazy(() => import('../pages/protected/Users'));
const Courses = lazy(() => import('../pages/protected/Courses'));
const CourseDetail = lazy(() => import('../pages/protected/CourseDetail'));
const Classes = lazy(() => import('../pages/protected/Classes'));
const ClassDetail = lazy(() => import('../pages/protected/ClassDetail'));
const Students = lazy(() => import('../pages/protected/Students'));
const StudentDetail = lazy(() => import('../pages/protected/StudentDetail'));

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
  {
    path: 'regions',
    element: Regions
  },
  {
    path: 'regions/:id',
    element: RegionDetail
  },
  {
    path: 'schools',
    element: Schools
  },
  {
    path: 'users',
    element: Users
  },
  {
    path: 'courses',
    element: Courses
  },
  {
    path: 'courses/:id',
    element: CourseDetail
  },
  {
    path: 'classes',
    element: Classes
  },
  {
    path: 'classes/:id',
    element: ClassDetail
  },
  {
    path: 'students',
    element: Students
  },
  {
    path: 'students/:id',
    element: StudentDetail
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

