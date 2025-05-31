import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { CurriculumDetailPage } from '../../features/curriculum';

function CurriculumDetail() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Curriculum Details" }));
  }, [dispatch]);

  return <CurriculumDetailPage />;
}

export default CurriculumDetail; 