import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';

const Documents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Documents Management" }));
    }, [dispatch]);

    return (
        <div className="documents-container">
            <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Documents Management</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">Coming Soon</h2>
                    <p className="text-blue-700">
                        Documents management functionality is under development. This will include:
                    </p>
                    <ul className="list-disc list-inside mt-3 text-blue-700 space-y-1">
                        <li>Document storage and organization</li>
                        <li>Policy and procedure management</li>
                        <li>Student record documentation</li>
                        <li>Staff document management</li>
                        <li>Compliance document tracking</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Documents; 