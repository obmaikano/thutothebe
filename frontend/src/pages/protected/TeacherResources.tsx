import React from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import TeacherResourcesPage from '../../features/teachers/pages/TeacherResourcesPage';

const TeacherResources: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['TEACHER']}>
      <TeacherResourcesPage />
    </ProtectedRoute>
  );
};

export default TeacherResources; 