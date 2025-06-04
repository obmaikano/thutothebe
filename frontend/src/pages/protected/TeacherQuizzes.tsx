import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import QuizListPage from '../../features/quizzes/pages/QuizListPage';

const TeacherQuizzes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "My Quizzes" }));
    }, [dispatch]);

    return (
        <div className="teacher-quizzes-container">
            <QuizListPage />
        </div>
    );
};

export default TeacherQuizzes; 