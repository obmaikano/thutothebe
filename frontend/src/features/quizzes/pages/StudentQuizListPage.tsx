import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizzes, clearQuizzesError } from '../quizzesSlice';
import { fetchQuizSubmissionsByStudentId, startQuiz } from '../quizSubmissionsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { Quiz } from '../../../api/services/quizApi';
import { QuizSubmission } from '../../../api/services/quizSubmissionApi';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  BookOpen, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  FileQuestion,
  Award,
  Calendar,
  Timer,
  Target
} from 'lucide-react';

interface QuizWithSubmission extends Quiz {
  submission?: QuizSubmission;
  statusInfo?: {
    status: string;
    label: string;
    color: string;
    icon: any;
  };
}

const StudentQuizListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quizzes, status, error } = useAppSelector(state => state.quizzes || { quizzes: [], status: 'idle', error: null });
  const { submissions } = useAppSelector(state => state.quizSubmissions || { submissions: [] });
  const { courses } = useAppSelector(state => state.courses || { courses: [] });
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchCourses());
    if (user) {
      dispatch(fetchQuizSubmissionsByStudentId(user.id));
    }
    return () => {
      dispatch(clearQuizzesError());
    };
  }, [dispatch, user]);

  const handleTakeQuiz = async (quiz: Quiz) => {
    if (!user) return;
    
    const existingSubmission = getQuizSubmissionStatus(quiz.id);
    
    // If no existing submission, start the quiz first
    if (!existingSubmission) {
      try {
        await dispatch(startQuiz({ quizId: quiz.id, studentId: user.id })).unwrap();
      } catch (error) {
        console.error('Failed to start quiz:', error);
        return;
      }
    }
    
    navigate(`/app/quiz-take/${quiz.id}`);
  };

  const handleViewResults = (quiz: Quiz) => {
    navigate(`/app/quiz-results/${quiz.id}`);
  };

  const getQuizSubmissionStatus = (quizId: number): QuizSubmission | undefined => {
    return (submissions || []).find(sub => sub.quizId === quizId);
  };

  const getQuizStatusInfo = (quiz: Quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);
    const submission = getQuizSubmissionStatus(quiz.id);

    // Check submission status first
    if (submission) {
      if (submission.status === 'IN_PROGRESS') {
        return { status: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock };
      } else if (submission.status === 'SUBMITTED') {
        return { status: 'submitted', label: 'Submitted', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: CheckCircle };
      } else if (submission.status === 'GRADED') {
        return { status: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 border-green-200', icon: Award };
      }
    }

    // Check time-based status
    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar };
    } else if (now > endDate) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
    } else {
      return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-800 border-green-200', icon: Play };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Filter quizzes to show only published and active ones for students
  const availableQuizzes: QuizWithSubmission[] = (quizzes || [])
    .filter(quiz => quiz.status === 'PUBLISHED' && quiz.active)
    .map(quiz => {
      const submission = getQuizSubmissionStatus(quiz.id);
      const statusInfo = getQuizStatusInfo(quiz);
      return {
        ...quiz,
        submission,
        statusInfo
      };
    });

  const filteredQuizzes = availableQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !courseFilter || quiz.courseId.toString() === courseFilter;
    
    const matchesStatus = !statusFilter || quiz.statusInfo?.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Get unique courses for filter
  const uniqueCourses = [...new Set(availableQuizzes.map(q => ({ id: q.courseId, name: q.courseName })))];

  // Calculate stats
  const stats = {
    total: availableQuizzes.length,
    available: availableQuizzes.filter(q => q.statusInfo?.status === 'available').length,
    inProgress: availableQuizzes.filter(q => q.statusInfo?.status === 'in-progress').length,
    completed: availableQuizzes.filter(q => q.statusInfo?.status === 'completed').length,
    upcoming: availableQuizzes.filter(q => q.statusInfo?.status === 'upcoming').length
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-600 mt-2">Take quizzes and view your results</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredQuizzes.length} of {availableQuizzes.length} quiz{availableQuizzes.length !== 1 ? 'zes' : ''}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search quizzes by title, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
            <option value="expired">Expired</option>
          </select>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map(course => (
              <option key={course.id} value={course.id.toString()}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {availableQuizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileQuestion size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Quizzes</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Play size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.available}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Clock size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Award size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.upcoming}</div>
                <div className="text-sm text-gray-500">Upcoming</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {availableQuizzes.length === 0 ? 'No quizzes available' : 'No quizzes match your filters'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {availableQuizzes.length === 0 
                ? "There are no quizzes available at the moment. Check back later."
                : "Try adjusting your search terms or filters to find what you're looking for."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuizzes.map((quiz) => {
                  const StatusIcon = quiz.statusInfo?.icon || FileQuestion;
                  const submission = quiz.submission;
                  
                  return (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileQuestion className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                            <div className="text-sm text-gray-500">Code: {quiz.code}</div>
                            {quiz.description && (
                              <div className="text-xs text-gray-400 truncate max-w-xs mt-1">
                                {quiz.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{quiz.courseName || 'Course'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {quiz.totalPoints} points
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Timer className="h-4 w-4 mr-1 text-gray-400" />
                          {quiz.timeLimit} minutes
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(quiz.startDate)}</div>
                        <div className="text-sm text-gray-500">to {formatDate(quiz.endDate)}</div>
                        {quiz.statusInfo?.status === 'available' && (
                          <div className="text-xs text-orange-600 font-medium">
                            {formatTimeRemaining(quiz.endDate)} remaining
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${quiz.statusInfo?.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {quiz.statusInfo?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {submission && submission.score !== undefined ? (
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">{submission.score}</span>
                            <span className="text-gray-500"> / {quiz.totalPoints}</span>
                            <div className="text-xs text-gray-400">
                              {Math.round((submission.score / quiz.totalPoints) * 100)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {quiz.statusInfo?.status === 'available' && (
                            <button
                              onClick={() => handleTakeQuiz(quiz)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Take Quiz
                            </button>
                          )}
                          {quiz.statusInfo?.status === 'in-progress' && (
                            <button
                              onClick={() => handleTakeQuiz(quiz)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Continue
                            </button>
                          )}
                          {(quiz.statusInfo?.status === 'completed' || quiz.statusInfo?.status === 'submitted') && submission && (
                            <button
                              onClick={() => handleViewResults(quiz)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Results
                            </button>
                          )}
                          {quiz.statusInfo?.status === 'upcoming' && (
                            <span className="text-gray-400 px-3 py-1 text-xs">
                              Not Available Yet
                            </span>
                          )}
                          {quiz.statusInfo?.status === 'expired' && !submission && (
                            <span className="text-red-400 px-3 py-1 text-xs">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuizListPage; 