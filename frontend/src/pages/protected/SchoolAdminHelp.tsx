import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SchoolAdminHelpPage } from '../../features/school_admin';

function SchoolAdminHelp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Help & Support" }));
  }, [dispatch]);

  return <SchoolAdminHelpPage />;
}

export default SchoolAdminHelp; 