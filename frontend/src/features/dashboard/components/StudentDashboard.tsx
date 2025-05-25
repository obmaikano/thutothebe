import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, Calendar, FileText, Award, Clock, Users, 
  BookOpen, Bookmark, Clock as ClockIcon, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import studentApi from '../../../api/services/studentApi';
import announcementApi from '../../../api/services/announcementApi';
import scheduleApi from '../../../api/services/scheduleApi';

// Interfaces for type safety
interface DashboardData {
  studentId: number;
  studentName: string;
  admissionNumber: string;
  className: string | null;
  schoolName: string | null;
  status: string;
  active: boolean;
  courseCount: number;
  enrolledCourses: Course[];
  upcomingAssignments: Assignment[];
  performanceMetrics: PerformanceMetrics;
  announcements: Announcement[];
  nextClass: NextClass;
  nextAssignment: NextAssignment;
  assignmentsDueThisWeek: number;
}

interface Course {
  id: number;
  name: string;
  code: string;
  description: string | null;
  teacherName: string;
  term: string;
  year: number;
  type: string;
  credits: number;
  progress: number;
}

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  urgent: boolean;
}

interface PerformanceMetrics {
  attendanceRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  averageGrade: string;
  averageScore: number;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
}

interface NextClass {
  subject: string;
  time: string;
  room: string;
}

