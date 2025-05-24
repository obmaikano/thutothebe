import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSchools, clearSchoolsError, activateSchool, deactivateSchool, deleteSchool } from '../schoolsSlice';
import { fetchRegions } from '../../regions/regionsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { School } from '../../../api/services/schoolApi';
import { Region } from '../../../api/services/regionApi';
import { Plus, Search, Building, Edit, Trash2 } from 'lucide-react';

const SchoolListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { schools, status, error } = useAppSelector(state => state.schools);
  const { regions } = useAppSelector(state => state.regions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchRegions());
    return () => {
      dispatch(clearSchoolsError());
    };
  }, [dispatch]);

  const handleCreateSchool = () => {
    dispatch(openModal({
      title: 'Create New School',
      bodyType: MODAL_BODY_TYPES.SCHOOL_ADD_NEW,
      size: 'md'
    }));
  };

  const handleEdit = (school: School) => {
    dispatch(openModal({
      title: 'Edit School',
      bodyType: MODAL_BODY_TYPES.SCHOOL_EDIT,
      extraObject: school
    }));
  };

  const handleDelete = (school: School) => {
    dispatch(openModal({
      title: 'Delete School',
      bodyType: MODAL_BODY_TYPES.SCHOOL_DELETE_CONFIRMATION,
      extraObject: school
    }));
  };

  const handleToggleStatus = async (school: School) => {
    try {
      if (school.active) {
        await dispatch(deactivateSchool(school.id)).unwrap();
      } else {
        await dispatch(activateSchool(school.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle school status:', error);
    }
  };

  const handleViewDetails = (school: School) => {
    window.location.href = `/app/schools/${school.id}`;
  };

  const getRegionName = (regionId: number) => {
    const region = regions.find((r: Region) => r.id === regionId);
    return region ? region.name : 'Unknown Region';
  };

  const filteredSchools = schools.filter((school: School) => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (school.description && school.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && school.active) ||
      (statusFilter === 'inactive' && !school.active);

    const matchesRegion = 
      regionFilter === '' ||
      school.regionId.toString() === regionFilter;

    return matchesSearch && matchesStatus && matchesRegion;
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600 mt-2">Manage schools and their configurations</p>
        </div>
        <button 
          onClick={handleCreateSchool} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New School
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearSchoolsError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search schools by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select 
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Regions</option>
            {regions.map((region: Region) => (
              <option key={region.id} value={region.id.toString()}>
                {region.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {schools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Building size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{schools.length}</div>
                <div className="text-sm text-gray-500">Total Schools</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Building size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {schools.filter((s: School) => s.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Schools</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <Building size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {schools.filter((s: School) => !s.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Schools</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schools Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Region
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
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
              {filteredSchools.map((school: School) => (
                <tr key={school.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(school)}>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <Building size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{school.name}</div>
                        <div className="text-sm text-gray-500">School {school.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {school.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                      {getRegionName(school.regionId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" onClick={(e) => e.stopPropagation()}>
                    <div className="max-w-xs truncate" title={school.description}>
                      {school.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(school);
                      }}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                        school.active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {school.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(school);
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Edit School"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(school);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete School"
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

        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">
              {searchTerm || statusFilter || regionFilter ? 'No schools found matching your criteria' : 'No schools found'}
            </div>
            {!searchTerm && !statusFilter && !regionFilter && (
              <button
                onClick={handleCreateSchool}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <Plus size={16} />
                Create First School
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolListPage; 