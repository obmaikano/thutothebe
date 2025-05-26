import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { ReportsPage } from '../../features/school_admin/pages/ReportsPage';

const SchoolReports = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Reports" }));
    }, [dispatch]);

    return (
        <div className="school-reports-container">
            <ReportsPage />
        </div>
    );
};

export default SchoolReports; 