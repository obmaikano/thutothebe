import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TeacherClassesPage from './pages/TeacherClassesPage';

const TeacherClasses: React.FC = () => {
  const { user } = useAuth();

  // Check if user has teacher role
  if (!user || user.role !== 'TEACHER') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need teacher privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return <TeacherClassesPage />;
};

export default TeacherClasses; 