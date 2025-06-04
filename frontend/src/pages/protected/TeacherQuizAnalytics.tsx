import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import QuizAnalyticsPage from '../../features/quizzes/pages/QuizAnalyticsPage';

const TeacherQuizAnalytics = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Quiz Analytics" }));
    }, [dispatch]);

    return (
        <div className="teacher-quiz-analytics-container">
            <QuizAnalyticsPage />
        </div>
    );
};

export default TeacherQuizAnalytics; 