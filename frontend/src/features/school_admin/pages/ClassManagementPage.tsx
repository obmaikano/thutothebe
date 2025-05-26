import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchClasses, clearClassesError } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Class } from '../../../api/services/classApi';
import { Plus, Search, BookOpen, Edit, Trash2, Eye, Users, Calendar, Clock, Filter, Download } from 'lucide-react';

const ClassManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { classes, status, error } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { students } = useAppSelector(state => state.students);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchTeachers());
    dispatch(fetchStudents());
    return () => {
      dispatch(clearClassesError());
    };
  }, [dispatch]);

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
    window.location.href = `/app/classes/${classItem.id}`;
  };

  const handleAssignStudents = (classItem: Class) => {
    dispatch(openModal({
      title: 'Assign Students to Class',
      bodyType: MODAL_BODY_TYPES.CLASS_ASSIGN_STUDENT,
      extraObject: classItem
    }));
  };

  const handleManageTimetable = (classItem: Class) => {
    window.location.href = `/app/timetable/${classItem.id}`;
  };

  const handleTakeAttendance = (classItem: Class) => {
    dispatch(openModal({
      title: 'Take Attendance',
      bodyType: MODAL_BODY_TYPES.ATTENDANCE_TAKE,
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

    const matchesGrade = 
      gradeFilter === '' || classItem.grade.toString() === gradeFilter;

    const matchesActive = 
      activeFilter === '' ||
      (activeFilter === 'active' && classItem.active) ||
      (activeFilter === 'inactive' && !classItem.active);

    return matchesSearch && matchesGrade && matchesActive;
  });

  const getTeacherNames = (teacherIds: number[] | undefined) => {
    if (!teacherIds || teacherIds.length === 0) return 'Unassigned';
    const teacherNames = teacherIds
      .map(id => {
        const teacher = teachers.find(t => t.id === id);
        return teacher ? `${teacher.firstName} ${teacher.lastName}` : null;
      })
      .filter((name): name is string => name !== null);
    
    if (teacherNames.length === 0) return 'Unknown Teachers';
    if (teacherNames.length === 1) return teacherNames[0];
    return `${teacherNames[0]} +${teacherNames.length - 1} more`;
  };

  const getStudentCountByClass = (classId: number) => {
    return students.filter(s => s.classId === classId).length;
  };

  const getGradeBadgeColor = (grade: number) => {
    switch (grade) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      case 6: return 'bg-purple-100 text-purple-800';
      case 7: return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get unique values for filters
  const grades = [...new Set(classes.map(c => c.grade))].sort();

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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select 
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade.toString()}>
                Grade {grade}
              </option>
            ))}
          </select>
          
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
              setGradeFilter('');
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
                  {classes.filter(c => c.teacherIds && c.teacherIds.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">Classes with Teachers</div>
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
                  {Math.round((classes.reduce((total, classItem) => total + getStudentCountByClass(classItem.id), 0) / classes.length) || 0)}
                </div>
                <div className="text-sm text-gray-500">Avg Students/Class</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <BookOpen size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-sm">Try adjusting your search criteria or create a new class.</p>
          </div>
        ) : (
          filteredClasses.map((classItem: Class) => (
            <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                  <p className="text-sm text-gray-600">{classItem.description || 'No description'}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadgeColor(classItem.grade)}`}>
                    Grade {classItem.grade}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    classItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {classItem.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Teachers:</span>
                  <span className="text-sm font-medium text-gray-900 text-right max-w-32 truncate" title={getTeacherNames(classItem.teacherIds)}>
                    {getTeacherNames(classItem.teacherIds)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getStudentCountByClass(classItem.id)}
                    {classItem.capacity && ` / ${classItem.capacity}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capacity:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {classItem.capacity || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Enrollment:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {classItem.currentEnrollment || getStudentCountByClass(classItem.id)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleViewDetails(classItem)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Eye size={12} />
                  View Details
                </button>
                <button
                  onClick={() => handleAssignStudents(classItem)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                  <Users size={12} />
                  Assign Students
                </button>
                <button
                  onClick={() => handleManageTimetable(classItem)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  <Calendar size={12} />
                  Timetable
                </button>
                <button
                  onClick={() => handleTakeAttendance(classItem)}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                >
                  <Clock size={12} />
                  Attendance
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
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
                <div className="text-xs text-gray-500">
                  ID: {classItem.id}
                </div>
              </div>
            </div>
          ))
        )}
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