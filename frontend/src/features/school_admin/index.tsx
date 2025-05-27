// School Admin Feature Exports

// Pages
export { SchoolAdminDashboardPage } from './pages/SchoolAdminDashboardPage';
export { TimetableManagementPage } from './pages/TimetableManagementPage';
export { AssessmentConfigurationPage } from './pages/AssessmentConfigurationPage';
export { SubjectAllocationPage } from './pages/SubjectAllocationPage';
export { default as ClassManagementPage } from './pages/ClassManagementPage';
export { default as StaffManagementPage } from './pages/StaffManagementPage';
export { default as StaffDetailPage } from './pages/StaffDetailPage';
export { default as StudentRecordsPage } from './pages/StudentRecordsPage';
export { ReportsPage } from './pages/ReportsPage';
export { SchoolSettingsPage } from './pages/SchoolSettingsPage';
export { default as SchoolAdminHelpPage } from './pages/SchoolAdminHelpPage';
export { FacilitiesPage } from './pages/FacilitiesPage';
export { SchoolCalendarPage } from './pages/SchoolCalendarPage';
export { AttendancePage } from './pages/AttendancePage';

// Modals
export { default as ScheduleEditModal } from './modals/ScheduleEditModal';
export { default as ScheduleViewModal } from './modals/ScheduleViewModal';

// Redux
export { default as schedulesReducer } from './schedulesSlice';
export * from './schedulesSlice'; 