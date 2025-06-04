import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import QuizCreationPage from '../../features/quizzes/pages/QuizCreationPage';

const TeacherQuizCreation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Create Quiz" }));
    }, [dispatch]);

    return (
        <div className="teacher-quiz-creation-container">
            <QuizCreationPage />
        </div>
    );
};

export default TeacherQuizCreation; 