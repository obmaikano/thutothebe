import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, ClipboardList, 
  AlertTriangle, Check, X, 
  Flag, ChevronRight, BarChart3, 
  Building, FileCheck
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

export const DirectorDashboard: React.FC = () => {
  const { user } = useAuth();
  const directorName = user ? `${user.firstName} ${user.lastName}` : 'Director';

  // Mock data for director dashboard
  const pendingApprovals = [
    { id: '1', type: 'New School', name: 'Phakalane Primary School', region: 'Gaborone', dateSubmitted: '2025-04-10', status: 'Pending Review' },
    { id: '2', type: 'Policy Change', name: 'Updated Teacher Evaluation Criteria', region: 'National', dateSubmitted: '2025-04-12', status: 'Pending Review' },
    { id: '3', type: 'Budget Amendment', name: 'Increase STEM Resources Allocation', region: 'Multiple', dateSubmitted: '2025-04-15', status: 'Under Review' },
  ];

  const escalatedIssues = [
    { id: '1', title: 'Teacher Shortage Crisis', region: 'Kgalagadi', severity: 'High', reportedBy: 'Regional Admin', dateReported: '2025-04-08', status: 'Unresolved' },
    { id: '2', title: 'School Infrastructure Concerns', region: 'North East', severity: 'Medium', reportedBy: 'School Head', dateReported: '2025-04-11', status: 'In Progress' },
    { id: '3', title: 'Curriculum Implementation Challenges', region: 'Gaborone', severity: 'Medium', reportedBy: 'Department Head', dateReported: '2025-04-14', status: 'In Progress' },
  ];

  const performanceSnapshots = [
    { region: 'Gaborone', enrollmentRate: 94, attendanceRate: 91, teacherAttendance: 96, overallRating: 'Excellent' },
    { region: 'Francistown', enrollmentRate: 91, attendanceRate: 88, teacherAttendance: 94, overallRating: 'Good' },
    { region: 'Molepolole', enrollmentRate: 88, attendanceRate: 84, teacherAttendance: 92, overallRating: 'Good' },
    { region: 'Maun', enrollmentRate: 85, attendanceRate: 82, teacherAttendance: 90, overallRating: 'Satisfactory' },
    { region: 'Serowe', enrollmentRate: 87, attendanceRate: 83, teacherAttendance: 91, overallRating: 'Good' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {directorName}!</h1>
        <p className="text-blue-100 mb-4">Education Director Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <ClipboardList size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Pending Approvals</p>
              <p className="text-white font-medium">{pendingApprovals.length} requiring review</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Escalated Issues</p>
              <p className="text-white font-medium">{escalatedIssues.filter(i => i.status === 'Unresolved').length} unresolved</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <BarChart3 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Overall Performance</p>
              <p className="text-white font-medium">Above target in 3 regions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Schools" 
          value="1,250" 
          change={3.5} 
          icon={<School size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Students" 
          value="452,800" 
          change={2.8} 
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Average Attendance" 
          value="86%" 
          change={1.2}
          icon={<FileCheck size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Regions" 
          value="5" 
          icon={<Building size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Queue */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Approval Queue</h2>
            <Link to="/app/approvals" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2 inline-block">
                      {approval.type}
                    </span>
                    <h3 className="font-medium">{approval.name}</h3>
                  </div>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full h-fit">
                    {approval.status}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Region: {approval.region}</span>
                  <span>Submitted: {new Date(approval.dateSubmitted).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="primary" leftIcon={<Check size={14} />} className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Review Details</Button>
                  <Button size="sm" variant="danger" leftIcon={<X size={14} />} className="flex-1">Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Escalated Issues */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Escalated Issues</h2>
            <Link to="/app/issues" className="text-sm text-blue-600 hover:underline">View all issues</Link>
          </div>
          <div className="space-y-4">
            {escalatedIssues.map(issue => (
              <div 
                key={issue.id} 
                className={`border rounded-lg p-4 ${
                  issue.status === 'Unresolved' && issue.severity === 'High' 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{issue.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    issue.severity === 'High' ? 'bg-red-100 text-red-800' : 
                    issue.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Region: {issue.region}</span>
                  <span>Reported: {new Date(issue.dateReported).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>Reported by: {issue.reportedBy}</span>
                </div>
                <div className="flex justify-between mt-3">
                  <span className={`text-sm ${
                    issue.status === 'Unresolved' ? 'text-red-600' : 
                    issue.status === 'In Progress' ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {issue.status}
                  </span>
                  <Button size="sm" leftIcon={<Flag size={14} />}>Prioritize</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Regional Performance Overview */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Regional Performance Overview</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>Current Term</option>
                <option>Previous Term</option>
                <option>Academic Year</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<BarChart3 size={16} />}>Full Report</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Attendance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher Attendance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceSnapshots.map((region, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.enrollmentRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.attendanceRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.teacherAttendance}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        region.overallRating === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        region.overallRating === 'Good' ? 'bg-blue-100 text-blue-800' : 
                        region.overallRating === 'Satisfactory' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {region.overallRating}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <Link to={`/app/regions/${region.region.toLowerCase()}`} className="flex items-center">
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

export default DirectorDashboard; 