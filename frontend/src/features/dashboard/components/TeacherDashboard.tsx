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
import assignmentApi, { Assignment } from '../../../api/services/assignmentApi';
import submissionApi, { Submission } from '../../../api/services/submissionApi';

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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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

        // Fetch teacher's assignments
        const assignmentsResponse = await assignmentApi.getByTeacher(teacherData.id);
        const teacherAssignments = Array.isArray(assignmentsResponse.data.data) 
          ? assignmentsResponse.data.data 
          : [];
        setAssignments(teacherAssignments);

        // Fetch submissions for teacher's assignments
        const allSubmissions: Submission[] = [];
        for (const assignment of teacherAssignments) {
          try {
            const submissionsResponse = await submissionApi.getByAssignment(assignment.id);
            const assignmentSubmissions = Array.isArray(submissionsResponse.data.data) 
              ? submissionsResponse.data.data 
              : [];
            allSubmissions.push(...assignmentSubmissions);
          } catch (err) {
            console.error(`Error fetching submissions for assignment ${assignment.id}:`, err);
          }
        }
        setSubmissions(allSubmissions);

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
  
  // Calculate real assignment data
  const assignmentsToGrade = assignments
    .filter(assignment => assignment.status === 'PUBLISHED')
    .map(assignment => {
      const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
      const pendingSubmissions = assignmentSubmissions.filter(s => s.status === 'PENDING');
      
      return {
        id: assignment.id.toString(),
        title: assignment.title,
        course: courses.find(c => c.id === assignment.courseId)?.name || 'Unknown Course',
        submissions: assignmentSubmissions.length,
        totalStudents: students.length, // This could be more accurate with course-specific student counts
        dueDate: new Date(assignment.dueDate) > new Date() ? 'Due ' + formatRelativeDate(assignment.dueDate) : 'Overdue',
        pendingCount: pendingSubmissions.length
      };
    })
    .filter(assignment => assignment.pendingCount > 0)
    .slice(0, 3); // Show top 3 assignments needing attention

  // Mock data for schedule (this would come from a schedule/timetable API)
  const teachingSchedule = [
    { id: '1', class: 'Mathematics', time: '08:00 AM - 09:30 AM', room: 'Room 101', students: 30 },
    { id: '2', title: 'Physics', time: '10:00 AM - 11:30 AM', room: 'Room 105', students: 28 },
    { id: '3', title: 'Chemistry', time: '01:00 PM - 02:30 PM', room: 'Lab 3', students: 25 },
  ];

  // Mock data for student messages (this would come from a messaging API)
  const studentMessages = [
    { id: '1', student: 'Thabiso Mokgwathi', message: 'Sir, I need help with the homework question 5.', time: '30 minutes ago', avatar: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { id: '2', student: 'Lesedi Molefe', message: 'When will you upload the lecture notes?', time: '2 hours ago', avatar: 'https://images.pexels.com/photos/5212307/pexels-photo-5212307.jpeg?auto=compress&cs=tinysrgb&w=150' },
  ];

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays > 1) return `in ${diffDays} days`;
    if (diffDays === -1) return 'yesterday';
    return `${Math.abs(diffDays)} days ago`;
  };

  // Calculate statistics
  const pendingSubmissions = submissions.filter(s => s.status === 'PENDING').length;
  const gradedSubmissions = submissions.filter(s => s.status === 'GRADED').length;
  const totalSubmissions = submissions.length;
  const averageScore = gradedSubmissions > 0 
    ? Math.round(submissions.filter(s => s.score !== undefined).reduce((sum, s) => sum + (s.score || 0), 0) / gradedSubmissions)
    : 0;

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
        <p className="text-blue-100 mb-4">You have {pendingSubmissions} submissions to grade and {teachingSchedule.length} classes scheduled today.</p>
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
                  ? `${assignmentsToGrade[0].title} - ${assignmentsToGrade[0].pendingCount} submissions`
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
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Pending" 
          value={pendingSubmissions.toString()} 
          icon={<FilePen size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Average Class Score" 
          value={`${averageScore}%`} 
          icon={<BarChart2 size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments to Grade */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Assignments to Grade</h2>
            <Link to="/app/teacher-assignments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {assignmentsToGrade.length > 0 ? assignmentsToGrade.map(assignment => (
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
                  <Button size="sm">Grade ({assignment.pendingCount})</Button>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <FilePen className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No assignments need grading</p>
              </div>
            )}
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {schedule.room}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Messages</h2>
            <Link to="/app/messages" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {studentMessages.map(message => (
              <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                <img 
                  src={message.avatar} 
                  alt={message.student}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.student}
                    </p>
                    <p className="text-xs text-gray-500">
                      {message.time}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
            {studentMessages.length === 0 && (
              <div className="text-center py-6">
                <MessageSquare className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No recent messages</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard; 