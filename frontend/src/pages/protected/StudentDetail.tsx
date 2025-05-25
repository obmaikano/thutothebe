import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentDetailPage from '../../features/students/pages/StudentDetailPage';

const StudentDetail = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Student Detail" }));
    }, [dispatch]);

    return (
        <div className="student-detail-container">
            <StudentDetailPage />
        </div>
    );
};

export default StudentDetail; 