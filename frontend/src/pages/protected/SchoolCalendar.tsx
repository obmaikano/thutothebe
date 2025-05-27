import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';

const SchoolCalendar = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Calendar" }));
    }, [dispatch]);

    return (
        <div className="school-calendar-container">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">School Calendar</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
                    <p className="text-blue-700">
                        School calendar functionality is under development. This will include:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-blue-700 space-y-1">
                        <li>Academic calendar management</li>
                        <li>Event scheduling and planning</li>
                        <li>Parent-teacher meeting coordination</li>
                        <li>Holiday and break planning</li>
                        <li>Regional event synchronization</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SchoolCalendar; 