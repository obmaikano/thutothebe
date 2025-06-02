import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import QuizAnalyticsPage from '../../features/quizzes/pages/QuizAnalyticsPage';

const QuizAnalytics = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Quiz Analytics" }));
    }, [dispatch]);

    return <QuizAnalyticsPage />;
};

export default QuizAnalytics; 