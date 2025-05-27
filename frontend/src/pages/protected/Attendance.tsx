import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AttendancePage } from '../../features/school_admin/pages/AttendancePage';

const Attendance = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Attendance Management" }));
    }, [dispatch]);

    return (
        <div className="attendance-container">
            <AttendancePage />
        </div>
    );
};

export default Attendance; 