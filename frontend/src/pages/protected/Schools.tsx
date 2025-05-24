import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SchoolListPage from '../../features/schools';

const SchoolManagement = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Management" }));
    }, [dispatch]);

    return (
        <div className="school-management-container">
            <SchoolListPage />
        </div>
    );
};

export default SchoolManagement; 