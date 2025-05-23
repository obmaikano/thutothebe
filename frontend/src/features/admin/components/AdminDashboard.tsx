import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, BarChart, FileText, Settings, PlusCircle,
  UserPlus, Building, Map, Shield, Activity, AlertTriangle
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAppDispatch } from '../../../app/hooks';
import { openModal } from '../../common/commonSlice';
import { openRightDrawer } from '../../common/rightDrawerSlice';
import { MODAL_BODY_TYPES, RIGHT_DRAWER_TYPES } from '../../../utils/modalConstants';

export const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const stats = [
    { icon: Users, label: 'Total Users', value: '2,456', change: '+12%', color: 'text-blue-600' },
    { icon: School, label: 'Active Schools', value: '128', change: '+5%', color: 'text-green-600' },
    { icon: FileText, label: 'System Reports', value: '8,543', change: '+18%', color: 'text-purple-600' },
    { icon: Activity, label: 'Active Sessions', value: '87', change: '+2%', color: 'text-orange-600' },
  ];

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new system user',
      icon: UserPlus,
      color: 'bg-blue-100 text-blue-600',
      action: () => dispatch(openModal({
        title: 'Add New User',
        size: 'lg',
        content: MODAL_BODY_TYPES.USER_ADD_NEW,
        contentProps: {
          onSuccess: () => console.log('User added successfully')
        }
      }))
    },
    {
      title: 'Register School',
      description: 'Add a new school to the system',
      icon: Building,
      color: 'bg-green-100 text-green-600',
      action: () => window.location.href = '/app/admin/schools/register'
    },
    {
      title: 'Configure Regions',
      description: 'Manage regional settings',
      icon: Map,
      color: 'bg-purple-100 text-purple-600',
      action: () => window.location.href = '/app/admin/regions'
    },
    {
      title: 'Manage Roles',
      description: 'Configure user roles and permissions',
      icon: Shield,
      color: 'bg-orange-100 text-orange-600',
      action: () => window.location.href = '/app/admin/roles'
    }
  ];

  const recentActivity = [
    { user: 'David Wilson', action: 'created', item: 'new user account', time: '2 hours ago', type: 'user' },
    { user: 'Sarah Chen', action: 'updated', item: 'school information', time: '1 day ago', type: 'school' },
    { user: 'Admin System', action: 'generated', item: 'monthly report', time: '2 days ago', type: 'report' },
    { user: 'John Smith', action: 'assigned', item: 'school administrator', time: '3 days ago', type: 'assignment' },
  ];

  const systemAlerts = [
    { id: 1, title: 'Server Usage High', description: 'Database server load at 85% capacity', level: 'warning' },
    { id: 2, title: 'Backup Completed', description: 'Daily system backup completed successfully', level: 'info' },
    { id: 3, title: 'Scheduled Maintenance', description: 'System update scheduled for Sunday 2AM', level: 'info' },
  ];

  const handleViewAuditLogs = () => {
    dispatch(openRightDrawer({
      header: "Audit Logs",
      bodyType: RIGHT_DRAWER_TYPES.AUDIT_LOGS,
      extraObject: {}
    }));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrator Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage users, schools, and system settings</p>
        </div>
        <div className="flex space-x-4">
          <Button
            variant="outline"
            leftIcon={Activity}
            onClick={handleViewAuditLogs}
          >
            View Audit Logs
          </Button>
          <Button
            leftIcon={Settings}
            onClick={() => window.location.href = '/app/admin/settings'}
          >
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color.includes('blue') ? 'bg-blue-50' : 
                stat.color.includes('green') ? 'bg-green-50' : 
                stat.color.includes('purple') ? 'bg-purple-50' : 'bg-orange-50'}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-xs font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button key={action.title} onClick={action.action} className="text-left">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${action.color}`}>
                    <action.icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button 
              onClick={handleViewAuditLogs}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action} {activity.item}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">System Alerts</h2>
          </div>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-md ${
                  alert.level === 'warning' 
                    ? 'bg-yellow-50 border-l-4 border-yellow-500' 
                    : 'bg-blue-50 border-l-4 border-blue-500'
                }`}
              >
                <h3 className={`font-medium ${
                  alert.level === 'warning' 
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
            <Link to="/app/admin/monitoring" className="text-sm text-blue-600 hover:text-blue-800">
              View system monitoring →
            </Link>
          </div>
        </Card>
      </div>

      {/* Management Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Management Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/app/admin/users" className="block">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">User Management</h3>
                  <p className="text-sm text-gray-500">Manage system users and roles</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/app/admin/schools" className="block">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <School className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">School Management</h3>
                  <p className="text-sm text-gray-500">Manage schools and administrators</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/app/admin/regions" className="block">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-900">Regional Configuration</h3>
                  <p className="text-sm text-gray-500">Configure regional settings</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}; 