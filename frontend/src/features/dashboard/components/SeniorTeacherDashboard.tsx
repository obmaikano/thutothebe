import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, BookOpen, Calendar, FileText, 
  CheckCircle, BookOpen as Book, 
  CheckSquare, BarChart3, User, Bell,
  Clock, ChevronRight, FileCheck, MessageSquare
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
  const teacherName = user ? `${user.firstName} ${user.lastName}` : 'Teacher';
  const department = 'Mathematics Department'; // Would come from user profile in a real implementation
  const schoolName = 'Gaborone Secondary School'; // Would come from user profile in a real implementation

  // Mock data for senior teacher dashboard
  const teacherStats = {
    totalClasses: 5,
    totalStudents: 178,
    assignmentsToGrade: 42,
    upcomingLessons: 3,
    avgAttendance: 92,
    avgPerformance: 76
  };

  const classSchedule = [
    { id: '1', className: 'Form 4A Mathematics', time: '08:00 - 09:30', location: 'Room 201', today: true },
    { id: '2', className: 'Form 5B Advanced Math', time: '10:00 - 11:30', location: 'Room 203', today: true },
    { id: '3', className: 'Form 3C Mathematics', time: '13:00 - 14:30', location: 'Room 105', today: true },
    { id: '4', className: 'Form 4B Mathematics', time: '08:00 - 09:30', location: 'Room 201', today: false },
    { id: '5', className: 'Form 5A Advanced Math', time: '10:00 - 11:30', location: 'Room 203', today: false },
  ];

  const pendingAssignments = [
    { id: '1', title: 'Algebra Quiz #3', class: 'Form 4A', submissionCount: 32, totalStudents: 38, dueDate: '2025-04-18' },
    { id: '2', title: 'Calculus Homework', class: 'Form 5B', submissionCount: 28, totalStudents: 35, dueDate: '2025-04-20' },
    { id: '3', title: 'Geometry Test', class: 'Form 3C', submissionCount: 40, totalStudents: 42, dueDate: '2025-04-25' },
  ];

  const studentPerformance = [
    { id: '1', class: 'Form 4A Mathematics', avgScore: 78, passingRate: 89, improvement: 3.2, students: 38 },
    { id: '2', class: 'Form 5B Advanced Math', avgScore: 82, passingRate: 91, improvement: 4.8, students: 35 },
    { id: '3', class: 'Form 3C Mathematics', avgScore: 72, passingRate: 84, improvement: 2.5, students: 42 },
    { id: '4', class: 'Form 4B Mathematics', avgScore: 75, passingRate: 86, improvement: 3.0, students: 36 },
    { id: '5', class: 'Form 5A Advanced Math', avgScore: 80, passingRate: 90, improvement: 1.5, students: 27 },
  ];

  const studentMessages = [
    { id: '1', student: 'Thabang Moseki', class: 'Form 4A', time: '2 hours ago', message: 'Question about algebra homework', read: false },
    { id: '2', student: 'Boitumelo Tau', class: 'Form 5B', time: '1 day ago', message: 'Request for extra help after class', read: true },
    { id: '3', student: 'Naledi Kgosi', class: 'Form 3C', time: '3 hours ago', message: 'Clarification on geometry formulas', read: false },
  ];

  const upcomingDeadlines = [
    { id: '1', title: 'Submit Term Reports', deadline: '2025-04-25', type: 'Administrative' },
    { id: '2', title: 'Final Exam Preparation', deadline: '2025-04-30', type: 'Academic' },
    { id: '3', title: 'Department Meeting', deadline: '2025-05-02', type: 'Meeting' },
  ];

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
              <FileCheck size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Assignments</p>
              <p className="text-white font-medium">{teacherStats.assignmentsToGrade} need grading</p>
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
          title="Avg. Attendance" 
          value={`${teacherStats.avgAttendance}%`} 
          change={2.1}
          icon={<CheckSquare size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Avg. Performance" 
          value={`${teacherStats.avgPerformance}%`} 
          change={3.5}
          icon={<BarChart3 size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Teaching Schedule</h2>
            <Link to="/app/schedule" className="text-sm text-blue-600 hover:underline">Full Schedule</Link>
          </div>
          <div className="space-y-4">
            {classSchedule.filter(c => c.today).map(classItem => (
              <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{classItem.className}</h3>
                    <p className="text-sm text-gray-600 mt-1">{classItem.location}</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {classItem.time}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" variant="primary" className="flex-1">View Lesson Plan</Button>
                  <Button size="sm" variant="outline" className="flex-1">Class Records</Button>
                  <Button size="sm" variant="outline" className="flex-1">Take Attendance</Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Assignments to Grade</h2>
              <Link to="/app/assignments" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submissions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/app/assignments/${assignment.id}`} className="hover:text-blue-600">
                          {assignment.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.class}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{assignment.submissionCount}/{assignment.totalStudents}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button size="sm" variant="primary">Grade</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Student Messages & Upcoming */}
        <Card className="col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Student Messages</h2>
              <Link to="/app/messages" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {studentMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg border ${
                    !message.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <h3 className="font-medium text-sm flex items-center">
                    {!message.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full inline-block mr-2"></span>
                    )}
                    {message.student}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Class: {message.class}</p>
                  <p className="text-sm text-gray-700 mt-2">{message.message}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">{message.time}</span>
                    <Button size="sm" variant="outline">Reply</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Upcoming Deadlines</h2>
              <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">View calendar</Link>
            </div>
            <div className="space-y-3">
              {upcomingDeadlines.map(item => (
                <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-sm">{item.title}</h3>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1 text-gray-500" />
                      <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Class Performance */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Class Performance Overview</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>Current Term</option>
                <option>Previous Term</option>
                <option>Academic Year</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<FileText size={16} />}>Generate Report</Button>
            </div>
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
                    Average Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Passing Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Improvement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentPerformance.map((classData) => (
                  <tr key={classData.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/classes/${classData.id}`} className="hover:text-blue-600">
                        {classData.class}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classData.students}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classData.avgScore}/100
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {classData.passingRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        classData.improvement > 3 ? 'bg-green-100 text-green-800' : 
                        classData.improvement > 0 ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {classData.improvement > 0 ? '+' : ''}{classData.improvement}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <Link to={`/app/classes/${classData.id}/performance`} className="flex items-center">
                        View Details
                        <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SeniorTeacherDashboard; 