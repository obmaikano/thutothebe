import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchUsers, fetchUserAnalytics } from '../usersSlice';
import { USER_ROLE_OPTIONS } from '../../../api/services/userApi';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar, 
  TrendingUp, 
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Shield,
  School,
  MapPin,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

const UserAnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, analytics, analyticsStatus, status } = useAppSelector(state => state.users);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'registrations' | 'activity' | 'roles'>('registrations');

  useEffect(() => {
    dispatch(fetchUsers({}));
    dispatch(fetchUserAnalytics());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers({}));
    dispatch(fetchUserAnalytics());
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      case '1y': return 'Last Year';
      default: return 'Last 30 Days';
    }
  };

  // Calculate additional metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.active).length;
  const inactiveUsers = totalUsers - activeUsers;
  const activationRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Role distribution data
  const roleDistribution = USER_ROLE_OPTIONS.map(role => {
    const count = users.filter(user => user.role === role.value).length;
    return {
      role: role.label,
      count,
      percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0
    };
  }).filter(item => item.count > 0);

  // Recent registrations (mock data for demonstration)
  const recentRegistrations = [
    { date: '2024-01-15', count: 12 },
    { date: '2024-01-14', count: 8 },
    { date: '2024-01-13', count: 15 },
    { date: '2024-01-12', count: 6 },
    { date: '2024-01-11', count: 10 },
    { date: '2024-01-10', count: 14 },
    { date: '2024-01-09', count: 9 },
  ];

  if (status === 'loading' || analyticsStatus === 'loading') {
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
          <h1 className="text-3xl font-bold text-gray-900">User Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into user data and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalUsers}</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeUsers}</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{activationRate}% activation rate</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <UserX size={24} className="text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{inactiveUsers}</div>
              <div className="text-sm text-gray-500">Inactive Users</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{100 - activationRate}% inactive rate</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics?.recentRegistrations || 0}
              </div>
              <div className="text-sm text-gray-500">New This Week</div>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <span className="text-green-600">+8% from last week</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Registrations</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">{getTimeRangeLabel(selectedTimeRange)}</span>
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {recentRegistrations.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.count / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-900 text-right">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
            <PieChart size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {roleDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ 
                      backgroundColor: `hsl(${(index * 360) / roleDistribution.length}, 70%, 50%)` 
                    }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Activity Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activity Summary</h3>
            <Activity size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Daily Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.lastLoginStats.today || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.lastLoginStats.thisWeek || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics?.lastLoginStats.thisMonth || 0}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {totalUsers > 0 
                    ? Math.round(((analytics?.lastLoginStats.thisWeek || 0) / totalUsers) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Roles */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Roles</h3>
            <Shield size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Administrative Roles</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => 
                  ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR'].includes(user.role)
                ).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Educational Staff</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => 
                  ['SCHOOL_HEAD', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(user.role)
                ).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Students</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => user.role === 'STUDENT').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parents</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => user.role === 'PARENT').length}
              </span>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
            <MapPin size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Schools</span>
              <span className="text-sm font-medium text-gray-900">
                {new Set(users.filter(user => user.schoolId).map(user => user.schoolId)).size}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Users with School Assignment</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => user.schoolId).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unassigned Users</span>
              <span className="text-sm font-medium text-gray-900">
                {users.filter(user => !user.schoolId).length}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Assignment Rate</span>
                <span className="text-sm font-medium text-blue-600">
                  {totalUsers > 0 
                    ? Math.round((users.filter(user => user.schoolId).length / totalUsers) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">Download detailed analytics reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export CSV
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAnalyticsPage; 