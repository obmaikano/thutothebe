import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import EditSchoolPage from '../../features/admin/pages/EditSchoolPage';

const EditSchool = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Edit School" }));
    }, [dispatch]);

    return (
        <div className="edit-school-container">
            <EditSchoolPage />
        </div>
    );
};

export default EditSchool; 