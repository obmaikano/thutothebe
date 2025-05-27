import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { TimetableManagementPage } from '../../features/school_admin/pages/TimetableManagementPage';

const TimetableManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Timetable Management" }));
    }, [dispatch]);

    return (
        <div className="timetable-management-container">
            <TimetableManagementPage />
        </div>
    );
};

export default TimetableManagement; 