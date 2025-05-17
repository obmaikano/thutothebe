import React from 'react';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { AdminDashboard } from './AdminDashboard';
import { ParentDashboard } from './ParentDashboard';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { MinistryExecutiveDashboard } from './MinistryExecutiveDashboard';
import { MinistryStaffDashboard } from './MinistryStaffDashboard';
import { DirectorDashboard } from './DirectorDashboard';
import { RegionalAdminDashboard } from './RegionalAdminDashboard';
import { RegionalOfficerDashboard } from './RegionalOfficerDashboard';
import { SchoolAdminDashboard } from './SchoolAdminDashboard';
import { SchoolHeadDashboard } from './SchoolHeadDashboard';
import { DepartmentHeadDashboard } from './DepartmentHeadDashboard';
import { SeniorTeacherDashboard } from './SeniorTeacherDashboard';
import { useAuth } from '../../../contexts/AuthContext';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || '';

  // Return the appropriate dashboard based on user role
  switch (role) {
    case 'STUDENT':
      return <StudentDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'SCHOOL_ADMIN':
      return <SchoolAdminDashboard />;
    case 'PARENT':
      return <ParentDashboard />;
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'MINISTRY_EXECUTIVE':
      return <MinistryExecutiveDashboard />;
    case 'MINISTRY_STAFF':
      return <MinistryStaffDashboard />;
    case 'DIRECTOR':
      return <DirectorDashboard />;
    case 'REGIONAL_ADMIN':
      return <RegionalAdminDashboard />;
    case 'REGIONAL_OFFICER':
      return <RegionalOfficerDashboard />;
    case 'SCHOOL_HEAD':
      return <SchoolHeadDashboard />;
    case 'DEPARTMENT_HEAD':
      return <DepartmentHeadDashboard />;
    case 'SENIOR_TEACHER':
      return <SeniorTeacherDashboard />;
    default:
      return <AdminDashboard />;
  }
};

export default RoleDashboard; 