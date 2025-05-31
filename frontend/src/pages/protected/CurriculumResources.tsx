import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setPageTitle } from '../../features/common/headerSlice';
import CurriculumResourcesPage from '../../features/curriculum/pages/CurriculumResourcesPage';

const CurriculumResources: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Curriculum Resources'));
  }, [dispatch]);

  return <CurriculumResourcesPage />;
};

export default CurriculumResources; 