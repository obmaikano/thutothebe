import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { generateCurriculumAnalytics } from '../curriculumAdvancedSlice';
import { BarChart3, TrendingUp, Activity, ExternalLink, AlertCircle } from 'lucide-react';

interface CurriculumAnalyticsTabProps {
  curriculumId: number;
}

const CurriculumAnalyticsTab: React.FC<CurriculumAnalyticsTabProps> = ({ curriculumId }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const {
    analytics,
    analyticsLoading,
    analyticsError
  } = useAppSelector(state => (state as any).curriculumAdvanced || {
    analytics: null,
    analyticsLoading: false,
    analyticsError: null
  });

  useEffect(() => {
    if (curriculumId) {
      // Generate analytics for this curriculum
      dispatch(generateCurriculumAnalytics({
        curriculumId,
        analyticsType: 'IMPLEMENTATION_PROGRESS',
        aggregationLevel: 'SCHOOL'
      }));
    }
  }, [dispatch, curriculumId]);

  const handleViewFullAnalytics = () => {
    navigate(`/app/curriculum-analytics/${curriculumId}`);
  };

  if (analyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Analytics Error</h3>
            <p className="text-red-600 mb-6">{analyticsError}</p>
            <button
              onClick={handleViewFullAnalytics}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              View Analytics Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Analytics</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            View comprehensive analytics, performance metrics, and insights for this curriculum including implementation progress, student outcomes, and usage statistics.
          </p>
          <button
            onClick={handleViewFullAnalytics}
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Full Analytics
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Quick Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.implementationRate ? `${Math.round(analytics.implementationRate)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Implementation Rate</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.engagementRate ? `${Math.round(analytics.engagementRate)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Student Engagement</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.outcomeAchievementRate ? `${Math.round(analytics.outcomeAchievementRate)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Learning Outcomes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Analytics Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Total Schools</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalSchools || 0}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Total Students</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalStudents || 0}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Average Performance</div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.averagePerformance ? `${Math.round(analytics.averagePerformance)}%` : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Completion Rate</div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.completionRate ? `${Math.round(analytics.completionRate)}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Analytics Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Implementation Progress</div>
              <div className="text-sm text-gray-600">Track curriculum rollout across schools and regions</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Student Performance</div>
              <div className="text-sm text-gray-600">Monitor learning outcomes and achievement rates</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Teacher Feedback</div>
              <div className="text-sm text-gray-600">Collect and analyze educator insights</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-gray-900">Resource Usage</div>
              <div className="text-sm text-gray-600">Track curriculum resource utilization</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumAnalyticsTab; 