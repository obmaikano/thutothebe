import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizzes, clearQuizzesError } from '../quizzesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Quiz } from '../../../api/services/quizApi';
import { Search, Filter, Plus, Edit, Trash2, Eye, FileQuestion, Clock, Users, BookOpen } from 'lucide-react';

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
    dispatch(openModal({
      title: 'Create New Quiz',
      bodyType: MODAL_BODY_TYPES.QUIZ_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEditQuiz = (quiz: Quiz) => {
    dispatch(openModal({
      title: 'Edit Quiz',
      bodyType: MODAL_BODY_TYPES.QUIZ_EDIT,
      extraObject: quiz,
      size: 'lg'
    }));
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
        {canCreateQuizzes && (
          <button
            onClick={handleCreateQuiz}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Quiz
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
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
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            {/* Quiz Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Code: {quiz.code}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(quiz.status)}`}>
                  {quiz.status}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleViewQuiz(quiz)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Quiz"
                >
                  <Eye className="h-4 w-4" />
                </button>
                {canCreateQuizzes && (
                  <>
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit Quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuiz(quiz)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quiz Description */}
            {quiz.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
            )}

            {/* Quiz Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{quiz.courseName || 'Course'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{quiz.timeLimit} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{quiz.totalPoints} points</span>
              </div>
            </div>

            {/* Quiz Dates */}
            <div className="border-t pt-3">
              <div className="text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Start:</span>
                  <span>{formatDate(quiz.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>End:</span>
                  <span>{formatDate(quiz.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || courseFilter
              ? 'Try adjusting your search criteria.'
              : canCreateQuizzes
              ? 'Get started by creating your first quiz.'
              : 'No quizzes have been created yet.'}
          </p>
          {canCreateQuizzes && !searchTerm && !statusFilter && !courseFilter && (
            <div className="mt-6">
              <button
                onClick={handleCreateQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your First Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizListPage;