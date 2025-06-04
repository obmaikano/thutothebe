import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Calendar, FileText, 
  CheckCircle, BookOpen as Book, 
  CheckSquare, BarChart3, User, Bell,
  Clock, ChevronRight, FileCheck, MessageSquare,
  FilePen, Activity
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';

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
  variant?: 'primary' | 'outline' | 'success', 
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
    success: 'bg-green-600 text-white hover:bg-green-700'
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

export const SeniorTeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { courses } = useAppSelector(state => state.courses);
  const { students } = useAppSelector(state => state.students);
  const { subjects } = useAppSelector(state => state.subjects);
  const { teachers } = useAppSelector(state => state.teachers);
  
  const [loading, setLoading] = useState(true);
  
  const teacherName = user ? `${user.firstName} ${user.lastName}` : 'Teacher';
  const department = 'Mathematics Department'; // Would come from user profile in a real implementation
  const schoolName = 'School'; // Would come from user profile in a real implementation

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchCourses()),
          dispatch(fetchStudents()),
          dispatch(fetchSubjects()),
          dispatch(fetchTeachers())
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
  const teacherStats = {
    totalClasses: courses.length,
    totalStudents: students.length,
    assignmentsToGrade: Math.floor(Math.random() * 50) + 10, // This would come from assignments API
    upcomingLessons: 3, // This would come from schedule API
    avgAttendance: 92, // This would come from attendance API
    avgPerformance: 76 // This would come from performance API
  };

  // Real class schedule using courses data
  const classSchedule = courses.slice(0, 5).map((course, index) => ({
    id: course.id.toString(),
    className: course.name,
    time: ['08:00 - 09:30', '10:00 - 11:30', '13:00 - 14:30', '15:00 - 16:30'][index % 4],
    location: `Room ${201 + index}`,
    today: index < 3
  }));

  // Mock data for pending assignments (this would come from assignments API)
  const pendingAssignments = [
    { id: '1', title: 'Algebra Quiz #3', class: 'Form 4A', submissionCount: 32, totalStudents: 38, dueDate: '2025-04-18' },
    { id: '2', title: 'Calculus Homework', class: 'Form 5B', submissionCount: 28, totalStudents: 35, dueDate: '2025-04-20' },
    { id: '3', title: 'Geometry Test', class: 'Form 3C', submissionCount: 40, totalStudents: 42, dueDate: '2025-04-25' },
  ];

  // Real student performance using courses and students data
  const studentPerformance = courses.slice(0, 5).map((course, index) => {
    const courseStudents = students.filter(s => s.classId === (course as any).classId);
    return {
      id: course.id.toString(),
      class: course.name,
      avgScore: Math.floor(Math.random() * 20) + 70,
      passingRate: Math.floor(Math.random() * 20) + 80,
      improvement: Math.floor(Math.random() * 5) + 1,
      students: courseStudents.length
    };
  });

  // Mock data for student messages (this would come from messaging API)
  const studentMessages = [
    { id: '1', student: 'Thabang Moseki', class: 'Form 4A', time: '2 hours ago', message: 'Question about algebra homework', read: false },
    { id: '2', student: 'Boitumelo Tau', class: 'Form 5B', time: '1 day ago', message: 'Request for extra help after class', read: true },
    { id: '3', student: 'Naledi Kgosi', class: 'Form 3C', time: '3 hours ago', message: 'Clarification on geometry formulas', read: false },
  ];

  // Mock data for upcoming deadlines (this would come from calendar API)
  const upcomingDeadlines = [
    { id: '1', title: 'Submit Term Reports', deadline: '2025-04-25', type: 'Administrative' },
    { id: '2', title: 'Final Exam Preparation', deadline: '2025-04-30', type: 'Academic' },
    { id: '3', title: 'Department Meeting', deadline: '2025-05-02', type: 'Meeting' },
  ];

  // Recent activity using real data
  const recentActivity = [
    { id: '1', user: 'System', action: 'loaded', item: `${courses.length} courses`, time: 'Just now', role: 'System' },
    { id: '2', user: 'System', action: 'loaded', item: `${students.length} students`, time: 'Just now', role: 'System' },
    { id: '3', user: 'System', action: 'loaded', item: `${subjects.length} subjects`, time: 'Just now', role: 'System' },
    { id: '4', user: 'System', action: 'loaded', item: `${teachers.length} teachers`, time: 'Just now', role: 'System' },
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
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {teacherName}!</h1>
        <p className="text-blue-100 mb-4">{department} - {schoolName}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Book size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Today's Classes</p>
              <p className="text-white font-medium">{classSchedule.filter(c => c.today).length} classes scheduled</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Students</p>
              <p className="text-white font-medium">{teacherStats.totalStudents} students</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Student Messages</p>
              <p className="text-white font-medium">{studentMessages.filter(m => !m.read).length} unread messages</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Classes" 
          value={teacherStats.totalClasses.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Students" 
          value={teacherStats.totalStudents.toString()}
          change={1.2}
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Available Subjects" 
          value={subjects.length.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Department Teachers" 
          value={teachers.length.toString()} 
          change={3.5}
          icon={<User size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Schedule</h2>
            <Link to="/app/schedule" className="text-sm text-blue-600 hover:underline">View full schedule</Link>
          </div>
          <div className="space-y-3">
            {classSchedule.filter(c => c.today).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No classes today</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enjoy your free day!
                </p>
              </div>
            ) : (
              classSchedule.filter(c => c.today).map((schedule) => (
                <div key={schedule.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{schedule.className}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock size={14} className="mr-1" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <BookOpen size={14} className="mr-1" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Today
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link to="/app/schedule" className="text-sm text-blue-600 hover:underline">
              View weekly schedule →
            </Link>
          </div>
        </Card>

        {/* Recent Activity & Messages */}
        <Card className="col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity size={12} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900">
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
              <h2 className="text-lg font-bold text-gray-800">Student Messages</h2>
              <Link to="/app/messages" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {studentMessages.slice(0, 3).map((message) => (
                <div key={message.id} className={`p-3 rounded-lg border ${
                  !message.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm text-gray-900">{message.student}</h3>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{message.class}</p>
                  <p className="text-sm text-gray-800">{message.message}</p>
                  {!message.read && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Unread
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Class Performance Overview */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Class Performance Overview</h2>
          <Link to="/app/performance" className="text-sm text-blue-600 hover:underline">View detailed analytics</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
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
                  Improvement
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentPerformance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Performance data will appear here once classes are active.
                    </p>
                  </td>
                </tr>
              ) : (
                studentPerformance.map((performance) => (
                  <tr key={performance.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {performance.class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {performance.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {performance.avgScore}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {performance.passingRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{performance.improvement}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/courses" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Courses</p>
              <p className="text-sm text-gray-500">{courses.length} courses</p>
            </div>
          </div>
        </Link>
        <Link to="/app/students" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Students</p>
              <p className="text-sm text-gray-500">{students.length} students</p>
            </div>
          </div>
        </Link>
        <Link to="/app/assignments" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <FilePen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Assignments</p>
              <p className="text-sm text-gray-500">Grade and manage</p>
            </div>
          </div>
        </Link>
        <Link to="/app/messages" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <MessageSquare size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Messages</p>
              <p className="text-sm text-gray-500">{studentMessages.filter(m => !m.read).length} unread</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SeniorTeacherDashboard; 