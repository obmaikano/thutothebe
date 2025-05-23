import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { EditSchool } from '../components/EditSchool';

const EditSchoolPage: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();

  if (!schoolId) {
    return <Navigate to="/app/schools" replace />;
  }

  return (
    <div className="p-6">
      <EditSchool schoolId={schoolId} />
    </div>
  );
};

export default EditSchoolPage; 