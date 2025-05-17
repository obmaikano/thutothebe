import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, Calendar, FileText, 
  TrendingUp, TrendingDown, BookOpen, 
  BarChart3, User, PieChart, Trophy,
  Mail, AlertTriangle, FileBarChart
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

export const SchoolHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const headName = user ? `${user.firstName} ${user.lastName}` : 'Principal';
  const schoolName = 'Gaborone Secondary School'; // Would come from user profile in a real implementation

  // Mock data for school head dashboard
  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 65,
    totalDepartments: 8,
    attendanceToday: 92,
    teacherAttendance: 96,
    examPassing: 78,
    nationalRanking: 12
  };

  const departmentPerformance = [
    { id: '1', name: 'Science', headTeacher: 'Dr. Mpho Kgosi', staffCount: 12, studentCount: 350, performance: 82, trend: 'up' },
    { id: '2', name: 'Mathematics', headTeacher: 'Mr. Samuel Tshane', staffCount: 10, studentCount: 450, performance: 75, trend: 'stable' },
    { id: '3', name: 'Languages', headTeacher: 'Mrs. Dineo Modise', staffCount: 14, studentCount: 480, performance: 80, trend: 'up' },
    { id: '4', name: 'Social Studies', headTeacher: 'Mr. Joseph Ncube', staffCount: 8, studentCount: 325, performance: 72, trend: 'down' },
    { id: '5', name: 'Technical Studies', headTeacher: 'Ms. Tebogo Molefe', staffCount: 7, studentCount: 220, performance: 77, trend: 'up' },
  ];

  const staffUpdates = [
    { id: '1', type: 'New Teacher', name: 'Katlego Phiri', department: 'Science', date: '2025-04-01', status: 'Onboarding' },
    { id: '2', type: 'Leave Request', name: 'Malebogo Senne', department: 'Mathematics', date: '2025-04-12 - 2025-04-23', status: 'Approved' },
    { id: '3', type: 'Transfer', name: 'David Moremi', department: 'Technical Studies', date: '2025-05-01', status: 'Processing' },
    { id: '4', type: 'Professional Development', name: 'Lesego Khumalo', department: 'Languages', date: '2025-04-25 - 2025-04-26', status: 'Scheduled' },
  ];

  const academicMetrics = [
    { id: '1', metric: 'Graduation Rate', value: 92, change: 3.2, target: 95 },
    { id: '2', metric: 'Tertiary Enrollment', value: 68, change: 5.5, target: 75 },
    { id: '3', metric: 'Average GPA', value: 3.2, change: 0.2, target: 3.5 },
    { id: '4', metric: 'National Exam Performance', value: 78, change: 4.2, target: 85 },
  ];

  const schoolEvents = [
    { id: '1', title: 'School Board Meeting', date: '2025-04-20', time: '10:00 AM', location: 'Conference Room' },
    { id: '2', title: 'End of Term Examinations', date: '2025-04-25', time: '8:00 AM', location: 'All Classrooms' },
    { id: '3', title: 'Staff Development Day', date: '2025-05-02', time: '9:00 AM', location: 'Main Hall' },
    { id: '4', title: 'Parents-Teachers Conference', date: '2025-05-05', time: '2:00 PM', location: 'School Auditorium' },
  ];

  const externalCommunications = [
    { id: '1', title: 'Ministry of Education Update', sender: 'Regional Director', date: '2025-04-10', type: 'Official' },
    { id: '2', title: 'Regional Sports Competition', sender: 'Regional Sports Council', date: '2025-04-14', type: 'Event' },
    { id: '3', title: 'Curriculum Implementation Review', sender: 'Ministry of Education', date: '2025-04-15', type: 'Policy' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {headName}!</h1>
        <p className="text-blue-100 mb-4">{schoolName} - Principal's Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Trophy size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">School Ranking</p>
              <p className="text-white font-medium">#{schoolStats.nationalRanking} in National Rankings</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Today's Attendance</p>
              <p className="text-white font-medium">{schoolStats.attendanceToday}% students, {schoolStats.teacherAttendance}% staff</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Attention Required</p>
              <p className="text-white font-medium">3 matters need your review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={schoolStats.totalStudents.toString()} 
          change={2.8} 
          icon={<Users size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Teaching Staff" 
          value={schoolStats.totalTeachers.toString()} 
          change={1.5} 
          icon={<User size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Departments" 
          value={schoolStats.totalDepartments.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Exam Passing Rate" 
          value={`${schoolStats.examPassing}%`} 
          change={4.2}
          icon={<BarChart3 size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Department Performance</h2>
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
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Head Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentPerformance.map((dept) => (
                  <tr key={dept.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/departments/${dept.id}`} className="hover:text-blue-600">
                        {dept.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.headTeacher}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.staffCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.studentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                          <div 
                            className={`h-2.5 rounded-full ${
                              dept.performance >= 80 ? 'bg-green-600' : 
                              dept.performance >= 70 ? 'bg-blue-600' : 
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${dept.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{dept.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {dept.trend === 'up' && <TrendingUp size={16} className="text-green-600 mr-1" />}
                        {dept.trend === 'down' && <TrendingDown size={16} className="text-red-600 mr-1" />}
                        <span className={`text-sm ${
                          dept.trend === 'up' ? 'text-green-600' : 
                          dept.trend === 'down' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {dept.trend === 'up' ? 'Improving' : 
                           dept.trend === 'down' ? 'Declining' : 
                           'Stable'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Academic Metrics */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Academic Metrics</h2>
            <Button size="sm" variant="outline" leftIcon={<FileBarChart size={16} />}>Export Report</Button>
          </div>
          <div className="space-y-4">
            {academicMetrics.map(metric => (
              <div key={metric.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-medium text-gray-700">{metric.metric}</h3>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{metric.value}%</span>
                    <span className={`text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      metric.value >= 80 ? 'bg-green-600' : 
                      metric.value >= 70 ? 'bg-blue-600' : 
                      'bg-yellow-600'
                    }`}
                    style={{ width: `${metric.value}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {metric.value}%</span>
                  <span>Target: {metric.target}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Updates */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Staff Updates</h2>
            <Link to="/app/staff" className="text-sm text-blue-600 hover:underline">Manage staff</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffUpdates.map((update) => (
                  <tr key={update.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        update.type === 'New Teacher' ? 'bg-green-100 text-green-800' : 
                        update.type === 'Leave Request' ? 'bg-yellow-100 text-yellow-800' : 
                        update.type === 'Transfer' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {update.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {update.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {update.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${
                        update.status === 'Approved' ? 'text-green-600' : 
                        update.status === 'Processing' ? 'text-yellow-600' : 
                        'text-blue-600'
                      }`}>
                        {update.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming School Events */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
            <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">View calendar</Link>
          </div>
          <div className="space-y-3">
            {schoolEvents.map(event => (
              <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-sm">{event.title}</h3>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <Calendar size={12} className="mr-1 text-gray-500" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center mt-1 text-xs text-gray-600">
                  <School size={12} className="mr-1 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">External Communications</h2>
              <Link to="/app/communications" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {externalCommunications.map(comm => (
                <div key={comm.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-sm">{comm.title}</h3>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Mail size={12} className="mr-1 text-gray-500" />
                      <span>From: {comm.sender}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {comm.type}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    Received: {new Date(comm.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SchoolHeadDashboard; 