import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchAllProgress, fetchProgressSummary } from '../curriculumProgressSlice';
import { TrendingUp, CheckCircle, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface CurriculumProgressTabProps {
  curriculumId: number;
}

const CurriculumProgressTab: React.FC<CurriculumProgressTabProps> = ({ curriculumId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {
    progressRecords,
    progressSummary,
    status,
    error
  } = useAppSelector(state => (state as any).curriculumProgress || {
    progressRecords: [],
    progressSummary: null,
    status: 'idle',
    error: null
  });

  useEffect(() => {
    if (curriculumId) {
      dispatch(fetchAllProgress());
      dispatch(fetchProgressSummary(curriculumId));
    }
  }, [dispatch, curriculumId]);

  const handleViewFullProgress = () => {
    navigate(`/app/curriculum-progress/${curriculumId}`);
  };

  // Filter progress records for this curriculum
  const curriculumProgress = progressRecords.filter((record: any) => 
    record.curriculumId === curriculumId
  );

  // Calculate stats from real data
  const progressStats = {
    completed: curriculumProgress.filter((p: any) => p.status === 'COMPLETED').length,
    inProgress: curriculumProgress.filter((p: any) => p.status === 'IN_PROGRESS').length,
    overdue: curriculumProgress.filter((p: any) => p.status === 'OVERDUE').length,
    overall: progressSummary?.overallProgress || 0
  };

  // Get recent progress updates
  const recentUpdates = curriculumProgress
    .sort((a: any, b: any) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 3);

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-green-600 mb-4"></div>
            <p className="text-gray-600">Loading progress data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Progress Error</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={handleViewFullProgress}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              View Progress Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Implementation Progress</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Track curriculum implementation progress across schools, monitor milestones, and manage implementation timelines with detailed progress tracking.
          </p>
          <button
            onClick={handleViewFullProgress}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Full Progress
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressStats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressStats.inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{progressStats.overdue}</div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(progressStats.overall)}%</div>
              <div className="text-sm text-gray-500">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline Preview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress Updates</h4>
        {recentUpdates.length > 0 ? (
          <div className="space-y-4">
            {recentUpdates.map((update: any, index: number) => (
              <div key={update.id || index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  update.status === 'COMPLETED' ? 'bg-green-100' :
                  update.status === 'IN_PROGRESS' ? 'bg-blue-100' :
                  update.status === 'OVERDUE' ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  {update.status === 'COMPLETED' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : update.status === 'OVERDUE' ? (
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {update.milestone || update.description || 'Progress Update'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(update.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {update.notes || `Progress: ${update.progressPercentage || 0}%`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No recent progress updates available</p>
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracking Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Implementation Milestones</div>
              <div className="text-sm text-gray-600">Track key implementation phases and deadlines</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">School-wise Progress</div>
              <div className="text-sm text-gray-600">Monitor progress across individual schools</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Timeline Management</div>
              <div className="text-sm text-gray-600">Manage implementation schedules and deadlines</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Progress Reports</div>
              <div className="text-sm text-gray-600">Generate detailed progress and status reports</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumProgressTab; 