import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import PermissionsRolesPage from '../../features/admin/pages/PermissionsRolesPage';

const PermissionsRoles = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Permissions & Roles' }));
    }, [dispatch]);

    return (
        <div className="permissions-roles-container">
            <PermissionsRolesPage />
        </div>
    );
};

export default PermissionsRoles; 