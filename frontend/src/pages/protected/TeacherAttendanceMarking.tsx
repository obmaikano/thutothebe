import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AttendanceMarkingPage } from '../../features/attendance';

function TeacherAttendanceMarking() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Mark Attendance" }));
  }, [dispatch]);

  return <AttendanceMarkingPage />;
}

export default TeacherAttendanceMarking; 