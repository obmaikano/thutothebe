import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchCurriculumProgress, fetchCurriculumProgressByStudentId, fetchCurriculumProgressByCurriculumId } from '../curriculumProgressSlice';
import { CurriculumProgress } from '../../../api/services/curriculumProgressApi';

interface CurriculumProgressDashboardProps {
  studentId?: number;
  curriculumId?: number;
  showAll?: boolean;
}

const CurriculumProgressDashboard: React.FC<CurriculumProgressDashboardProps> = ({ studentId, curriculumId, showAll = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { curriculumProgress, loading, error } = useSelector((state: RootState) => state.curriculumProgress);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    if (showAll) {
      dispatch(fetchCurriculumProgress());
    } else if (studentId) {
      dispatch(fetchCurriculumProgressByStudentId(studentId));
    } else if (curriculumId) {
      dispatch(fetchCurriculumProgressByCurriculumId(curriculumId));
    }
  }, [dispatch, studentId, curriculumId, showAll]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all' && showAll) {
      dispatch(fetchCurriculumProgress());
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    if (percentage >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading curriculum progress...</span>
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
            <h3 className="text-sm font-medium text-red-800">Error loading curriculum progress</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  const totalProgress = curriculumProgress.length > 0 
    ? curriculumProgress.reduce((sum, progress) => sum + (progress.overallProgress || 0), 0) / curriculumProgress.length
    : 0;

  const completedModules = curriculumProgress.filter(p => p.overallProgress === 100).length;
  const inProgressModules = curriculumProgress.filter(p => p.overallProgress > 0 && p.overallProgress < 100).length;
  const notStartedModules = curriculumProgress.filter(p => p.overallProgress === 0).length;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Progress</p>
              <p className={`text-2xl font-bold ${getProgressColor(totalProgress)}`}>
                {totalProgress.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedModules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{inProgressModules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Not Started</p>
              <p className="text-2xl font-bold text-gray-600">{notStartedModules}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Curriculum Progress Details</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {curriculumProgress.length === 0 ? (
            <div className="px-6 py-4 text-center text-gray-500">
              No curriculum progress found
            </div>
          ) : (
            curriculumProgress.map((progress) => (
              <div key={progress.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {progress.curriculumName || `Curriculum ${progress.curriculumId}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Student: {progress.studentName || `ID: ${progress.studentId}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getProgressColor(progress.overallProgress || 0)}`}>
                      {progress.overallProgress?.toFixed(1) || 0}%
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressBarColor(progress.overallProgress || 0)}`}
                    style={{ width: `${progress.overallProgress || 0}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Lessons Completed:</span>
                    <span className="ml-1">{progress.lessonsCompleted || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Lessons:</span>
                    <span className="ml-1">{progress.totalLessons || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Assessments Passed:</span>
                    <span className="ml-1">{progress.assessmentsPassed || 0}</span>
                  </div>
                  <div>
                    <span className="font-medium">Total Assessments:</span>
                    <span className="ml-1">{progress.totalAssessments || 0}</span>
                  </div>
                </div>

                {progress.lastActivityDate && (
                  <div className="mt-2 text-xs text-gray-500">
                    Last Activity: {formatDate(progress.lastActivityDate)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {curriculumProgress.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Average Completion Rate</h4>
              <p className="text-2xl font-bold text-blue-600">
                {totalProgress.toFixed(1)}%
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Average Assessment Score</h4>
              <p className="text-2xl font-bold text-green-600">
                {curriculumProgress.length > 0 
                  ? (curriculumProgress.reduce((sum, p) => sum + (p.averageAssessmentScore || 0), 0) / curriculumProgress.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Active Students</h4>
              <p className="text-2xl font-bold text-purple-600">
                {curriculumProgress.filter(p => p.overallProgress > 0).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumProgressDashboard; 