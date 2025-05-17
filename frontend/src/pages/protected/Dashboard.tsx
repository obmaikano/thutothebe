import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { RoleDashboard } from '../../features/dashboard';

const DashboardPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Dashboard" }));
    }, [dispatch]);

    return (
        <div className="dashboard-container">
            <RoleDashboard />
        </div>
    );
};

export default DashboardPage;