import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import AssignSchoolAdminPage from '../../features/admin/pages/AssignSchoolAdminPage';

const AssignSchoolAdmin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Assign School Admin" }));
    }, [dispatch]);

    return (
        <div className="assign-school-admin-container">
            <AssignSchoolAdminPage />
        </div>
    );
};

export default AssignSchoolAdmin; 