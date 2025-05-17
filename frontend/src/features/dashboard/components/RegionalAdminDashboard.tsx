import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, FileCheck, AlertTriangle, 
  Building, BookOpen, GraduationCap, BarChart3,
  Mail, CheckCircle, Calendar
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

export const RegionalAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const adminName = user ? `${user.firstName} ${user.lastName}` : 'Administrator';
  const region = 'Gaborone'; // Would come from user profile in a real implementation

  // Mock data for regional admin dashboard
  const schoolStats = {
    totalSchools: 45,
    primarySchools: 28,
    secondarySchools: 15,
    specialEducation: 2,
    underPerformingSchools: 6,
    teacherCount: 850,
    studentCount: 12500,
    averageAttendance: 88
  };

  const pendingRequests = [
    { id: '1', title: 'Teacher Transfer Request', school: 'Gaborone Secondary School', submittedBy: 'John Morapedi', submittedOn: '2025-04-10', priority: 'High' },
    { id: '2', title: 'Additional Resource Allocation', school: 'Phakalane Primary School', submittedBy: 'Sarah Kgosi', submittedOn: '2025-04-12', priority: 'Medium' },
    { id: '3', title: 'School Maintenance Request', school: 'Block 8 Primary School', submittedBy: 'David Tshane', submittedOn: '2025-04-15', priority: 'High' },
  ];

  const schoolPerformance = [
    { id: '1', name: 'Gaborone Secondary School', level: 'Secondary', enrollmentRate: 95, attendanceRate: 92, academicPerformance: 85, status: 'Excellent' },
    { id: '2', name: 'Phakalane Primary School', level: 'Primary', enrollmentRate: 92, attendanceRate: 90, academicPerformance: 82, status: 'Good' },
    { id: '3', name: 'Block 8 Primary School', level: 'Primary', enrollmentRate: 88, attendanceRate: 85, academicPerformance: 78, status: 'Good' },
    { id: '4', name: 'Ledumang Senior Secondary', level: 'Secondary', enrollmentRate: 91, attendanceRate: 87, academicPerformance: 80, status: 'Good' },
    { id: '5', name: 'Broadhurst Primary School', level: 'Primary', enrollmentRate: 84, attendanceRate: 80, academicPerformance: 72, status: 'Fair' },
  ];

  const upcomingEvents = [
    { id: '1', title: 'Regional School Heads Meeting', date: '2025-04-20', location: 'Regional Education Office', type: 'Meeting' },
    { id: '2', title: 'Teacher Professional Development Day', date: '2025-04-25', location: 'Gaborone Conference Center', type: 'Training' },
    { id: '3', title: 'Regional Academic Excellence Awards', date: '2025-05-05', location: 'Gaborone Secondary School', type: 'Event' },
    { id: '4', title: 'School Inspection - Block 8 Primary', date: '2025-05-10', location: 'Block 8 Primary School', type: 'Inspection' },
  ];

  const alertIssues = [
    { id: '1', title: 'Teacher Shortage', school: 'Broadhurst Primary School', severity: 'High', reportedOn: '2025-04-08', status: 'Unresolved' },
    { id: '2', title: 'Infrastructure Maintenance', school: 'Ledumang Senior Secondary', severity: 'Medium', reportedOn: '2025-04-12', status: 'In Progress' }
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {adminName}!</h1>
        <p className="text-blue-100 mb-4">{region} Region - Education Administration Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Schools</p>
              <p className="text-white font-medium">{schoolStats.totalSchools} in the region</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Attention Required</p>
              <p className="text-white font-medium">{alertIssues.length} issues pending</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Schools" 
          value={schoolStats.totalSchools.toString()} 
          change={2.2} 
          icon={<School size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Teachers" 
          value={schoolStats.teacherCount.toString()} 
          change={3.5} 
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Students" 
          value={schoolStats.studentCount.toLocaleString()} 
          change={1.8}
          icon={<GraduationCap size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
        <StatCard 
          title="Avg. Attendance" 
          value={`${schoolStats.averageAttendance}%`} 
          change={0.5}
          icon={<FileCheck size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">School Performance</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>All Schools</option>
                <option>Primary Schools</option>
                <option>Secondary Schools</option>
                <option>Special Education</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<BarChart3 size={16} />}>Full Report</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schoolPerformance.map((school) => (
                  <tr key={school.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/app/schools/${school.id}`} className="hover:text-blue-600">
                        {school.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.enrollmentRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {school.attendanceRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        school.status === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        school.status === 'Good' ? 'bg-blue-100 text-blue-800' : 
                        school.status === 'Fair' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {school.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700">
            Showing 5 of {schoolStats.totalSchools} schools. 
            <Link to="/app/schools" className="text-blue-600 hover:underline ml-1">
              View all schools
            </Link>
          </div>
        </Card>

        {/* Upcoming Events & Alerts */}
        <Card className="col-span-1">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Upcoming Events</h2>
              <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">View calendar</Link>
            </div>
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map(event => (
                <div key={event.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Calendar size={14} className="mr-1 text-gray-500" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Alert Issues</h2>
              <Link to="/app/issues" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {alertIssues.map(issue => (
                <div 
                  key={issue.id} 
                  className={`p-3 rounded-lg border ${
                    issue.severity === 'High' && issue.status === 'Unresolved' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm">{issue.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      issue.severity === 'High' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{issue.school}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Reported: {new Date(issue.reportedOn).toLocaleDateString()}</span>
                    <span className={`text-xs ${
                      issue.status === 'Unresolved' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Requests</h2>
            <Link to="/app/requests" className="text-sm text-blue-600 hover:underline">View all requests</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map(request => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.school}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.submittedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" leftIcon={<CheckCircle size={14} />}>Approve</Button>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Resource Distribution */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Resource Distribution</h2>
            <Link to="/app/resources" className="text-sm text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Teachers per School</span>
                <span className="text-sm text-gray-600">Average: 18.9</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimum: 14</span>
                <span>Maximum: 26</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Student-Teacher Ratio</span>
                <span className="text-sm text-gray-600">Average: 14.7:1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lowest: 12:1</span>
                <span>Highest: 18:1</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Technology Resources</span>
                <span className="text-sm text-gray-600">Meeting Target: 65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Needs Improvement: 35%</span>
                <span>Excellent: 40%</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button fullWidth variant="outline" leftIcon={<BarChart3 size={16} />}>Resource Allocation Report</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegionalAdminDashboard; 