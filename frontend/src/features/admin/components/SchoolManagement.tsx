import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, Search, Filter, Plus, Edit2, Trash2, 
  MapPin, Users, UserCheck, Eye, Building, AlertCircle
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { useAppDispatch } from '../../../app/hooks';
import { openModal, showNotification } from '../../common/commonSlice';

interface SchoolData {
  id: string;
  name: string;
  emisCode: string;
  region: string;
  district: string;
  level: 'Primary' | 'Secondary' | 'Combined';
  status: 'active' | 'inactive' | 'pending';
  adminName?: string;
  adminEmail?: string;
  adminId?: string;
  adminAssignedDate?: string;
  totalStudents: number;
  totalTeachers: number;
  address: string;
  phone?: string;
  email?: string;
  establishedYear: number;
  hasAdmin: boolean;
}

interface SchoolManagementProps {
  searchTerm: string;
  filterType: string;
}

export const SchoolManagement: React.FC<SchoolManagementProps> = ({ searchTerm, filterType }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedAdminStatus, setSelectedAdminStatus] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Enhanced mock data - would come from API in real implementation
  const schools: SchoolData[] = [
    {
      id: '1',
      name: 'Gaborone Secondary School',
      emisCode: 'GAB001',
      region: 'Gaborone',
      district: 'Gaborone Central',
      level: 'Secondary',
      status: 'active',
      adminName: 'Dr. David Wilson',
      adminEmail: 'david.wilson@education.gov.bw',
      adminId: 'admin001',
      adminAssignedDate: '2024-01-15',
      totalStudents: 1250,
      totalTeachers: 65,
      address: '123 School Road, Gaborone',
      phone: '+267 3950001',
      email: 'info@gaboronesec.edu.bw',
      establishedYear: 1985,
      hasAdmin: true
    },
    {
      id: '2',
      name: 'Francistown Primary School',
      emisCode: 'FRA001',
      region: 'Francistown',
      district: 'Francistown Central',
      level: 'Primary',
      status: 'active',
      adminName: 'Mrs. Sarah Chen',
      adminEmail: 'sarah.chen@education.gov.bw',
      adminId: 'admin002',
      adminAssignedDate: '2024-01-10',
      totalStudents: 850,
      totalTeachers: 45,
      address: '456 Education Lane, Francistown',
      phone: '+267 2410001',
      email: 'admin@francistownpri.edu.bw',
      establishedYear: 1970,
      hasAdmin: true
    },
    {
      id: '3',
      name: 'Maun Combined School',
      emisCode: 'MAU001',
      region: 'Maun',
      district: 'Ngamiland West',
      level: 'Combined',
      status: 'active',
      totalStudents: 650,
      totalTeachers: 35,
      address: '789 River Road, Maun',
      phone: '+267 6860001',
      email: 'contact@mauncombined.edu.bw',
      establishedYear: 1995,
      hasAdmin: false
    },
    {
      id: '4',
      name: 'Tlokweng Primary School',
      emisCode: 'GAB002',
      region: 'Gaborone',
      district: 'South East',
      level: 'Primary',
      status: 'pending',
      totalStudents: 420,
      totalTeachers: 28,
      address: '101 Village Road, Tlokweng',
      establishedYear: 2020,
      hasAdmin: false
    }
  ];

  const regions = [
    'Gaborone',
    'Francistown',
    'Molepolole',
    'Maun',
  ];

  const levels = [
    'Primary',
    'Secondary',
    'Combined',
  ];

  const adminStatusOptions = [
    { value: 'all', label: 'All Schools' },
    { value: 'with_admin', label: 'With Administrator' },
    { value: 'without_admin', label: 'Without Administrator' }
  ];

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.emisCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || school.region === selectedRegion;
    const matchesLevel = selectedLevel === 'all' || school.level === selectedLevel;
    const matchesType = !filterType || school.level === filterType;
    const matchesAdminStatus = selectedAdminStatus === 'all' || 
                              (selectedAdminStatus === 'with_admin' && school.hasAdmin) ||
                              (selectedAdminStatus === 'without_admin' && !school.hasAdmin);
    return matchesSearch && matchesRegion && matchesLevel && matchesType && matchesAdminStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignAdmin = (school: SchoolData) => {
    dispatch(openModal({
      title: `Assign School Administrator - ${school.name}`,
      size: 'lg',
      content: 'AssignSchoolAdminModal' as any,
      contentProps: {
        schoolId: school.id,
        schoolName: school.name,
        onSuccess: () => {
          dispatch(showNotification({
            type: 'success',
            message: 'School administrator assigned successfully'
          }));
        }
      }
    }));
  };

  const handleViewSchool = (school: SchoolData) => {
    setSelectedSchool(school);
    setShowDetails(true);
  };

  const handleEditSchool = (school: SchoolData) => {
    navigate(`/app/schools/${school.id}/edit`);
  };

  const handleDeleteSchool = (school: SchoolData) => {
    dispatch(openModal({
      title: 'Confirm Deletion',
      size: 'md',
      content: 'ConfirmationModal' as any,
      contentProps: {
        message: `Are you sure you want to delete ${school.name}? This action cannot be undone and will affect all associated data.`,
        onConfirm: () => {
          dispatch(showNotification({
            type: 'success',
            message: 'School deleted successfully'
          }));
        }
      }
    }));
  };

  const getSchoolsWithoutAdmin = () => {
    return schools.filter(school => !school.hasAdmin).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600 mt-1">Manage schools and their administrators</p>
        </div>
        <Button
          leftIcon={Plus}
          onClick={() => navigate('/app/schools/register')}
        >
          Register New School
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
              <p className="text-sm font-medium text-gray-500">Total Schools</p>
              <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">With Administrator</p>
              <p className="text-2xl font-bold text-gray-900">
                {schools.filter(s => s.hasAdmin).length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Need Administrator</p>
              <p className="text-2xl font-bold text-gray-900">
                {getSchoolsWithoutAdmin()}
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
                {schools.reduce((sum, school) => sum + school.totalStudents, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schools..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              readOnly
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All Levels</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedAdminStatus}
            onChange={(e) => setSelectedAdminStatus(e.target.value)}
          >
            {adminStatusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <Button variant="outline" leftIcon={Filter}>
            More Filters
          </Button>
        </div>
      </Card>

      {/* Schools Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students/Teachers
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
              {filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <School className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {school.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          EMIS: {school.emisCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{school.region}</div>
                    <div className="text-sm text-gray-500">{school.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {school.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {school.hasAdmin ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {school.adminName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {school.adminEmail}
                        </div>
                        {school.adminAssignedDate && (
                          <div className="text-xs text-gray-400">
                            Assigned: {school.adminAssignedDate}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
                        <span className="text-sm text-orange-600">No Administrator</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Students: {school.totalStudents}</div>
                    <div>Teachers: {school.totalTeachers}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(school.status)}`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewSchool(school)}
                        leftIcon={Eye}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSchool(school)}
                        leftIcon={Edit2}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssignAdmin(school)}
                        leftIcon={UserCheck}
                        className={!school.hasAdmin ? 'text-orange-600 hover:text-orange-700' : ''}
                      >
                        {school.hasAdmin ? 'Change Admin' : 'Assign Admin'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchool(school)}
                        leftIcon={Trash2}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">No schools found matching your criteria.</div>
          </div>
        )}
      </Card>

      {/* School Details Modal */}
      {showDetails && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">{selectedSchool.name}</h3>
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
                    <h4 className="text-sm font-medium text-gray-700">School Information</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">EMIS Code:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedSchool.emisCode}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Level:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedSchool.level}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Established:</span>
                        <span className="text-sm text-gray-900 ml-2">{selectedSchool.establishedYear}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSchool.status)}`}>
                          {selectedSchool.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Address:</span>
                        <p className="text-sm text-gray-900">{selectedSchool.address}</p>
                      </div>
                      {selectedSchool.phone && (
                        <div>
                          <span className="text-sm text-gray-500">Phone:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedSchool.phone}</span>
                        </div>
                      )}
                      {selectedSchool.email && (
                        <div>
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm text-gray-900 ml-2">{selectedSchool.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Administrator</h4>
                    <div className="mt-2">
                      {selectedSchool.hasAdmin ? (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">{selectedSchool.adminName}</p>
                          <p className="text-sm text-gray-600">{selectedSchool.adminEmail}</p>
                          {selectedSchool.adminAssignedDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              Assigned: {selectedSchool.adminAssignedDate}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                            <p className="text-sm text-orange-700">No administrator assigned</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Statistics</h4>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{selectedSchool.totalStudents}</p>
                        <p className="text-xs text-blue-600">Students</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{selectedSchool.totalTeachers}</p>
                        <p className="text-xs text-green-600">Teachers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => handleEditSchool(selectedSchool)} leftIcon={Edit2}>
                  Edit School
                </Button>
                <Button 
                  onClick={() => handleAssignAdmin(selectedSchool)} 
                  leftIcon={UserCheck}
                  className={!selectedSchool.hasAdmin ? 'bg-orange-600 hover:bg-orange-700' : ''}
                >
                  {selectedSchool.hasAdmin ? 'Change Administrator' : 'Assign Administrator'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 