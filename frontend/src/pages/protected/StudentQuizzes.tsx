import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import StudentQuizListPage from '../../features/quizzes/pages/StudentQuizListPage';

const StudentQuizzes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Quizzes" }));
    }, [dispatch]);

    return (
        <div className="student-quizzes-container">
            <StudentQuizListPage />
        </div>
    );
};

export default StudentQuizzes; 