import React from 'react';
import { useAppSelector } from '../../store';
import QuizListPage from '../../features/quizzes/pages/QuizListPage';
import StudentQuizListPage from '../../features/quizzes/pages/StudentQuizListPage';

const Quizzes: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);

  // Show student quiz list for students, teacher/admin quiz list for others
  if (user?.role === 'STUDENT') {
    return <StudentQuizListPage />;
  }

  return <QuizListPage />;
};

export default Quizzes; 