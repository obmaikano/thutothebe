import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchClassById, 
  clearCurrentClass, 
  clearClassesError,
  addStudentToClass,
  removeStudentFromClass
} from '../classesSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
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
  Clock
} from 'lucide-react';

const ClassDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentClass, status, error } = useAppSelector(state => state.classes);
  const { schools } = useAppSelector(state => state.schools);
  const { students } = useAppSelector(state => state.students);
  const { teachers } = useAppSelector(state => state.teachers);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'reports' | 'attendance'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchClassById(Number(id)));
      dispatch(fetchSchools());
      dispatch(fetchStudents());
      dispatch(fetchTeachers());
    }
    
    return () => {
      dispatch(clearCurrentClass());
      dispatch(clearClassesError());
    };
  }, [dispatch, id]);

  // Helper functions
  const getSchoolName = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : `School ${schoolId}`;
  };

  const getEnrolledStudents = () => {
    if (!currentClass) return [];
    // In a real implementation, this would come from the API
    // For now, we'll simulate based on currentEnrollment
    return students.slice(0, currentClass.currentEnrollment || 0);
  };

  const getAssignedTeachers = () => {
    // In a real implementation, this would come from the API
    // For now, we'll simulate some assigned teachers
    return teachers.slice(0, 2);
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
    dispatch(openModal({
      title: 'Add Student to Class',
      bodyType: MODAL_BODY_TYPES.STUDENT_ASSIGN_CLASS,
      extraObject: { classId: currentClass?.id, availableStudents: students }
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
      // Refresh class data
      dispatch(fetchClassById(currentClass.id));
    } catch (error) {
      console.error('Failed to remove student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignTeacher = () => {
    dispatch(openModal({
      title: 'Assign Teacher to Class',
      bodyType: MODAL_BODY_TYPES.TEACHER_ASSIGN_CLASS,
      extraObject: { classId: currentClass?.id, availableTeachers: teachers }
    }));
  };

  const handleTakeAttendance = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Take Attendance',
        bodyType: MODAL_BODY_TYPES.ATTENDANCE_TAKE,
        extraObject: { 
          classId: currentClass.id, 
          className: currentClass.name,
          students: getEnrolledStudents()
        }
      }));
    }
  };

  const handleGenerateReport = () => {
    if (currentClass) {
      dispatch(openModal({
        title: 'Generate Report',
        bodyType: MODAL_BODY_TYPES.REPORT_GENERATE,
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
          <p>Error loading class details: {error}</p>
          <button
            onClick={() => navigate('/app/classes')}
            className="mt-2 text-sm underline"
          >
            Return to Classes
          </button>
        </div>
      </div>
    );
  }

  const enrolledStudents = getEnrolledStudents();
  const assignedTeachers = getAssignedTeachers();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/classes')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{currentClass.name}</h1>
            <p className="text-sm text-gray-500">
              Grade {currentClass.grade} • {getSchoolName(currentClass.schoolId)}
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
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {currentClass.currentEnrollment || 0}
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
                  Math.max(0, currentClass.capacity - (currentClass.currentEnrollment || 0)) : 
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
                    <div className="text-sm text-gray-600">Grade {currentClass.grade}</div>
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
                  <span className="text-sm font-medium">{currentClass.currentEnrollment || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Class Capacity</span>
                  <span className="text-sm font-medium">{currentClass.capacity || 'Not set'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available Spots</span>
                  <span className="text-sm font-medium">
                    {currentClass.capacity ? 
                      Math.max(0, currentClass.capacity - (currentClass.currentEnrollment || 0)) : 
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
                        {Math.round(((currentClass.currentEnrollment || 0) / currentClass.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, ((currentClass.currentEnrollment || 0) / currentClass.capacity) * 100)}%` 
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
                <button
                  onClick={handleAddStudent}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </button>
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
                        {student.id}
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
                <button
                  onClick={handleAssignTeacher}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Teacher
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
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
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <GraduationCap className="h-6 w-6 text-green-600" />
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.qualification || 'General'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Class Teacher
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          teacher.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-red-600 hover:text-red-900"
                          title="Remove assignment"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {assignedTeachers.length === 0 && (
                <div className="text-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers assigned</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Assign teachers to manage this class.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleAssignTeacher}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Teacher
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Class Average</h3>
                    <div className="text-3xl font-bold text-blue-600">85.2%</div>
                    <div className="text-sm text-gray-500">Overall performance</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Performers</h3>
                    <div className="text-3xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-500">Above 90%</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Support</h3>
                    <div className="text-3xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-500">Below 60%</div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
              <div className="space-y-4">
                {[
                  { subject: 'Mathematics', average: 87, students: 28, color: 'blue' },
                  { subject: 'English', average: 84, students: 28, color: 'green' },
                  { subject: 'Science', average: 89, students: 28, color: 'purple' },
                  { subject: 'Social Studies', average: 82, students: 28, color: 'orange' }
                ].map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full bg-${subject.color}-500`}></div>
                      <div>
                        <div className="font-medium text-gray-900">{subject.subject}</div>
                        <div className="text-sm text-gray-500">{subject.students} students</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{subject.average}%</div>
                      <div className="text-sm text-gray-500">Class average</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assessments</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'Chapter 5 Quiz', subject: 'Mathematics', date: '2024-01-15', submitted: '25/28', average: '88%' },
                      { name: 'Essay Assignment', subject: 'English', date: '2024-01-12', submitted: '28/28', average: '85%' },
                      { name: 'Lab Report', subject: 'Science', date: '2024-01-10', submitted: '27/28', average: '92%' }
                    ].map((assessment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assessment.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.submitted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assessment.average}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Attendance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Attendance</h3>
                    <div className="text-3xl font-bold text-green-600">26/28</div>
                    <div className="text-sm text-gray-500">92.9% present</div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <ClipboardCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
                    <div className="text-3xl font-bold text-blue-600">91.5%</div>
                    <div className="text-sm text-gray-500">Average attendance</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Perfect Attendance</h3>
                    <div className="text-3xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-gray-500">Students</div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">At Risk</h3>
                    <div className="text-3xl font-bold text-red-600">2</div>
                    <div className="text-sm text-gray-500">Below 80%</div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <Clock className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTakeAttendance}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Take Attendance
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
                <button
                  onClick={handleViewCalendar}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </button>
              </div>
            </div>

            {/* Attendance Trends */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Trends</h3>
              <div className="space-y-4">
                {[
                  { date: '2024-01-15', present: 26, absent: 2, percentage: 92.9 },
                  { date: '2024-01-14', present: 25, absent: 3, percentage: 89.3 },
                  { date: '2024-01-13', present: 27, absent: 1, percentage: 96.4 },
                  { date: '2024-01-12', present: 24, absent: 4, percentage: 85.7 },
                  { date: '2024-01-11', present: 26, absent: 2, percentage: 92.9 }
                ].map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-900">{day.date}</div>
                      <div className="text-sm text-gray-500">
                        {day.present} present, {day.absent} absent
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${day.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-gray-900 w-12">
                        {day.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Attendance */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Attendance Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        This Week
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        This Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Overall
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enrolledStudents.slice(0, 10).map((student, index) => {
                      const weeklyAttendance = Math.floor(Math.random() * 20) + 80;
                      const monthlyAttendance = Math.floor(Math.random() * 15) + 85;
                      const overallAttendance = Math.floor(Math.random() * 10) + 90;
                      
                      return (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {student.firstName} {student.lastName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {weeklyAttendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {monthlyAttendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {overallAttendance}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              overallAttendance >= 95 
                                ? 'bg-green-100 text-green-800' 
                                : overallAttendance >= 85
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {overallAttendance >= 95 ? 'Excellent' : overallAttendance >= 85 ? 'Good' : 'At Risk'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassDetailPage; 