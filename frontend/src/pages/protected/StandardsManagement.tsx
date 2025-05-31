import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { StandardsManagementPage } from '../../features/curriculum';

function StandardsManagement() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Standards Management" }));
  }, [dispatch]);

  return <StandardsManagementPage />;
}

export default StandardsManagement; 