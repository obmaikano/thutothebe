import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Users, School, 
  BookOpen, Target, Activity, Calendar, Download, 
  Filter, RefreshCw, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';

export const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Mock analytics data
  const overviewMetrics = {
    totalUsers: 45850,
    activeUsers: 38250,
    totalSessions: 125430,
    avgSessionDuration: '24m 32s',
    bounceRate: 12.4,
    completionRate: 87.6,
    userGrowth: 8.5,
    sessionGrowth: 12.3
  };

  // Mock performance metrics
  const performanceMetrics = [
    { metric: 'Academic Performance', current: 73.2, previous: 71.8, trend: 'up', change: 1.4 },
    { metric: 'System Adoption', current: 84.7, previous: 82.1, trend: 'up', change: 2.6 },
    { metric: 'Content Completion', current: 78.9, previous: 76.2, trend: 'up', change: 2.7 },
    { metric: 'Assignment Submission', current: 91.2, previous: 89.8, trend: 'up', change: 1.4 },
    { metric: 'Teacher Engagement', current: 89.4, previous: 91.2, trend: 'down', change: -1.8 },
    { metric: 'Student Retention', current: 94.3, previous: 93.8, trend: 'up', change: 0.5 }
  ];

  // Mock regional analytics
  const regionalAnalytics = [
    { region: 'Gaborone', users: 8450, sessions: 25670, avgDuration: '28m', performance: 78.5 },
    { region: 'Francistown', users: 6850, sessions: 19890, avgDuration: '25m', performance: 75.8 },
    { region: 'Molepolole', users: 5420, sessions: 16200, avgDuration: '23m', performance: 71.4 },
    { region: 'Maun', users: 4230, sessions: 12680, avgDuration: '22m', performance: 69.2 },
    { region: 'Kanye', users: 3890, sessions: 11450, avgDuration: '21m', performance: 70.8 }
  ];

  // Mock trending data
  const trendingTopics = [
    { topic: 'Mathematics Grade 10', views: 12450, engagement: 89.2, growth: 15.3 },
    { topic: 'English Literature', views: 9890, engagement: 85.7, growth: 12.8 },
    { topic: 'Setswana Grammar', views: 8920, engagement: 91.4, growth: 8.5 },
    { topic: 'Science Experiments', views: 7680, engagement: 87.9, growth: 18.2 },
    { topic: 'History of Botswana', views: 6540, engagement: 83.6, growth: 6.7 }
  ];

  const exportData = (dataType: string) => {
    console.log(`Exporting ${dataType} analytics data...`);
    // Implementation for export functionality
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive educational analytics and performance insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Regions</option>
            <option value="gaborone">Gaborone</option>
            <option value="francistown">Francistown</option>
            <option value="molepolole">Molepolole</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={overviewMetrics.totalUsers.toLocaleString()}
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
          change={overviewMetrics.userGrowth}
        />
        <StatCard
          title="Active Users"
          value={overviewMetrics.activeUsers.toLocaleString()}
          icon={Activity}
          iconColor="bg-green-100 text-green-600"
          change={parseFloat(((overviewMetrics.activeUsers / overviewMetrics.totalUsers) * 100).toFixed(1))}
        />
        <StatCard
          title="Total Sessions"
          value={overviewMetrics.totalSessions.toLocaleString()}
          icon={BarChart3}
          iconColor="bg-purple-100 text-purple-600"
          change={overviewMetrics.sessionGrowth}
        />
        <StatCard
          title="Avg Session Duration"
          value={overviewMetrics.avgSessionDuration}
          icon={Calendar}
          iconColor="bg-yellow-100 text-yellow-600"
          change={overviewMetrics.completionRate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
            <Button onClick={() => exportData('performance')} variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{metric.metric}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.current}%</span>
                    <div className={`flex items-center ml-3 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? (
                        <ArrowUpRight size={16} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={16} className="mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {metric.trend === 'up' ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-24">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-full rounded-full ${
                        metric.current >= 80 ? 'bg-green-500' :
                        metric.current >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.current}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trending Topics */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Trending Content</h2>
            <Button variant="outline" size="sm">
              <Eye size={16} className="mr-2" />
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{topic.topic}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    topic.growth > 10 ? 'bg-green-100 text-green-800' :
                    topic.growth > 5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    +{topic.growth}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{topic.views.toLocaleString()} views</span>
                  <span>{topic.engagement}% engagement</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Regional Analytics */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Regional Analytics</h2>
          <Button onClick={() => exportData('regional')} variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Users
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionalAnalytics.map((region, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {region.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.users.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.sessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.avgDuration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className={`mr-2 ${
                        region.performance >= 75 ? 'text-green-600' :
                        region.performance >= 65 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {region.performance}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            region.performance >= 75 ? 'bg-green-500' :
                            region.performance >= 65 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${region.performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      to={`/app/analytics/region/${region.region.toLowerCase()}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/reports"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate Reports</p>
                <p className="text-sm text-gray-500">Create detailed reports</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/monitoring"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Real-time Monitor</p>
                <p className="text-sm text-gray-500">Live system monitoring</p>
              </div>
            </div>
          </Link>
          
          <button 
            onClick={() => exportData('comprehensive')}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Download size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Export All Data</p>
                <p className="text-sm text-gray-500">Comprehensive export</p>
              </div>
            </div>
          </button>
          
          <Link 
            to="/app/regions"
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <School size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Regional Overview</p>
                <p className="text-sm text-gray-500">View by region</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}; 