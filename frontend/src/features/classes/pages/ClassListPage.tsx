import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchClasses, clearClassesError, activateClass, deactivateClass, deleteClass } from '../classesSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Class } from '../../../api/services/classApi';
import { Plus, Search, School, Edit, Trash2, Eye, Users } from 'lucide-react';

const ClassListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { classes, status, error } = useAppSelector(state => state.classes);
  const { schools } = useAppSelector(state => state.schools);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchSchools());
    return () => {
      dispatch(clearClassesError());
    };
  }, [dispatch]);

  // Helper function to get school name from ID
  const getSchoolName = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : `School ${schoolId}`;
  };

  const handleCreateClass = () => {
    dispatch(openModal({
      title: 'Create New Class',
      bodyType: MODAL_BODY_TYPES.CLASS_ADD_NEW,
      size: 'md'
    }));
  };

  const handleEdit = (classItem: Class) => {
    dispatch(openModal({
      title: 'Edit Class',
      bodyType: MODAL_BODY_TYPES.CLASS_EDIT,
      extraObject: classItem
    }));
  };

  const handleDelete = (classItem: Class) => {
    dispatch(openModal({
      title: 'Delete Class',
      bodyType: MODAL_BODY_TYPES.CLASS_DELETE_CONFIRMATION,
      extraObject: classItem
    }));
  };

  const handleToggleStatus = async (classItem: Class) => {
    try {
      if (classItem.active) {
        await dispatch(deactivateClass(classItem.id)).unwrap();
      } else {
        await dispatch(activateClass(classItem.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to toggle class status:', error);
    }
  };

  const handleViewDetails = (classItem: Class) => {
    dispatch(openModal({
      title: 'Class Details',
      bodyType: MODAL_BODY_TYPES.CLASS_VIEW,
      extraObject: classItem
    }));
  };

  const filteredClasses = classes.filter((classItem: Class) => {
    const matchesSearch = 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.grade.toString().includes(searchTerm) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      statusFilter === '' ||
      (statusFilter === 'active' && classItem.active) ||
      (statusFilter === 'inactive' && !classItem.active);

    const matchesGrade = 
      gradeFilter === '' || classItem.grade.toString() === gradeFilter;

    return matchesSearch && matchesStatus && matchesGrade;
  });

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Class Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage school classes and their enrollment
          </p>
        </div>
        <button
          onClick={handleCreateClass}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Class
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearClassesError())}
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
              placeholder="Search classes by name, grade, or description..."
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
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {Array.from({length: 12}, (_, i) => i + 1).map(grade => (
              <option key={grade} value={grade.toString()}>Grade {grade}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <School size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
                <div className="text-sm text-gray-500">Total Classes</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <School size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {classes.filter((c: Class) => c.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Classes</div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <School size={20} className="text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {classes.filter((c: Class) => !c.active).length}
                </div>
                <div className="text-sm text-gray-500">Inactive Classes</div>
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
                  {classes.reduce((sum, c) => sum + (c.currentEnrollment || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
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
              {filteredClasses.map((classItem: Class) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <School className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => navigate(`/app/classes/${classItem.id}`)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          {classItem.name}
                        </button>
                        {classItem.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{classItem.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Grade {classItem.grade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getSchoolName(classItem.schoolId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {classItem.currentEnrollment || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {classItem.capacity || 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(classItem)}
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                        classItem.active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {classItem.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(classItem)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                        title="Edit class"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete class"
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

        {filteredClasses.length === 0 && (
          <div className="text-center py-8">
            <School className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No classes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || gradeFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by creating a new class.'
              }
            </p>
            {!searchTerm && !statusFilter && !gradeFilter && (
              <div className="mt-6">
                <button
                  onClick={handleCreateClass}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Class
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredClasses.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredClasses.length}</span> of{' '}
                  <span className="font-medium">{classes.length}</span> classes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassListPage; 