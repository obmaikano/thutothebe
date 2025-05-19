import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import CourseListPage from '../../features/courses/pages/CourseListPage';

const CoursesPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Courses" }));
    }, [dispatch]);

    return (
        <div className="courses-container">
            <CourseListPage />
        </div>
    );
};

export default CoursesPage; 