import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchClassesWithTeachers, assignTeacherToClass, removeTeacherFromClass, clearClassesError } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Class } from '../../../api/services/classApi';
import { Plus, Search, BookOpen, Edit, Trash2, Eye, Users, Calendar, Clock, Filter, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClassManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { classes, status, error } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { students } = useAppSelector(state => state.students);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [lastTeacherAssignmentTime, setLastTeacherAssignmentTime] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchClassesWithTeachers());
    dispatch(fetchTeachers());
    dispatch(fetchStudents());
    return () => {
      dispatch(clearClassesError());
    };
  }, [dispatch]);

  // Refetch classes when teacher assignments are made
  useEffect(() => {
    if (status === 'succeeded' && lastTeacherAssignmentTime > 0) {
      const timeoutId = setTimeout(() => {
        dispatch(fetchClassesWithTeachers());
      }, 500); // Small delay to ensure backend has processed the assignment
      
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, status, lastTeacherAssignmentTime]);

  const handleCreateClass = () => {
    dispatch(openModal({
      title: 'Create New Class',
      bodyType: MODAL_BODY_TYPES.CLASS_ADD_NEW,
      size: 'lg'
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

  const handleViewDetails = (classItem: Class) => {
    navigate(`/app/classes/${classItem.id}`);
  };

  const handleAssignStudents = (classItem: Class) => {
    dispatch(openModal({
      title: 'Assign Students to Class',
      bodyType: MODAL_BODY_TYPES.STUDENT_ASSIGN_CLASS,
      extraObject: classItem
    }));
  };

  const handleAssignTeacher = async (classItem: Class, teacherId: number) => {
    try {
      await dispatch(assignTeacherToClass({ classId: classItem.id, teacherId })).unwrap();
      setLastTeacherAssignmentTime(Date.now());
    } catch (error) {
      console.error('Failed to assign teacher:', error);
    }
  };

  const handleRemoveTeacher = async (classItem: Class, teacherId: number) => {
    try {
      await dispatch(removeTeacherFromClass({ classId: classItem.id, teacherId })).unwrap();
      setLastTeacherAssignmentTime(Date.now());
    } catch (error) {
      console.error('Failed to remove teacher:', error);
    }
  };

  const handleManageTimetable = (classItem: Class) => {
    window.location.href = `/app/timetable/${classItem.id}`;
  };

  const handleTakeAttendance = (classItem: Class) => {
    dispatch(openModal({
      title: 'Take Attendance',
      bodyType: MODAL_BODY_TYPES.ATTENDANCE_TAKE,
      size: 'lg',
      extraObject: classItem
    }));
  };

  const handleExportData = () => {
    console.log('Exporting class data...');
  };

  const filteredClasses = classes.filter((classItem: Class) => {
    const matchesSearch = 
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (classItem.description && classItem.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesActive = 
      activeFilter === '' ||
      (activeFilter === 'active' && classItem.active) ||
      (activeFilter === 'inactive' && !classItem.active);

    return matchesSearch && matchesActive;
  });

  const getTeacherNames = (teacherIds: number[] | undefined) => {
    if (!teacherIds || teacherIds.length === 0) return [];
    return teachers
      .filter(teacher => teacherIds.includes(teacher.id))
      .map(teacher => ({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        email: teacher.email,
        staffId: teacher.staffId,
        active: teacher.active
      }));
  };

  const getStudentCountByClass = (classId: number) => {
    return students.filter(s => s.classId === classId).length;
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
          <h1 className="text-3xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-2">Manage classes, timetables, and student assignments</p>
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
            onClick={handleCreateClass} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Create Class
          </button>
        </div>
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
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search classes by name or description..."
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Classes</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <div></div> {/* Empty div for spacing */}

          <button
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      {classes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{classes.length}</div>
                <div className="text-sm text-gray-500">Total Classes</div>
                <div className="text-xs text-gray-400 mt-1">
                  {classes.filter(c => c.active).length} Active
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {classes.reduce((total, classItem) => total + getStudentCountByClass(classItem.id), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Students</div>
                <div className="text-xs text-gray-400 mt-1">
                  {classes.filter(c => getStudentCountByClass(c.id) > 0).length} Classes with Students
                </div>
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
                  {teachers.filter(t => t.active).length}
                </div>
                <div className="text-sm text-gray-500">Active Teachers</div>
                <div className="text-xs text-gray-400 mt-1">
                  {teachers.length} Total Teachers
                </div>
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
                  {classes.filter(c => c.teacherIds && c.teacherIds.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">Classes with Teachers</div>
                <div className="text-xs text-gray-400 mt-1">
                  {classes.filter(c => !c.teacherIds || c.teacherIds.length === 0).length} Need Assignment
                </div>
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
                  Teachers
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
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
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <BookOpen size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No classes found</p>
                      <p className="text-sm">Try adjusting your search criteria or create a new class.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClasses.map((classItem: Class) => (
                  <tr key={classItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {classItem.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {classItem.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {Date.now() - lastTeacherAssignmentTime < 2000 && lastTeacherAssignmentTime > 0 ? (
                        <div className="flex items-center">
                          <div className="loading loading-spinner loading-sm mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {classItem.teacherIds && classItem.teacherIds.length > 0 ? (
                            getTeacherNames(classItem.teacherIds).map(teacher => (
                              <div key={teacher.id} className="flex items-center gap-2">
                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <div className="text-sm text-gray-900">
                                    {teacher.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {teacher.staffId || 'No ID'} • {teacher.active ? 'Active' : 'Inactive'}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 italic">No teachers assigned</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getStudentCountByClass(classItem.id)}
                        {classItem.capacity && ` / ${classItem.capacity}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {classItem.currentEnrollment || getStudentCountByClass(classItem.id)} enrolled
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {classItem.capacity || 'Not set'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {classItem.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(classItem)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleAssignStudents(classItem)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Assign Students"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          onClick={() => dispatch(openModal({
                            title: 'Assign Teacher to Class',
                            bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS,
                            extraObject: {
                              classId: classItem.id,
                              className: classItem.name,
                              gradeLevel: classItem.gradeLevel,
                              availableTeachers: teachers.filter(t => 
                                !classItem.teacherIds?.includes(t.id)
                              )
                            }
                          }))}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Assign Teacher"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          onClick={() => handleManageTimetable(classItem)}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded"
                          title="Manage Timetable"
                        >
                          <Calendar size={16} />
                        </button>
                        <button
                          onClick={() => handleTakeAttendance(classItem)}
                          className="text-orange-600 hover:text-orange-900 p-1 rounded"
                          title="Take Attendance"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                          title="Edit Class"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(classItem)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Class"
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

      {/* Summary */}
      {filteredClasses.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filteredClasses.length} of {classes.length} classes
          </div>
          <div className="text-sm text-gray-500">
            {classes.filter(c => !c.teacherIds || c.teacherIds.length === 0).length} classes need teacher assignment
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagementPage; 