import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SystemOverview } from '../../features/system';

const SystemOverviewPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "System Overview" }));
    }, [dispatch]);

    return (
        <div className="system-overview-container">
            <SystemOverview />
        </div>
    );
};

export default SystemOverviewPage; 