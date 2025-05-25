import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, Users, FileText, Calendar, Clock, BarChart2, 
  BookOpen, FilePen, User, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import courseApi, { Course } from '../../../api/services/courseApi';
import studentApi, { Student } from '../../../api/services/studentApi';
import teacherApi, { Teacher } from '../../../api/services/teacherApi';

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
  onClick?: () => void
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, onClick }) => {
  
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
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const teacherName = user ? `${user.firstName} ${user.lastName}` : 'Teacher';
  
  // State for real data
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user?.id) {
        setError('User information not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, fetch the teacher record using the user ID
        const teacherResponse = await teacherApi.getByUserId(user.id);
        const teacherData = Array.isArray(teacherResponse.data.data) 
          ? teacherResponse.data.data[0] 
          : teacherResponse.data.data;
        
        if (!teacherData) {
          setError('Teacher profile not found. Please contact your administrator.');
          setLoading(false);
          return;
        }
        
        setTeacher(teacherData);
        
        // Now fetch teacher's courses using the teacher ID
        const coursesResponse = await courseApi.getActiveByTeacher(teacherData.id);
        const teacherCourses = Array.isArray(coursesResponse.data.data) 
          ? coursesResponse.data.data 
          : [];
        setCourses(teacherCourses);

        // Fetch students from teacher's courses
        const studentsResponse = await studentApi.getActiveByTeacher(teacherData.id);
        const teacherStudents = Array.isArray(studentsResponse.data.data) 
          ? studentsResponse.data.data 
          : [];
        setStudents(teacherStudents);

      } catch (err: any) {
        console.error('Error fetching teacher data:', err);
        if (err.response?.status === 404) {
          setError('Teacher profile not found. Please contact your administrator to set up your teacher profile.');
        } else {
          setError(err.response?.data?.message || 'Failed to load teacher data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user?.id]);
  
  // Mock data for assignments and schedule (these would come from assignment/schedule APIs)
  const assignmentsToGrade = [
    { id: '1', title: 'Mathematics Quiz', course: 'Mathematics', submissions: 25, totalStudents: 30, dueDate: 'Due today' },
    { id: '2', title: 'Science Lab Report', course: 'Biology', submissions: 18, totalStudents: 28, dueDate: 'Due tomorrow' },
    { id: '3', title: 'English Essay', course: 'English Literature', submissions: 10, totalStudents: 25, dueDate: 'Due in 3 days' },
  ];

  const teachingSchedule = [
    { id: '1', class: 'Mathematics', time: '08:00 AM - 09:30 AM', room: 'Room 101', students: 30 },
    { id: '2', title: 'Physics', time: '10:00 AM - 11:30 AM', room: 'Room 105', students: 28 },
    { id: '3', title: 'Chemistry', time: '01:00 PM - 02:30 PM', room: 'Lab 3', students: 25 },
  ];

  const studentMessages = [
    { id: '1', student: 'Thabiso Mokgwathi', message: 'Sir, I need help with the homework question 5.', time: '30 minutes ago', avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: '2', student: 'Lesedi Molefe', message: 'When will you upload the lecture notes?', time: '2 hours ago', avatar: 'https://images.pexels.com/photos/5212307/pexels-photo-5212307.jpeg?auto=compress&cs=tinysrgb&w=150' },
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
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {teacherName}!</h1>
        <p className="text-blue-100 mb-4">You have {assignmentsToGrade.length} assignments to grade and {teachingSchedule.length} classes scheduled today.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Next class</p>
              <p className="text-white font-medium">
                {teachingSchedule.length > 0 
                  ? `${teachingSchedule[0].class || teachingSchedule[0].title} - ${teachingSchedule[0].room}, ${teachingSchedule[0].time.split(' - ')[0]}`
                  : 'No classes scheduled'
                }
              </p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <FilePen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Grading needed</p>
              <p className="text-white font-medium">
                {assignmentsToGrade.length > 0 
                  ? `${assignmentsToGrade[0].title} - ${assignmentsToGrade[0].submissions} submissions`
                  : 'No assignments to grade'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Courses Teaching" 
          value={courses.length.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Students" 
          value={students.length.toString()} 
          change={5} 
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Pending" 
          value={assignmentsToGrade.length.toString()} 
          change={-10}
          icon={<FilePen size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Average Class Score" 
          value="76%" 
          change={3}
          icon={<BarChart2 size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments to Grade */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Assignments to Grade</h2>
            <Link to="/app/assignments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {assignmentsToGrade.map(assignment => (
              <div 
                key={assignment.id} 
                className="p-3 rounded-lg border border-gray-200"
              >
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Submissions</span>
                    <span>{assignment.submissions}/{assignment.totalStudents}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {assignment.dueDate}
                  </div>
                  <Button size="sm">Grade</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Schedule</h2>
            <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">Full calendar</Link>
          </div>
          <div className="space-y-3">
            {teachingSchedule.map((schedule, index) => (
              <div 
                key={schedule.id} 
                className={`p-3 rounded-lg border ${index === 0 ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
              >
                <h3 className="font-medium">{schedule.class || schedule.title}</h3>
                <div className="flex justify-between mt-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    {schedule.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={14} className="mr-1" />
                    {schedule.students} students
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M3 3h18v18H3z" />
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M7 12h10" />
                    <path d="M7 16h10" />
                    <path d="M7 8h2" />
                  </svg>
                  {schedule.room}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Student Messages */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Student Messages</h2>
            <Link to="/app/messages" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {studentMessages.map(message => (
              <div key={message.id} className="flex items-start border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <img 
                  src={message.avatar} 
                  alt={message.student} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium">{message.student}</h3>
                  <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{message.time}</p>
                    <Button size="sm" variant="outline">Reply</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth>Open Messaging</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Course Performance */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Course Performance</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>All Courses</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Average Attendance</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-700 text-2xl font-bold">
                  85%
                </div>
                <p className="text-sm text-gray-500 mt-2">5% higher than last term</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Assignment Completion</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-700 text-2xl font-bold">
                  78%
                </div>
                <p className="text-sm text-gray-500 mt-2">3% higher than last term</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Students at Risk</h3>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-700 text-2xl font-bold">
                  12%
                </div>
                <p className="text-sm text-gray-500 mt-2">2% lower than last term</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard; 