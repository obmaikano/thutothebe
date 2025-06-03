import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDashboardData } from '../analyticsSlice';
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Target, 
  Award,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const PerformanceDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { dashboardData, status, error, filters } = useAppSelector(state => state.analytics);
  
  const [selectedTimeframe, setSelectedTimeframe] = useState<'WEEK' | 'MONTH' | 'TERM' | 'YEAR'>('MONTH');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [dispatch, selectedTimeframe, user]);

  const loadDashboardData = async () => {
    if (user) {
      await dispatch(fetchDashboardData({
        timeframe: selectedTimeframe,
        schoolId: user.schoolId,
        regionId: user.regionId
      }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export dashboard data');
  };

  // Mock data for demonstration
  const mockMetrics = {
    totalStudents: 1250,
    averagePerformance: 78.5,
    courseCompletion: 85.2,
    atRiskStudents: 45
  };

  const mockTrendData = [
    { month: 'Jan', performance: 75, completion: 80 },
    { month: 'Feb', performance: 78, completion: 82 },
    { month: 'Mar', performance: 76, completion: 84 },
    { month: 'Apr', performance: 80, completion: 86 },
    { month: 'May', performance: 78.5, completion: 85.2 }
  ];

  const mockSubjectData = [
    { subject: 'Mathematics', score: 82 },
    { subject: 'English', score: 79 },
    { subject: 'Science', score: 84 },
    { subject: 'History', score: 77 },
    { subject: 'Geography', score: 81 }
  ];

  const mockRiskData = [
    { name: 'Low Risk', value: 70, color: '#10B981' },
    { name: 'Medium Risk', value: 25, color: '#F59E0B' },
    { name: 'High Risk', value: 5, color: '#EF4444' }
  ];

  const canViewAllPerformance = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE', 
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'REGIONAL_OFFICER',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Comprehensive view of student and institutional performance
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as 'WEEK' | 'MONTH' | 'TERM' | 'YEAR')}
                  className="select select-bordered select-sm"
                >
                  <option value="WEEK">This Week</option>
                  <option value="MONTH">This Month</option>
                  <option value="TERM">This Term</option>
                  <option value="YEAR">This Year</option>
                </select>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="btn btn-sm btn-outline"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleExport}
                  className="btn btn-sm btn-primary"
                >
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.totalStudents.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.averagePerformance}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+2.3% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Course Completion</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.courseCompletion}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">+1.8% from last month</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
                <p className="text-3xl font-bold text-gray-900">{mockMetrics.atRiskStudents}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 ml-1">-5 from last month</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <BookOpen className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Last 5 Months
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} name="Performance %" />
                <Line type="monotone" dataKey="completion" stroke="#10B981" strokeWidth={2} name="Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Risk Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockRiskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Subject Performance Overview</h3>
            <button className="btn btn-sm btn-outline">
              <Filter className="h-4 w-4" />
              Filter Subjects
            </button>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockSubjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboardPage; 