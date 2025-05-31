import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setPageTitle } from '../../features/common/headerSlice';
import CurriculumAnalyticsPage from '../../features/curriculum/pages/CurriculumAnalyticsPage';

const CurriculumAnalytics: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageTitle('Curriculum Analytics'));
  }, [dispatch]);

  return <CurriculumAnalyticsPage />;
};

export default CurriculumAnalytics; 