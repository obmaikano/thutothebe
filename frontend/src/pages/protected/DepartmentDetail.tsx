import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import DepartmentDetailsPage from '../../features/departments/pages/DepartmentDetailsPage';

function DepartmentDetail() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Department Details" }));
  }, [dispatch]);

  return <DepartmentDetailsPage />;
}

export default DepartmentDetail; 