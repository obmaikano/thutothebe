import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, Calendar, FileText, 
  AlertTriangle, Bell, BookOpen, 
  BarChart3, CheckCircle, User, 
  Clipboard, PieChart, Clock
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';

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
  const dispatch = useAppDispatch();
  
  // Redux state
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  const { classes } = useAppSelector(state => state.classes);
  const { courses } = useAppSelector(state => state.courses);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [loading, setLoading] = useState(true);
  
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Administrator';
  const schoolName = user?.schoolName || 'School Administration'; // Would come from user profile

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
          dispatch(fetchTeachers()),
          dispatch(fetchClasses()),
          dispatch(fetchCourses()),
          dispatch(fetchSubjects())
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  // Calculate real statistics
  const schoolStats = {
    totalStudents: students.length,
    totalTeachers: teachers.length,
    totalClasses: classes.length,
    totalCourses: courses.length,
    activeStudents: students.filter(s => s.active).length,
    activeTeachers: teachers.filter(t => t.active).length,
    attendanceToday: 92, // This would come from attendance API
    studentGrowth: 3.5, // This would come from analytics API
    teacherGrowth: 2.1, // This would come from analytics API
    performanceChange: 4.2 // This would come from performance API
  };

  // Real data for class performance (using actual classes)
  const classPerformance = classes.slice(0, 5).map((classItem, index) => {
    const classStudents = students.filter(s => s.classId === classItem.id);
    return {
      id: classItem.id.toString(),
      className: classItem.name,
      totalStudents: classStudents.length,
      averageScore: Math.floor(Math.random() * 30) + 60, // This would come from grades API
      passingRate: Math.floor(Math.random() * 30) + 70, // This would come from grades API
      trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
    };
  });

  // Mock data for pending approvals (this would come from approvals API)
  const pendingApprovals = [
    { id: '1', type: 'Teacher Leave Request', requestedBy: 'Moses Moeti', department: 'Science', submittedOn: '2025-04-12', status: 'Pending Review' },
    { id: '2', type: 'Student Enrollment', requestedBy: 'Tebogo Kgosi', department: 'Administration', submittedOn: '2025-04-14', status: 'Pending Review' },
    { id: '3', type: 'Class Schedule Change', requestedBy: 'Sarah Phiri', department: 'Mathematics', submittedOn: '2025-04-15', status: 'Under Review' },
  ];

  // Mock data for notifications (this would come from notifications API)
  const recentNotifications = [
    { id: '1', title: 'Regional Inspection Scheduled', type: 'Official', date: '2025-04-10', priority: 'High' },
    { id: '2', title: 'End of Term Reports Due', type: 'Academic', date: '2025-04-14', priority: 'Medium' },
    { id: '3', title: 'Teacher Professional Development', type: 'Training', date: '2025-04-15', priority: 'Medium' },
    { id: '4', title: 'Budget Approval Granted', type: 'Administrative', date: '2025-04-16', priority: 'Low' },
  ];

  // Mock data for upcoming events (this would come from events API)
  const upcomingEvents = [
    { id: '1', title: 'End of Term Exams', date: '2025-04-25', location: 'All Classrooms', type: 'Academic' },
    { id: '2', title: 'Parent-Teacher Meeting', date: '2025-04-30', location: 'Main Hall', type: 'Meeting' },
    { id: '3', title: 'Inter-School Sports Competition', date: '2025-05-05', location: 'Sports Field', type: 'Sports' },
  ];

  // Recent activity using real data
  const recentActivity = [
    { id: '1', user: 'System', action: 'loaded', item: `${students.length} students`, time: 'Just now', role: 'System' },
    { id: '2', user: 'System', action: 'loaded', item: `${teachers.length} teachers`, time: 'Just now', role: 'System' },
    { id: '3', user: 'System', action: 'loaded', item: `${classes.length} classes`, time: 'Just now', role: 'System' },
    { id: '4', user: 'System', action: 'loaded', item: `${courses.length} courses`, time: 'Just now', role: 'System' },
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
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">{schoolName} - Administration Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Active Students</p>
              <p className="text-white font-medium">{schoolStats.activeStudents} students enrolled</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <User size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Active Teachers</p>
              <p className="text-white font-medium">{schoolStats.activeTeachers} teachers active</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Classes</p>
              <p className="text-white font-medium">{schoolStats.totalClasses} classes running</p>
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
          title="Total Courses" 
          value={schoolStats.totalCourses.toString()}
          icon={<School size={20} />} 
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
                {classPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating your first class.
                      </p>
                    </td>
                  </tr>
                ) : (
                  classPerformance.map((classInfo) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            Showing {Math.min(5, classPerformance.length)} of {schoolStats.totalClasses} classes. 
            <Link to="/app/classes" className="text-blue-600 hover:underline ml-1">
              View all classes
            </Link>
          </div>
        </Card>

        {/* Notifications & System Activity */}
        <Card className="col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
              <Link to="/app/activity" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-blue-600" />
                    </div>
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
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Pending Approvals</h2>
              <Link to="/app/approvals" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{approval.type}</p>
                      <p className="text-xs text-gray-600">by {approval.requestedBy}</p>
                      <p className="text-xs text-gray-500">{approval.submittedOn}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {approval.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/students" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Students</p>
              <p className="text-sm text-gray-500">View and manage students</p>
            </div>
          </div>
        </Link>
        <Link to="/app/teachers" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <User size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Teachers</p>
              <p className="text-sm text-gray-500">View and manage teachers</p>
            </div>
          </div>
        </Link>
        <Link to="/app/classes" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Classes</p>
              <p className="text-sm text-gray-500">Configure classes</p>
            </div>
          </div>
        </Link>
        <Link to="/app/courses" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <School size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Courses</p>
              <p className="text-sm text-gray-500">Configure courses</p>
            </div>
          </div>
        </Link>
      </div>

      {/* System Status */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">System Status</h2>
          <Link to="/app/notifications" className="text-sm text-blue-600 hover:underline">View all notifications</Link>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg border-l-4 bg-blue-50 border-blue-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  System loaded {schoolStats.totalStudents} students, {schoolStats.totalTeachers} teachers, and {schoolStats.totalClasses} classes successfully
                </p>
                <p className="text-xs mt-1 text-blue-600">Current</p>
              </div>
            </div>
          </div>
          {recentNotifications.slice(0, 2).map((notification) => (
            <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
              notification.priority === 'High' ? 'bg-red-50 border-red-400' :
              notification.priority === 'Medium' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.priority === 'High' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                  {notification.priority === 'Medium' && <Clock className="h-5 w-5 text-yellow-400" />}
                  {notification.priority === 'Low' && <CheckCircle className="h-5 w-5 text-blue-400" />}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    notification.priority === 'High' ? 'text-red-800' :
                    notification.priority === 'Medium' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    notification.priority === 'High' ? 'text-red-600' :
                    notification.priority === 'Medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {notification.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SchoolAdminDashboard; 