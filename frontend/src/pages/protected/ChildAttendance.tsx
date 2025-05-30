import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { StudentAttendancePage } from '../../features/attendance';

function ChildAttendance() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Child Attendance" }));
  }, [dispatch]);

  return <StudentAttendancePage />;
}

export default ChildAttendance; 