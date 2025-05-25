import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { StudentDashboard as StudentDashboardComponent } from '../../features/dashboard/components/StudentDashboard';

const StudentDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Dashboard" }));
    }, [dispatch]);

    return (
        <div className="student-dashboard-container">
            <StudentDashboardComponent />
        </div>
    );
};

export default StudentDashboard; 