import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import ClassManagementPage from '../../features/school_admin/pages/ClassManagementPage';

const ClassManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Class Management" }));
    }, [dispatch]);

    return (
        <div className="class-management-container">
            <ClassManagementPage />
        </div>
    );
};

export default ClassManagement; 