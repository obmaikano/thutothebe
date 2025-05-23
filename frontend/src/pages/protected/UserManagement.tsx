import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import UserManagementPage from '../../features/admin/pages/UserManagementPage';

const UserManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "User Management" }));
    }, [dispatch]);

    return (
        <div className="user-management-container">
            <UserManagementPage />
        </div>
    );
};

export default UserManagement; 