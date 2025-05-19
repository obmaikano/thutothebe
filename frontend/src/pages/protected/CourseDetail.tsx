import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import CourseDetailPage from '../../features/courses/pages/CourseDetailPage';

const CourseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Course Details" }));
    }, [dispatch]);

    return (
        <div className="course-detail-container">
            <CourseDetailPage />
        </div>
    );
};

export default CourseDetail; 