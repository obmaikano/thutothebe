import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AttendanceReportsPage } from '../../features/attendance';

function AttendanceReports() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Attendance Reports" }));
  }, [dispatch]);

  return <AttendanceReportsPage />;
}

export default AttendanceReports; 