interface NextAssignment {
  title: string;
  course: string;
  dueDate: string;
}

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
  icon: React.ReactNode, 
  iconColor: string 
}> = ({ title, value, icon, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
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
  onClick?: () => void
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, leftIcon, onClick }) => {
  
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
      {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
    </button>
  );
};

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [noStudentRecord, setNoStudentRecord] = useState(false);
  const [creatingStudent, setCreatingStudent] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [nextClass, setNextClass] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setNoStudentRecord(false);

        console.log('Fetching student record for user ID:', user.id);

        // Get student record first using user ID
        const studentResponse = await studentApi.getByUserId(user.id);
        console.log('Student API response:', studentResponse.data);
        
        if (studentResponse.data.status !== 'SUCCESS' || !studentResponse.data.data) {
          console.error('Failed to get student record. Response:', studentResponse.data);
          setNoStudentRecord(true);
          setError('Student profile not found. Your account may not be fully set up yet.');
          setLoading(false);
          return;
        }

        const student = Array.isArray(studentResponse.data.data) 
          ? studentResponse.data.data[0] 
          : studentResponse.data.data;

        if (!student) {
          setNoStudentRecord(true);
          setError('Student profile not found. Your account may not be fully set up yet.');
          setLoading(false);
          return;
        }

        setStudentData(student);
        console.log('Student data:', student);

        // Fetch dashboard data using the student ID
        const dashboardResponse = await studentApi.getDashboard(student.id);
        console.log('Dashboard API response:', dashboardResponse.data);
        
        if (dashboardResponse.data.status === 'SUCCESS') {
          const dashboardInfo = dashboardResponse.data.data as unknown as DashboardData;
          setDashboardData(dashboardInfo);
        } else {
          console.error('Failed to fetch dashboard data:', dashboardResponse.data.message);
          setError('Failed to load dashboard data');
        }

        // Fetch real announcements
        try {
          const announcementResponse = await announcementApi.getForStudent(student.id);
          if (announcementResponse.data.status === 'SUCCESS' && announcementResponse.data.data) {
            const announcementData = Array.isArray(announcementResponse.data.data) 
              ? announcementResponse.data.data 
              : [announcementResponse.data.data];
            
            // Transform announcements to match dashboard format
            const transformedAnnouncements = announcementData.slice(0, 3).map((announcement: any) => ({
              id: announcement.id,
              title: announcement.title,
              content: announcement.content,
              date: new Date(announcement.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })
            }));
            setAnnouncements(transformedAnnouncements);
          }
        } catch (err) {
          console.warn('Failed to fetch announcements:', err);
          // Don't fail the entire dashboard if announcements fail
        }

        // Fetch real next class information
        try {
          const nextClassResponse = await scheduleApi.getNextClass(student.id);
          if (nextClassResponse.data.status === 'SUCCESS' && nextClassResponse.data.data) {
            const nextClassData = nextClassResponse.data.data;
            setNextClass({
              subject: nextClassData.subject,
              time: `${nextClassData.startTime} - ${nextClassData.endTime}`,
              room: nextClassData.room,
              timeUntil: nextClassData.timeUntil || 'Soon'
            });
          }
        } catch (err) {
          console.warn('Failed to fetch next class:', err);
          // Don't fail the entire dashboard if schedule fails
        }

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 404) {
          setNoStudentRecord(true);
          setError('Student profile not found. Your account may not be fully set up yet. Please contact your administrator to complete your student profile setup.');
        } else if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access this resource.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const createStudentRecord = async () => {
    if (!user?.id) return;
    
    try {
      setCreatingStudent(true);
      console.log('Creating student record for user ID:', user.id);
      
      const response = await studentApi.createForUser(user.id);
      console.log('Create student response:', response.data);
      
      if (response.data.status === 'SUCCESS') {
        // Student record created successfully, refresh the page data
        setNoStudentRecord(false);
        setError(null);
        // Trigger a re-fetch of the data
        window.location.reload();
      } else {
        setError('Failed to create student record: ' + response.data.message);
      }
    } catch (err: any) {
      console.error('Error creating student record:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('school')) {
        setError('Cannot create student record: You must be assigned to a school first. Please contact your administrator.');
      } else {
        setError('Failed to create student record: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setCreatingStudent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className={`border rounded-lg p-6 ${noStudentRecord ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className={`h-5 w-5 ${noStudentRecord ? 'text-yellow-400' : 'text-red-400'}`} />
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${noStudentRecord ? 'text-yellow-800' : 'text-red-800'}`}>
                {noStudentRecord ? 'Student Profile Setup Required' : 'Error'}
              </h3>
              <div className={`mt-2 text-sm ${noStudentRecord ? 'text-yellow-700' : 'text-red-700'}`}>
                <p>{error}</p>
                {noStudentRecord && (
                  <div className="mt-4">
                    <p className="font-medium">What you can do:</p>
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>Contact your school administrator to complete your student profile setup</li>
                      <li>Ensure your account has been properly enrolled in the system</li>
                      <li>Check that you have been assigned to a class and school</li>
                    </ul>
                    <div className="mt-4">
                      <p className="text-sm">
                        <strong>Your User ID:</strong> {user?.id} <br />
                        <strong>Your Email:</strong> {user?.email} <br />
                        <strong>Your Role:</strong> {user?.role}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={createStudentRecord}
                        disabled={creatingStudent}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        {creatingStudent ? 'Creating...' : 'Create Student Profile'}
                      </button>
                      <p className="text-xs text-yellow-600 mt-2">
                        This will attempt to create your student profile automatically. You must be assigned to a school for this to work.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">No dashboard data available</h3>
          <p className="mt-2 text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const studentName = dashboardData.studentName || (user ? `${user.firstName} ${user.lastName}` : 'Student');
  
  // Use real next class data if available, otherwise fall back to dashboard data
  const displayNextClass = nextClass || dashboardData.nextClass;

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {studentName}!</h1>
        <p className="text-blue-100 mb-4">
          You have {dashboardData.assignmentsDueThisWeek} assignment{dashboardData.assignmentsDueThisWeek !== 1 ? 's' : ''} due this week. Keep up the good work!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Next class</p>
              <p className="text-white font-medium">
                {displayNextClass ? 
                  `${displayNextClass.subject} - ${displayNextClass.time}` : 
                  'No upcoming classes'
                }
              </p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Next assignment</p>
              <p className="text-white font-medium">
                {dashboardData.nextAssignment ? 
                  `${dashboardData.nextAssignment.title} - ${dashboardData.nextAssignment.dueDate}` : 
                  'No upcoming assignments'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Courses Enrolled" 
          value={dashboardData.courseCount.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${dashboardData.performanceMetrics.attendanceRate}%`} 
          icon={<Calendar size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Completed" 
          value={`${dashboardData.performanceMetrics.assignmentsCompleted}/${dashboardData.performanceMetrics.totalAssignments}`} 
          icon={<FileText size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Average Grade" 
          value={dashboardData.performanceMetrics.averageGrade} 
          icon={<Bookmark size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Assignments</h2>
            <Link to="/app/student-assignments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {dashboardData.upcomingAssignments.length === 0 ? (
              <div className="text-center py-4">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No upcoming assignments</p>
              </div>
            ) : (
              dashboardData.upcomingAssignments.map(assignment => (
                <div 
                  key={assignment.id} 
                  className={`p-3 rounded-lg border ${assignment.urgent ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{assignment.title}</h3>
                    {assignment.urgent && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Urgent</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{assignment.course}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock size={14} className="mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline">Start</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Enrolled Courses */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">My Courses</h2>
            <Link to="/app/student-courses" className="text-sm text-blue-600 hover:underline">View all courses</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData.enrolledCourses.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No courses enrolled</p>
              </div>
            ) : (
              dashboardData.enrolledCourses.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden flex">
                  <div className="w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-2/3 p-3">
                    <h3 className="font-medium">{course.name}</h3>
                    <p className="text-sm text-gray-600">{course.teacherName}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Announcements - now using real data */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Announcements</h2>
          </div>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-4">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No announcements</p>
              </div>
            ) : (
              announcements.map(announcement => (
                <div key={announcement.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{announcement.date}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Student Information */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Student Info</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Admission Number</p>
              <p className="font-medium">{dashboardData.admissionNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Class</p>
              <p className="font-medium">{dashboardData.className || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">School</p>
              <p className="font-medium">{dashboardData.schoolName || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                dashboardData.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {dashboardData.status}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard; 