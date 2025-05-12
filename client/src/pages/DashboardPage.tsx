import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ParentDashboard from '../components/dashboard/ParentDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.STUDENT:
        return <StudentDashboard />;
      case UserRole.TEACHER:
        return <TeacherDashboard />;
      case UserRole.SUPER_ADMIN:
      case UserRole.REGIONAL_ADMIN:
        return <AdminDashboard />;
      case UserRole.PARENT:
        return <ParentDashboard />;
      default:
        return <div>Dashboard not available for this role</div>;
    }
  };

  return (
    <div>
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;