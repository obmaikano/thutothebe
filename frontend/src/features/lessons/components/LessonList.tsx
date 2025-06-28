import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchLessons, fetchLessonsByCourseId, fetchLessonsByStatus } from '../lessonsSlice';
import { Lesson } from '../../../api/services/lessonApi';

interface LessonListProps {
  courseId?: number;
  status?: Lesson['status'];
  showAll?: boolean;
}

const LessonList: React.FC<LessonListProps> = ({ courseId, status, showAll = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lessons, loading, error } = useSelector((state: RootState) => state.lessons);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    if (showAll) {
      dispatch(fetchLessons());
    } else if (courseId) {
      dispatch(fetchLessonsByCourseId(courseId));
    } else if (status) {
      dispatch(fetchLessonsByStatus(status));
    }
  }, [dispatch, courseId, status, showAll]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all' && showAll) {
      dispatch(fetchLessons());
    } else if (filter === 'planned') {
      dispatch(fetchLessonsByStatus('PLANNED'));
    } else if (filter === 'scheduled') {
      dispatch(fetchLessonsByStatus('SCHEDULED'));
    } else if (filter === 'in_progress') {
      dispatch(fetchLessonsByStatus('IN_PROGRESS'));
    } else if (filter === 'completed') {
      dispatch(fetchLessonsByStatus('COMPLETED'));
    }
  };

  const getStatusColor = (status: Lesson['status']) => {
    switch (status) {
      case 'PLANNED':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'POSTPONED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading lessons...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading lessons</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {showAll && (
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('planned')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'planned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Planned
          </button>
          <button
            onClick={() => handleFilterChange('scheduled')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Scheduled
          </button>
          <button
            onClick={() => handleFilterChange('in_progress')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'in_progress'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>
      )}

      {/* Lessons List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {lessons.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No lessons found
            </li>
          ) : (
            lessons.map((lesson) => (
              <li key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {lesson.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                        {lesson.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Order: {lesson.lessonOrder}</span>
                      {lesson.durationMinutes && (
                        <span>Duration: {lesson.durationMinutes} min</span>
                      )}
                      {lesson.scheduledDate && (
                        <span>Scheduled: {formatDate(lesson.scheduledDate)}</span>
                      )}
                      {lesson.completedDate && (
                        <span>Completed: {formatDate(lesson.completedDate)}</span>
                      )}
                    </div>
                    {lesson.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.isMandatory && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Mandatory
                      </span>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{lessons.length}</div>
            <div className="text-sm text-gray-500">Total Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {lessons.filter(l => l.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {lessons.filter(l => l.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {lessons.filter(l => l.status === 'SCHEDULED').length}
            </div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonList; 