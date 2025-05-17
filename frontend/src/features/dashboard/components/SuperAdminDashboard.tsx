import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, AlertTriangle, 
  School, Building, Clock
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

// Card component
const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

// StatCard component
const StatCard: React.FC<{ 
  title: string, 
  value: string, 
  change?: number, 
  icon: React.ReactNode, 
  iconColor: string 
}> = ({ title, value, change, icon, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <div className="flex items-center">
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {change !== undefined && (
            <span className={`ml-2 text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
      <div className={`p-2 rounded-lg ${iconColor}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Button component
const Button: React.FC<{ 
  children: React.ReactNode, 
  variant?: 'primary' | 'outline', 
  size?: 'sm' | 'md' | 'lg',
  fullWidth?: boolean,
  leftIcon?: React.ReactNode,
  className?: string,
  onClick?: () => void
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, leftIcon, className = '', onClick }) => {
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  const sizeClasses = {
    sm: 'py-1 px-2.5 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base'
  };
  
  return (
    <button 
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
    </button>
  );
};

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

  const pendingApprovals = [
    { id: '1', name: 'Botlhe Motswakae', email: 'botlhe@education.gov.bw', role: 'Teacher', school: 'Gaborone Secondary School', date: '2 days ago' },
    { id: '2', name: 'Mpho Sereetsi', email: 'mpho@education.gov.bw', role: 'Regional Admin', school: 'Francistown Region', date: '3 days ago' },
  ];

  const systemAlerts = [
    { id: '1', type: 'error', message: 'Server performance degraded due to high traffic', time: '2 hours ago' },
    { id: '2', type: 'warning', message: 'Low disk space on primary storage (85% used)', time: '5 hours ago' },
    { id: '3', type: 'info', message: 'System maintenance scheduled for this weekend', time: '1 day ago' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">System overview for the Ministry of Education LMS</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Schools</p>
              <p className="text-white font-medium">130</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Users</p>
              <p className="text-white font-medium">45,230</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">System Alerts</p>
              <p className="text-white font-medium">3 active alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Schools" 
          value="130" 
          change={5} 
          icon={<School size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Teachers" 
          value="2,490" 
          change={8} 
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Students" 
          value="37,520" 
          change={3}
          icon={<BookOpen size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Regional Offices" 
          value="5" 
          icon={<Building size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
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
                {regionalStats.map((region, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.schools}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.teachers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              region.performance >= 75 ? 'bg-green-600' : 
                              region.performance >= 65 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${region.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{region.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Approvals */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
            <Link to="/app/approvals" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map(user => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                <div className="flex justify-between mt-2">
                  <div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mr-2">
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-500">{user.date}</span>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" variant="primary" className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">System Alerts</h2>
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

        {/* System Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">System Performance</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 mb-1">Server Uptime</p>
              <p className="text-lg font-semibold">99.8%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 mb-1">Avg. Response</p>
              <p className="text-lg font-semibold">245ms</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 mb-1">CPU Usage</p>
              <p className="text-lg font-semibold">45%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600 mb-1">Memory</p>
              <p className="text-lg font-semibold">65%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium text-gray-700">Daily Active Users</p>
              <p className="text-sm font-medium text-gray-700">12,543</p>
            </div>
            <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="h-full bg-blue-600 w-[45%]"></div>
                <div className="h-full bg-green-500 w-[30%]"></div>
                <div className="h-full bg-yellow-500 w-[15%]"></div>
                <div className="h-full bg-red-500 w-[10%]"></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-1"></div>
                <span>Students (45%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Teachers (30%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>Parents (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Admins (10%)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 