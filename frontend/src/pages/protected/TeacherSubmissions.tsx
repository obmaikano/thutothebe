import React from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import TeacherSubmissionsPage from '../../features/teachers/pages/TeacherSubmissionsPage';

const TeacherSubmissions: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['TEACHER']}>
      <TeacherSubmissionsPage />
    </ProtectedRoute>
  );
};

export default TeacherSubmissions; 