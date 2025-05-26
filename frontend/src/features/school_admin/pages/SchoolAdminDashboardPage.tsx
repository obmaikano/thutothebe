import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  Users, School, Calendar, FileText, 
  AlertTriangle, Bell, BookOpen, 
  BarChart3, CheckCircle, User, 
  Clipboard, PieChart, Clock,
  UserPlus, GraduationCap, Settings,
  TrendingUp, Activity, Award
} from 'lucide-react';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchClasses } from '../../classes/classesSlice';

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
  iconColor: string,
  onClick?: () => void
}> = ({ title, value, change, icon, iconColor, onClick }) => (
  <div 
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    onClick={onClick}
  >
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

// Quick Action Button component
const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}> = ({ icon, title, description, onClick, color }) => (
  <button
    onClick={onClick}
    className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left w-full"
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

export const SchoolAdminDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  const { classes } = useAppSelector(state => state.classes);
  
  const [loading, setLoading] = useState(true);

  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Administrator';
  const schoolName = 'Gaborone Secondary School'; // Would come from user profile in a real implementation

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
          dispatch(fetchTeachers()),
          dispatch(fetchClasses())
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [dispatch]);

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.active && s.status === 'ACTIVE').length;
  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter(t => t.active).length;
  const totalClasses = classes.length;
  const attendanceToday = 92; // Mock data - would come from attendance API

  // Mock data for pending items and notifications
  const pendingApprovals = [
    { id: '1', type: 'Teacher Leave Request', requestedBy: 'Moses Moeti', department: 'Science', submittedOn: '2025-04-12', status: 'Pending Review' },
    { id: '2', type: 'Student Enrollment', requestedBy: 'Tebogo Kgosi', department: 'Administration', submittedOn: '2025-04-14', status: 'Pending Review' },
    { id: '3', type: 'Class Schedule Change', requestedBy: 'Sarah Phiri', department: 'Mathematics', submittedOn: '2025-04-15', status: 'Under Review' },
  ];

  const recentNotifications = [
    { id: '1', title: 'Regional Inspection Scheduled', type: 'Official', date: '2025-04-10', priority: 'High' },
    { id: '2', title: 'End of Term Reports Due', type: 'Academic', date: '2025-04-14', priority: 'Medium' },
    { id: '3', title: 'Teacher Professional Development', type: 'Training', date: '2025-04-15', priority: 'Medium' },
    { id: '4', title: 'Budget Approval Granted', type: 'Administrative', date: '2025-04-16', priority: 'Low' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'End of Term Exams', date: '2025-04-25', location: 'All Classrooms', type: 'Academic' },
    { id: '2', title: 'Parent-Teacher Meeting', date: '2025-04-30', location: 'Main Hall', type: 'Meeting' },
    { id: '3', title: 'Inter-School Sports Competition', date: '2025-05-05', location: 'Sports Field', type: 'Sports' },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-teacher':
        window.location.href = '/app/staff';
        break;
      case 'enroll-student':
        window.location.href = '/app/students';
        break;
      case 'create-class':
        window.location.href = '/app/classes';
        break;
      case 'schedule-assessment':
        window.location.href = '/app/assessments';
        break;
      default:
        break;
    }
  };

  const navigateToSection = (section: string) => {
    switch (section) {
      case 'students':
        window.location.href = '/app/students';
        break;
      case 'teachers':
        window.location.href = '/app/staff';
        break;
      case 'classes':
        window.location.href = '/app/classes';
        break;
      case 'reports':
        window.location.href = '/app/reports';
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Welcome Header */}
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
              <p className="text-white font-medium">{attendanceToday}% of students present</p>
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

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={totalStudents.toString()} 
          change={3.5} 
          icon={<Users size={20} />} 
          iconColor="bg-blue-100 text-blue-600"
          onClick={() => navigateToSection('students')}
        />
        <StatCard 
          title="Active Teachers" 
          value={activeTeachers.toString()} 
          change={2.1} 
          icon={<User size={20} />} 
          iconColor="bg-green-100 text-green-600"
          onClick={() => navigateToSection('teachers')}
        />
        <StatCard 
          title="Total Classes" 
          value={totalClasses.toString()} 
          icon={<BookOpen size={20} />} 
          iconColor="bg-purple-100 text-purple-600"
          onClick={() => navigateToSection('classes')}
        />
        <StatCard 
          title="School Performance" 
          value="B+" 
          change={4.2}
          icon={<BarChart3 size={20} />} 
          iconColor="bg-orange-100 text-orange-600"
          onClick={() => navigateToSection('reports')}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<UserPlus size={20} />}
            title="Add Teacher"
            description="Register new teaching staff"
            onClick={() => handleQuickAction('add-teacher')}
            color="bg-blue-100 text-blue-600"
          />
          <QuickActionButton
            icon={<GraduationCap size={20} />}
            title="Enroll Student"
            description="Add new student to school"
            onClick={() => handleQuickAction('enroll-student')}
            color="bg-green-100 text-green-600"
          />
          <QuickActionButton
            icon={<BookOpen size={20} />}
            title="Create Class"
            description="Set up new class structure"
            onClick={() => handleQuickAction('create-class')}
            color="bg-purple-100 text-purple-600"
          />
          <QuickActionButton
            icon={<FileText size={20} />}
            title="Schedule Assessment"
            description="Plan tests and examinations"
            onClick={() => handleQuickAction('schedule-assessment')}
            color="bg-orange-100 text-orange-600"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{approval.type}</p>
                    <p className="text-sm text-gray-600">
                      {approval.requestedBy} • {approval.department}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{approval.submittedOn}</p>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {approval.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <Bell size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentNotifications.slice(0, 4).map((notification) => (
              <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`p-1 rounded-full ${
                  notification.priority === 'High' ? 'bg-red-100' :
                  notification.priority === 'Medium' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    notification.priority === 'High' ? 'bg-red-500' :
                    notification.priority === 'Medium' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500">{notification.type} • {notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <Calendar size={20} className="text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1 rounded-full ${
                  event.type === 'Academic' ? 'bg-blue-100' :
                  event.type === 'Meeting' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    event.type === 'Academic' ? 'bg-blue-500' :
                    event.type === 'Meeting' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                </div>
                <span className="text-xs font-medium text-gray-500">{event.type}</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.date}</p>
              <p className="text-xs text-gray-500">{event.location}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}; 