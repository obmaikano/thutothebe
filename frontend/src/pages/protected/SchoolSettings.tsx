import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { SchoolSettingsPage } from '../../features/school_admin/pages/SchoolSettingsPage';

const SchoolSettings = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "School Settings" }));
    }, [dispatch]);

    return (
        <div className="school-settings-container">
            <SchoolSettingsPage />
        </div>
    );
};

export default SchoolSettings; 