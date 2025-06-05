import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchUsers, 
  fetchUserAnalytics 
} from '../usersSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  Users, 
  UserPlus, 
  BarChart3, 
  Download, 
  Upload,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Calendar,
  Settings,
  Filter,
  Eye,
  PieChart,
  FileText,
  Shield
} from 'lucide-react';
import analyticsApi, { UserStats } from '../../../api/services/analyticsApi';

const UserDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, analytics, status, analyticsStatus } = useAppSelector(state => state.users);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          dispatch(fetchUsers({})),
          dispatch(fetchUserAnalytics()),
          analyticsApi.getUserStats().then(response => setUserStats(response.data.data))
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const totalUsers = userStats?.totalUsers || 0;
  const activeUsers = userStats?.activeUsers || 0;
  const inactiveUsers = totalUsers - activeUsers;
  const activationRate = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

  // Calculate role distribution from real data
  const roleStats = userStats?.usersByRole || {};

  const handleCreateUser = () => {
    dispatch(openModal({
      title: 'Create New User',
      bodyType: MODAL_BODY_TYPES.USER_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleExportUsers = () => {
    dispatch(openModal({
      title: 'Export Users',
      bodyType: MODAL_BODY_TYPES.USER_EXPORT,
      size: 'lg'
    }));
  };

  const quickActions = [
    {
      title: 'Create User',
      description: 'Add a new user to the system',
      icon: UserPlus,
      action: handleCreateUser,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconColor: 'text-white'
    },
    {
      title: 'View All Users',
      description: 'Browse and manage all users',
      icon: Users,
      action: () => navigate('/app/users'),
      color: 'bg-green-600 hover:bg-green-700',
      iconColor: 'text-white'
    },
    {
      title: 'User Analytics',
      description: 'View detailed user analytics',
      icon: BarChart3,
      action: () => navigate('/app/user-analytics'),
      color: 'bg-purple-600 hover:bg-purple-700',
      iconColor: 'text-white'
    },
    {
      title: 'Export Data',
      description: 'Export user data and reports',
      icon: Download,
      action: handleExportUsers,
      color: 'bg-orange-600 hover:bg-orange-700',
      iconColor: 'text-white'
    }
  ];

  const recentActivity = [
    { action: 'New user registered', time: '2 minutes ago', type: 'info' },
    { action: 'User profile updated', time: '15 minutes ago', type: 'success' },
    { action: 'User deactivated', time: '1 hour ago', type: 'warning' },
    { action: 'Bulk export completed', time: '2 hours ago', type: 'info' },
    { action: 'Role permissions updated', time: '3 hours ago', type: 'success' }
  ];

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">User Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of user data, analytics, and management tools</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/user-analytics')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BarChart3 size={16} />
            Analytics
          </button>
          <button
            onClick={handleCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus size={16} />
            Add User
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

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`p-4 rounded-lg text-left transition-colors ${action.color}`}
            >
              <action.icon size={24} className={action.iconColor} />
              <div className="mt-3">
                <div className="font-medium text-white">{action.title}</div>
                <div className="text-sm text-white opacity-90 mt-1">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
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
                {userStats?.todayActive || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Weekly Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {userStats?.weeklyActive || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Monthly Active Users</span>
              <span className="text-sm font-medium text-gray-900">
                {userStats?.monthlyActive || 0}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <span className="text-sm font-medium text-green-600">
                  {totalUsers > 0 
                    ? Math.round(((userStats?.weeklyActive || 0) / totalUsers) * 100)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Role Distribution</h3>
            <PieChart size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {Object.entries(roleStats)
              .sort(([,a], [,b]) => Number(b) - Number(a))
              .slice(0, 5)
              .map(([role, count], index) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ 
                        backgroundColor: `hsl(${(index * 360) / 5}, 70%, 50%)` 
                      }}
                    ></div>
                    <span className="text-sm text-gray-700">{role.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500">
                      ({totalUsers > 0 ? Math.round((Number(count) / totalUsers) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => navigate('/app/user-analytics')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View detailed analytics →
            </button>
          </div>
        </div>

        {/* User Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Status</h3>
            <Shield size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Users</span>
              <span className="text-sm font-medium text-gray-900">{totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-green-600">{activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inactive Users</span>
              <span className="text-sm font-medium text-red-600">{inactiveUsers}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Activation Rate</span>
                <span className="text-sm font-medium text-blue-600">{activationRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Tools */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Management Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/app/users')}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Eye className="h-6 w-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Browse Users</div>
            <div className="text-sm text-gray-600 mt-1">View and manage all users</div>
          </button>
          
          <button
            onClick={handleExportUsers}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Export Data</div>
            <div className="text-sm text-gray-600 mt-1">Export user data and reports</div>
          </button>
          
          <button
            onClick={() => navigate('/app/permissions-roles')}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <Shield className="h-6 w-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Roles & Permissions</div>
            <div className="text-sm text-gray-600 mt-1">Manage user access controls</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage; 