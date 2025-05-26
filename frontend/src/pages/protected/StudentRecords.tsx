import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentRecordsPage from '../../features/school_admin/pages/StudentRecordsPage';

const StudentRecords = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Student Records" }));
    }, [dispatch]);

    return (
        <div className="student-records-container">
            <StudentRecordsPage />
        </div>
    );
};

export default StudentRecords; 