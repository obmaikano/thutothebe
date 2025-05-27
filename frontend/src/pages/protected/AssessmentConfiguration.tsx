import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { AssessmentConfigurationPage } from '../../features/school_admin/pages/AssessmentConfigurationPage';

const AssessmentConfiguration = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Assessment Configuration" }));
    }, [dispatch]);

    return (
        <div className="assessment-configuration-container">
            <AssessmentConfigurationPage />
        </div>
    );
};

export default AssessmentConfiguration; 