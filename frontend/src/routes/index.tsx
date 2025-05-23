import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Lazy load pages
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Courses = lazy(() => import('../pages/protected/Courses'));
const CourseDetail = lazy(() => import('../pages/protected/CourseDetail'));
const NewCourse = lazy(() => import('../pages/protected/NewCourse'));
const EditCourse = lazy(() => import('../pages/protected/EditCourse'));

// New feature pages
const RegionsPage = lazy(() => import('../pages/protected/Regions'));
const SystemOverviewPage = lazy(() => import('../pages/protected/SystemOverview'));
const AnalyticsPage = lazy(() => import('../pages/protected/Analytics'));

// Admin pages
const SchoolManagementPage = lazy(() => import('../pages/protected/SchoolManagement'));
const SchoolRegistrationPage = lazy(() => import('../pages/protected/SchoolRegistration'));
const EditSchoolPage = lazy(() => import('../pages/protected/EditSchool'));
const AssignSchoolAdminPage = lazy(() => import('../pages/protected/AssignSchoolAdmin'));
const RegionConfigPage = lazy(() => import('../pages/protected/RegionConfig'));
const PermissionsRolesPage = lazy(() => import('../pages/protected/PermissionsRoles'));
const AuditLogPage = lazy(() => import('../pages/protected/AuditLog'));
const UserManagementPage = lazy(() => import('../pages/protected/UserManagement'));

// Reports and Monitoring pages
const ReportsPage = lazy(() => import('../pages/protected/Reports'));
const SystemMonitoringPage = lazy(() => import('../pages/protected/SystemMonitoring'));

// Individual Report Components - create dedicated page components
import { SchoolPerformanceReport } from '../features/reports/components/SchoolPerformanceReport';
import { LearnerProgressionReport } from '../features/reports/components/LearnerProgressionReport';
import { SubjectAnalyticsReport } from '../features/reports/components/SubjectAnalyticsReport';
import { AssignmentTrackingReport } from '../features/reports/components/AssignmentTrackingReport';
import { UsageMonitoringDashboard } from '../features/reports/components/UsageMonitoringDashboard';
import { RegionalUsageReport } from '../features/reports/components/RegionalUsageReport';
import { SchoolUsageReport } from '../features/reports/components/SchoolUsageReport';
import { UserActivityReport } from '../features/reports/components/UserActivityReport';

// Create wrapper components for individual reports
const SchoolPerformanceReportPage = () => <SchoolPerformanceReport />;
const LearnerProgressionReportPage = () => <LearnerProgressionReport />;
const SubjectAnalyticsReportPage = () => <SubjectAnalyticsReport />;
const AssignmentTrackingReportPage = () => <AssignmentTrackingReport />;
const UsageMonitoringDashboardPage = () => <UsageMonitoringDashboard />;
const RegionalUsageReportPage = () => <RegionalUsageReport />;
const SchoolUsageReportPage = () => <SchoolUsageReport />;
const UserActivityReportPage = () => <UserActivityReport />;

const NotFoundPage = lazy(() => import('../pages/protected/404'));

// App routes - nested under /app path
export const appRoutes = [
  {
    path: 'dashboard',
    element: Dashboard
  },
  {
    path: 'courses',
    element: Courses
  },
  {
    path: 'courses/new',
    element: NewCourse
  },
  {
    path: 'courses/:id',
    element: CourseDetail
  },
  {
    path: 'courses/:id/edit',
    element: EditCourse
  },
  // New feature routes
  {
    path: 'regions',
    element: RegionsPage
  },
  {
    path: 'system',
    element: SystemOverviewPage
  },
  {
    path: 'analytics',
    element: AnalyticsPage
  },
  // Admin routes
  {
    path: 'schools',
    element: SchoolManagementPage
  },
  {
    path: 'schools/register',
    element: SchoolRegistrationPage
  },
  {
    path: 'schools/:schoolId/edit',
    element: EditSchoolPage
  },
  {
    path: 'schools/:schoolId/assign-admin',
    element: AssignSchoolAdminPage
  },
  {
    path: 'regions',
    element: RegionConfigPage
  },
  {
    path: 'permissions-roles',
    element: PermissionsRolesPage
  },
  {
    path: 'audit-log',
    element: AuditLogPage
  },
  {
    path: 'users',
    element: UserManagementPage
  },
  // Reports and Monitoring routes
  {
    path: 'reports',
    element: ReportsPage
  },
  {
    path: 'reports/school-performance',
    element: SchoolPerformanceReportPage
  },
  {
    path: 'reports/learner-progression',
    element: LearnerProgressionReportPage
  },
  {
    path: 'reports/subject-analytics',
    element: SubjectAnalyticsReportPage
  },
  {
    path: 'reports/assignment-tracking',
    element: AssignmentTrackingReportPage
  },
  {
    path: 'monitoring',
    element: SystemMonitoringPage
  },
  {
    path: 'monitoring/usage',
    element: UsageMonitoringDashboardPage
  },
  {
    path: 'monitoring/regional',
    element: RegionalUsageReportPage
  },
  {
    path: 'monitoring/school',
    element: SchoolUsageReportPage
  },
  {
    path: 'monitoring/users',
    element: UserActivityReportPage
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

