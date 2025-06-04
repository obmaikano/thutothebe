import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentAttendancePage from '../../features/students/pages/StudentAttendancePage';

const StudentAttendance = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Attendance" }));
    }, [dispatch]);

    return (
        <div className="student-attendance-container">
            <StudentAttendancePage />
        </div>
    );
};

export default StudentAttendance; 