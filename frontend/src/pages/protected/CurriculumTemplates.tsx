import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { CurriculumTemplatesPage } from '../../features/curriculum';

function CurriculumTemplates() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Curriculum Templates" }));
  }, [dispatch]);

  return <CurriculumTemplatesPage />;
}

export default CurriculumTemplates; 