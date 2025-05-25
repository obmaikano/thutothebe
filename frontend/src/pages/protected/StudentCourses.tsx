import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentCoursesPage from '../../features/students/pages/StudentCoursesPage';

const StudentCourses = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Courses" }));
    }, [dispatch]);

    return (
        <div className="student-courses-container">
            <StudentCoursesPage />
        </div>
    );
};

export default StudentCourses; 