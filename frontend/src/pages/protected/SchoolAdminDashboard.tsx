import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SchoolAdminDashboardPage } from '../../features/school_admin/pages/SchoolAdminDashboardPage';

const SchoolAdminDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Admin Dashboard" }));
    }, [dispatch]);

    return (
        <div className="school-admin-dashboard-container">
            <SchoolAdminDashboardPage />
        </div>
    );
};

export default SchoolAdminDashboard; 