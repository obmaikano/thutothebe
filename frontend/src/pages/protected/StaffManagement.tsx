import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StaffManagementPage from '../../features/school_admin/pages/StaffManagementPage';

const StaffManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Staff Management" }));
    }, [dispatch]);

    return (
        <div className="staff-management-container">
            <StaffManagementPage />
        </div>
    );
};

export default StaffManagement; 