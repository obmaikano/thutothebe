import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPageTitle } from '../../features/common/headerSlice';
import EditCoursePage from '../../features/courses/pages/EditCoursePage';

const EditCourse = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Edit Course" }));
    }, [dispatch]);

    return (
        <div className="edit-course-container">
            <EditCoursePage />
        </div>
    );
};

export default EditCourse; 