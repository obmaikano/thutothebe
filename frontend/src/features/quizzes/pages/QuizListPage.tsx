import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizzes, clearQuizzesError, activateQuiz, deactivateQuiz } from '../quizzesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Quiz } from '../../../api/services/quizApi';
import { Search, Filter, Plus, Edit, Trash2, Eye, FileQuestion, Clock, Users, BookOpen, Play, Settings, BarChart3 } from 'lucide-react';

const QuizListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { quizzes, status, error } = useAppSelector(state => state.quizzes || { quizzes: [], status: 'idle', error: null });
  const { courses } = useAppSelector(state => state.courses || { courses: [] });
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearQuizzesError());
    };
  }, [dispatch]);

  const handleCreateQuiz = () => {
    navigate('/app/quiz-creation');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    navigate(`/app/quiz-creation/${quiz.id}`);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    dispatch(openModal({
      title: 'Delete Quiz',
      bodyType: MODAL_BODY_TYPES.QUIZ_DELETE_CONFIRMATION,
      extraObject: quiz,
      size: 'md'
    }));
  };

  const handleViewQuiz = (quiz: Quiz) => {
    navigate(`/app/quiz-results/${quiz.id}`);
  };

  const handleViewAnalytics = () => {
    navigate('/app/quiz-analytics');
  };

  const handleToggleStatus = async (quiz: Quiz) => {
    try {
      if (quiz.active) {
        await dispatch(deactivateQuiz(quiz.id)).unwrap();
      } else {
        await dispatch(activateQuiz(quiz.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle quiz status:', error);
    }
  };

  // Check if user can create quizzes
  const canCreateQuizzes = [
    'TEACHER', 
    'SCHOOL_ADMIN', 
    'REGIONAL_ADMIN',
    'MINISTRY_STAFF',
    'SUPER_ADMIN'
  ].includes(user?.role || '');

  const filteredQuizzes = (quizzes || []).filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || quiz.status === statusFilter;
    const matchesCourse = !courseFilter || quiz.courseId.toString() === courseFilter;
    
    // For teachers, only show their quizzes
    if (user?.role === 'TEACHER') {
      return quiz.instructorId === user.id && matchesSearch && matchesStatus && matchesCourse;
    }
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600 mt-2">Create and manage quizzes for your courses</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleViewAnalytics}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={16} />
            Analytics
          </button>
          {canCreateQuizzes && (
            <button
              onClick={handleCreateQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create Quiz
            </button>
          )}
        </div>
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
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <select 
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Courses</option>
            {(courses || []).map(course => (
              <option key={course.id} value={course.id.toString()}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {filteredQuizzes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileQuestion size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredQuizzes.length}</div>
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
                <div className="text-2xl font-bold text-gray-900">
                  {filteredQuizzes.filter(q => q.status === 'PUBLISHED' && q.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Quizzes</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Edit size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredQuizzes.filter(q => q.status === 'DRAFT').length}
                </div>
                <div className="text-sm text-gray-500">Draft Quizzes</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(filteredQuizzes.map(q => q.courseId)).size}
                </div>
                <div className="text-sm text-gray-500">Courses with Quizzes</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quiz List</h3>
          <p className="text-sm text-gray-600">Manage your quizzes and track their performance</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quiz Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                      <div className="text-sm text-gray-500">Code: {quiz.code}</div>
                      {quiz.description && (
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                          {quiz.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {quiz.courseName || courses?.find(c => c.id === quiz.courseId)?.name || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(quiz.status)}`}>
                        {quiz.status}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        quiz.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        <span>Start: {formatDate(quiz.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        <span>End: {formatDate(quiz.endDate)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-col gap-1">
                      <div>{quiz.timeLimit} minutes</div>
                      <div>{quiz.totalPoints} points</div>
                      <div>Max attempts: {quiz.maxAttempts}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewQuiz(quiz)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Results"
                      >
                        <Eye size={16} />
                      </button>
                      {canCreateQuizzes && (
                        <>
                          <button
                            onClick={() => handleEditQuiz(quiz)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Quiz"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(quiz)}
                            className={`${
                              quiz.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                            }`}
                            title={quiz.active ? 'Deactivate Quiz' : 'Activate Quiz'}
                          >
                            {quiz.active ? <Users size={16} /> : <Play size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Quiz"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <FileQuestion size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter || courseFilter 
                ? 'No quizzes match your current filters.' 
                : 'Get started by creating your first quiz.'}
            </p>
            {canCreateQuizzes && !searchTerm && !statusFilter && !courseFilter && (
              <button
                onClick={handleCreateQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
              >
                <Plus size={16} />
                Create First Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;