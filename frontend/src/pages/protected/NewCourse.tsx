import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import NewCoursePage from '../../features/courses/pages/NewCoursePage';

const NewCourse = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Create New Course" }));
    }, [dispatch]);

    return (
        <div className="new-course-container">
            <NewCoursePage />
        </div>
    );
};

export default NewCourse; 