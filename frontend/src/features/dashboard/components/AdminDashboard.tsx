import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart, FileText, School, Briefcase, AlertCircle, Settings, PlusCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Total Users', value: '2,456', change: '+12%' },
    { icon: School, label: 'Active Courses', value: '128', change: '+5%' },
    { icon: FileText, label: 'Assignments', value: '8,543', change: '+18%' },
    { icon: Briefcase, label: 'Teachers', value: '87', change: '+2%' },
  ];

  const recentActivity = [
    { user: 'David Wilson', action: 'created', item: 'Biology 101 course', time: '2 hours ago', role: 'Teacher' },
    { user: 'Admin System', action: 'updated', item: 'system settings', time: '1 day ago', role: 'System' },
    { user: 'Sarah Chen', action: 'deleted', item: 'Math Quiz 3', time: '2 days ago', role: 'Teacher' },
    { user: 'John Smith', action: 'registered', item: '45 new students', time: '3 days ago', role: 'Admin' },
  ];

  const systemAlerts = [
    { id: 1, title: 'Server Usage High', description: 'Database server load at 85% capacity', level: 'warning' },
    { id: 2, title: 'Storage Space Low', description: 'Storage space is below 10GB available', level: 'critical' },
    { id: 3, title: 'Scheduled Maintenance', description: 'System update scheduled for Sunday 2AM', level: 'info' },
  ];

  const userDistribution = {
    students: 2150,
    teachers: 87,
    administrators: 15,
    parents: 204,
  };

  const coursesPerDepartment = [
    { name: 'Science', count: 45, color: 'bg-blue-500' },
    { name: 'Mathematics', count: 38, color: 'bg-green-500' },
    { name: 'Languages', count: 27, color: 'bg-yellow-500' },
    { name: 'Social Studies', count: 18, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administrator Dashboard</h1>
        <div className="flex space-x-4">
          <Link
            to="/app/users/create"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New User
          </Link>
          <Link
            to="/app/settings"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 mr-2" />
            System Settings
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-xs font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">User Distribution</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Students</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${(userDistribution.students / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.students}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Teachers</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(userDistribution.teachers / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.teachers}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Admins</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(userDistribution.administrators / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.administrators}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Parents</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: `${(userDistribution.parents / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.parents}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/app/users" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all users →
              </Link>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <School className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Courses Per Department</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {coursesPerDepartment.map((dept) => (
                <div key={dept.name} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-800">{dept.name}</span>
                    <span className="text-gray-600">{dept.count} courses</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`${dept.color} h-full`} style={{ width: `${(dept.count / 128) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/app/departments" className="text-sm text-indigo-600 hover:text-indigo-800">
                Manage departments →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">System Alerts</h2>
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-md ${
                    alert.level === 'critical' 
                      ? 'bg-red-50 border-l-4 border-red-500' 
                      : alert.level === 'warning'
                      ? 'bg-yellow-50 border-l-4 border-yellow-500'
                      : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <h3 className={`font-medium ${
                    alert.level === 'critical' 
                      ? 'text-red-800' 
                      : alert.level === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-600">{alert.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/app/system/alerts" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all alerts →
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      {' '}<span className="text-gray-600">{activity.action}</span>
                      {' '}<span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.time} • {activity.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/app/activity-logs" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 