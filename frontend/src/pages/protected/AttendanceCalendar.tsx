import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AttendanceCalendarPage } from '../../features/attendance';

function AttendanceCalendar() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Attendance Calendar" }));
  }, [dispatch]);

  return <AttendanceCalendarPage />;
}

export default AttendanceCalendar; 