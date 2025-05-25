import React from 'react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import TeacherAssignmentsPage from '../../features/teachers/pages/TeacherAssignmentsPage';

const TeacherAssignments: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['TEACHER']}>
      <TeacherAssignmentsPage />
    </ProtectedRoute>
  );
};

export default TeacherAssignments; 