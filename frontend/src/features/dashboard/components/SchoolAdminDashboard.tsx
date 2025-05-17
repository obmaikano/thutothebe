import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, Calendar, FileText, 
  AlertTriangle, Bell, BookOpen, 
  BarChart3, CheckCircle, User, 
  Clipboard, PieChart, Clock
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
  variant?: 'primary' | 'outline' | 'danger', 
  size?: 'sm' | 'md' | 'lg',
  fullWidth?: boolean,
  leftIcon?: React.ReactNode,
  className?: string,
  onClick?: () => void
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, leftIcon, className = '', onClick }) => {
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
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

export const SchoolAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Administrator';
  const schoolName = 'Gaborone Secondary School'; // Would come from user profile in a real implementation

  // Mock data for school admin dashboard
  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 65,
    totalClasses: 32,
    attendanceToday: 92,
    studentGrowth: 3.5,
    teacherGrowth: 2.1,
    performanceChange: 4.2
  };

  const pendingApprovals = [
    { id: '1', type: 'Leave Request', requestedBy: 'Moses Moeti', department: 'Science', submittedOn: '2025-04-12', status: 'Pending Review' },
    { id: '2', type: 'Facility Use', requestedBy: 'Tebogo Kgosi', department: 'Sports', submittedOn: '2025-04-14', status: 'Pending Review' },
    { id: '3', type: 'Budget Amendment', requestedBy: 'Sarah Phiri', department: 'Administration', submittedOn: '2025-04-15', status: 'Under Review' },
  ];

  const recentNotifications = [
    { id: '1', title: 'Regional Inspection Scheduled', type: 'Official', date: '2025-04-10', priority: 'High' },
    { id: '2', title: 'End of Term Reports Due', type: 'Academic', date: '2025-04-14', priority: 'Medium' },
    { id: '3', title: 'Teacher Professional Development', type: 'Training', date: '2025-04-15', priority: 'Medium' },
    { id: '4', title: 'Budget Approval Granted', type: 'Administrative', date: '2025-04-16', priority: 'Low' },
  ];

  const classPerformance = [
    { id: '1', className: 'Form 4 Science', totalStudents: 42, averageScore: 76, passingRate: 88, trend: 'up' },
    { id: '2', className: 'Form 3 Mathematics', totalStudents: 45, averageScore: 68, passingRate: 75, trend: 'down' },
    { id: '3', className: 'Form 5 Languages', totalStudents: 38, averageScore: 82, passingRate: 92, trend: 'up' },
    { id: '4', className: 'Form 4 Social Studies', totalStudents: 40, averageScore: 72, passingRate: 83, trend: 'stable' },
    { id: '5', className: 'Form 3 Technical', totalStudents: 35, averageScore: 74, passingRate: 86, trend: 'up' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'End of Term Exams', date: '2025-04-25', location: 'All Classrooms', type: 'Academic' },
    { id: '2', title: 'Parent-Teacher Meeting', date: '2025-04-30', location: 'Main Hall', type: 'Meeting' },
    { id: '3', title: 'Inter-School Sports Competition', date: '2025-05-05', location: 'Sports Field', type: 'Sports' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">{schoolName} - Administration Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Today's Attendance</p>
              <p className="text-white font-medium">{schoolStats.attendanceToday}% of students present</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Bell size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Notifications</p>
              <p className="text-white font-medium">{recentNotifications.filter(n => n.priority === 'High').length} urgent notifications</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Upcoming Events</p>
              <p className="text-white font-medium">{upcomingEvents.length} in next 30 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={schoolStats.totalStudents.toString()} 
          change={schoolStats.studentGrowth} 
          icon={<Users size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Teachers" 
          value={schoolStats.totalTeachers.toString()} 
          change={schoolStats.teacherGrowth} 
          icon={<User size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Classes" 
          value={schoolStats.totalClasses.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Performance" 
          value="B+" 
          change={schoolStats.performanceChange}
          icon={<BarChart3 size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Class Performance Overview</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>Current Term</option>
                <option>Previous Term</option>
                <option>Academic Year</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<FileText size={16} />}>Full Report</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passing Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {classPerformance.map((classInfo) => (
                  <tr key={classInfo.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/classes/${classInfo.id}`} className="hover:text-blue-600">
                        {classInfo.className}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classInfo.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classInfo.averageScore}/100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classInfo.passingRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        classInfo.trend === 'up' ? 'bg-green-100 text-green-800' : 
                        classInfo.trend === 'down' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {classInfo.trend === 'up' ? 'Improving' : 
                         classInfo.trend === 'down' ? 'Declining' : 
                         'Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            Showing 5 of {schoolStats.totalClasses} classes. 
            <Link to="/app/classes" className="text-blue-600 hover:underline ml-1">
              View all classes
            </Link>
          </div>
        </Card>

        {/* Notifications & Upcoming Events */}
        <Card className="col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Important Notifications</h2>
              <Link to="/app/notifications" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentNotifications.slice(0, 3).map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.priority === 'High' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {notification.type}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1 text-gray-500" />
                      <span>{new Date(notification.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`${
                      notification.priority === 'High' ? 'text-red-600' : 
                      notification.priority === 'Medium' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {notification.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
              <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">View calendar</Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-sm">{event.title}</h3>
                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <Calendar size={12} className="mr-1 text-gray-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <School size={12} className="mr-1 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
            <Link to="/app/approvals" className="text-sm text-blue-600 hover:underline">View all requests</Link>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2 inline-block">
                      {approval.type}
                    </span>
                    <h3 className="font-medium">{approval.requestedBy}</h3>
                    <p className="text-sm text-gray-600">Department: {approval.department}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full h-fit">
                    {approval.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>Submitted: {new Date(approval.submittedOn).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="primary" leftIcon={<CheckCircle size={14} />} className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Review Details</Button>
                  <Button size="sm" variant="danger" className="flex-1">Reject</Button>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clipboard size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No pending approvals at this time.</p>
              </div>
            )}
          </div>
        </Card>

        {/* School Demographics */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">School Demographics</h2>
            <Button size="sm" variant="outline" leftIcon={<PieChart size={16} />}>Details</Button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Student Gender Distribution</h3>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <div className="h-40 w-40">
                  {/* Placeholder for pie chart */}
                  <div className="text-center text-gray-500">
                    <PieChart size={40} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">Gender Distribution Chart</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2 space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Male (52%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                  <span>Female (48%)</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Student Distribution by Form</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Form 1</span>
                    <span className="text-xs text-gray-900">280</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '22.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Form 2</span>
                    <span className="text-xs text-gray-900">265</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '21.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Form 3</span>
                    <span className="text-xs text-gray-900">255</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '20.4%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Form 4</span>
                    <span className="text-xs text-gray-900">240</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '19.2%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-600">Form 5</span>
                    <span className="text-xs text-gray-900">210</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '16.8%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard; 