import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAppDispatch } from '../../../app/hooks';
import { openModal, showNotification } from '../../common/commonSlice';
import { Search, Plus, Edit, MapPin, Users, Building, UserCheck, Eye, Trash2 } from 'lucide-react';

interface Region {
  id: string;
  name: string;
  code: string;
  director: string;
  directorId?: string;
  directorEmail?: string;
  assistantDirector?: string;
  assistantDirectorId?: string;
  assistantDirectorEmail?: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  schoolCount: number;
  staffCount: number;
  studentCount: number;
  budget: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  regionId?: string;
  status: string;
}

const initialRegions: Region[] = [
  {
    id: '1',
    name: 'Gaborone Education Region',
    code: 'GAB',
    director: 'Dr. Thabo Molefi',
    directorId: 'staff1',
    directorEmail: 'thabo.molefi@education.gov.bw',
    assistantDirector: 'Ms. Boitumelo Kgosana',
    assistantDirectorId: 'staff2',
    assistantDirectorEmail: 'boitumelo.kgosana@education.gov.bw',
    description: 'Central region covering Gaborone and surrounding areas',
    address: '123 Government Complex, Gaborone',
    phone: '+267 3950000',
    email: 'gaborone.region@education.gov.bw',
    schoolCount: 45,
    staffCount: 12,
    studentCount: 25000,
    budget: 12500000,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Francistown Education Region',
    code: 'FRC',
    director: 'Mr. Kenneth Mogomotsi',
    directorId: 'staff3',
    directorEmail: 'kenneth.mogomotsi@education.gov.bw',
    description: 'Northern region covering Francistown and surrounding districts',
    address: '456 Regional Office, Francistown',
    phone: '+267 2410000',
    email: 'francistown.region@education.gov.bw',
    schoolCount: 38,
    staffCount: 10,
    studentCount: 18500,
    budget: 9500000,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    name: 'Maun Education Region',
    code: 'MAU',
    director: 'Mrs. Bontle Tshukudu',
    directorId: 'staff4',
    directorEmail: 'bontle.tshukudu@education.gov.bw',
    description: 'Northwest region covering Maun and Okavango areas',
    address: '789 District Office, Maun',
    phone: '+267 6860000',
    email: 'maun.region@education.gov.bw',
    schoolCount: 22,
    staffCount: 8,
    studentCount: 12000,
    budget: 7200000,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-08'
  }
];

const availableStaff: Staff[] = [
  {
    id: 'staff5',
    firstName: 'Grace',
    lastName: 'Mmusi',
    email: 'grace.mmusi@education.gov.bw',
    role: 'Education Specialist',
    status: 'active'
  },
  {
    id: 'staff6',
    firstName: 'Peter',
    lastName: 'Sekgoma',
    email: 'peter.sekgoma@education.gov.bw',
    role: 'Regional Coordinator',
    status: 'active'
  },
  {
    id: 'staff7',
    firstName: 'Mary',
    lastName: 'Letsholo',
    email: 'mary.letsholo@education.gov.bw',
    role: 'Deputy Director',
    status: 'active'
  }
];

