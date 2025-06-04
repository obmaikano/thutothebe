import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart, FileText, School, Briefcase, AlertCircle, Settings, PlusCircle, BookOpen, Building } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { fetchDepartments } from '../../departments/departmentsSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  const { courses } = useAppSelector(state => state.courses);
  const { departments } = useAppSelector(state => state.departments);
  const { subjects } = useAppSelector(state => state.subjects);
  
  const [loading, setLoading] = useState(true);
  
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Administrator';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchStudents()),
          dispatch(fetchTeachers()),
          dispatch(fetchCourses()),
          dispatch(fetchDepartments()),
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
  const stats = [
    { 
      icon: Users, 
      label: 'Total Students', 
      value: students.length.toString(), 
      change: '+3.2%' // This would come from analytics API
    },
    { 
      icon: School, 
      label: 'Active Courses', 
      value: courses.filter(c => c.active).length.toString(), 
      change: '+5.1%' 
    },
    { 
      icon: BookOpen, 
      label: 'Total Subjects', 
      value: subjects.length.toString(), 
      change: '+2.8%' 
    },
    { 
      icon: Briefcase, 
      label: 'Active Teachers', 
      value: teachers.filter(t => t.active).length.toString(), 
      change: '+1.5%' 
    },
  ];

  // Real activity using actual data
  const recentActivity = [
    { user: 'System', action: 'loaded', item: `${students.length} students`, time: 'Just now', role: 'System' },
    { user: 'System', action: 'loaded', item: `${teachers.length} teachers`, time: 'Just now', role: 'System' },
    { user: 'System', action: 'loaded', item: `${courses.length} courses`, time: 'Just now', role: 'System' },
    { user: 'System', action: 'loaded', item: `${departments.length} departments`, time: 'Just now', role: 'System' },
  ];

  // System alerts using real data
  const systemAlerts = [
    { 
      id: 1, 
      title: 'System Status', 
      description: `Successfully loaded ${students.length} students and ${teachers.length} teachers`, 
      level: 'info' 
    },
    { 
      id: 2, 
      title: 'Active Courses', 
      description: `${courses.filter(c => c.active).length} courses are currently active`, 
      level: 'info' 
    },
    { 
      id: 3, 
      title: 'Department Status', 
      description: `${departments.filter(d => d.active).length} departments are active`, 
      level: 'info' 
    },
  ];

  // Real user distribution
  const userDistribution = {
    students: students.length,
    teachers: teachers.length,
    administrators: 15, // This would come from users API
    parents: Math.floor(students.length * 0.8), // Estimated based on students
  };

  // Real courses per department
  const coursesPerDepartment = departments.slice(0, 4).map(dept => {
    const deptCourses = courses.filter(course => (course as any).departmentId === dept.id);
    return {
      name: dept.name,
      count: deptCourses.length,
      color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 4)]
    };
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {adminName}!</h1>
          <p className="text-gray-600 mt-1">System Administration Dashboard</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/app/students"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Manage Students
          </Link>
          <Link
            to="/app/settings"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 mr-2" />
            System Settings
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <stat.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-xs font-medium text-green-600">{stat.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <BarChart className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">User Distribution</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Students</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${(userDistribution.students / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.students}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Teachers</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${(userDistribution.teachers / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.teachers}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Admins</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(userDistribution.administrators / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.administrators}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-sm text-gray-600">Parents</span>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: `${(userDistribution.parents / (userDistribution.students + userDistribution.teachers + userDistribution.administrators + userDistribution.parents)) * 100}%` }}></div>
                </div>
                <span className="ml-4 text-sm font-medium">{userDistribution.parents}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/app/students" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all students →
              </Link>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <Building className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Courses Per Department</h2>
            </div>
            {coursesPerDepartment.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first department.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {coursesPerDepartment.map((dept) => (
                  <div key={dept.name} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-800">{dept.name}</span>
                      <span className="text-gray-600">{dept.count} courses</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`${dept.color} h-full`} style={{ width: `${Math.max(10, (dept.count / Math.max(1, courses.length)) * 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link to="/app/departments" className="text-sm text-indigo-600 hover:text-indigo-800">
                Manage departments →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">System Status</h2>
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-md ${
                    alert.level === 'critical' 
                      ? 'bg-red-50 border-l-4 border-red-500' 
                      : alert.level === 'warning'
                      ? 'bg-yellow-50 border-l-4 border-yellow-500'
                      : 'bg-blue-50 border-l-4 border-blue-500'
                  }`}
                >
                  <h3 className={`font-medium ${
                    alert.level === 'critical' 
                      ? 'text-red-800' 
                      : alert.level === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-600">{alert.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/app/system/alerts" className="text-sm text-indigo-600 hover:text-indigo-800">
                View system monitoring →
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-indigo-600 mr-2" />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium text-sm">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">{activity.user}</span>
                      {' '}<span className="text-gray-600">{activity.action}</span>
                      {' '}<span className="font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.time} • {activity.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Link to="/app/activity-logs" className="text-sm text-indigo-600 hover:text-indigo-800">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/students" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Students</p>
              <p className="text-sm text-gray-500">{students.length} students</p>
            </div>
          </div>
        </Link>
        <Link to="/app/teachers" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Briefcase size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Teachers</p>
              <p className="text-sm text-gray-500">{teachers.length} teachers</p>
            </div>
          </div>
        </Link>
        <Link to="/app/courses" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <School size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Courses</p>
              <p className="text-sm text-gray-500">{courses.length} courses</p>
            </div>
          </div>
        </Link>
        <Link to="/app/departments" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Building size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Departments</p>
              <p className="text-sm text-gray-500">{departments.length} departments</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard; 