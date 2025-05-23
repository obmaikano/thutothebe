import React from 'react';
import { Route } from 'react-router-dom';
import { SuperAdminDashboard } from '../dashboard/components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserManagement } from './components/UserManagement';
import { SchoolManagement } from './components/SchoolManagement';
import RegionConfig from './components/RegionConfig';
import PermissionsRoles from './components/PermissionsRoles';
import AuditLogPanel from './components/AuditLogPanel';
import { SchoolRegistrationPage, EditSchoolPage } from './pages';

export const adminRoutes = [
  <Route key="super-admin-dashboard" path="/app/admin" element={<SuperAdminDashboard />} />,
  <Route key="admin-dashboard" path="/app/admin/dashboard" element={<AdminDashboard />} />,
  <Route key="user-management" path="/app/admin/users" element={<UserManagement />} />,
  <Route key="school-management" path="/app/admin/schools" element={<SchoolManagement searchTerm="" filterType="" />} />,
  <Route key="school-registration" path="/app/admin/schools/register" element={<SchoolRegistrationPage />} />,
  <Route key="edit-school" path="/app/admin/schools/:schoolId/edit" element={<EditSchoolPage />} />,
  <Route key="region-configuration" path="/app/admin/regions" element={<RegionConfig />} />,
  <Route key="permissions-roles" path="/app/admin/roles" element={<PermissionsRoles />} />,
  <Route key="audit-logs" path="/app/admin/audit" element={<AuditLogPanel />} />,
]; 