const RegionConfig: React.FC = () => {
  const dispatch = useAppDispatch();
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const filteredRegions = regions.filter(region =>
    (selectedStatus === '' || region.status === selectedStatus) &&
    (region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     region.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
     region.director.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateRegion = () => {
    dispatch(openModal({
      title: 'Create Regional Education Office',
      size: 'lg',
      content: 'CreateRegionModal' as any,
      contentProps: {
        availableStaff,
        onSuccess: (newRegion: Region) => {
          setRegions([...regions, { ...newRegion, id: Date.now().toString() }]);
          dispatch(showNotification({
            type: 'success',
            message: 'Regional office created successfully'
          }));
        }
      }
    }));
  };

  const handleEditRegion = (region: Region) => {
    dispatch(openModal({
      title: `Edit ${region.name}`,
      size: 'lg',
      content: 'EditRegionModal' as any,
      contentProps: {
        region,
        availableStaff,
        onSuccess: (updatedRegion: Region) => {
          setRegions(regions.map(r => r.id === updatedRegion.id ? updatedRegion : r));
          dispatch(showNotification({
            type: 'success',
            message: 'Regional office updated successfully'
          }));
        }
      }
    }));
  };

  const handleAssignLeadership = (region: Region) => {
    dispatch(openModal({
      title: `Assign Leadership - ${region.name}`,
      size: 'lg',
      content: 'AssignLeadershipModal' as any,
      contentProps: {
        region,
        availableStaff,
        onSuccess: (updatedRegion: Region) => {
          setRegions(regions.map(r => r.id === updatedRegion.id ? updatedRegion : r));
          dispatch(showNotification({
            type: 'success',
            message: 'Leadership assigned successfully'
          }));
        }
      }
    }));
  };

  const handleViewDetails = (region: Region) => {
    setSelectedRegion(region);
    setShowDetails(true);
  };

  const handleDeleteRegion = (region: Region) => {
    dispatch(openModal({
      title: 'Confirm Deletion',
      size: 'md',
      content: 'ConfirmationModal' as any,
      contentProps: {
        message: `Are you sure you want to delete the ${region.name}? This action cannot be undone.`,
        onConfirm: () => {
          setRegions(regions.filter(r => r.id !== region.id));
          dispatch(showNotification({
            type: 'success',
            message: 'Regional office deleted successfully'
          }));
        }
      }
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regional Education Offices</h1>
          <p className="text-gray-600 mt-1">Manage regional offices and assign leadership</p>
        </div>
        <Button onClick={handleCreateRegion} leftIcon={Plus}>
          Create Regional Office
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Regions</p>
              <p className="text-2xl font-bold text-gray-900">{regions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">
                {regions.reduce((sum, region) => sum + region.schoolCount, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {regions.reduce((sum, region) => sum + region.studentCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Regions</p>
              <p className="text-2xl font-bold text-gray-900">
                {regions.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search regions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRegions.map(region => (
          <Card key={region.id} className="relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{region.name}</h3>
                <p className="text-sm text-gray-500">Code: {region.code}</p>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                region.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {region.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Director</p>
                <p className="text-sm text-gray-900">{region.director}</p>
                {region.directorEmail && (
                  <p className="text-xs text-gray-500">{region.directorEmail}</p>
                )}
              </div>

              {region.assistantDirector && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Assistant Director</p>
                  <p className="text-sm text-gray-900">{region.assistantDirector}</p>
                  {region.assistantDirectorEmail && (
                    <p className="text-xs text-gray-500">{region.assistantDirectorEmail}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Schools</p>
                  <p className="font-semibold">{region.schoolCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Students</p>
                  <p className="font-semibold">{region.studentCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Staff</p>
                  <p className="font-semibold">{region.staffCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Budget</p>
                  <p className="font-semibold">{formatCurrency(region.budget)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(region)}
                    leftIcon={Eye}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRegion(region)}
                    leftIcon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAssignLeadership(region)}
                    leftIcon={UserCheck}
                  >
                    Leadership
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRegion(region)}
                    leftIcon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRegions.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <div className="text-gray-500">No regional offices found matching your criteria.</div>
          </div>
        </Card>
      )}

      {/* Region Details Modal */}
      {showDetails && selectedRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedRegion.name}</h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Basic Information</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Region Code:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedRegion.code}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRegion.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedRegion.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Description:</span>
                        <p className="text-sm text-gray-900 mt-1">{selectedRegion.description}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Address:</span>
                        <p className="text-sm text-gray-900">{selectedRegion.address}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Phone:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedRegion.phone}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedRegion.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Leadership</h4>
                    <div className="mt-2 space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">Regional Director</p>
                        <p className="text-sm text-gray-700">{selectedRegion.director}</p>
                        {selectedRegion.directorEmail && (
                          <p className="text-xs text-gray-500">{selectedRegion.directorEmail}</p>
                        )}
                      </div>
                      
                      {selectedRegion.assistantDirector && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">Assistant Director</p>
                          <p className="text-sm text-gray-700">{selectedRegion.assistantDirector}</p>
                          {selectedRegion.assistantDirectorEmail && (
                            <p className="text-xs text-gray-500">{selectedRegion.assistantDirectorEmail}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Statistics</h4>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedRegion.schoolCount}</p>
                        <p className="text-xs text-blue-600">Schools</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedRegion.studentCount.toLocaleString()}</p>
                        <p className="text-xs text-green-600">Students</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{selectedRegion.staffCount}</p>
                        <p className="text-xs text-purple-600">Staff</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-bold text-orange-600">{formatCurrency(selectedRegion.budget)}</p>
                        <p className="text-xs text-orange-600">Budget</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => handleEditRegion(selectedRegion)} leftIcon={Edit}>
                  Edit Region
                </Button>
                <Button onClick={() => handleAssignLeadership(selectedRegion)} leftIcon={UserCheck}>
                  Assign Leadership
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionConfig; 