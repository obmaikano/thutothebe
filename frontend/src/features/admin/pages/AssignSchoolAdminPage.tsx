import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AssignSchoolAdmin } from '../components/AssignSchoolAdmin';

const AssignSchoolAdminPage: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();

  if (!schoolId) {
    return <Navigate to="/app/schools" replace />;
  }

  return (
    <div className="p-6">
      <AssignSchoolAdmin schoolId={schoolId} />
    </div>
  );
};

export default AssignSchoolAdminPage; 