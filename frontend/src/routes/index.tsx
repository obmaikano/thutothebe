import { lazy } from 'react';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Courses = lazy(() => import('../pages/protected/Courses'));
const CourseDetail = lazy(() => import('../pages/protected/CourseDetail'));
const NewCourse = lazy(() => import('../pages/protected/NewCourse'));
const EditCourse = lazy(() => import('../pages/protected/EditCourse'));

// Wrap lazy components with Suspense

const routes = [
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/courses',
    component: Courses
  },
  {
    path: '/courses/new',
    component: NewCourse
  },
  {
    path: '/courses/:id',
    component: CourseDetail
  },
  {
    path: '/courses/:id/edit',
    component: EditCourse
  }
]

export default routes;
