import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizById } from '../quizzesSlice';
import { createQuizSubmission, updateQuizSubmission, submitQuiz, fetchQuizSubmissionsByQuizIdAndStudentId } from '../quizSubmissionsSlice';
import { Quiz } from '../../../api/services/quizApi';
import { Question } from '../../../api/services/questionApi';
import { QuizSubmission } from '../../../api/services/quizSubmissionApi';
import QuizTimer from '../components/QuizTimer';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, FileQuestion } from 'lucide-react';

interface QuizAnswer {
  questionId: number;
  answer: string;
  selectedOptions?: number[];
}

const QuizTakingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentQuiz, status, error } = useAppSelector(state => state.quizzes);
  const { currentSubmission, status: submissionStatus } = useAppSelector(state => state.quizSubmissions);
  const { user } = useAppSelector(state => state.auth);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuizAnswer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [timeWarningShown, setTimeWarningShown] = useState(false);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    if (id && user) {
      dispatch(fetchQuizById(Number(id)));
      // Check if user already has a submission for this quiz
      dispatch(fetchQuizSubmissionsByQuizIdAndStudentId({ 
        quizId: Number(id), 
        studentId: user.id 
      }));
    }
  }, [dispatch, id, user]);

  useEffect(() => {
    // If user already has a submission, load their previous answers
    if (currentSubmission && currentSubmission.status === 'IN_PROGRESS') {
      setSubmissionId(currentSubmission.id);
      // Load previous answers from submission responses
      const previousAnswers: Record<number, QuizAnswer> = {};
      currentSubmission.responses.forEach(response => {
        previousAnswers[response.questionId] = {
          questionId: response.questionId,
          answer: response.answer,
          selectedOptions: response.answer ? [parseInt(response.answer)] : undefined
        };
      });
      setAnswers(previousAnswers);
    } else if (currentQuiz && user && !currentSubmission) {
      // Create new submission if none exists
      createNewSubmission();
    }
  }, [currentSubmission, currentQuiz, user]);

  const createNewSubmission = async () => {
    if (!currentQuiz || !user) return;

    try {
      const submissionData = {
        quizId: currentQuiz.id,
        studentId: user.id,
        startedAt: new Date().toISOString(),
        status: 'IN_PROGRESS' as const,
        responses: [],
        active: true
      };

      const result = await dispatch(createQuizSubmission(submissionData)).unwrap();
      if (result && typeof result === 'object' && 'id' in result) {
        setSubmissionId(result.id);
      }
    } catch (error) {
      console.error('Failed to create quiz submission:', error);
    }
  };

  const handleTimeUp = useCallback(() => {
    handleSubmitQuiz(true); // Auto-submit when time is up
  }, []);

  const handleTimeWarning = useCallback((minutesLeft: number) => {
    if (minutesLeft <= 5 && !timeWarningShown) {
      setTimeWarningShown(true);
      // Could show a toast notification here
    }
  }, [timeWarningShown]);

  const handleAnswerChange = async (questionId: number, answer: string, selectedOptions?: number[]) => {
    const newAnswer = {
      questionId,
      answer,
      selectedOptions
    };

    setAnswers(prev => ({
      ...prev,
      [questionId]: newAnswer
    }));

    // Auto-save the answer to the backend
    if (submissionId) {
      try {
        const responses = Object.values({
          ...answers,
          [questionId]: newAnswer
        }).map((ans, index) => ({
          id: 0, // Temporary ID, will be set by backend
          questionId: ans.questionId,
          answer: ans.answer,
          submissionId: submissionId,
          isCorrect: undefined,
          points: undefined
        }));

        await dispatch(updateQuizSubmission({
          id: submissionId,
          submissionData: { responses }
        }));
      } catch (error) {
        console.error('Failed to auto-save answer:', error);
      }
    }
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if (!submissionId) return;

    setIsSubmitting(true);
    try {
      // First update the submission with final answers
      const responses = Object.values(answers).map((ans, index) => ({
        id: 0, // Temporary ID, will be set by backend
        questionId: ans.questionId,
        answer: ans.answer,
        submissionId: submissionId,
        isCorrect: undefined,
        points: undefined
      }));

      await dispatch(updateQuizSubmission({
        id: submissionId,
        submissionData: { 
          responses,
          submittedAt: new Date().toISOString()
        }
      }));

      // Then submit the quiz
      await dispatch(submitQuiz(submissionId)).unwrap();

      // Navigate to results page after successful submission
      navigate(`/app/quiz-results/${currentQuiz?.id}`);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      setIsSubmitting(false);
    }
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] !== undefined;
  };

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id.toString()}
                  checked={answer?.selectedOptions?.includes(option.id) || false}
                  onChange={() => handleAnswerChange(question.id, option.text, [option.id])}
                  className="radio radio-primary"
                />
                <span className="text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={answer?.answer === 'true'}
                onChange={() => handleAnswerChange(question.id, 'true')}
                className="radio radio-primary"
              />
              <span className="text-gray-700">True</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={answer?.answer === 'false'}
                onChange={() => handleAnswerChange(question.id, 'false')}
                className="radio radio-primary"
              />
              <span className="text-gray-700">False</span>
            </label>
          </div>
        );

      case 'SHORT_ANSWER':
        return (
          <textarea
            value={answer?.answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here..."
            className="textarea textarea-bordered w-full"
            rows={3}
          />
        );

      case 'ESSAY':
        return (
          <textarea
            value={answer?.answer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Write your essay here..."
            className="textarea textarea-bordered w-full"
            rows={8}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (status === 'loading' || submissionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Quiz Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || 'The quiz you are looking for could not be found.'}
        </p>
        <button
          onClick={() => navigate('/app/quizzes')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  // Check if quiz has already been submitted
  if (currentSubmission && currentSubmission.status !== 'IN_PROGRESS') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Quiz Already Submitted</h3>
        <p className="mt-1 text-sm text-gray-500">
          You have already submitted this quiz. You can view your results below.
        </p>
        <button
          onClick={() => navigate(`/app/quiz-results/${currentQuiz.id}`)}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          View Results
        </button>
      </div>
    );
  }

  const questions = currentQuiz.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  if (totalQuestions === 0) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Questions Available</h3>
        <p className="mt-1 text-sm text-gray-500">
          This quiz doesn't have any questions yet.
        </p>
        <button
          onClick={() => navigate('/app/quizzes')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {getAnsweredQuestionsCount()} / {totalQuestions} answered
            </div>
            <QuizTimer
              timeLimit={currentQuiz.timeLimit}
              onTimeUp={handleTimeUp}
              onWarning={handleTimeWarning}
              warningThresholds={[10, 5, 2, 1]}
              className="w-80"
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Questions</h3>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((question: Question, index: number) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-indigo-600 text-white'
                    : isQuestionAnswered(question.id)
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Not answered</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded">
                    {currentQuestion.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="mb-8">
                {renderQuestion(currentQuestion)}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="flex gap-3">
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirmation(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Submit Quiz
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Quiz?</h3>
            <p className="text-gray-600 mb-6">
              You have answered {getAnsweredQuestionsCount()} out of {totalQuestions} questions. 
              Once submitted, you cannot make changes to your answers.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSubmitConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitQuiz()}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTakingPage; 