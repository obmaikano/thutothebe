import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchLessonCompletions, fetchLessonCompletionsByLessonId, fetchLessonCompletionsByStudentId } from '../lessonCompletionsSlice';
import { LessonCompletion } from '../../../api/services/lessonCompletionApi';

interface LessonCompletionListProps {
  lessonId?: number;
  studentId?: number;
  showAll?: boolean;
}

const LessonCompletionList: React.FC<LessonCompletionListProps> = ({ lessonId, studentId, showAll = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { lessonCompletions, loading, error } = useSelector((state: RootState) => state.lessonCompletions);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    if (showAll) {
      dispatch(fetchLessonCompletions());
    } else if (lessonId) {
      dispatch(fetchLessonCompletionsByLessonId(lessonId));
    } else if (studentId) {
      dispatch(fetchLessonCompletionsByStudentId(studentId));
    }
  }, [dispatch, lessonId, studentId, showAll]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all' && showAll) {
      dispatch(fetchLessonCompletions());
    } else if (filter === 'completed') {
      // Filter by completion status
      const completedCompletions = lessonCompletions.filter(lc => lc.status === 'COMPLETED');
      // Note: This is client-side filtering. For server-side filtering, you'd need to add API endpoints
    } else if (filter === 'in_progress') {
      const inProgressCompletions = lessonCompletions.filter(lc => lc.status === 'IN_PROGRESS');
    } else if (filter === 'failed') {
      const failedCompletions = lessonCompletions.filter(lc => lc.status === 'FAILED');
    }
  };

  const getStatusColor = (status: LessonCompletion['status']) => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading lesson completions...</span>
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
            <h3 className="text-sm font-medium text-red-800">Error loading lesson completions</h3>
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
            onClick={() => handleFilterChange('pending_review')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              selectedFilter === 'pending_review'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending Review
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

      {/* Lesson Completions List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {lessonCompletions.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No lesson completions found
            </li>
          ) : (
            lessonCompletions.map((completion) => (
              <li key={completion.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {completion.lessonTitle || `Lesson ${completion.lessonId}`}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(completion.status)}`}>
                        {completion.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>Student: {completion.studentName || `ID: ${completion.studentId}`}</span>
                      {completion.percentage !== null && (
                        <span>Progress: {completion.percentage}%</span>
                      )}
                      {completion.timeSpentMinutes && (
                        <span>Time Spent: {formatDuration(completion.timeSpentMinutes)}</span>
                      )}
                      {completion.completedDate && (
                        <span>Completed: {formatDate(completion.completedDate)}</span>
                      )}
                    </div>
                    {completion.notes && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {completion.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {completion.score !== null && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Score: {completion.score}
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
            <div className="text-2xl font-bold text-gray-900">{lessonCompletions.length}</div>
            <div className="text-sm text-gray-500">Total Completions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {lessonCompletions.filter(lc => lc.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {lessonCompletions.filter(lc => lc.status === 'IN_PROGRESS').length}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {lessonCompletions.filter(lc => lc.status === 'FAILED').length}
            </div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonCompletionList; 