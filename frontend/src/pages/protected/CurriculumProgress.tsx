import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setPageTitle } from '../../features/common/headerSlice';
import CurriculumProgressPage from '../../features/curriculum/pages/CurriculumProgressPage';

const CurriculumProgress: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Curriculum Progress'));
  }, [dispatch]);

  return <CurriculumProgressPage />;
};

export default CurriculumProgress; 