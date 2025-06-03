import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SchoolList from '../../features/schools/pages/SchoolListPage';

function SchoolListPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Schools Management" }));
  }, [dispatch]);

  return <SchoolList />;
}

export default SchoolListPage; 