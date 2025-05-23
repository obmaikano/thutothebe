import React, { useState } from 'react';
import { 
  Monitor, Cpu, HardDrive, Wifi, Users, School, 
  BarChart3, Activity, CheckCircle, AlertTriangle, 
  RefreshCw, Settings, Download, Clock, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';

export const SystemOverview: React.FC = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock system health data
  const systemMetrics = {
    status: 'healthy',
    uptime: '99.87%',
    responseTime: '245ms',
    errorRate: '0.13%',
    activeUsers: 12450,
    totalSessions: 85670,
    serverLoad: 45,
    memoryUsage: 68,
    diskUsage: 34,
    networkLatency: 12
  };

  // Mock infrastructure data
  const infrastructure = {
    servers: {
      web: { status: 'healthy', count: 3, load: 45 },
      database: { status: 'healthy', count: 2, load: 62 },
      cache: { status: 'healthy', count: 4, load: 33 },
      storage: { status: 'warning', count: 2, load: 78 }
    },
    databases: {
      primary: { status: 'healthy', connections: 145, queries: 1250 },
      replica: { status: 'healthy', connections: 89, queries: 890 },
      cache: { status: 'healthy', hitRate: 94.5, memory: 2.1 }
    }
  };

  // Mock national statistics
  const nationalStats = {
    totalRegions: 10,
    totalSchools: 1250,
    totalStudents: 485000,
    totalTeachers: 28500,
    systemAdoption: 84.7,
    activeRegions: 10
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={16} className="text-green-600" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'critical': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const refreshData = () => {
    setLastRefresh(new Date());
    // Implementation for refreshing system data
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600 mt-2">Complete system status and infrastructure monitoring</p>
          <p className="text-sm text-gray-500 mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={refreshData} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Link to="/app/settings">
            <Button variant="outline">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </Link>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="System Status"
          value={systemMetrics.status.charAt(0).toUpperCase() + systemMetrics.status.slice(1)}
          icon={systemMetrics.status === 'healthy' ? CheckCircle : AlertTriangle}
          iconColor={systemMetrics.status === 'healthy' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
        />
        <StatCard
          title="Uptime"
          value={systemMetrics.uptime}
          icon={Clock}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Response Time"
          value={systemMetrics.responseTime}
          icon={Activity}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Error Rate"
          value={systemMetrics.errorRate}
          icon={AlertTriangle}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Active Users"
          value={systemMetrics.activeUsers.toLocaleString()}
          icon={Users}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Total Sessions"
          value={systemMetrics.totalSessions.toLocaleString()}
          icon={Globe}
          iconColor="bg-pink-100 text-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Infrastructure Status */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Infrastructure Status</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor('healthy')}`}>
              {getStatusIcon('healthy')}
              <span className="ml-1">All Systems Operational</span>
            </span>
          </div>
          <div className="space-y-4">
            {Object.entries(infrastructure.servers).map(([name, server]) => (
              <div key={name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Monitor size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 capitalize">{name} Servers</h3>
                    <p className="text-sm text-gray-500">{server.count} instances</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{server.load}% load</p>
                    <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                      <div 
                        className={`h-full rounded-full ${
                          server.load < 50 ? 'bg-green-500' :
                          server.load < 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${server.load}%` }}
                      />
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* National Education Statistics */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">National Education Statistics</h2>
            <Link to="/app/regions">
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Globe size={20} className="text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Active Regions</p>
                    <p className="text-xl font-bold text-blue-900">{nationalStats.activeRegions}/{nationalStats.totalRegions}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <School size={20} className="text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Total Schools</p>
                    <p className="text-xl font-bold text-green-900">{nationalStats.totalSchools.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Users size={20} className="text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-purple-800">Total Students</p>
                    <p className="text-xl font-bold text-purple-900">{nationalStats.totalStudents.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Users size={20} className="text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Total Teachers</p>
                    <p className="text-xl font-bold text-yellow-900">{nationalStats.totalTeachers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">System Adoption Rate</span>
                <span className="text-sm font-bold text-gray-900">{nationalStats.systemAdoption}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${nationalStats.systemAdoption}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Resource Usage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemMetrics.serverLoad / 100)}`}
                  className="text-blue-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                {systemMetrics.serverLoad}%
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Cpu size={16} className="text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">CPU Usage</h3>
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemMetrics.memoryUsage / 100)}`}
                  className="text-green-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                {systemMetrics.memoryUsage}%
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Monitor size={16} className="text-green-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Memory Usage</h3>
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemMetrics.diskUsage / 100)}`}
                  className="text-purple-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                {systemMetrics.diskUsage}%
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              <HardDrive size={16} className="text-purple-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Disk Usage</h3>
            </div>
          </div>

          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - systemMetrics.networkLatency / 100)}`}
                  className="text-yellow-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                {systemMetrics.networkLatency}ms
              </span>
            </div>
            <div className="flex items-center justify-center mb-2">
              <Wifi size={16} className="text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Network Latency</h3>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/monitoring"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Activity size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">System Monitoring</p>
                <p className="text-sm text-gray-500">Real-time monitoring</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/reports"
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Generate Reports</p>
                <p className="text-sm text-gray-500">System reports</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/analytics"
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Analytics Dashboard</p>
                <p className="text-sm text-gray-500">System analytics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/settings"
            className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Settings size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">System Settings</p>
                <p className="text-sm text-gray-500">Configure system</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}; 