import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { CurriculumBuilderPage } from '../../features/curriculum';

function CurriculumBuilder() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Curriculum Builder" }));
  }, [dispatch]);

  return <CurriculumBuilderPage />;
}

export default CurriculumBuilder; 