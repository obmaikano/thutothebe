import React, { useState } from 'react';
import { SchoolManagement } from '../components/SchoolManagement';

const SchoolManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  return (
    <div className="p-6">
      <SchoolManagement searchTerm={searchTerm} filterType={filterType} />
    </div>
  );
};

export default SchoolManagementPage; 