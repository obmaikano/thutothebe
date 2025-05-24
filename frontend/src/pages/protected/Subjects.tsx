import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SubjectListPage from '../../features/subjects/pages/SubjectListPage';

function Subjects() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Subjects" }));
  }, [dispatch]);

  return <SubjectListPage />;
}

export default Subjects; 