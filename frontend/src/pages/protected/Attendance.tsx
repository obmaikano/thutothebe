import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';

const Attendance = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Attendance Tracking" }));
    }, [dispatch]);

    return (
        <div className="attendance-container">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Attendance Tracking</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
                    <p className="text-blue-700">
                        Attendance tracking functionality is under development. This will include:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-blue-700 space-y-1">
                        <li>Daily attendance recording</li>
                        <li>Student and staff attendance reports</li>
                        <li>Attendance analytics and trends</li>
                        <li>Parent notification system</li>
                        <li>Attendance policy management</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Attendance; 