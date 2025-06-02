import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizzes, clearQuizzesError } from '../quizzesSlice';
import { fetchQuizSubmissions } from '../quizSubmissionsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { Quiz } from '../../../api/services/quizApi';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  BookOpen,
  Filter,
  Download,
  Eye,
  Calendar
} from 'lucide-react';

const QuizAnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizzes, status, error } = useAppSelector(state => state.quizzes);
  const { submissions } = useAppSelector(state => state.quizSubmissions);
  const { courses } = useAppSelector(state => state.courses);
  const { user } = useAppSelector(state => state.auth);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('30');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchQuizSubmissions());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearQuizzesError());
    };
  }, [dispatch]);

  // Filter quizzes based on user role and filters
  const filteredQuizzes = (quizzes || []).filter(quiz => {
    const matchesCourse = !courseFilter || quiz.courseId.toString() === courseFilter;
    const matchesStatus = !statusFilter || quiz.status === statusFilter;
    
    // For teachers, only show their quizzes
    if (user?.role === 'TEACHER') {
      return quiz.instructorId === user.id && matchesCourse && matchesStatus;
    }
    
    return matchesCourse && matchesStatus;
  });

  // Calculate analytics for selected quiz or all quizzes
  const getQuizAnalytics = (quiz?: Quiz) => {
    const targetQuizzes = quiz ? [quiz] : filteredQuizzes;
    const targetSubmissions = (submissions || []).filter(sub => 
      targetQuizzes.some(q => q.id === sub.quizId)
    );

    const totalSubmissions = targetSubmissions.length;
    const completedSubmissions = targetSubmissions.filter(sub => 
      sub.status === 'SUBMITTED' || sub.status === 'GRADED'
    ).length;
    
    const averageScore = targetSubmissions.length > 0 
      ? targetSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / targetSubmissions.length
      : 0;

    const completionRate = totalSubmissions > 0 
      ? (completedSubmissions / totalSubmissions) * 100 
      : 0;

    return {
      totalQuizzes: targetQuizzes.length,
      totalSubmissions,
      completedSubmissions,
      averageScore: Math.round(averageScore * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100,
      passRate: targetSubmissions.length > 0 
        ? Math.round((targetSubmissions.filter(sub => (sub.score || 0) >= 60).length / targetSubmissions.length) * 100)
        : 0
    };
  };

  const overallAnalytics = getQuizAnalytics();
  const selectedQuizAnalytics = selectedQuiz ? getQuizAnalytics(selectedQuiz) : null;

  const handleViewQuiz = (quiz: Quiz) => {
    navigate(`/app/quiz-results/${quiz.id}`);
  };

  const handleExportData = () => {
    // Implementation for exporting analytics data
    console.log('Exporting analytics data...');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Analytics</h1>
          <p className="text-gray-600 mt-2">Analyze quiz performance and student engagement</p>
        </div>
        <button
          onClick={handleExportData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download size={16} />
          Export Data
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearQuizzesError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {(courses || []).map(course => (
                <option key={course.id} value={course.id.toString()}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specific Quiz
            </label>
            <select
              value={selectedQuiz?.id || ''}
              onChange={(e) => {
                const quiz = filteredQuizzes.find(q => q.id === Number(e.target.value));
                setSelectedQuiz(quiz || null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Quizzes</option>
              {filteredQuizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedQuizAnalytics?.totalQuizzes || overallAnalytics.totalQuizzes}
              </div>
              <div className="text-sm text-gray-500">
                {selectedQuiz ? 'Selected Quiz' : 'Total Quizzes'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedQuizAnalytics?.totalSubmissions || overallAnalytics.totalSubmissions}
              </div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Target size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedQuizAnalytics?.averageScore || overallAnalytics.averageScore}%
              </div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {selectedQuizAnalytics?.completionRate || overallAnalytics.completionRate}%
              </div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Performance Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quiz Performance Overview</h3>
          <p className="text-sm text-gray-600">Detailed performance metrics for each quiz</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pass Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => {
                const quizSubmissions = (submissions || []).filter(sub => sub.quizId === quiz.id);
                const avgScore = quizSubmissions.length > 0 
                  ? quizSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / quizSubmissions.length
                  : 0;
                const passRate = quizSubmissions.length > 0 
                  ? (quizSubmissions.filter(sub => (sub.score || 0) >= 60).length / quizSubmissions.length) * 100
                  : 0;

                return (
                  <tr key={quiz.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">Code: {quiz.code}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quiz.courseName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(quiz.status)}`}>
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{quizSubmissions.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{Math.round(avgScore * 100) / 100}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{Math.round(passRate)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewQuiz(quiz)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Data</h3>
            <p className="text-gray-600">
              No quizzes found matching your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Additional Analytics Section */}
      {selectedQuiz && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Detailed Analytics: {selectedQuiz.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {selectedQuizAnalytics?.totalSubmissions || 0}
              </div>
              <div className="text-sm text-gray-600">Total Attempts</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {selectedQuizAnalytics?.completionRate || 0}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {selectedQuizAnalytics?.passRate || 0}%
              </div>
              <div className="text-sm text-gray-600">Pass Rate (≥60%)</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <span className="ml-2 text-gray-600">{formatDate(selectedQuiz.startDate)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">End Date:</span>
                <span className="ml-2 text-gray-600">{formatDate(selectedQuiz.endDate)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Time Limit:</span>
                <span className="ml-2 text-gray-600">{selectedQuiz.timeLimit} minutes</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Total Points:</span>
                <span className="ml-2 text-gray-600">{selectedQuiz.totalPoints}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizAnalyticsPage; 