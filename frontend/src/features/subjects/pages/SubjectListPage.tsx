import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchSubjects, clearSubjectsError, activateSubject, deactivateSubject, deleteSubject } from '../subjectsSlice';
import { fetchDepartments } from '../../departments/departmentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Subject } from '../../../api/services/subjectApi';
import { Plus, Search, BookOpen, Edit, Trash2, Building, Eye, Filter } from 'lucide-react';

const SubjectListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { subjects, status, error } = useAppSelector(state => state.subjects);
  const { departments } = useAppSelector(state => state.departments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchDepartments());
    return () => {
      dispatch(clearSubjectsError());
    };
  }, [dispatch]);

  const handleCreateSubject = () => {
    dispatch(openModal({
      title: 'Create New Subject',
      bodyType: MODAL_BODY_TYPES.SUBJECT_ADD_NEW,
      size: 'md'
    }));
  };

  const handleEdit = (subject: Subject) => {
    dispatch(openModal({
      title: 'Edit Subject',
      bodyType: MODAL_BODY_TYPES.SUBJECT_EDIT,
      extraObject: subject
    }));
  };

  const handleDelete = (subject: Subject) => {
    dispatch(openModal({
      title: 'Delete Subject',
      bodyType: MODAL_BODY_TYPES.SUBJECT_DELETE_CONFIRMATION,
      extraObject: subject
    }));
  };

  const handleToggleStatus = async (subject: Subject) => {
    try {
      if (subject.active) {
        await dispatch(deactivateSubject(subject.id)).unwrap();
      } else {
        await dispatch(activateSubject(subject.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle subject status:', error);
    }
  };

  const handleViewDetails = (subject: Subject) => {
    window.location.href = `/app/subjects/${subject.id}`;
  };

  const getDepartmentName = (departmentId?: number) => {
    if (!departmentId) return 'No Department';
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  const filteredSubjects = subjects.filter((subject: Subject) => {
    const matchesSearch = 
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && subject.active) ||
      (statusFilter === 'inactive' && !subject.active);

    const matchesDepartment = 
      departmentFilter === '' ||
      (departmentFilter === 'none' && !(subject as any).departmentId) ||
      (subject as any).departmentId?.toString() === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
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
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-600 mt-2">Manage academic subjects and their configurations</p>
        </div>
        <button 
          onClick={handleCreateSubject} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New Subject
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearSubjectsError())}
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
              placeholder="Search subjects by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
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
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="none">No Department</option>
              {departments
                .filter(dept => dept.active)
                .map(department => (
                  <option key={department.id} value={department.id.toString()}>
                    {department.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{subjects.length}</div>
                <div className="text-sm text-gray-500">Total Subjects</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.filter((s: Subject) => s.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Subjects</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <Building size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.filter((s: Subject) => (s as any).departmentId).length}
                </div>
                <div className="text-sm text-gray-500">With Department</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {subjects.filter((s: Subject) => !s.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Subjects</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subjects Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter || departmentFilter
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first subject.'}
                    </p>
                    {!searchTerm && !statusFilter && !departmentFilter && (
                      <div className="mt-6">
                        <button
                          onClick={handleCreateSubject}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Plus className="-ml-1 mr-2 h-5 w-5" />
                          Add Subject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject: Subject) => (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {getDepartmentName((subject as any).departmentId)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {subject.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        subject.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subject.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(subject)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50"
                          title="Edit Subject"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(subject)}
                          className={`p-1 rounded-md ${
                            subject.active 
                              ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                          title={subject.active ? 'Deactivate' : 'Activate'}
                        >
                          <BookOpen size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(subject)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                          title="Delete Subject"
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

      {/* Results Summary */}
      {filteredSubjects.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filteredSubjects.length} of {subjects.length} subjects
          </span>
          {(searchTerm || statusFilter || departmentFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setDepartmentFilter('');
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectListPage; 