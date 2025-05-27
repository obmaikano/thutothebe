import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';

const Monitoring = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Monitoring" }));
    }, [dispatch]);

    return (
        <div className="monitoring-container">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">School Monitoring</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
                    <p className="text-blue-700">
                        School monitoring functionality is under development. This will include:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-blue-700 space-y-1">
                        <li>LMS usage analytics</li>
                        <li>System performance monitoring</li>
                        <li>User activity tracking</li>
                        <li>Resource utilization reports</li>
                        <li>System health monitoring</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Monitoring; 