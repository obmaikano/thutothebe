import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchClassById, 
  clearCurrentClass, 
  clearClassesError,
  addStudentToClass,
  removeStudentFromClass,
  fetchClassWithStudents,
  removeTeacherFromClass
} from '../classesSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchStudents, fetchStudentsByClass } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { 
  fetchAttendanceByClass, 
  fetchAttendanceStats,
  fetchAttendanceSummary,
  clearError
} from '../../attendance/attendanceSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  UserMinus, 
  Edit, 
  School, 
  BookOpen,
  GraduationCap,
  Calendar,
  MapPin,
  Settings,
  BarChart3,
  ClipboardCheck,
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  User
} from 'lucide-react';

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentClass, status, error } = useAppSelector(state => state.classes);
  const { schools } = useAppSelector(state => state.schools);
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  const { 
    attendanceRecords, 
    attendanceStats, 
    attendanceSummary, 
    status: attendanceStatus 
  } = useAppSelector(state => state.attendance);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'reports' | 'attendance'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const classId = Number(id);
      dispatch(fetchClassWithStudents(classId));
      dispatch(fetchStudentsByClass(classId));
      dispatch(fetchSchools());
      dispatch(fetchStudents());
      dispatch(fetchTeachers());
      
      // Fetch attendance data for the class
      dispatch(fetchAttendanceByClass({ 
        classId, 
        filters: { 
          page: 0, 
          size: 10, 
          sortBy: 'attendanceDate', 
          sortDirection: 'DESC' 
        } 
      }));
      
      // Fetch attendance stats for the class
      dispatch(fetchAttendanceStats({ classId }));
      
      // Fetch attendance summary for the class
      dispatch(fetchAttendanceSummary({ classId }));
    }
    
    return () => {
      dispatch(clearCurrentClass());
      dispatch(clearClassesError());
      dispatch(clearError());
    };
  }, [dispatch, id]);

  // Update enrolled students when students data changes
  useEffect(() => {
    if (currentClass && students.length > 0) {
      // Filter students that are enrolled in this class using multiple approaches
      const classStudents = students.filter(student => {
        // Check via foreign key (classId)
        const enrolledViaFK = student.classId === currentClass.id;
        
        // Check via join table (studentIds array)
        const enrolledViaJoinTable = currentClass.studentIds && currentClass.studentIds.includes(student.id);
        
        // Student is enrolled if either relationship exists
        return enrolledViaFK || enrolledViaJoinTable;
      });
      
      setEnrolledStudents(classStudents);
    } else {
      setEnrolledStudents([]);
    }
  }, [currentClass, students]);

  // Helper functions
  const getSchoolName = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : `School ${schoolId}`;
  };

  const getEnrolledStudents = () => {
    return enrolledStudents;
  };

  const getAssignedTeachers = () => {
    if (!currentClass || !currentClass.teacherIds) return [];
    return teachers.filter(teacher => currentClass.teacherIds!.includes(teacher.id));
  };

  const handleDataRefresh = async () => {
    if (!currentClass) return;
    
    try {
      setIsLoading(true);
      // Force refresh all related data
      await Promise.all([
        dispatch(fetchClassWithStudents(currentClass.id)),
        dispatch(fetchStudentsByClass(currentClass.id)),
        dispatch(fetchStudents()),
        dispatch(fetchTeachers()),
        dispatch(fetchAttendanceByClass({ 
          classId: currentClass.id, 
          filters: { 
            page: 0, 
            size: 10, 
            sortBy: 'attendanceDate', 
            sortDirection: 'DESC' 
          } 
        })),
        dispatch(fetchAttendanceStats({ classId: currentClass.id })),
        dispatch(fetchAttendanceSummary({ classId: currentClass.id }))
      ]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAttendanceData = async () => {
    if (!currentClass) return;
    
    try {
      await Promise.all([
        dispatch(fetchAttendanceByClass({ 
          classId: currentClass.id, 
          filters: { 
            page: 0, 
            size: 10, 
            sortBy: 'attendanceDate', 
            sortDirection: 'DESC' 
          } 
        })),
        dispatch(fetchAttendanceStats({ classId: currentClass.id })),
        dispatch(fetchAttendanceSummary({ classId: currentClass.id }))
      ]);
    } catch (error) {
      console.error('Failed to refresh attendance data:', error);
    }
  };

  const handleEditClass = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Edit Class',
        bodyType: MODAL_BODY_TYPES.CLASS_EDIT,
        extraObject: currentClass
      }));
    }
  };

  const handleAddStudent = () => {
    // Filter students to only include those who are:
    // 1. Active
    // 2. Not already enrolled in this class
    // 3. Not already enrolled in another class (optional - depends on business rules)
    const availableStudents = students.filter(student => {
      // Must be active
      if (!student.active) return false;
      
      // Check if already enrolled in this class via classId
      if (student.classId === currentClass?.id) return false;
      
      // Check if already enrolled in this class via studentIds array
      if (currentClass?.studentIds && currentClass.studentIds.includes(student.id)) return false;
      
      // Check if student is in the enrolledStudents list
      if (enrolledStudents.some(enrolled => enrolled.id === student.id)) return false;
      
      return true;
    });

    dispatch(openModal({
      title: 'Add Student to Class',
      bodyType: MODAL_BODY_TYPES.STUDENT_ASSIGN_CLASS,
      extraObject: {
        classId: currentClass?.id,
        availableStudents,
        classInfo: {
          name: currentClass?.name,
          gradeLevel: currentClass?.gradeLevel,
          capacity: currentClass?.capacity
        }
      }
    }));
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (!currentClass) return;
    
    try {
      setIsLoading(true);
      await dispatch(removeStudentFromClass({ 
        classId: currentClass.id, 
        studentId 
      })).unwrap();
      
      // Refresh all necessary data
      await Promise.all([
        dispatch(fetchClassWithStudents(currentClass.id)),
        dispatch(fetchStudentsByClass(currentClass.id)),
        dispatch(fetchStudents()) // Refresh the general students list
      ]);
    } catch (error: any) {
      console.error('Failed to remove student:', error);
      // Show user-friendly error message
      if (error.includes('already enrolled') || error.includes('duplicate key')) {
        alert('This student is already enrolled in the class.');
      } else {
        alert('Failed to remove student from class. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTeacher = () => {
    // Filter out teachers who are already assigned to this class
    const availableTeachers = teachers.filter(teacher => 
      !currentClass?.teacherIds?.includes(teacher.id)
    );

    dispatch(openModal({
      title: 'Assign Teacher to Class',
      bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS,
      extraObject: {
        classId: currentClass?.id,
        className: currentClass?.name,
        gradeLevel: currentClass?.gradeLevel,
        availableTeachers
      }
    }));
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    if (!currentClass) return;
    
    try {
      setIsLoading(true);
      await dispatch(removeTeacherFromClass({ 
        classId: currentClass.id, 
        teacherId 
      })).unwrap();
      
      // Refresh all necessary data
      await Promise.all([
        dispatch(fetchClassWithStudents(currentClass.id)),
        dispatch(fetchTeachers())
      ]);
    } catch (error: any) {
      console.error('Failed to remove teacher:', error);
      alert('Failed to remove teacher from class. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeAttendance = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Take Attendance',
        bodyType: MODAL_BODY_TYPES.ATTENDANCE_TAKE,
        size: 'lg',
        extraObject: { 
          classId: currentClass.id, 
          className: currentClass.name,
          students: getEnrolledStudents(),
          onSuccess: refreshAttendanceData // Callback to refresh attendance data
        }
      }));
    }
  };

  const handleGenerateReport = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Generate Report',
        bodyType: MODAL_BODY_TYPES.REPORT_GENERATE,
        size: 'lg',
        extraObject: { 
          classId: currentClass.id, 
          className: currentClass.name,
          studentCount: currentClass.currentEnrollment || 0
        }
      }));
    }
  };

  const handleViewCalendar = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Class Calendar',
        bodyType: MODAL_BODY_TYPES.CALENDAR_VIEW,
        size: 'lg',
        extraObject: { 
          classId: currentClass.id, 
          className: currentClass.name
        }
      }));
    }
  };

  if (status === 'loading' || !currentClass) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium">Error loading class details</h3>
              <p className="mt-1 text-sm">
                {error.includes('duplicate key') || error.includes('constraint') 
                  ? 'There is a data synchronization issue. Some students may appear to be enrolled multiple times. Please contact your administrator.'
                  : error
                }
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => navigate('/app/class-management')}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
                >
                  Return to Classes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const assignedTeachers = getAssignedTeachers();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/class-management')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{currentClass.name}</h1>
            <p className="text-sm text-gray-500">
              {currentClass.gradeLevel ? `${currentClass.gradeLevel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}` : ''} • {getSchoolName(currentClass.schoolId)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
            currentClass.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {currentClass.active ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={handleDataRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            title="Refresh class data"
          >
            <Clock className="h-4 w-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleEditClass}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Class
          </button>
        </div>
      </div>

      {/* Class Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-wente border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {enrolledStudents.length}
              </div>
              <div className="text-sm text-gray-500">Enrolled Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentClass.capacity || 'N/A'}
              </div>
              <div className="text-sm text-gray-500">Class Capacity</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <GraduationCap className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {assignedTeachers.length}
              </div>
              <div className="text-sm text-gray-500">Assigned Teachers</div>
              <div className="text-xs text-gray-400 mt-1">
                {assignedTeachers.filter(t => t.active).length} Active
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg mr-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentClass.capacity ? 
                  Math.max(0, currentClass.capacity - enrolledStudents.length) : 
                  'N/A'
                }
              </div>
              <div className="text-sm text-gray-500">Available Spots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: School },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'teachers', label: 'Teachers', icon: GraduationCap },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'attendance', label: 'Attendance', icon: ClipboardCheck }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <School className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Class Name</div>
                    <div className="text-sm text-gray-600">{currentClass.name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Grade Level</div>
                    <div className="text-sm text-gray-600">{currentClass.gradeLevel ? currentClass.gradeLevel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">School</div>
                    <div className="text-sm text-gray-600">{getSchoolName(currentClass.schoolId)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Status</div>
                    <div className="text-sm text-gray-600">
                      {currentClass.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </div>
              
              {currentClass.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{currentClass.description}</p>
                </div>
              )}
            </div>

            {/* Enrollment Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Enrollment</span>
                  <span className="text-sm font-medium">{enrolledStudents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Class Capacity</span>
                  <span className="text-sm font-medium">{currentClass.capacity || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available Spots</span>
                  <span className="text-sm font-medium">
                    {currentClass.capacity ? 
                      Math.max(0, currentClass.capacity - enrolledStudents.length) : 
                      'N/A'
                    }
                  </span>
                </div>
                
                {/* Enrollment Progress Bar */}
                {currentClass.capacity && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Enrollment Progress</span>
                      <span>
                        {Math.round((enrolledStudents.length / currentClass.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (enrolledStudents.length / currentClass.capacity) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Enrolled Students ({enrolledStudents.length})
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddStudent}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Student
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrolledStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.admissionNumber || student.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            student.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.active ? 'Active' : 'Inactive'}
                          </span>
                          {student.status && (
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.status === 'ACTIVE' 
                                ? 'bg-blue-100 text-blue-800'
                                : student.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemoveStudent(student.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Remove from class"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {enrolledStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No students enrolled</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding students to this class.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAddStudent}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Student
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assigned Teachers ({assignedTeachers.length})
                </h3>
                <div className="flex gap-3">
                  <button
                    onClick={handleAssignTeacher}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Assign Teacher
                  </button>
                </div>
              </div>
            </div>
            
            {assignedTeachers.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers assigned</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by assigning a teacher to this class.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAssignTeacher}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Assign Teacher
                  </button>
                </div>
              </div>
            ) : (
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignedTeachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-purple-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {teacher.firstName} {teacher.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {teacher.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.staffId || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              teacher.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {teacher.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveTeacher(teacher.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Remove from class"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Reports tab</h3>
            <p className="mt-1 text-sm text-gray-500">Reporting functionality coming soon.</p>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {enrolledStudents.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Students</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {attendanceStats?.attendanceRate ? Math.round(attendanceStats.attendanceRate) : 0}%
                    </div>
                    <div className="text-sm text-gray-500">Attendance Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {attendanceStats?.lateCount || 0}
                    </div>
                    <div className="text-sm text-gray-500">Late Today</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(attendanceStats?.absentExcusedCount || 0) + (attendanceStats?.absentUnexcusedCount || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Absent Today</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleTakeAttendance}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    Take Attendance
                  </button>
                  <button
                    onClick={() => {
                      dispatch(openModal({
                        title: 'Attendance Report',
                        bodyType: MODAL_BODY_TYPES.ATTENDANCE_REPORT,
                        size: 'lg',
                        extraObject: { 
                          classId: currentClass?.id, 
                          className: currentClass?.name,
                          students: enrolledStudents
                        }
                      }));
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Report
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Today's Attendance</h4>
                  <p className="text-sm text-gray-600 mb-3">Mark attendance for today's class</p>
                  <button
                    onClick={handleTakeAttendance}
                    className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Mark Today
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Bulk Operations</h4>
                  <p className="text-sm text-gray-600 mb-3">Mark all students present or absent</p>
                  <button
                    onClick={() => {
                      dispatch(openModal({
                        title: 'Bulk Attendance',
                        bodyType: MODAL_BODY_TYPES.ATTENDANCE_BULK_MARK,
                        size: 'lg',
                        extraObject: { 
                          classId: currentClass?.id, 
                          className: currentClass?.name,
                          students: enrolledStudents
                        }
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                  >
                    Bulk Mark
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                  <p className="text-sm text-gray-600 mb-3">Export attendance records</p>
                  <button
                    onClick={() => {
                      dispatch(openModal({
                        title: 'Export Attendance',
                        bodyType: MODAL_BODY_TYPES.ATTENDANCE_REPORT,
                        size: 'lg',
                        extraObject: { 
                          classId: currentClass?.id, 
                          className: currentClass?.name,
                          mode: 'export'
                        }
                      }));
                    }}
                    className="w-full px-3 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Attendance Records
                  </h3>
                  <button
                    onClick={() => {
                      dispatch(openModal({
                        title: 'Attendance History',
                        bodyType: MODAL_BODY_TYPES.ATTENDANCE_VIEW_DETAILS,
                        size: 'lg',
                        extraObject: { 
                          classId: currentClass?.id, 
                          className: currentClass?.name,
                          students: enrolledStudents
                        }
                      }));
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View All
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {attendanceRecords.length > 0 ? (
                  <div className="space-y-4">
                    {attendanceRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              record.attendanceStatus === 'PRESENT' ? 'bg-green-500' :
                              record.attendanceStatus === 'LATE' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {record.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(record.attendanceDate).toLocaleDateString()} • {record.attendanceType}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            record.attendanceStatus === 'PRESENT' ? 'bg-green-100 text-green-800' :
                            record.attendanceStatus === 'LATE' ? 'bg-yellow-100 text-yellow-800' :
                            record.attendanceStatus === 'ABSENT_EXCUSED' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.attendanceStatus.replace('_', ' ')}
                          </span>
                          {record.arrivalTime && (
                            <span className="text-xs text-gray-500">
                              Arrived: {record.arrivalTime}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardCheck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-sm font-medium text-gray-900">No recent attendance records</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start tracking attendance by marking today's attendance.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleTakeAttendance}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Take Attendance
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student Attendance Summary */}
            {enrolledStudents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Student Attendance Summary
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Attendance Rate
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Marked
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {enrolledStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {student.admissionNumber || student.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              student.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {(() => {
                                const studentRecords = attendanceRecords.filter(record => record.studentEntityId === student.id);
                                if (studentRecords.length === 0) return 'N/A';
                                
                                const presentCount = studentRecords.filter(record => record.attendanceStatus === 'PRESENT').length;
                                const attendanceRate = Math.round((presentCount / studentRecords.length) * 100);
                                return `${attendanceRate}%`;
                              })()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-500">
                              {(() => {
                                const studentRecords = attendanceRecords.filter(record => record.studentEntityId === student.id);
                                if (studentRecords.length === 0) return 'Never';
                                
                                const latestRecord = studentRecords.sort((a, b) => 
                                  new Date(b.attendanceDate).getTime() - new Date(a.attendanceDate).getTime()
                                )[0];
                                
                                return new Date(latestRecord.attendanceDate).toLocaleDateString();
                              })()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                dispatch(openModal({
                                  title: 'Mark Student Attendance',
                                  bodyType: MODAL_BODY_TYPES.ATTENDANCE_MARK,
                                  size: 'lg',
                                  extraObject: { 
                                    studentId: student.id,
                                    classId: currentClass?.id,
                                    studentName: `${student.firstName} ${student.lastName}`,
                                    mode: 'create',
                                    onSuccess: refreshAttendanceData
                                  }
                                }));
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark attendance for this student"
                            >
                              <ClipboardCheck className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailPage; 