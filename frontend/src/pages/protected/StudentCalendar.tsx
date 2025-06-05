import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentCalendarPage from '../../features/calendar/pages/StudentCalendarPage';

function StudentCalendar() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Calendar Events" }));
  }, [dispatch]);

  return <StudentCalendarPage />;
}

export default StudentCalendar; 