import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SchoolRegistration } from '../components/SchoolRegistration';

const SchoolRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/app/schools');
  };

  return (
    <div className="p-6">
      <SchoolRegistration onSuccess={handleSuccess} />
    </div>
  );
};

export default SchoolRegistrationPage; 