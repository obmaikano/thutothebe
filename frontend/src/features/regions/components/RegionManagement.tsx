import React, { useState } from 'react';
import { 
  Plus, Search, Edit, Trash2, MapPin, Users, School
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

export const RegionManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regions, setRegions] = useState([
    {
      id: 1,
      name: 'Gaborone',
      code: 'GAB',
      schools: 285,
      students: 125000,
      teachers: 7200,
      status: 'active',
      createdAt: '2020-01-15',
      description: 'Capital region of Botswana'
    },
    {
      id: 2,
      name: 'Francistown',
      code: 'FRA',
      schools: 195,
      students: 95000,
      teachers: 5500,
      status: 'active',
      createdAt: '2020-01-15',
      description: 'Second largest city region'
    },
    {
      id: 3,
      name: 'Molepolole',
      code: 'MOL',
      schools: 168,
      students: 82000,
      teachers: 4800,
      status: 'active',
      createdAt: '2020-01-15',
      description: 'Traditional capital region'
    },
    {
      id: 4,
      name: 'Maun',
      code: 'MAU',
      schools: 142,
      students: 68000,
      teachers: 3900,
      status: 'active',
      createdAt: '2020-01-15',
      description: 'Tourism hub region'
    }
  ]);

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (regionId: number) => {
    console.log('Edit region:', regionId);
    // Implementation for edit functionality
  };

  const handleDelete = (regionId: number) => {
    console.log('Delete region:', regionId);
    // Implementation for delete functionality
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Region Management</h1>
          <p className="text-gray-600 mt-2">Manage educational regions and their configurations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} className="mr-2" />
          Add New Region
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search regions by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Regions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
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
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegions.map((region) => (
                <tr key={region.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <MapPin size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{region.name}</div>
                        <div className="text-sm text-gray-500">{region.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {region.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <School size={16} className="text-gray-400 mr-2" />
                      {region.schools}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      {region.students.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      {region.teachers.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      region.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {region.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(region.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(region.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(region.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
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