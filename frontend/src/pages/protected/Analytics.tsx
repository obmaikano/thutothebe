import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AnalyticsDashboard } from '../../features/analytics';

const AnalyticsPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Analytics" }));
    }, [dispatch]);

    return (
        <div className="analytics-container">
            <AnalyticsDashboard />
        </div>
    );
};

export default AnalyticsPage; 