import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import UserListPage from '../../features/users/pages/UserListPage';

function Users() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Users" }));
  }, [dispatch]);

  return <UserListPage />;
}

export default Users; 