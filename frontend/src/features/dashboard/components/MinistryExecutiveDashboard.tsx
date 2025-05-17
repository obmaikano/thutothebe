import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, PieChart, Users, School, 
  GraduationCap, Map, AlertTriangle, 
  TrendingUp, TrendingDown, FileBarChart
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

export const MinistryExecutiveDashboard: React.FC = () => {
  const { user } = useAuth();
  const executiveName = user ? `${user.firstName} ${user.lastName}` : 'Executive';

  // Mock data for ministry executive dashboard
  const nationalStats = {
    enrollment: 452800,
    graduationRate: 78,
    teacherCount: 24500,
    schoolCount: 1250,
    yearOverYearGrowth: 3.2
  };

  const regionalPerformance = [
    { region: 'Gaborone', enrollmentRate: 94, completionRate: 82, teacherRatio: 1.24, performance: 80 },
    { region: 'Francistown', enrollmentRate: 91, completionRate: 78, teacherRatio: 1.18, performance: 75 },
    { region: 'Molepolole', enrollmentRate: 88, completionRate: 72, teacherRatio: 0.95, performance: 68 },
    { region: 'Maun', enrollmentRate: 85, completionRate: 70, teacherRatio: 0.92, performance: 65 },
    { region: 'Serowe', enrollmentRate: 87, completionRate: 74, teacherRatio: 0.98, performance: 70 },
  ];

  const policyMetrics = [
    { id: '1', name: 'Digital Learning Initiative', progress: 65, status: 'On Track', lastUpdate: '5 days ago' },
    { id: '2', name: 'Teacher Development Program', progress: 48, status: 'At Risk', lastUpdate: '2 days ago' },
    { id: '3', name: 'Inclusive Education Framework', progress: 72, status: 'On Track', lastUpdate: '1 week ago' },
    { id: '4', name: 'STEM Curriculum Enhancement', progress: 35, status: 'Delayed', lastUpdate: '3 days ago' },
  ];

  const alerts = [
    { id: '1', type: 'warning', title: 'Declining Enrollment', region: 'Kgalagadi', message: 'Enrollment rates down 5% in the past quarter', time: '2 days ago' },
    { id: '2', type: 'alert', title: 'Teacher Shortage', region: 'North East', message: 'Critical shortage of math and science teachers', time: '1 week ago' },
    { id: '3', type: 'info', title: 'Budget Allocation', message: 'Q3 budget allocation complete for all regions', time: '3 days ago' },
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl p-6 shadow-md mb-6">
        <h1 className="text-2xl text-white font-bold mb-2">Welcome back, {executiveName}!</h1>
        <p className="text-blue-100 mb-4">National Education Performance Dashboard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">National Enrollment</p>
              <p className="text-white font-medium">{nationalStats.enrollment.toLocaleString()} students</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <GraduationCap size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Graduation Rate</p>
              <p className="text-white font-medium">{nationalStats.graduationRate}%</p>
            </div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center">
            <div className="bg-white p-2 rounded-full mr-3">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-white text-opacity-90 text-sm">Critical Alerts</p>
              <p className="text-white font-medium">2 requiring attention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Students" 
          value={nationalStats.enrollment.toLocaleString()} 
          change={nationalStats.yearOverYearGrowth} 
          icon={<Users size={20} />} 
          iconColor="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Total Teachers" 
          value={nationalStats.teacherCount.toLocaleString()} 
          change={1.8} 
          icon={<Users size={20} />} 
          iconColor="bg-green-100 text-green-600" 
        />
        <StatCard 
          title="Total Schools" 
          value={nationalStats.schoolCount.toLocaleString()} 
          change={0.5}
          icon={<School size={20} />} 
          iconColor="bg-orange-100 text-orange-600" 
        />
        <StatCard 
          title="Avg. Completion Rate" 
          value="75%" 
          change={2.1}
          icon={<GraduationCap size={20} />} 
          iconColor="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regional Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Regional Performance Overview</h2>
            <Link to="/app/reports/regions" className="text-sm text-blue-600 hover:underline">View detailed report</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher Ratio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionalPerformance.map((region, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.enrollmentRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.completionRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.teacherRatio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              region.performance >= 75 ? 'bg-green-600' : 
                              region.performance >= 65 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${region.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">{region.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Key Metrics & Alerts */}
        <Card className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Critical Alerts</h2>
            <Link to="/app/alerts" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg border ${
                  alert.type === 'alert' ? 'border-red-200 bg-red-50' : 
                  alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : 
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${
                    alert.type === 'alert' ? 'bg-red-100 text-red-700' : 
                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alert.title}</p>
                    {alert.region && (
                      <p className="text-xs text-gray-600">Region: {alert.region}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Policy Implementation Tracking */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Policy Implementation Tracking</h2>
            <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
              <option>All Policies</option>
              <option>In Progress</option>
              <option>At Risk</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="space-y-4">
            {policyMetrics.map(policy => (
              <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">{policy.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    policy.status === 'On Track' ? 'bg-green-100 text-green-800' : 
                    policy.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {policy.status}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Implementation Progress</span>
                    <span>{policy.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${
                        policy.status === 'On Track' ? 'bg-green-600' : 
                        policy.status === 'At Risk' ? 'bg-yellow-600' : 
                        'bg-red-600'
                      }`}
                      style={{ width: `${policy.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">Last updated: {policy.lastUpdate}</span>
                  <Link to={`/app/policies/${policy.id}`} className="text-xs text-blue-600 hover:underline">View details</Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Metrics */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Education Metrics</h2>
            <div className="flex space-x-2">
              <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                <option>This Academic Year</option>
                <option>Previous Year</option>
                <option>5-Year Trend</option>
              </select>
              <Button size="sm" variant="outline" leftIcon={<FileBarChart size={16} />}>Export</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Enrollment by Gender</h3>
              <div className="flex items-center justify-center h-52 text-center text-gray-400">
                [Pie Chart Visualization]
              </div>
              <div className="flex justify-center mt-2 space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Male (48%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                  <span>Female (52%)</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">STEM vs Non-STEM Graduates</h3>
              <div className="flex items-center justify-center h-52 text-center text-gray-400">
                [Pie Chart Visualization]
              </div>
              <div className="flex justify-center mt-2 space-x-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span>STEM (35%)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                  <span>Non-STEM (65%)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Strategic Indicators */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Strategic Indicators</h2>
            <Button size="sm" variant="outline" leftIcon={<Map size={16} />}>View Map</Button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">National Dropout Rates</h3>
                <span className="text-sm font-medium text-red-600">-2.1% YoY</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Primary Level</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">3.2%</span>
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Secondary Level</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">7.8%</span>
                    <TrendingDown className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tertiary Level</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">12.4%</span>
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-700">Teacher Qualification Levels</h3>
                <span className="text-sm font-medium text-green-600">+5.3% YoY</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Diploma Holders</span>
                  <span className="text-sm font-medium text-gray-900">28.5%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bachelor's Degree</span>
                  <span className="text-sm font-medium text-gray-900">58.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Master's or Higher</span>
                  <span className="text-sm font-medium text-gray-900">13.3%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MinistryExecutiveDashboard; 