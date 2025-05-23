import React, { useState } from 'react';
import { 
  MapPin, Users, School, TrendingUp, TrendingDown, 
  BarChart3, Download, Filter, Eye, Edit, 
  Activity, CheckCircle, AlertTriangle, Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';

export const RegionsOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock data for regional overview
  const nationalStats = {
    totalRegions: 10,
    totalSchools: 1250,
    totalStudents: 485000,
    totalTeachers: 28500,
    averagePerformance: 73.2,
    systemAdoption: 84.7
  };

  // Mock data for regions
  const regions = [
    {
      id: 1,
      name: 'Gaborone',
      schools: 285,
      students: 125000,
      teachers: 7200,
      performance: 78.5,
      systemAdoption: 92.1,
      status: 'excellent',
      lastUpdated: '2 hours ago',
      coordinates: { lat: -24.6282, lng: 25.9231 }
    },
    {
      id: 2,
      name: 'Francistown',
      schools: 195,
      students: 95000,
      teachers: 5500,
      performance: 75.8,
      systemAdoption: 89.5,
      status: 'good',
      lastUpdated: '4 hours ago',
      coordinates: { lat: -21.1593, lng: 27.5091 }
    },
    {
      id: 3,
      name: 'Molepolole',
      schools: 168,
      students: 82000,
      teachers: 4800,
      performance: 71.4,
      systemAdoption: 85.7,
      status: 'average',
      lastUpdated: '6 hours ago',
      coordinates: { lat: -24.4064, lng: 25.4942 }
    },
    {
      id: 4,
      name: 'Maun',
      schools: 142,
      students: 68000,
      teachers: 3900,
      performance: 69.2,
      systemAdoption: 78.9,
      status: 'needs_attention',
      lastUpdated: '8 hours ago',
      coordinates: { lat: -19.9835, lng: 23.4122 }
    },
    {
      id: 5,
      name: 'Kanye',
      schools: 125,
      students: 55000,
      teachers: 3200,
      performance: 70.8,
      systemAdoption: 81.8,
      status: 'average',
      lastUpdated: '5 hours ago',
      coordinates: { lat: -24.9833, lng: 25.3333 }
    },
    {
      id: 6,
      name: 'Serowe',
      schools: 98,
      students: 42000,
      teachers: 2450,
      performance: 68.5,
      systemAdoption: 76.4,
      status: 'needs_attention',
      lastUpdated: '10 hours ago',
      coordinates: { lat: -22.3928, lng: 26.7083 }
    },
    {
      id: 7,
      name: 'Palapye',
      schools: 87,
      students: 38000,
      teachers: 2200,
      performance: 67.9,
      systemAdoption: 74.6,
      status: 'needs_attention',
      lastUpdated: '7 hours ago',
      coordinates: { lat: -22.5431, lng: 27.1253 }
    },
    {
      id: 8,
      name: 'Lobatse',
      schools: 75,
      students: 32000,
      teachers: 1850,
      performance: 69.7,
      systemAdoption: 79.2,
      status: 'average',
      lastUpdated: '9 hours ago',
      coordinates: { lat: -25.2372, lng: 25.6672 }
    },
    {
      id: 9,
      name: 'Kasane',
      schools: 45,
      students: 18000,
      teachers: 1050,
      performance: 66.3,
      systemAdoption: 72.1,
      status: 'needs_attention',
      lastUpdated: '12 hours ago',
      coordinates: { lat: -17.8136, lng: 25.1564 }
    },
    {
      id: 10,
      name: 'Ghanzi',
      schools: 30,
      students: 12000,
      teachers: 680,
      performance: 64.8,
      systemAdoption: 68.5,
      status: 'critical',
      lastUpdated: '15 hours ago',
      coordinates: { lat: -21.6975, lng: 21.6425 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'average': return 'text-yellow-600 bg-yellow-100';
      case 'needs_attention': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle size={16} className="text-green-600" />;
      case 'good': return <CheckCircle size={16} className="text-blue-600" />;
      case 'average': return <Activity size={16} className="text-yellow-600" />;
      case 'needs_attention': return <AlertTriangle size={16} className="text-orange-600" />;
      case 'critical': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const exportData = (dataType: string) => {
    console.log(`Exporting ${dataType} data...`);
    // Implementation for export functionality would go here
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Regional Overview</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of all educational regions across Botswana</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="performance">Performance</option>
            <option value="adoption">System Adoption</option>
          </select>
          <Button onClick={() => exportData('regions')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* National Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Regions"
          value={nationalStats.totalRegions.toLocaleString()}
          icon={MapPin}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Total Schools"
          value={nationalStats.totalSchools.toLocaleString()}
          icon={School}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Students"
          value={nationalStats.totalStudents.toLocaleString()}
          icon={Users}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Teachers"
          value={nationalStats.totalTeachers.toLocaleString()}
          icon={Users}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Avg Performance"
          value={`${nationalStats.averagePerformance}%`}
          icon={BarChart3}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="System Adoption"
          value={`${nationalStats.systemAdoption}%`}
          icon={Activity}
          iconColor="bg-pink-100 text-pink-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/app/reports/school-performance" 
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Regional Performance</p>
                <p className="text-sm text-gray-500">Compare regional metrics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/app/monitoring/regional" 
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Activity size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Usage Monitoring</p>
                <p className="text-sm text-gray-500">Monitor regional usage</p>
              </div>
            </div>
          </Link>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Map size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Regional Map</p>
                <p className="text-sm text-gray-500">Geographic visualization</p>
              </div>
            </div>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Download size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bulk Export</p>
                <p className="text-sm text-gray-500">Export all regional data</p>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Regions Table */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Regional Summary</h2>
          <Button 
            onClick={() => exportData('regional-summary')} 
            variant="outline" 
            size="sm"
          >
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
                  Schools
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  System Adoption
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <MapPin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{region.name}</div>
                        <div className="text-sm text-gray-500">Updated {region.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.schools}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.students.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {region.teachers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className={`mr-2 ${
                        region.performance >= 75 ? 'text-green-600' :
                        region.performance >= 65 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {region.performance}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            region.performance >= 75 ? 'bg-green-500' :
                            region.performance >= 65 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${region.performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className={`mr-2 ${
                        region.systemAdoption >= 85 ? 'text-green-600' :
                        region.systemAdoption >= 70 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {region.systemAdoption}%
                      </span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            region.systemAdoption >= 85 ? 'bg-green-500' :
                            region.systemAdoption >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${region.systemAdoption}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(region.status)}`}>
                      {getStatusIcon(region.status)}
                      <span className="ml-1 capitalize">{region.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}; 