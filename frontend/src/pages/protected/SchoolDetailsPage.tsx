import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SchoolDetails from '../../features/schools/pages/SchoolDetailsPage';

function SchoolDetailsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "School Details" }));
  }, [dispatch]);

  return <SchoolDetails />;
}

export default SchoolDetailsPage; 