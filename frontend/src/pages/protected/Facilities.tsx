import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';

const Facilities = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Facilities Management" }));
    }, [dispatch]);

    return (
        <div className="facilities-container">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Facilities Management</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
                    <p className="text-blue-700">
                        Facilities management functionality is under development. This will include:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-blue-700 space-y-1">
                        <li>Classroom and facility booking</li>
                        <li>Equipment inventory management</li>
                        <li>Maintenance request tracking</li>
                        <li>Facility usage analytics</li>
                        <li>Resource allocation planning</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Facilities; 