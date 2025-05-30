import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import CalendarPage from '../../features/calendar/pages/CalendarPage';

function Calendar() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Calendar Events" }));
  }, [dispatch]);

  return <CalendarPage />;
}

export default Calendar; 