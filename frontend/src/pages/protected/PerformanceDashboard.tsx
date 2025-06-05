import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import PerformanceDashboardPage from '../../features/analytics/pages/PerformanceDashboardPage';

const PerformanceDashboard = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Performance Analytics" }));
    }, [dispatch]);

    return (
        <div className="performance-dashboard-container">
            <PerformanceDashboardPage />
        </div>
    );
};

export default PerformanceDashboard; 