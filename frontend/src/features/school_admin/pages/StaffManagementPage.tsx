import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchTeachers, clearTeachersError, activateTeacher, deactivateTeacher } from '../../teachers/teachersSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Teacher } from '../../../api/services/teacherApi';
import { Plus, Search, Users, Edit, Trash2, Eye, UserCheck, UserX, Filter, Download } from 'lucide-react';

const StaffManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { teachers, status, error } = useAppSelector(state => state.teachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [qualificationFilter, setQualificationFilter] = useState('');

  useEffect(() => {
    dispatch(fetchTeachers());
    return () => {
      dispatch(clearTeachersError());
    };
  }, [dispatch]);

  const handleCreateTeacher = () => {
    dispatch(openModal({
      title: 'Add New Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleEdit = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Edit Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_EDIT,
      extraObject: teacher,
      size: 'lg'
    }));
  };

  const handleDelete = (teacher: Teacher) => {
    dispatch(openModal({
      title: 'Remove Teacher',
      bodyType: MODAL_BODY_TYPES.TEACHER_DELETE_CONFIRMATION,
      extraObject: teacher
    }));
  };

  const handleToggleStatus = async (teacher: Teacher) => {
    try {
      if (teacher.active) {
        await dispatch(deactivateTeacher(teacher.id)).unwrap();
      } else {
        await dispatch(activateTeacher(teacher.id)).unwrap();
      }
      // Refresh the teachers list
      dispatch(fetchTeachers());
    } catch (error) {
      console.error('Failed to toggle teacher status:', error);
    }
  };

  const handleViewDetails = (teacher: Teacher) => {
    navigate(`/app/staff/${teacher.id}`);
  };

  const handleExportData = () => {
    // Implementation for exporting staff data
    console.log('Exporting staff data...');
  };

  const filteredTeachers = teachers.filter((teacher: Teacher) => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.qualification.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = 
      departmentFilter === '' || teacher.qualification.toLowerCase().includes(departmentFilter.toLowerCase());

    const matchesActive = 
      activeFilter === '' ||
      (activeFilter === 'active' && teacher.active) ||
      (activeFilter === 'inactive' && !teacher.active);

    const matchesQualification = 
      qualificationFilter === '' || teacher.qualification.toLowerCase().includes(qualificationFilter.toLowerCase());

    return matchesSearch && matchesDepartment && matchesActive && matchesQualification;
  });

  const getQualificationBadgeColor = (qualification: string) => {
    const qual = qualification.toLowerCase();
    if (qual.includes('phd') || qual.includes('doctorate')) return 'bg-purple-100 text-purple-800';
    if (qual.includes('master') || qual.includes('msc') || qual.includes('ma')) return 'bg-blue-100 text-blue-800';
    if (qual.includes('bachelor') || qual.includes('bsc') || qual.includes('ba')) return 'bg-green-100 text-green-800';
    if (qual.includes('diploma')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">Manage teaching staff, qualifications, and assignments</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportData}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={16} />
            Export Data
          </button>
          <button 
            onClick={handleCreateTeacher} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearTeachersError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search teachers by name, staff ID, email, or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Filters:</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="physical education">Physical Education</option>
            <option value="arts">Arts</option>
          </select>
          
          <select 
            value={qualificationFilter}
            onChange={(e) => setQualificationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Qualifications</option>
            <option value="phd">PhD/Doctorate</option>
            <option value="master">Master's Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="diploma">Diploma</option>
          </select>
          
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Staff</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {teachers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{teachers.length}</div>
                <div className="text-sm text-gray-500">Total Staff</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <UserCheck size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {teachers.filter((t: Teacher) => t.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Teachers</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <UserX size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {teachers.filter((t: Teacher) => !t.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Staff</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Users size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((teachers.filter((t: Teacher) => t.active).length / teachers.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Active Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Users size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No teachers found</p>
                    <p className="text-sm">Try adjusting your search criteria or add a new teacher.</p>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher: Teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{teacher.staffId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getQualificationBadgeColor(teacher.qualification)}`}>
                        {teacher.qualification}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        teacher.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {teacher.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(teacher)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Edit Teacher"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(teacher)}
                          className={`p-1 rounded ${
                            teacher.active 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={teacher.active ? 'Deactivate' : 'Activate'}
                        >
                          {teacher.active ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Remove Teacher"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination would go here if needed */}
      {filteredTeachers.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredTeachers.length} of {teachers.length} teachers
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage; 