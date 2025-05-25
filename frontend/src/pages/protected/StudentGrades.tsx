import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentGradesPage from '../../features/students/pages/StudentGradesPage';

const StudentGrades = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Grades" }));
    }, [dispatch]);

    return (
        <div className="student-grades-container">
            <StudentGradesPage />
        </div>
    );
};

export default StudentGrades; 