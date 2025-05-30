import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { StudentAttendancePage } from '../../features/attendance';

function MyAttendance() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "My Attendance" }));
  }, [dispatch]);

  return <StudentAttendancePage />;
}

export default MyAttendance; 