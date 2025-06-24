import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Calendar, FileText, 
  TrendingUp, TrendingDown, CheckCircle, 
  BarChart3, User, PieChart, Award,
  Mail, Clock, FileBarChart, Search
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

export const DepartmentHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const headName = user ? `${user.firstName} ${user.lastName}` : 'Department Head';
  const departmentName = 'Science Department'; // Would come from user profile in a real implementation
  const schoolName = 'Gaborone Secondary School'; // Would come from user profile in a real implementation

  // Mock data for department head dashboard
  const departmentStats = {
    totalStudents: 350,
    totalTeachers: 12,
    totalCourses: 16,
    avgAttendance: 89,
    avgPerformance: 74,
    examPassing: 78,
    departmentRanking: 2
  };

  const teacherPerformance = [
    { id: '1', name: 'Dr. Mpho Kgosi', subject: 'Biology', classes: 5, students: 160, performance: 85, attendance: 97, status: 'Excellent' },
    { id: '2', name: 'Ms. Lesedi Tau', subject: 'Chemistry', classes: 4, students: 145, performance: 78, attendance: 92, status: 'Good' },
    { id: '3', name: 'Mr. Kagiso Molefe', subject: 'Physics', classes: 4, students: 140, performance: 72, attendance: 95, status: 'Good' },
    { id: '4', name: 'Ms. Keletso Morapedi', subject: 'Environmental Science', classes: 3, students: 95, performance: 80, attendance: 91, status: 'Good' },
  ];

  const coursePerformance = [
    { id: '1', name: 'Advanced Biology', level: 'Form 5', students: 42, averageScore: 76, passingRate: 88, trend: 'up' },
    { id: '2', name: 'Chemistry', level: 'Form 4', students: 45, averageScore: 68, passingRate: 75, trend: 'down' },
    { id: '3', name: 'Physics', level: 'Form 5', students: 38, averageScore: 72, passingRate: 82, trend: 'stable' },
    { id: '4', name: 'Environmental Science', level: 'Form 3', students: 32, averageScore: 82, passingRate: 92, trend: 'up' },
    { id: '5', name: 'Laboratory Techniques', level: 'Form 4', students: 35, averageScore: 74, passingRate: 86, trend: 'stable' },
  ];

  const pendingTasks = [
    { id: '1', title: 'Term Exam Papers Review', deadline: '2025-04-25', priority: 'High', status: 'Pending' },
    { id: '2', title: 'Teacher Performance Evaluation', deadline: '2025-04-30', priority: 'Medium', status: 'In Progress' },
    { id: '3', title: 'Curriculum Revision Meeting', deadline: '2025-05-05', priority: 'Medium', status: 'Scheduled' },
    { id: '4', title: 'Laboratory Equipment Request', deadline: '2025-05-10', priority: 'Low', status: 'Draft' },
  ];

  const departmentAnnouncements = [
    { id: '1', title: 'Laboratory Schedule Update', date: '2025-04-15', sender: 'Principal', priority: 'High' },
    { id: '2', title: 'End of Term Preparations', date: '2025-04-18', sender: 'Department Head', priority: 'Medium' },
    { id: '3', title: 'Science Fair Preparations', date: '2025-04-20', sender: 'Department Head', priority: 'Medium' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Department Meeting', date: '2025-04-22', time: '14:00', location: 'Science Conference Room' },
    { id: '2', title: 'Science Fair Planning', date: '2025-04-26', time: '15:30', location: 'Laboratory 2' },
    { id: '3', title: 'Curriculum Review', date: '2025-05-02', time: '09:00', location: 'Main Conference Room' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {headName}!</h1>
        <p className="text-blue-100 mb-4">{departmentName} - {schoolName}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Award size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Department Ranking</p>
              <p className="text-white font-medium">#{departmentStats.departmentRanking} in School</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Pending Tasks</p>
              <p className="text-white font-medium">{pendingTasks.filter(t => t.priority === 'High').length} high priority tasks</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Today's Attendance</p>
              <p className="text-white font-medium">{departmentStats.avgAttendance}% class attendance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Students" 
          value={departmentStats.totalStudents.toString()} 
          change={2.5} 
          icon={<Users size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Teachers" 
          value={departmentStats.totalTeachers.toString()} 
          change={0} 
          icon={<User size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Courses" 
          value={departmentStats.totalCourses.toString()} 
          change={6.7} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Avg. Performance" 
          value={`${departmentStats.avgPerformance}%`} 
          change={3.8}
          icon={<BarChart3 size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Teacher Performance</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search teacher..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button size="sm" variant="outline" leftIcon={<FileText size={16} />}>Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Classes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teacherPerformance.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/teacher-details/${teacher.id}`} className="hover:text-blue-600">
                        {teacher.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.classes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 w-24">
                          <div 
                            className={`h-2.5 rounded-full ${
                              teacher.performance >= 80 ? 'bg-green-600' : 
                              teacher.performance >= 70 ? 'bg-blue-600' : 
                              'bg-yellow-600'
                            }`}
                            style={{ width: `${teacher.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{teacher.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        teacher.status === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        teacher.status === 'Good' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Tasks</h2>
            <Link to="/app/tasks" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-3 rounded-lg border ${
                  task.priority === 'High' ? 'border-red-200 bg-red-50' : 
                  task.priority === 'Medium' ? 'border-yellow-200 bg-yellow-50' : 
                  'border-gray-200'
                }`}
              >
                <h3 className="font-medium text-sm">{task.title}</h3>
                <div className="flex justify-between mt-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock size={12} className="mr-1 text-gray-500" />
                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-xs ${
                    task.status === 'Pending' ? 'text-red-600' : 
                    task.status === 'In Progress' ? 'text-yellow-600' : 
                    task.status === 'Scheduled' ? 'text-blue-600' : 
                    'text-gray-600'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" fullWidth leftIcon={task.status === 'Pending' ? <CheckCircle size={14} /> : undefined}>
                    {task.status === 'Pending' ? 'Start Task' : 
                     task.status === 'In Progress' ? 'Continue' : 
                     task.status === 'Scheduled' ? 'View Details' : 
                     'Edit Draft'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Department Announcements</h2>
              <Link to="/app/announcements" className="text-sm text-blue-600 hover:underline">Create new</Link>
            </div>
            <div className="space-y-3">
              {departmentAnnouncements.map(announcement => (
                <div key={announcement.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-sm">{announcement.title}</h3>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={12} className="mr-1 text-gray-500" />
                      <span>{new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full ${
                      announcement.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">By: {announcement.sender}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Course Performance</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>Current Term</option>
                <option>Previous Term</option>
                <option>Academic Year</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<FileBarChart size={16} />}>Report</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
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
                {coursePerformance.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/courses/${course.id}`} className="hover:text-blue-600">
                        {course.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.averageScore}/100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {course.passingRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {course.trend === 'up' && <TrendingUp size={16} className="text-green-600 mr-1" />}
                        {course.trend === 'down' && <TrendingDown size={16} className="text-red-600 mr-1" />}
                        <span className={`text-sm ${
                          course.trend === 'up' ? 'text-green-600' : 
                          course.trend === 'down' ? 'text-red-600' : 
                          'text-blue-600'
                        }`}>
                          {course.trend === 'up' ? 'Improving' : 
                           course.trend === 'down' ? 'Declining' : 
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

        {/* Upcoming Events & Department Stats */}
        <Card className="col-span-1">
          <div className="mb-6">
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
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <BookOpen size={12} className="mr-1 text-gray-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Department Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Passing Rate by Subject</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Biology</span>
                    <span className="text-xs font-medium">83%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '83%' }}></div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Chemistry</span>
                    <span className="text-xs font-medium">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-600">Physics</span>
                    <span className="text-xs font-medium">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Environmental Science</span>
                    <span className="text-xs font-medium">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button fullWidth variant="outline" leftIcon={<FileBarChart size={16} />}>View Department Analytics</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentHeadDashboard; 