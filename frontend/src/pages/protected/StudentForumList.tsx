import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentForumListPage from '../../features/forums/pages/StudentForumListPage';

function StudentForumList() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Discussion Forums" }));
  }, [dispatch]);

  return <StudentForumListPage />;
}

export default StudentForumList; 