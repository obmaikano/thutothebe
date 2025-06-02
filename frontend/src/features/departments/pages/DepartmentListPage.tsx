import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchDepartments, fetchDepartmentsBySchool, clearDepartmentsError, activateDepartment, deactivateDepartment, deleteDepartment } from '../departmentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Department } from '../../../api/services/departmentApi';
import { Plus, Search, Building2, Edit, Trash2, Users, BookOpen, Eye, ChevronDown, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DepartmentWorkflowControls from '../components/DepartmentWorkflowControls';

const DepartmentListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { departments, status, error } = useAppSelector(state => state.departments);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.schoolId) {
      dispatch(fetchDepartmentsBySchool(user.schoolId));
    } else {
      dispatch(fetchDepartments());
    }
    return () => {
      dispatch(clearDepartmentsError());
    };
  }, [dispatch, user?.schoolId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCreateDropdown && !(event.target as Element).closest('.relative')) {
        setShowCreateDropdown(false);
      }
      if (showEditDropdown && !(event.target as Element).closest('.edit-dropdown')) {
        setShowEditDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCreateDropdown, showEditDropdown]);

  const canCreateDepartment = ['SUPER_ADMIN', 'SCHOOL_ADMIN'].includes(user?.role || '');
  const canManageDepartments = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD'].includes(user?.role || '');
  const canViewDepartments = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'TEACHER', 'SENIOR_TEACHER'].includes(user?.role || '');

  const handleCreateDepartment = () => {
    setShowCreateDropdown(false);
    dispatch(openModal({
      title: 'Create New Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ADD_NEW,
      size: 'lg'
    }));
  };

  const handleCreateWithBuilder = () => {
    setShowCreateDropdown(false);
    navigate('/app/departments/create');
  };

  const handleEdit = (department: Department) => {
    setShowEditDropdown(null);
    dispatch(openModal({
      title: 'Edit Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_EDIT,
      extraObject: department,
      size: 'lg'
    }));
  };

  const handleView = (department: Department) => {
    dispatch(openModal({
      title: 'View Department Details',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_VIEW,
      extraObject: department,
      size: 'lg'
    }));
  };

  const handleDelete = (department: Department) => {
    dispatch(openModal({
      title: 'Delete Department',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_DELETE_CONFIRMATION,
      extraObject: department
    }));
  };

  const handleToggleStatus = async (department: Department) => {
    try {
      if (department.active) {
        await dispatch(deactivateDepartment(department.id)).unwrap();
      } else {
        await dispatch(activateDepartment(department.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle department status:', error);
    }
  };

  const handleRowClick = (department: Department, event: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/app/departments/${department.id}`);
  };

  const handleAssignHead = (department: Department) => {
    dispatch(openModal({
      title: 'Assign Department Head',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_HEAD,
      extraObject: department
    }));
  };

  const handleAssignTeacher = (department: Department) => {
    dispatch(openModal({
      title: 'Assign Teacher',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_TEACHER,
      extraObject: department
    }));
  };

  const handleAssignSubject = (department: Department) => {
    dispatch(openModal({
      title: 'Assign Subject',
      bodyType: MODAL_BODY_TYPES.DEPARTMENT_ASSIGN_SUBJECT,
      extraObject: department
    }));
  };

  const filteredDepartments = departments.filter((department: Department) => {
    const matchesSearch = 
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (department.departmentHeadName && department.departmentHeadName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && department.active) ||
      (statusFilter === 'inactive' && !department.active);

    const matchesSchool = 
      schoolFilter === '' || department.schoolName.toLowerCase().includes(schoolFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const getStatusBadge = (active: boolean) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        active 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {active ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (!canViewDepartments) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view departments.</p>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (status === 'failed' && error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error Loading Departments</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <div className="mt-4">
            <button
              onClick={() => {
                if (user?.schoolId) {
                  dispatch(fetchDepartmentsBySchool(user.schoolId));
                } else {
                  dispatch(fetchDepartments());
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600 mt-2">Manage academic departments and their resources</p>
        </div>
        {canCreateDepartment && (
          <div className="relative">
            <button 
              onClick={() => setShowCreateDropdown(!showCreateDropdown)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Create New Department
              <ChevronDown size={16} />
            </button>
            
            {showCreateDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={handleCreateDepartment}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Quick Create (Modal)
                  </button>
                  <button
                    onClick={handleCreateWithBuilder}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Create with Form
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearDepartmentsError())}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search departments..."
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
          {!user?.schoolId && (
            <input
              type="text"
              placeholder="Filter by school..."
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>
      </div>

      {/* Stats Summary */}
      {departments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{departments.length}</div>
                <div className="text-sm text-gray-500">Total Departments</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {departments.filter((d: Department) => d.active).length}
                </div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {departments.filter((d: Department) => d.departmentHeadId).length}
                </div>
                <div className="text-sm text-gray-500">With Head</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {departments.reduce((total: number, d: Department) => total + d.subjectIds.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Subjects</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Users size={20} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {departments.reduce((total: number, d: Department) => total + d.teacherIds.length, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Teachers</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Departments Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department Head
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resources
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
              {filteredDepartments.map((department: Department) => (
                <tr 
                  key={department.id} 
                  className={`hover:bg-blue-50 hover:shadow-sm cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:border-blue-400 ${
                    showEditDropdown === department.id ? 'bg-blue-50 border-blue-400 shadow-md' : ''
                  }`}
                  onClick={(event) => handleRowClick(department, event)}
                  title="Click to view department details"
                >
                  <td className={`px-6 whitespace-nowrap ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{department.name}</div>
                        <div className="text-sm text-gray-500">
                          {department.description ? department.description.substring(0, 50) + '...' : 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 whitespace-nowrap text-sm text-gray-900 ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    {department.schoolName}
                  </td>
                  <td className={`px-6 whitespace-nowrap text-sm text-gray-900 ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    {department.departmentHeadName || (
                      <span className="text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className={`px-6 whitespace-nowrap ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    <div className="flex items-center space-x-4 text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        {department.teacherIds.length}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                        {department.subjectIds.length}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 whitespace-nowrap ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    {getStatusBadge(department.active)}
                  </td>
                  <td className={`px-6 whitespace-nowrap text-sm font-medium ${
                    showEditDropdown === department.id ? 'py-8' : 'py-4'
                  }`}>
                    <div className="edit-dropdown">
                      <DepartmentWorkflowControls 
                        department={department} 
                        userRole={user?.role || ''} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter || schoolFilter
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by creating a new department.'}
              </p>
              {canCreateDepartment && !searchTerm && !statusFilter && !schoolFilter && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateDropdown(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Create New Department
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentListPage; 