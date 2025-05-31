import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchDashboardAnalytics,
  fetchRealTimeAnalytics,
  fetchTrendAnalytics,
  generateCurriculumAnalytics,
  clearDashboardData,
  clearRealTimeData,
  clearTrendData
} from '../curriculumAdvancedSlice';
import {
  fetchProgressByCurriculum,
  fetchProgressSummary,
  fetchProgressStatistics,
  fetchOverdueProgress
} from '../curriculumProgressSlice';
import { fetchCurriculumById } from '../curriculumSlice';
import { CurriculumProgressDTO } from '../../../api/services/curriculumProgressApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Calendar,
  Target,
  Download,
  RefreshCw
} from 'lucide-react';

const CurriculumAnalyticsPage: React.FC = () => {
  const { curriculumId } = useParams<{ curriculumId: string }>();
  const dispatch = useAppDispatch();
  
  const { currentCurriculum } = useAppSelector(state => state.curriculum);
  const {
    dashboardData,
    realTimeData,
    trendData,
    analyticsLoading,
    analyticsError
  } = useAppSelector(state => (state as any).curriculumAdvanced || {
    dashboardData: null,
    realTimeData: null,
    trendData: null,
    analyticsLoading: false,
    analyticsError: null
  });
  const {
    progressSummary,
    progressStatistics,
    overdueProgress,
    status: progressStatus
  } = useAppSelector(state => (state as any).curriculumProgress || {
    progressSummary: null,
    progressStatistics: null,
    overdueProgress: [],
    status: 'idle'
  });
  const { user } = useAppSelector(state => state.auth);

  const [selectedMetric, setSelectedMetric] = useState('implementation_progress');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [aggregationLevel, setAggregationLevel] = useState<'NATIONAL' | 'REGIONAL' | 'SCHOOL' | 'CLASS' | 'INDIVIDUAL'>('SCHOOL');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  useEffect(() => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      
      // Fetch curriculum details
      dispatch(fetchCurriculumById(id));
      
      // Fetch analytics data
      dispatch(fetchDashboardAnalytics({
        curriculumId: id,
        level: aggregationLevel,
        schoolId: user?.schoolId,
        teacherId: user?.role === 'TEACHER' ? user.id : undefined
      }));
      
      dispatch(fetchRealTimeAnalytics({
        curriculumId: id,
        schoolId: user?.schoolId,
        regionId: user?.regionId
      }));
      
      // Fetch progress data
      dispatch(fetchProgressByCurriculum(id));
      dispatch(fetchProgressSummary(id));
      dispatch(fetchProgressStatistics());
      dispatch(fetchOverdueProgress());
    }

    return () => {
      dispatch(clearDashboardData());
      dispatch(clearRealTimeData());
      dispatch(clearTrendData());
    };
  }, [dispatch, curriculumId, aggregationLevel, user]);

  const handleGenerateAnalytics = () => {
    if (curriculumId) {
      console.log('Generating analytics for curriculum:', curriculumId);
      console.log('Analytics parameters:', {
        curriculumId: parseInt(curriculumId),
        analyticsType: selectedMetric,
        aggregationLevel,
        schoolId: user?.schoolId,
        regionId: user?.regionId,
        generatedById: user?.id
      });
      
      dispatch(generateCurriculumAnalytics({
        curriculumId: parseInt(curriculumId),
        analyticsType: selectedMetric as any,
        aggregationLevel,
        schoolId: user?.schoolId,
        regionId: user?.regionId,
        generatedById: user?.id
      })).then((result) => {
        console.log('Generate analytics result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          showNotification('success', 'Analytics generated successfully');
        } else {
          showNotification('error', 'Failed to generate analytics');
        }
      }).catch((error) => {
        console.error('Generate analytics error:', error);
        showNotification('error', 'Failed to generate analytics');
      });
    }
  };

  const handleFetchTrends = () => {
    if (curriculumId) {
      console.log('Fetching trends for curriculum:', curriculumId);
      console.log('Trend parameters:', {
        curriculumId: parseInt(curriculumId),
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        metric: selectedMetric
      });
      
      dispatch(fetchTrendAnalytics({
        curriculumId: parseInt(curriculumId),
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        metric: selectedMetric
      })).then((result) => {
        console.log('Fetch trends result:', result);
        if (result.meta.requestStatus === 'fulfilled') {
          showNotification('success', 'Trend data fetched successfully');
        } else {
          showNotification('error', 'Failed to fetch trend data');
        }
      }).catch((error) => {
        console.error('Fetch trends error:', error);
        showNotification('error', 'Failed to fetch trend data');
      });
    }
  };

  const handleExportReport = () => {
    if (!curriculumId) return;
    
    // Create export data
    const exportData = {
      curriculum: currentCurriculum,
      summary: progressSummary,
      statistics: progressStatistics,
      overdueProgress: overdueProgress,
      dashboardData: dashboardData,
      realTimeData: realTimeData,
      trendData: trendData,
      generatedAt: new Date().toISOString(),
      generatedBy: user?.name || 'Unknown User',
      dateRange: dateRange,
      aggregationLevel: aggregationLevel,
      selectedMetric: selectedMetric
    };

    // Convert to JSON and download
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `curriculum-analytics-${curriculumId}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('success', 'Analytics report exported successfully');
  };

  const handleRefreshData = () => {
    if (curriculumId) {
      const id = parseInt(curriculumId);
      
      console.log('Refreshing data for curriculum:', id);
      console.log('User context:', { schoolId: user?.schoolId, regionId: user?.regionId, role: user?.role });
      
      // Refresh all data
      dispatch(fetchCurriculumById(id));
      dispatch(fetchDashboardAnalytics({
        curriculumId: id,
        level: aggregationLevel,
        schoolId: user?.schoolId,
        teacherId: user?.role === 'TEACHER' ? user.id : undefined
      })).then((result) => {
        console.log('Dashboard analytics result:', result);
      }).catch((error) => {
        console.error('Dashboard analytics error:', error);
      });
      
      dispatch(fetchRealTimeAnalytics({
        curriculumId: id,
        schoolId: user?.schoolId,
        regionId: user?.regionId
      })).then((result) => {
        console.log('Real-time analytics result:', result);
      }).catch((error) => {
        console.error('Real-time analytics error:', error);
      });
      
      dispatch(fetchProgressByCurriculum(id));
      dispatch(fetchProgressSummary(id));
      dispatch(fetchProgressStatistics());
      dispatch(fetchOverdueProgress());
      
      showNotification('success', 'Data refreshed successfully');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'COMPLETED': '#10B981',
      'IN_PROGRESS': '#3B82F6',
      'NOT_STARTED': '#6B7280',
      'ON_HOLD': '#F59E0B',
      'CANCELLED': '#EF4444'
    };
    return colors[status as keyof typeof colors] || '#6B7280';
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (analyticsLoading || progressStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error Loading Analytics</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{analyticsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Analytics</h1>
          <p className="text-gray-600 mt-2">
            {currentCurriculum?.title || 'Loading curriculum...'} - Implementation Analytics & Progress Tracking
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Generate Analytics
          </button>
          <button
            onClick={handleFetchTrends}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <TrendingUp size={16} />
            Fetch Trends
          </button>
          <button
            onClick={handleExportReport}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Export Report
          </button>
          <button
            onClick={handleRefreshData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analytics Type</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="IMPLEMENTATION_PROGRESS">Implementation Progress</option>
              <option value="PERFORMANCE_ANALYSIS">Performance Analysis</option>
              <option value="RESOURCE_UTILIZATION">Resource Utilization</option>
              <option value="TEACHER_EFFECTIVENESS">Teacher Effectiveness</option>
              <option value="STUDENT_OUTCOMES">Student Outcomes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation Level</label>
            <select
              value={aggregationLevel}
              onChange={(e) => setAggregationLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NATIONAL">National</option>
              <option value="REGIONAL">Regional</option>
              <option value="SCHOOL">School</option>
              <option value="CLASS">Class</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {progressSummary?.totalSchools || 0}
              </div>
              <div className="text-sm text-gray-500">Total Schools</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {progressSummary?.completedSchools || 0}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Activity size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {progressSummary?.inProgressSchools || 0}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {progressSummary?.overdueSchools || 0}
              </div>
              <div className="text-sm text-gray-500">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Implementation Progress Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Progress</h3>
          {progressSummary && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: progressSummary.completedSchools, color: '#10B981' },
                    { name: 'In Progress', value: progressSummary.inProgressSchools, color: '#3B82F6' },
                    { name: 'Not Started', value: progressSummary.notStartedSchools, color: '#6B7280' },
                    { name: 'Overdue', value: progressSummary.overdueSchools, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Completed', value: progressSummary.completedSchools, color: '#10B981' },
                    { name: 'In Progress', value: progressSummary.inProgressSchools, color: '#3B82F6' },
                    { name: 'Not Started', value: progressSummary.notStartedSchools, color: '#6B7280' },
                    { name: 'Overdue', value: progressSummary.overdueSchools, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Performance Trends */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
          {trendData && trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">No trend data available</p>
                <p className="text-sm">Click "Fetch Trends" to generate trend analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Data */}
      {realTimeData && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Implementation Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(realTimeData).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-600 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overdue Implementations */}
      {overdueProgress.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Overdue Implementations ({overdueProgress.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueProgress.slice(0, 10).map((progress: CurriculumProgressDTO) => (
                  <tr key={progress.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {progress.schoolName || 'Unknown School'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        {progress.implementationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${progress.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span>{progress.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {progress.daysOverdue || 0} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(progress.expectedEndDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Statistics Summary */}
      {progressStatistics && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {progressStatistics.averageCompletionTime}
              </div>
              <div className="text-sm text-gray-500">Average Completion Time (days)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {progressStatistics.successRate}%
              </div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {progressStatistics.totalImplementations}
              </div>
              <div className="text-sm text-gray-500">Total Implementations</div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' :
            notification.type === 'error' ? 'bg-red-100 border border-red-400 text-red-700' :
            'bg-blue-100 border border-blue-400 text-blue-700'
          }`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumAnalyticsPage; 