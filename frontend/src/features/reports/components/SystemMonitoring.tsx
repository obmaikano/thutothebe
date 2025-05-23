import React, { useState } from 'react';
import { 
  Activity, Users, School, Clock, TrendingUp, TrendingDown,
  Monitor, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle,
  PlayCircle, PauseCircle, BarChart3, Calendar, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';

export const SystemMonitoring: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock data for system health
  const systemHealth = {
    status: 'healthy',
    uptime: '99.87%',
    activeUsers: 12450,
    totalSessions: 85670,
    averageResponseTime: '245ms',
    errorRate: '0.13%'
  };

  // Mock data for regional usage
  const regionalUsage = [
    { 
      region: 'Gaborone', 
      activeUsers: 3450, 
      totalLogins: 12800, 
      avgSessionTime: '42m',
      contentCompletions: 8950,
      assignmentSubmissions: 2340
    },
    { 
      region: 'Francistown', 
      activeUsers: 2850, 
      totalLogins: 9600, 
      avgSessionTime: '38m',
      contentCompletions: 6780,
      assignmentSubmissions: 1890
    },
    { 
      region: 'Molepolole', 
      activeUsers: 2200, 
      totalLogins: 7800, 
      avgSessionTime: '35m',
      contentCompletions: 5420,
      assignmentSubmissions: 1560
    },
    { 
      region: 'Maun', 
      activeUsers: 1850, 
      totalLogins: 6400, 
      avgSessionTime: '33m',
      contentCompletions: 4230,
      assignmentSubmissions: 1240
    },
    { 
      region: 'Kanye', 
      activeUsers: 1650, 
      totalLogins: 5900, 
      avgSessionTime: '31m',
      contentCompletions: 3890,
      assignmentSubmissions: 1080
    }
  ];

  // Mock data for school usage patterns
  const schoolUsagePatterns = [
    { 
      school: 'Gaborone Secondary School', 
      region: 'Gaborone',
      activeUsers: 450, 
      teacherLogins: 25, 
      studentLogins: 425,
      adminLogins: 5,
      lastActivity: '2 mins ago',
      systemAdoption: 89.5
    },
    { 
      school: 'Francistown High School', 
      region: 'Francistown',
      activeUsers: 380, 
      teacherLogins: 22, 
      studentLogins: 358,
      adminLogins: 3,
      lastActivity: '5 mins ago',
      systemAdoption: 85.2
    },
    { 
      school: 'Molepolole Community Junior Secondary', 
      region: 'Molepolole',
      activeUsers: 320, 
      teacherLogins: 18, 
      studentLogins: 302,
      adminLogins: 2,
      lastActivity: '8 mins ago',
      systemAdoption: 78.9
    },
    { 
      school: 'Maun Senior Secondary School', 
      region: 'Maun',
      activeUsers: 285, 
      teacherLogins: 16, 
      studentLogins: 269,
      adminLogins: 3,
      lastActivity: '12 mins ago',
      systemAdoption: 72.4
    }
  ];

  // Mock data for user role activity
  const userRoleActivity = [
    { 
      role: 'Students', 
      totalUsers: 42500, 
      activeUsers: 38250, 
      avgLoginFreq: '4.2/week',
      avgSessionTime: '35m',
      engagementScore: 78.5
    },
    { 
      role: 'Teachers', 
      totalUsers: 2850, 
      activeUsers: 2650, 
      avgLoginFreq: '5.8/week',
      avgSessionTime: '65m',
      engagementScore: 89.2
    },
    { 
      role: 'School Admins', 
      totalUsers: 450, 
      activeUsers: 425, 
      avgLoginFreq: '6.2/week',
      avgSessionTime: '45m',
      engagementScore: 92.8
    },
    { 
      role: 'Regional Officers', 
      totalUsers: 85, 
      activeUsers: 78, 
      avgLoginFreq: '4.5/week',
      avgSessionTime: '55m',
      engagementScore: 86.4
    },
    { 
      role: 'Ministry Staff', 
      totalUsers: 125, 
      activeUsers: 118, 
      avgLoginFreq: '3.8/week',
      avgSessionTime: '75m',
      engagementScore: 91.5
    }
  ];

  // Mock data for assignment and content tracking
  const assignmentTracking = {
    totalAssignments: 8450,
    submittedAssignments: 7620,
    pendingAssignments: 830,
    overdueAssignments: 385,
    submissionRate: 90.2,
    onTimeSubmissionRate: 82.7
  };

  const contentTracking = {
    totalContent: 12500,
    completedContent: 9850,
    inProgressContent: 1890,
    notStartedContent: 760,
    completionRate: 78.8,
    avgCompletionTime: '28m'
  };

  const exportData = (dataType: string) => {
    console.log(`Exporting ${dataType} data...`);
    // Implementation for export functionality would go here
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Adoption Monitoring</h1>
          <p className="text-gray-600 mt-2">Real-time monitoring of LMS usage and engagement across the education system</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Metrics</option>
            <option value="usage">Usage Only</option>
            <option value="performance">Performance Only</option>
            <option value="engagement">Engagement Only</option>
          </select>
          <Button onClick={() => exportData('monitoring')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="System Status"
          value={systemHealth.status === 'healthy' ? 'Healthy' : 'Issues'}
          icon={systemHealth.status === 'healthy' ? CheckCircle : AlertTriangle}
          iconColor={systemHealth.status === 'healthy' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
        />
        <StatCard
          title="Uptime"
          value={systemHealth.uptime}
          icon={Monitor}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Active Users"
          value={systemHealth.activeUsers.toLocaleString()}
          icon={Users}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Total Sessions"
          value={systemHealth.totalSessions.toLocaleString()}
          icon={Activity}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Response Time"
          value={systemHealth.averageResponseTime}
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Error Rate"
          value={systemHealth.errorRate}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      {/* Monitoring Navigation */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Detailed Monitoring Views</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/monitoring/usage" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Usage Dashboard</p>
                <p className="text-sm text-gray-500">Comprehensive usage analytics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/monitoring/regional" 
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Regional Usage</p>
                <p className="text-sm text-gray-500">Regional usage patterns</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/monitoring/school" 
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <School size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">School Usage</p>
                <p className="text-sm text-gray-500">Individual school monitoring</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/monitoring/users" 
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Users size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">User Activity</p>
                <p className="text-sm text-gray-500">User behavior analytics</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Usage Statistics */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Regional Usage Statistics</h2>
            <Button 
              onClick={() => exportData('regional')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {regionalUsage.map((region) => (
              <div key={region.region} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{region.region}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {region.activeUsers} active
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Logins</p>
                    <p className="text-lg font-semibold text-gray-900">{region.totalLogins.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Session</p>
                    <p className="text-lg font-semibold text-gray-900">{region.avgSessionTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Content Completed</p>
                    <p className="text-lg font-semibold text-gray-900">{region.contentCompletions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assignments</p>
                    <p className="text-lg font-semibold text-gray-900">{region.assignmentSubmissions.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Role Activity */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Role Activity</h2>
            <Button 
              onClick={() => exportData('roles')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Users
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Login Freq
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userRoleActivity.map((role) => (
                  <tr key={role.role} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.role}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <span className="font-medium">{role.activeUsers.toLocaleString()}</span>
                        <span className="text-gray-400">/{role.totalUsers.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {((role.activeUsers / role.totalUsers) * 100).toFixed(1)}% active
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{role.avgLoginFreq}</div>
                      <div className="text-xs text-gray-400">{role.avgSessionTime} avg session</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 ${
                          role.engagementScore >= 85 ? 'text-green-600' :
                          role.engagementScore >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {role.engagementScore}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              role.engagementScore >= 85 ? 'bg-green-500' :
                              role.engagementScore >= 70 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${role.engagementScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* School Usage Patterns */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">School Usage Patterns</h2>
          <Button 
            onClick={() => exportData('schools')} 
            variant="outline" 
            size="sm"
          >
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role Distribution
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System Adoption
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schoolUsagePatterns.map((school) => (
                <tr key={school.school} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {school.school}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.activeUsers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="text-xs">Teachers: {school.teacherLogins}</div>
                      <div className="text-xs">Students: {school.studentLogins}</div>
                      <div className="text-xs">Admins: {school.adminLogins}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`mr-2 ${
                        school.systemAdoption >= 85 ? 'text-green-600' :
                        school.systemAdoption >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {school.systemAdoption}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            school.systemAdoption >= 85 ? 'bg-green-500' :
                            school.systemAdoption >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${school.systemAdoption}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {school.lastActivity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assignment & Content Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Assignment Tracking</h2>
            <Button 
              onClick={() => exportData('assignments')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Submitted</p>
                    <p className="text-xl font-bold text-green-900">{assignmentTracking.submittedAssignments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Clock size={20} className="text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Pending</p>
                    <p className="text-xl font-bold text-yellow-900">{assignmentTracking.pendingAssignments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-red-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Overdue</p>
                    <p className="text-xl font-bold text-red-900">{assignmentTracking.overdueAssignments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 size={20} className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total</p>
                    <p className="text-xl font-bold text-blue-900">{assignmentTracking.totalAssignments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Submission Rate</span>
                <span>{assignmentTracking.submissionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${assignmentTracking.submissionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>On-time Submission Rate</span>
                <span>{assignmentTracking.onTimeSubmissionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-blue-500"
                  style={{ width: `${assignmentTracking.onTimeSubmissionRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Content Completion Tracking</h2>
            <Button 
              onClick={() => exportData('content')} 
              variant="outline" 
              size="sm"
            >
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle size={20} className="text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Completed</p>
                    <p className="text-xl font-bold text-green-900">{contentTracking.completedContent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <PlayCircle size={20} className="text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">In Progress</p>
                    <p className="text-xl font-bold text-yellow-900">{contentTracking.inProgressContent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <PauseCircle size={20} className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Not Started</p>
                    <p className="text-xl font-bold text-gray-900">{contentTracking.notStartedContent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 size={20} className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Total</p>
                    <p className="text-xl font-bold text-blue-900">{contentTracking.totalContent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Completion Rate</span>
                <span>{contentTracking.completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${contentTracking.completionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Avg Completion Time</span>
                <span>{contentTracking.avgCompletionTime}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}; 