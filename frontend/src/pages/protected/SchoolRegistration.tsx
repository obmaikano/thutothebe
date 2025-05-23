import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import SchoolRegistrationPage from '../../features/admin/pages/SchoolRegistrationPage';

const SchoolRegistration = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Registration" }));
    }, [dispatch]);

    return (
        <div className="school-registration-container">
            <SchoolRegistrationPage />
        </div>
    );
};

export default SchoolRegistration; 