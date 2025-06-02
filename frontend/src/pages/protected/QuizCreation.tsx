import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import QuizCreationPage from '../../features/quizzes/pages/QuizCreationPage';

const QuizCreation = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Quiz Creation" }));
    }, [dispatch]);

    return <QuizCreationPage />;
};

export default QuizCreation; 