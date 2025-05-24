import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SubjectDetailPage from '../../features/subjects/pages/SubjectDetailPage';

function SubjectDetail() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Subject Details" }));
  }, [dispatch]);

  return <SubjectDetailPage />;
}

export default SubjectDetail; 