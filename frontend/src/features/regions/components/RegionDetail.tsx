import React, { useState } from 'react';
import { 
  MapPin, Users, School, BarChart3, Download, 
  ArrowLeft, Activity, CheckCircle, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/card';
import { StatCard } from '../../../components/ui/stat-card';
import { Button } from '../../../components/ui/button';

export const RegionDetail: React.FC = () => {
  // Mock region data - this would typically come from route params
  const region = {
    id: 1,
    name: 'Gaborone',
    schools: 285,
    students: 125000,
    teachers: 7200,
    performance: 78.5,
    systemAdoption: 92.1,
    status: 'excellent',
    lastUpdated: '2 hours ago',
    coordinates: { lat: -24.6282, lng: 25.9231 },
    description: 'The capital region of Botswana, home to the largest concentration of educational institutions in the country.'
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <Link 
            to="/app/regions" 
            className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{region.name} Region</h1>
            <p className="text-gray-600 mt-2">{region.description}</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download size={16} className="mr-2" />
          Export Region Data
        </Button>
      </div>

      {/* Region Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Schools"
          value={region.schools.toString()}
          icon={School}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Students"
          value={region.students.toLocaleString()}
          icon={Users}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Teachers"
          value={region.teachers.toLocaleString()}
          icon={Users}
          iconColor="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Performance"
          value={`${region.performance}%`}
          icon={BarChart3}
          iconColor="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="System Adoption"
          value={`${region.systemAdoption}%`}
          icon={Activity}
          iconColor="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Status"
          value={region.status.charAt(0).toUpperCase() + region.status.slice(1)}
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Information */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{region.lastUpdated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Coordinates:</span>
              <span className="font-medium">{region.coordinates.lat}, {region.coordinates.lng}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Student-Teacher Ratio:</span>
              <span className="font-medium">{Math.round(region.students / region.teachers)}:1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Schools per 1000 Students:</span>
              <span className="font-medium">{((region.schools / region.students) * 1000).toFixed(1)}</span>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Academic Performance</span>
                <span className="font-medium">{region.performance}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${region.performance}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">System Adoption</span>
                <span className="font-medium">{region.systemAdoption}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${region.systemAdoption}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Regional Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to={`/app/schools?region=${region.name}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <School size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">View Schools</p>
                <p className="text-sm text-gray-500">{region.schools} schools</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/app/reports/school-performance?region=${region.name}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Performance Report</p>
                <p className="text-sm text-gray-500">Detailed analytics</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to={`/app/monitoring/regional?region=${region.name}`}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Activity size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Usage Monitoring</p>
                <p className="text-sm text-gray-500">Real-time data</p>
              </div>
            </div>
          </Link>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Download size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Export Data</p>
                <p className="text-sm text-gray-500">Download reports</p>
              </div>
            </div>
          </button>
        </div>
      </Card>
    </div>
  );
}; 