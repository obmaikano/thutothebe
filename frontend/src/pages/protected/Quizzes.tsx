import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import { useAuth } from '../../contexts/AuthContext';
import QuizListPage from '../../features/quizzes/pages/QuizListPage';
import StudentQuizListPage from '../../features/quizzes/pages/StudentQuizListPage';

const Quizzes = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Quizzes" }));
    }, [dispatch]);

    // Route to appropriate quiz interface based on user role
    const isStudent = user?.role === 'STUDENT';
    
    return (
        <div className="quizzes-container">
            {isStudent ? <StudentQuizListPage /> : <QuizListPage />}
        </div>
    );
};

export default Quizzes; 