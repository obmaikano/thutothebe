import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SchoolManagementPage from '../../features/admin/pages/SchoolManagementPage';

const SchoolManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Management" }));
    }, [dispatch]);

    return (
        <div className="school-management-container">
            <SchoolManagementPage />
        </div>
    );
};

export default SchoolManagement; 