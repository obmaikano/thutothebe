import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, BookOpen, MessageSquare, 
  Bell, Users, User, School
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudents } from '../../students/studentsSlice';
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

export const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [loading, setLoading] = useState(true);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  
  const parentName = user ? `${user.firstName} ${user.lastName}` : 'Parent';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
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

  // Filter students that belong to this parent (this would be based on parent-child relationship in real implementation)
  const children = students.slice(0, 2).map((student, index) => ({
    id: student.id.toString(),
    name: `${student.firstName} ${student.lastName}`,
    grade: `Grade ${student.academicYear}`,
    school: 'School',
    avatar: `https://images.pexels.com/photos/${5212317 + index}/pexels-photo-${5212317 + index}.jpeg?auto=compress&cs=tinysrgb&w=150`,
    attendance: Math.floor(Math.random() * 20) + 80, // This would come from attendance API
    grades: {
      Mathematics: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)],
      Science: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)],
      English: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)],
      History: ['A', 'B+', 'B', 'C+'][Math.floor(Math.random() * 4)],
    },
    upcomingAssignments: [
      { title: 'Mathematics Quiz', dueDate: 'Tomorrow', status: 'Not started' },
      { title: 'Science Lab Report', dueDate: 'In 3 days', status: 'In progress' },
    ]
  }));

  // Real announcements (this would come from announcements API)
  const announcements = [
    { id: '1', title: 'Parent-Teacher Meeting', content: 'Parent-teacher meetings will be held on May 5th, 2025.', date: '2 days ago' },
    { id: '2', title: 'School Holiday', content: 'School will be closed on April 25th for a national holiday.', date: '3 days ago' },
  ];

  // Recent activity using real data
  const recentActivity = [
    { id: '1', user: 'System', action: 'loaded', item: `${students.length} students`, time: 'Just now', role: 'System' },
    { id: '2', user: 'System', action: 'loaded', item: `${courses.length} courses`, time: 'Just now', role: 'System' },
    { id: '3', user: 'System', action: 'loaded', item: `${subjects.length} subjects`, time: 'Just now', role: 'System' },
  ];

  const selectedChild = children[selectedChildIndex] || children[0];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="p-8 space-y-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
          <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {parentName}!</h1>
          <p className="text-blue-100 mb-4">Track your children's education journey and stay connected with their teachers.</p>
        </div>
        
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No children found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your children's profiles will appear here once they are enrolled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {parentName}!</h1>
        <p className="text-blue-100 mb-4">Track your children's education journey and stay connected with their teachers.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Children Enrolled</p>
              <p className="text-white font-medium">{children.length} children in system</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Available Courses</p>
              <p className="text-white font-medium">{courses.length} courses available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Child Selection Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {children.map((child, index) => (
            <button 
              key={child.id}
              onClick={() => setSelectedChildIndex(index)}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                index === selectedChildIndex ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <img 
                src={child.avatar}
                alt={child.name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=3b82f6&color=fff`;
                }}
              />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Child Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Overall Grade" 
          value="B+" 
          change={5} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Attendance Rate" 
          value={`${selectedChild?.attendance || 92}%`} 
          change={-2} 
          icon={<Calendar size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Assignments Due" 
          value={selectedChild?.upcomingAssignments?.length.toString() || "0"} 
          icon={<Clock size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Available Subjects" 
          value={subjects.length.toString()}
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Performance */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Subject Grades</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>Term 2, 2025</option>
              <option>Term 1, 2025</option>
              <option>All Terms</option>
            </select>
          </div>
          <div className="space-y-3">
            {selectedChild && Object.entries(selectedChild.grades).map(([subject, grade]) => (
              <div key={subject} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="font-medium">{subject}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                  grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                  grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {grade}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">View Detailed Report</Button>
          </div>
        </Card>

        {/* Upcoming Assignments */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Assignments</h2>
            <Link to="/app/assignments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {selectedChild?.upcomingAssignments?.map((assignment, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">{assignment.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    assignment.status === 'Not started' ? 'bg-red-100 text-red-800' :
                    assignment.status === 'In progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Clock size={12} className="mr-1" />
                  <span>Due {assignment.dueDate}</span>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <Clock className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm">No upcoming assignments</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">View Assignment Calendar</Button>
          </div>
        </Card>

        {/* School Announcements & Activity */}
        <Card className="col-span-1 lg:col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">School Announcements</h2>
              <Link to="/app/announcements" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-sm text-blue-900">{announcement.title}</h3>
                  <p className="text-xs text-blue-700 mt-1">{announcement.content}</p>
                  <p className="text-xs text-blue-600 mt-2">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">System Activity</h2>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <Bell size={12} className="text-green-600" />
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
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/messages" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <MessageSquare size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Message Teachers</p>
              <p className="text-sm text-gray-500">Communicate with teachers</p>
            </div>
          </div>
        </Link>
        <Link to="/app/calendar" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">School Calendar</p>
              <p className="text-sm text-gray-500">View events and schedules</p>
            </div>
          </div>
        </Link>
        <Link to="/app/grades" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Grades</p>
              <p className="text-sm text-gray-500">Check academic progress</p>
            </div>
          </div>
        </Link>
        <Link to="/app/attendance" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Users size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Attendance Report</p>
              <p className="text-sm text-gray-500">Track attendance records</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ParentDashboard; 