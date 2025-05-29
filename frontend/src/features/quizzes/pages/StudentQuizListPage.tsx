import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchQuizzes, clearQuizzesError } from '../quizzesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { Quiz } from '../../../api/services/quizApi';
import { Search, Filter, Clock, Users, BookOpen, Play, CheckCircle, AlertCircle } from 'lucide-react';

const StudentQuizListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { quizzes, status, error } = useAppSelector(state => state.quizzes || { quizzes: [], status: 'idle', error: null });
  const { courses } = useAppSelector(state => state.courses || { courses: [] });
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  useEffect(() => {
    dispatch(fetchQuizzes());
    dispatch(fetchCourses());
    return () => {
      dispatch(clearQuizzesError());
    };
  }, [dispatch]);

  const handleTakeQuiz = (quiz: Quiz) => {
    // TODO: Navigate to quiz taking page
    console.log('Take quiz:', quiz);
  };

  const handleViewResults = (quiz: Quiz) => {
    // TODO: Navigate to quiz results page
    console.log('View results:', quiz);
  };

  // Filter quizzes to show only published and active ones for students
  const availableQuizzes = (quizzes || []).filter(quiz => 
    quiz.status === 'PUBLISHED' && 
    quiz.active &&
    new Date(quiz.startDate) <= new Date() &&
    new Date(quiz.endDate) >= new Date()
  );

  const filteredQuizzes = availableQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !courseFilter || quiz.courseId.toString() === courseFilter;
    return matchesSearch && matchesCourse;
  });

  const getQuizStatus = (quiz: Quiz) => {
    const now = new Date();
    const startDate = new Date(quiz.startDate);
    const endDate = new Date(quiz.endDate);

    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-100 text-blue-800', icon: Clock };
    } else if (now > endDate) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-100 text-red-800', icon: AlertCircle };
    } else {
      return { status: 'available', label: 'Available', color: 'bg-green-100 text-green-800', icon: Play };
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

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Quizzes</h1>
        <p className="text-gray-600 mt-2">Take quizzes and view your results</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        {filteredQuizzes.map((quiz) => {
          const quizStatus = getQuizStatus(quiz);
          const StatusIcon = quizStatus.icon;
          
          return (
            <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Quiz Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">Code: {quiz.code}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${quizStatus.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {quizStatus.label}
                  </span>
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
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span>{formatDate(quiz.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span>{formatDate(quiz.endDate)}</span>
                  </div>
                  {quizStatus.status === 'available' && (
                    <div className="flex justify-between mt-1 font-medium text-orange-600">
                      <span>Time left:</span>
                      <span>{formatTimeRemaining(quiz.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {quizStatus.status === 'available' && (
                  <button
                    onClick={() => handleTakeQuiz(quiz)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Take Quiz
                  </button>
                )}
                {quizStatus.status === 'expired' && (
                  <button
                    onClick={() => handleViewResults(quiz)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    View Results
                  </button>
                )}
                {quizStatus.status === 'upcoming' && (
                  <button
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Clock className="h-4 w-4" />
                    Not Available Yet
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredQuizzes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes available</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || courseFilter
              ? 'Try adjusting your search criteria.'
              : 'There are no quizzes available at the moment. Check back later.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentQuizListPage; 