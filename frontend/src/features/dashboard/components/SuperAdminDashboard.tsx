import React from 'react';
import { Link } from 'react-router-dom';
import { 
  School, Users, AlertTriangle, Calendar, BookOpen, 
  Building, BarChart3, FileText, Settings, PlusCircle,
  UserPlus, School as SchoolIcon, Map, Shield, BookOpen as BookIcon,
  FileCheck, BarChart2, Activity, Eye
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { StatCard } from '../../../components/ui/stat-card';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Super Admin';

  // Mock data for admin dashboard
  const regionalStats = [
    { region: 'Gaborone', schools: 45, teachers: 850, students: 12000, performance: 76 },
    { region: 'Francistown', schools: 32, teachers: 620, students: 9500, performance: 72 },
    { region: 'Molepolole', schools: 28, teachers: 540, students: 8200, performance: 68 },
    { region: 'Maun', schools: 25, teachers: 480, students: 7800, performance: 65 },
  ];

  const systemMetrics = {
    totalSchools: 130,
    totalUsers: 45230,
    totalRegions: 5,
    activeAlerts: 3,
    systemHealth: 98.5,
    storageUsage: 65,
    cpuUsage: 45,
    memoryUsage: 60
  };

  const recentActivity = [
    { id: '1', user: 'David Wilson', action: 'created', item: 'Biology 101 course', time: '2 hours ago', role: 'Teacher' },
    { id: '2', user: 'Admin System', action: 'updated', item: 'system settings', time: '1 day ago', role: 'System' },
    { id: '3', user: 'Sarah Chen', action: 'deleted', item: 'Math Quiz 3', time: '2 days ago', role: 'Teacher' },
    { id: '4', user: 'John Smith', action: 'registered', item: '45 new students', time: '3 days ago', role: 'Admin' },
  ];

  const systemAlerts = [
    { id: '1', type: 'error', message: 'Server performance degraded due to high traffic', time: '2 hours ago' },
    { id: '2', type: 'warning', message: 'Low disk space on primary storage (85% used)', time: '5 hours ago' },
    { id: '3', type: 'info', message: 'System maintenance scheduled for this weekend', time: '1 day ago' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">National Education System Administration</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Schools</p>
              <p className="text-white font-medium">{systemMetrics.totalSchools}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Users</p>
              <p className="text-white font-medium">{systemMetrics.totalUsers.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Building size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Regions</p>
              <p className="text-white font-medium">{systemMetrics.totalRegions}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Active Alerts</p>
              <p className="text-white font-medium">{systemMetrics.activeAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/users/create" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <UserPlus size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Create User</p>
              <p className="text-sm text-gray-500">Add new system users</p>
            </div>
          </div>
        </Link>
        <Link to="/app/schools/register" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <SchoolIcon size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Register School</p>
              <p className="text-sm text-gray-500">Add new schools</p>
            </div>
          </div>
        </Link>
        <Link to="/app/regions/configure" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Map size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Configure Regions</p>
              <p className="text-sm text-gray-500">Manage regional offices</p>
            </div>
          </div>
        </Link>
        <Link to="/app/settings/roles" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Shield size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Roles</p>
              <p className="text-sm text-gray-500">Configure permissions</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Statistics */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Regional Statistics</h2>
            <Link to="/app/reports/regional" className="text-sm text-blue-600 hover:underline">View detailed report</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schools
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teachers
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalStats.map((stat) => (
                  <tr key={stat.region}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.schools}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.teachers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 ${
                          stat.performance >= 75 ? 'text-green-600' :
                          stat.performance >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.performance}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              stat.performance >= 75 ? 'bg-green-500' :
                              stat.performance >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${stat.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">System Alerts</h2>
            <Link to="/app/system/alerts" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {systemAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border ${
                  alert.type === 'error' ? 'border-red-200 bg-red-50' : 
                  alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${
                    alert.type === 'error' ? 'bg-red-100 text-red-700' : 
                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Health & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">System Health</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">System Uptime</span>
                <span className="text-sm font-medium text-green-600">{systemMetrics.systemHealth}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${systemMetrics.systemHealth}%` }}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                <span className="text-sm font-medium text-blue-600">{systemMetrics.storageUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${systemMetrics.storageUsage}%` }}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">CPU Usage</span>
                <span className="text-sm font-medium text-orange-600">{systemMetrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${systemMetrics.cpuUsage}%` }}></div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                <span className="text-sm font-medium text-purple-600">{systemMetrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${systemMetrics.memoryUsage}%` }}></div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <Link to="/app/activity" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Users size={16} className="text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} <span className="text-gray-500">{activity.action}</span> {activity.item}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">{activity.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 