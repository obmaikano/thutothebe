import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SchoolCalendarPage } from '../../features/school_admin/pages/SchoolCalendarPage';

const SchoolCalendar = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Calendar" }));
    }, [dispatch]);

    return (
        <div className="school-calendar-container">
            <SchoolCalendarPage />
        </div>
    );
};

export default SchoolCalendar; 