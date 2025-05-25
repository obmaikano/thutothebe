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
const Parents = lazy(() => import('../pages/protected/Parents'));
const ParentDetailsPage = lazy(() => import('../features/parents/pages/ParentDetailsPage'));
const TeacherStudents = lazy(() => import('../pages/protected/TeacherStudents'));
const TeacherCourses = lazy(() => import('../pages/protected/TeacherCourses'));
const TeacherClasses = lazy(() => import('../pages/protected/TeacherClasses'));
const TeacherAssignments = lazy(() => import('../pages/protected/TeacherAssignments'));
const TeacherResources = lazy(() => import('../pages/protected/TeacherResources'));
const TeacherSubmissions = lazy(() => import('../pages/protected/TeacherSubmissions'));

// Student role pages
const StudentDashboard = lazy(() => import('../pages/protected/StudentDashboard'));
const StudentCourses = lazy(() => import('../pages/protected/StudentCourses'));
const StudentAssignments = lazy(() => import('../pages/protected/StudentAssignments'));
const StudentGrades = lazy(() => import('../pages/protected/StudentGrades'));
const StudentMessages = lazy(() => import('../pages/protected/StudentMessages'));
const StudentSchedule = lazy(() => import('../pages/protected/StudentSchedule'));
const StudentHelp = lazy(() => import('../pages/protected/StudentHelp'));

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
  {
    path: 'parents',
    element: Parents
  },
  {
    path: 'parents/:id',
    element: ParentDetailsPage
  },
  {
    path: 'teacher-students',
    element: TeacherStudents
  },
  {
    path: 'teacher-courses',
    element: TeacherCourses
  },
  {
    path: 'teacher-classes',
    element: TeacherClasses
  },
  {
    path: 'teacher-assignments',
    element: TeacherAssignments
  },
  {
    path: 'teacher-resources',
    element: TeacherResources
  },
  {
    path: 'teacher-submissions',
    element: TeacherSubmissions
  },
  // Student role routes
  {
    path: 'student-dashboard',
    element: StudentDashboard
  },
  {
    path: 'student-courses',
    element: StudentCourses
  },
  {
    path: 'student-assignments',
    element: StudentAssignments
  },
  {
    path: 'student-grades',
    element: StudentGrades
  },
  {
    path: 'messages',
    element: StudentMessages
  },
  {
    path: 'schedule',
    element: StudentSchedule
  },
  {
    path: 'help',
    element: StudentHelp
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

