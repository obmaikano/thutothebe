import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import AttendanceAnalyticsPage from '../../features/attendance/pages/AttendanceAnalyticsPage';

const AttendanceAnalytics = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Attendance Analytics" }));
    }, [dispatch]);

    return (
        <div className="attendance-analytics-container">
            <AttendanceAnalyticsPage />
        </div>
    );
};

export default AttendanceAnalytics; 