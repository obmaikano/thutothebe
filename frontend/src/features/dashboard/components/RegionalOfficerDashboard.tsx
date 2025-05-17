import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, School, FileCheck, Map, 
  Calendar, ClipboardCheck, CheckCircle, 
  Clock, FileText, ChevronRight, Search 
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
    className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${onClick ? 'cursor-pointer hover:border-blue-200 transition-colors' : ''}`}
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
  variant?: 'primary' | 'outline' | 'success', 
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
    success: 'bg-green-600 text-white hover:bg-green-700'
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

export const RegionalOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const officerName = user ? `${user.firstName} ${user.lastName}` : 'Officer';
  const region = 'Gaborone'; // Would come from user profile in a real implementation

  // Mock data for regional officer dashboard
  const scheduledVisits = [
    { id: '1', school: 'Gaborone Secondary School', date: '2025-04-20', time: '09:00 AM', purpose: 'Regular Inspection', status: 'Scheduled' },
    { id: '2', school: 'Phakalane Primary School', date: '2025-04-22', time: '11:00 AM', purpose: 'Follow-up Assessment', status: 'Scheduled' },
    { id: '3', school: 'Block 8 Primary School', date: '2025-04-25', time: '10:30 AM', purpose: 'Teacher Assessment', status: 'Scheduled' },
  ];

  const completedVisits = [
    { id: '4', school: 'Ledumang Senior Secondary', date: '2025-04-10', purpose: 'Infrastructure Review', status: 'Completed', report: 'Submitted' },
    { id: '5', school: 'Broadhurst Primary School', date: '2025-04-15', purpose: 'Educational Quality Check', status: 'Completed', report: 'Pending' },
  ];

  const pendingReports = [
    { id: '1', school: 'Broadhurst Primary School', visitDate: '2025-04-15', dueDate: '2025-04-22', status: 'Pending' },
    { id: '2', school: 'Maru-a-Pula School', visitDate: '2025-04-08', dueDate: '2025-04-15', status: 'Overdue' },
  ];

  const assessmentMetrics = [
    { id: '1', metric: 'Classroom Management', schools: 5, averageScore: 3.8, maxScore: 5 },
    { id: '2', metric: 'Teaching Quality', schools: 5, averageScore: 4.1, maxScore: 5 },
    { id: '3', metric: 'Student Engagement', schools: 5, averageScore: 3.6, maxScore: 5 },
    { id: '4', metric: 'Resource Utilization', schools: 5, averageScore: 3.2, maxScore: 5 },
    { id: '5', metric: 'Infrastructure Condition', schools: 5, averageScore: 3.5, maxScore: 5 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {officerName}!</h1>
        <p className="text-blue-100 mb-4">{region} Region - Education Officer Portal</p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for schools, visits, or reports..."
            className="w-full bg-white rounded-lg pl-10 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <School size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Scheduled Visits</p>
              <p className="text-white font-medium">{scheduledVisits.length} upcoming</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Reports Due</p>
              <p className="text-white font-medium">{pendingReports.length} pending</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Completed This Month</p>
              <p className="text-white font-medium">{completedVisits.length} school visits</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Today's Visits" 
          value="0" 
          icon={<Calendar size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="This Week" 
          value="3" 
          icon={<School size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Reports Due" 
          value="2" 
          icon={<FileText size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduled School Visits */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Scheduled School Visits</h2>
            <Link to="/app/visits/schedule" className="text-sm text-blue-600 hover:underline">Schedule New Visit</Link>
          </div>
          {scheduledVisits.length > 0 ? (
            <div className="space-y-4">
              {scheduledVisits.map(visit => (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{visit.school}</h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {visit.purpose}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span>{new Date(visit.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-gray-500" />
                      <span>{visit.time}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="primary" className="flex-1">Prepare Checklist</Button>
                    <Button size="sm" variant="outline" className="flex-1">View School Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Reschedule</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No scheduled visits for now.</p>
              <Button size="sm" className="mt-4" leftIcon={<Calendar size={14} />}>Schedule a Visit</Button>
            </div>
          )}
        </Card>

        {/* Assessment Reports */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Reports Due</h2>
            <Link to="/app/reports" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {pendingReports.map(report => (
              <div 
                key={report.id} 
                className={`p-3 rounded-lg border ${
                  report.status === 'Overdue' 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-medium text-sm">{report.school}</h3>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <Calendar size={12} className="mr-1 text-gray-500" />
                  <span>Visit Date: {new Date(report.visitDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-600">Due: {new Date(report.dueDate).toLocaleDateString()}</span>
                  <span className={`text-xs ${
                    report.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-blue-600'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <Button size="sm" fullWidth className="mt-3" variant="primary">
                  Complete Report
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Completed Visits</h2>
              <Link to="/app/visits/completed" className="text-sm text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {completedVisits.map(visit => (
                <div key={visit.id} className="p-3 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-sm">{visit.school}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-600">{new Date(visit.date).toLocaleDateString()}</span>
                    <span className={`text-xs ${
                      visit.report === 'Submitted' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      Report: {visit.report}
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    {visit.report === 'Submitted' ? (
                      <Button size="sm" fullWidth variant="outline">View Report</Button>
                    ) : (
                      <Button size="sm" fullWidth variant="primary">Complete Report</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Assessment Metrics */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Assessment Metrics</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>Last 30 Days</option>
                <option>Last Quarter</option>
                <option>This Academic Year</option>
              </select>
              <Button size="sm" variant="outline">Generate Report</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment Area
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schools Assessed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assessmentMetrics.map((metric) => (
                  <tr key={metric.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric.metric}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.schools}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.averageScore}/{metric.maxScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            (metric.averageScore / metric.maxScore) > 0.8 ? 'bg-green-600' :
                            (metric.averageScore / metric.maxScore) > 0.6 ? 'bg-blue-600' :
                            (metric.averageScore / metric.maxScore) > 0.4 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${(metric.averageScore / metric.maxScore) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <Link to={`/app/assessments/${metric.id}`} className="flex items-center">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Map */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Region Map</h2>
            <Button size="sm" variant="outline" leftIcon={<Map size={16} />}>Full Map View</Button>
          </div>
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Map size={48} className="mx-auto mb-2 text-gray-400" />
              <p>Interactive region map with school locations</p>
              <p className="text-sm">Click to view in full screen</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">28</p>
              <p className="text-xs text-gray-600">Primary</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">15</p>
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">2</p>
              <p className="text-xs text-gray-600">Special</p>
            </div>
          </div>
        </Card>

        {/* Quick Tools */}
        <Card>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Tools</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/app/visits/schedule" className="p-4 border border-blue-100 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex flex-col items-center text-center">
                <Calendar size={32} className="text-blue-600 mb-2" />
                <p className="font-medium text-gray-800">Schedule Visit</p>
                <p className="text-sm text-gray-600">Plan your school visits</p>
              </div>
            </Link>
            <Link to="/app/reports/new" className="p-4 border border-green-100 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex flex-col items-center text-center">
                <FileText size={32} className="text-green-600 mb-2" />
                <p className="font-medium text-gray-800">New Report</p>
                <p className="text-sm text-gray-600">Create assessment report</p>
              </div>
            </Link>
            <Link to="/app/checklists" className="p-4 border border-purple-100 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex flex-col items-center text-center">
                <ClipboardCheck size={32} className="text-purple-600 mb-2" />
                <p className="font-medium text-gray-800">Checklists</p>
                <p className="text-sm text-gray-600">Assessment templates</p>
              </div>
            </Link>
            <Link to="/app/metrics" className="p-4 border border-orange-100 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div className="flex flex-col items-center text-center">
                <FileCheck size={32} className="text-orange-600 mb-2" />
                <p className="font-medium text-gray-800">Metrics</p>
                <p className="text-sm text-gray-600">View assessment data</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegionalOfficerDashboard; 