import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { LearningObjectivesPage } from '../../features/curriculum';

function LearningObjectives() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Learning Objectives" }));
  }, [dispatch]);

  return <LearningObjectivesPage />;
}

export default LearningObjectives; 