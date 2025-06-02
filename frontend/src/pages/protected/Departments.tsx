import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import DepartmentListPage from '../../features/departments/pages/DepartmentListPage';

function Departments() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Departments" }));
  }, [dispatch]);

  return <DepartmentListPage />;
}

export default Departments; 