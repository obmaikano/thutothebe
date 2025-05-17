import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ClipboardList, FileBarChart, 
  School, Download, Mail, Search, 
  Calendar, AlertTriangle, Map
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
  icon: React.ReactNode, 
  iconColor: string,
  onClick?: () => void 
}> = ({ title, value, icon, iconColor, onClick }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-colors hover:border-blue-200 cursor-pointer"
    onClick={onClick}
  >
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
  className?: string,
  onClick?: () => void
}> = ({ children, variant = 'primary', size = 'md', fullWidth = false, leftIcon, className = '', onClick }) => {
  
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
        ${className}
      `}
      onClick={onClick}
    >
      {leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
    </button>
  );
};

export const MinistryStaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const staffName = user ? `${user.firstName} ${user.lastName}` : 'Staff Member';

  // Mock data
  const pendingReports = [
    { id: '1', title: 'Q3 Regional Performance Summary', requestedBy: 'Director of Policy', dueDate: '2025-04-20', priority: 'High' },
    { id: '2', title: 'Teacher Qualification Analysis', requestedBy: 'Ministry Executive', dueDate: '2025-04-25', priority: 'Medium' },
    { id: '3', title: 'Rural Schools Resource Assessment', requestedBy: 'Regional Coordination', dueDate: '2025-05-05', priority: 'Medium' },
    { id: '4', title: 'Annual Budget Allocation Review', requestedBy: 'Finance Department', dueDate: '2025-05-10', priority: 'Low' },
  ];

  const recentExports = [
    { id: '1', title: 'National Enrollment Statistics', format: 'Excel', generatedDate: '2025-04-10', size: '4.2 MB' },
    { id: '2', title: 'Regional Teacher Distribution', format: 'PDF', generatedDate: '2025-04-08', size: '2.1 MB' },
    { id: '3', title: 'STEM Program Performance', format: 'PowerPoint', generatedDate: '2025-04-05', size: '8.7 MB' },
  ];

  const upcomingMeetings = [
    { id: '1', title: 'Regional Coordination Monthly Meeting', date: '2025-04-18', time: '10:00 AM', location: 'Conference Room A' },
    { id: '2', title: 'Data Quality Review Committee', date: '2025-04-20', time: '2:00 PM', location: 'Virtual Meeting' },
    { id: '3', title: 'Executive Briefing Preparation', date: '2025-04-22', time: '9:30 AM', location: "Director's Office" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {staffName}!</h1>
        <p className="text-blue-100 mb-4">Ministry of Education Staff Portal</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for reports, data, or schools..."
            className="w-full bg-white rounded-lg pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard 
              title="Generate Report" 
              value="New Report" 
              icon={<FileBarChart size={20} />} 
              iconColor="bg-blue-100 text-blue-600" 
            />
            <StatCard 
              title="Export Data" 
              value="Create Export" 
              icon={<Download size={20} />} 
              iconColor="bg-green-100 text-green-600" 
            />
            <StatCard 
              title="School Directory" 
              value="Find School" 
              icon={<School size={20} />} 
              iconColor="bg-orange-100 text-orange-600" 
            />
          </div>
        </div>

        <div>
          <Card>
            <h2 className="text-lg font-bold text-gray-800 mb-3">Work Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-red-100 p-1.5 rounded-lg mr-2">
                    <ClipboardList size={16} className="text-red-600" />
                  </div>
                  <span className="text-sm text-gray-700">Pending Reports</span>
                </div>
                <span className="text-sm font-semibold">{pendingReports.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-1.5 rounded-lg mr-2">
                    <Calendar size={16} className="text-yellow-600" />
                  </div>
                  <span className="text-sm text-gray-700">Upcoming Meetings</span>
                </div>
                <span className="text-sm font-semibold">{upcomingMeetings.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1.5 rounded-lg mr-2">
                    <Mail size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">Unread Messages</span>
                </div>
                <span className="text-sm font-semibold">5</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reports */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Reports</h2>
            <Link to="/app/reports" className="text-sm text-blue-600 hover:underline">View all reports</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
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
                {pendingReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.requestedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        report.priority === 'High' ? 'bg-red-100 text-red-800' : 
                        report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button size="sm">Start Work</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Meetings</h2>
            <Link to="/app/calendar" className="text-sm text-blue-600 hover:underline">View calendar</Link>
          </div>
          <div className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="border border-gray-200 rounded-lg p-3">
                <h3 className="font-medium">{meeting.title}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Calendar size={14} className="mr-1 text-blue-600" />
                  <span>{new Date(meeting.date).toLocaleDateString()} at {meeting.time}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <Map size={14} className="mr-1 text-blue-600" />
                  <span>{meeting.location}</span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" fullWidth variant="outline">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Data Exports */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Data Exports</h2>
            <Link to="/app/data-exports" className="text-sm text-blue-600 hover:underline">All exports</Link>
          </div>
          <div className="space-y-3">
            {recentExports.map(export_ => (
              <div key={export_.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-md mr-3">
                    <FileBarChart size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{export_.title}</h3>
                    <p className="text-xs text-gray-500">Generated on {export_.generatedDate} • {export_.size}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  leftIcon={<Download size={14} />}
                >
                  {export_.format}
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline" leftIcon={<FileBarChart size={16} />}>Generate New Data Export</Button>
          </div>
        </Card>

        {/* Region Coordination */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Regional Coordination</h2>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Gaborone Region</h3>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">45 schools, 850 teachers</p>
              <div className="flex justify-between mt-3">
                <Button size="sm" variant="outline">Contact</Button>
                <Button size="sm">View Dashboard</Button>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200">
              <h3 className="font-medium">Francistown Region</h3>
              <p className="text-sm text-gray-600 mt-1">32 schools, 620 teachers</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Quarterly Report Status</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-yellow-600 h-1.5 rounded-full"
                    style={{ width: `75%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-gray-200">
              <h3 className="font-medium">Maun Region</h3>
              <p className="text-sm text-gray-600 mt-1">25 schools, 480 teachers</p>
              <div className="flex items-center mt-2 text-sm text-yellow-700">
                <AlertTriangle size={14} className="mr-1" />
                <span>Data submission overdue</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button fullWidth variant="outline">View All Regions</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MinistryStaffDashboard; 