import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  School, Users, AlertTriangle, Calendar, BookOpen, 
  Building, BarChart3, FileText, Settings, PlusCircle,
  UserPlus, School as SchoolIcon, Map, Shield, BookOpen as BookIcon,
  FileCheck, BarChart2, Activity, Eye
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchDepartments } from '../../departments/departmentsSlice';
import { fetchRegions } from '../../regions/regionsSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { StatCard } from '../../../components/ui/stat-card';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { subjects } = useAppSelector(state => state.subjects);
  const { departments } = useAppSelector(state => state.departments);
  const { regions } = useAppSelector(state => state.regions);
  const { schools } = useAppSelector(state => state.schools);
  const { students } = useAppSelector(state => state.students);
  
  const [loading, setLoading] = useState(true);
  
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Super Admin';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          dispatch(fetchSubjects()),
          dispatch(fetchDepartments()),
          dispatch(fetchRegions()),
          dispatch(fetchSchools()),
          dispatch(fetchStudents())
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
  const systemMetrics = {
    totalSchools: schools.length,
    totalUsers: students.length, // This would include all users in a real implementation
    totalRegions: regions.length,
    totalSubjects: subjects.length,
    totalDepartments: departments.length,
    activeSubjects: subjects.filter(s => s.active).length,
    activeSchools: schools.filter(s => s.active).length,
    activeStudents: students.filter(s => s.active).length,
    systemHealth: 98.5, // This would come from monitoring API
    storageUsage: 65,
    cpuUsage: 45,
    memoryUsage: 60
  };

  // Group schools by region for regional statistics
  const regionalStats = regions.map(region => {
    const regionSchools = schools.filter(school => school.regionId === region.id);
    const regionStudents = students.filter(student => 
      regionSchools.some(school => school.id === student.schoolId)
    );
    
    return {
      region: region.name,
      schools: regionSchools.length,
      students: regionStudents.length,
      performance: Math.floor(Math.random() * 30) + 60 // This would come from analytics API
    };
  });

  const recentActivity = [
    { id: '1', user: 'System', action: 'loaded', item: `${subjects.length} subjects`, time: 'Just now', role: 'System' },
    { id: '2', user: 'System', action: 'loaded', item: `${schools.length} schools`, time: 'Just now', role: 'System' },
    { id: '3', user: 'System', action: 'loaded', item: `${students.length} students`, time: 'Just now', role: 'System' },
    { id: '4', user: 'System', action: 'loaded', item: `${departments.length} departments`, time: 'Just now', role: 'System' },
  ];

  const systemAlerts = [
    { id: '1', type: 'info', message: `${systemMetrics.activeSubjects} active subjects in the system`, time: 'Current' },
    { id: '2', type: 'info', message: `${systemMetrics.activeSchools} active schools registered`, time: 'Current' },
    { id: '3', type: 'info', message: `${systemMetrics.activeStudents} active students enrolled`, time: 'Current' },
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">National Education System Administration</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Schools</p>
              <p className="text-white font-medium">{systemMetrics.totalSchools}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Total Students</p>
              <p className="text-white font-medium">{systemMetrics.totalUsers.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <Building size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Regions</p>
              <p className="text-white font-medium">{systemMetrics.totalRegions}</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Subjects</p>
              <p className="text-white font-medium">{systemMetrics.totalSubjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.activeSubjects}</div>
              <div className="text-sm text-gray-500">Active Subjects</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Building size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.totalDepartments}</div>
              <div className="text-sm text-gray-500">Departments</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <School size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.activeSchools}</div>
              <div className="text-sm text-gray-500">Active Schools</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Users size={20} className="text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{systemMetrics.activeStudents}</div>
              <div className="text-sm text-gray-500">Active Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/subjects" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Subjects</p>
              <p className="text-sm text-gray-500">Add and configure subjects</p>
            </div>
          </div>
        </Link>
        <Link to="/app/departments" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Building size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Departments</p>
              <p className="text-sm text-gray-500">Configure departments</p>
            </div>
          </div>
        </Link>
        <Link to="/app/schools" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <SchoolIcon size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Schools</p>
              <p className="text-sm text-gray-500">Add and configure schools</p>
            </div>
          </div>
        </Link>
        <Link to="/app/regions" className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Map size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Regions</p>
              <p className="text-sm text-gray-500">Configure regional offices</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Statistics */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Regional Statistics</h2>
            <Link to="/app/regions" className="text-sm text-blue-600 hover:underline">View all regions</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schools
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalStats.map((stat) => (
                  <tr key={stat.region}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stat.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.schools}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stat.students.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className={`mr-2 ${
                          stat.performance >= 75 ? 'text-green-600' :
                          stat.performance >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.performance}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              stat.performance >= 75 ? 'bg-green-500' :
                              stat.performance >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${stat.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Activity */}
        <Card>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent System Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity size={16} className="text-blue-600" />
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
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">System Status</h2>
          <Link to="/app/monitoring" className="text-sm text-blue-600 hover:underline">View monitoring</Link>
        </div>
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
              alert.type === 'error' ? 'bg-red-50 border-red-400' :
              alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {alert.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-400" />}
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400" />}
                  {alert.type === 'info' && <Activity className="h-5 w-5 text-blue-400" />}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    alert.type === 'error' ? 'text-red-800' :
                    alert.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {alert.message}
                  </p>
                  <p className={`text-xs mt-1 ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {alert.time}
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

export default SuperAdminDashboard; 