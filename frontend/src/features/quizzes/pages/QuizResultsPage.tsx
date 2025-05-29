import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizById } from '../quizzesSlice';
import { fetchQuizSubmissionsByQuizIdAndStudentId } from '../quizSubmissionsSlice';
import { Quiz } from '../../../api/services/quizApi';
import { QuizSubmission } from '../../../api/services/quizSubmissionApi';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  FileQuestion, 
  ArrowLeft,
  BarChart3,
  Target,
  Calendar
} from 'lucide-react';

const QuizResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentQuiz, status, error } = useAppSelector(state => state.quizzes);
  const { currentSubmission, status: submissionStatus, error: submissionError } = useAppSelector(state => state.quizSubmissions);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (id && user) {
      dispatch(fetchQuizById(Number(id)));
      // Fetch the user's submission for this quiz
      dispatch(fetchQuizSubmissionsByQuizIdAndStudentId({ 
        quizId: Number(id), 
        studentId: user.id 
      }));
    }
  }, [dispatch, id, user]);

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || submissionStatus === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || submissionError || !currentQuiz) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Results Not Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {error || submissionError || 'The quiz results could not be found.'}
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

  if (!currentSubmission) {
    return (
      <div className="text-center py-12">
        <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No Submission Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't submitted this quiz yet.
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate('/app/quizzes')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Quizzes
          </button>
          <button
            onClick={() => navigate(`/app/quiz-take/${currentQuiz.id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Take Quiz
          </button>
        </div>
      </div>
    );
  }

  // Check if quiz is still in progress
  if (currentSubmission.status === 'IN_PROGRESS') {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto h-12 w-12 text-blue-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Quiz In Progress</h3>
        <p className="mt-1 text-sm text-gray-500">
          You have started this quiz but haven't submitted it yet.
        </p>
        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate('/app/quizzes')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Quizzes
          </button>
          <button
            onClick={() => navigate(`/app/quiz-take/${currentQuiz.id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Continue Quiz
          </button>
        </div>
      </div>
    );
  }

  const score = currentSubmission.score || 0;
  const totalPoints = currentQuiz.totalPoints;
  const percentage = Math.round((score / totalPoints) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/app/quizzes')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Quizzes
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
                <p className="text-sm text-gray-600">Quiz Results</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                currentSubmission.status === 'GRADED' 
                  ? 'bg-green-100 text-green-800' 
                  : currentSubmission.status === 'SUBMITTED'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentSubmission.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                    percentage >= 70 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {percentage >= 70 ? (
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    ) : (
                      <XCircle className="h-12 w-12 text-red-600" />
                    )}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {percentage}%
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  {score} out of {totalPoints} points
                </p>
                <div className="flex justify-center items-center gap-2">
                  <span className="text-sm text-gray-500">Grade:</span>
                  <span className={`text-2xl font-bold ${getGradeColor(percentage)}`}>
                    {getGradeLetter(percentage)}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Breakdown
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Score</span>
                  <span className="font-medium">{score} / {totalPoints} points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Percentage</span>
                  <span className="font-medium">{percentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Grade</span>
                  <span className={`font-medium ${getGradeColor(percentage)}`}>
                    {getGradeLetter(percentage)}
                  </span>
                </div>
                {currentSubmission.submittedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time Taken</span>
                    <span className="font-medium">
                      {formatDuration(currentSubmission.startedAt, currentSubmission.submittedAt)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Limit</span>
                  <span className="font-medium">{currentQuiz.timeLimit} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-medium">{currentSubmission.responses.length} / {currentQuiz.questions?.length || 0}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback */}
            {currentSubmission.feedback && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor Feedback</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700">{currentSubmission.feedback}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Information Sidebar */}
          <div className="space-y-6">
            {/* Quiz Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                Quiz Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Code:</span>
                  <span className="font-medium">{currentQuiz.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Course:</span>
                  <span className="font-medium">{currentQuiz.courseName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Points:</span>
                  <span className="font-medium">{currentQuiz.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium">{currentQuiz.timeLimit} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium">{currentQuiz.questions?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Submission Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Started</p>
                    <p className="text-xs text-gray-500">{formatDateTime(currentSubmission.startedAt)}</p>
                  </div>
                </div>
                
                {currentSubmission.submittedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitted</p>
                      <p className="text-xs text-gray-500">{formatDateTime(currentSubmission.submittedAt)}</p>
                    </div>
                  </div>
                )}
                
                {currentSubmission.gradedAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Graded</p>
                      <p className="text-xs text-gray-500">{formatDateTime(currentSubmission.gradedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/app/quizzes')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Back to Quizzes
                </button>
                
                {currentQuiz.maxAttempts > 1 && (
                  <button
                    onClick={() => navigate(`/app/quiz-take/${currentQuiz.id}`)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage; 