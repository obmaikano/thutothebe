import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchAttendanceRecords, 
  deleteAttendanceRecord, 
  deleteBulkAttendance,
  exportAttendance,
  setFilters,
  clearFilters
} from '../attendanceSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { AttendanceFilters } from '../../../api/services/attendanceApi';
import studentApi, { Student } from '../../../api/services/studentApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import subjectApi, { Subject } from '../../../api/services/subjectApi';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Calendar,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Timer,
  LogOut,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';

const AttendanceListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { attendanceRecords, status, error, filters } = useAppSelector(state => state.attendance);
  const { user } = useAppSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<AttendanceFilters>({
    page: 0,
    size: 20,
    sortBy: 'attendanceDate',
    sortDirection: 'DESC'
  });

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState({
    students: false,
    classes: false,
    courses: false,
    subjects: false
  });

  // Load initial data
  useEffect(() => {
    loadClasses();
    loadStudents();
  }, [user]);

  // Load courses when class is selected
  useEffect(() => {
    if (localFilters.classId) {
      loadCoursesByClass(localFilters.classId);
    }
  }, [localFilters.classId]);

  // Load subjects when course is selected
  useEffect(() => {
    if (localFilters.courseId) {
      loadSubjectsByCourse(localFilters.courseId);
    }
  }, [localFilters.courseId]);

  // Load attendance records on component mount and when filters change
  useEffect(() => {
    dispatch(fetchAttendanceRecords(filters));
  }, [dispatch, filters]);

  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      let response;
      if (user?.role === 'TEACHER' && user?.id) {
        response = await studentApi.getActiveByTeacher(user.id);
      } else {
        response = await studentApi.getActive();
      }
      if (response.data.data && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const loadClasses = async () => {
    setLoading(prev => ({ ...prev, classes: true }));
    try {
      let response;
      if (user?.role === 'TEACHER' && user?.id) {
        response = await classApi.getActiveByTeacher(user.id);
      } else {
        response = await classApi.getActiveClasses();
      }
      if (response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  const loadCoursesByClass = async (classId: number) => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const response = await courseApi.getActiveByClass(classId);
      if (response.data.data && Array.isArray(response.data.data)) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const loadSubjectsByCourse = async (courseId: number) => {
    setLoading(prev => ({ ...prev, subjects: true }));
    try {
      // Find the course to get its subject
      const course = courses.find(c => c.id === courseId);
      if (course?.subjectId) {
        const response = await subjectApi.getById(course.subjectId);
        if (response.data.data && !Array.isArray(response.data.data)) {
          setSubjects([response.data.data]);
        }
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    } finally {
      setLoading(prev => ({ ...prev, subjects: false }));
    }
  };

  // Role-based permissions
  const canEdit = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD', 'SENIOR_TEACHER', 'TEACHER'].includes(user?.role || '');
  const canDelete = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'DEPARTMENT_HEAD'].includes(user?.role || '');
  const canViewAll = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'SCHOOL_HEAD', 'DEPARTMENT_HEAD'].includes(user?.role || '');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Implement search logic here
  };

  const handleFilterChange = (field: keyof AttendanceFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    setShowFilters(false);
  };

  const clearAllFilters = () => {
    setLocalFilters({
      page: 0,
      size: 20,
      sortBy: 'attendanceDate',
      sortDirection: 'DESC'
    });
    dispatch(clearFilters());
    setShowFilters(false);
  };

  const handleViewDetails = (attendanceId: number) => {
    dispatch(openModal({
      title: 'Attendance Details',
      bodyType: MODAL_BODY_TYPES.ATTENDANCE_VIEW_DETAILS,
      extraObject: { attendanceId }
    }));
  };

  const handleEdit = (attendanceId: number) => {
    dispatch(openModal({
      title: 'Edit Attendance',
      bodyType: MODAL_BODY_TYPES.ATTENDANCE_EDIT,
      extraObject: { attendanceId, mode: 'edit' }
    }));
  };

  const handleDelete = async (attendanceId: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await dispatch(deleteAttendanceRecord(attendanceId)).unwrap();
      } catch (error) {
        console.error('Failed to delete attendance record:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} attendance records?`)) {
      try {
        await dispatch(deleteBulkAttendance(selectedRecords)).unwrap();
        setSelectedRecords([]);
      } catch (error) {
        console.error('Failed to delete attendance records:', error);
      }
    }
  };

  const handleExport = async (format: 'CSV' | 'PDF' | 'EXCEL') => {
    try {
      await dispatch(exportAttendance({ filters, format })).unwrap();
    } catch (error) {
      console.error('Failed to export attendance:', error);
    }
  };

  const handleSelectRecord = (recordId: number) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecords.length === attendanceRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(attendanceRecords.map(record => record.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'ABSENT_EXCUSED':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'ABSENT_UNEXCUSED':
        return <XCircle className="w-4 h-4 text-error" />;
      case 'LATE':
        return <Timer className="w-4 h-4 text-info" />;
      case 'EARLY_DEPARTURE':
        return <LogOut className="w-4 h-4 text-secondary" />;
      default:
        return <Clock className="w-4 h-4 text-base-content" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'badge-success';
      case 'ABSENT_EXCUSED':
        return 'badge-warning';
      case 'ABSENT_UNEXCUSED':
        return 'badge-error';
      case 'LATE':
        return 'badge-info';
      case 'EARLY_DEPARTURE':
        return 'badge-secondary';
      default:
        return 'badge-ghost';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DAILY':
        return <Calendar className="w-4 h-4" />;
      case 'PERIOD':
        return <Clock className="w-4 h-4" />;
      case 'EVENT':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return timeString;
  };

  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      !localFilters.courseId || courses.find(c => c.id === localFilters.courseId)?.subjectId === subject.id
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance Records</h1>
          <p className="text-gray-600">View and manage attendance records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(fetchAttendanceRecords(filters))}
            className="btn btn-ghost btn-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => dispatch(openModal({
              title: 'Mark Attendance',
              bodyType: MODAL_BODY_TYPES.ATTENDANCE_MARK,
              extraObject: { mode: 'create' }
            }))}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Actions */}
      <div className="bg-base-100 p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <div className="form-control flex-1 max-w-md">
              <div className="input-group">
                <span>
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search students, classes..."
                  className="input input-bordered flex-1"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-outline btn-sm ${showFilters ? 'btn-active' : ''}`}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedRecords.length > 0 && canDelete && (
              <button
                onClick={handleBulkDelete}
                className="btn btn-error btn-sm"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete ({selectedRecords.length})
              </button>
            )}
            
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline btn-sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => handleExport('CSV')}>Export as CSV</a></li>
                <li><a onClick={() => handleExport('EXCEL')}>Export as Excel</a></li>
                <li><a onClick={() => handleExport('PDF')}>Export as PDF</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Student</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.studentEntityId || ''}
                  onChange={(e) => handleFilterChange('studentEntityId', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={loading.students}
                >
                  <option value="">
                    {loading.students ? 'Loading students...' : 'All Students'}
                  </option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Class</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.classId || ''}
                  onChange={(e) => handleFilterChange('classId', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={loading.classes}
                >
                  <option value="">
                    {loading.classes ? 'Loading classes...' : 'All Classes'}
                  </option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Course</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.courseId || ''}
                  onChange={(e) => handleFilterChange('courseId', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!localFilters.classId || loading.courses}
                >
                  <option value="">
                    {loading.courses ? 'Loading courses...' : 'All Courses'}
                  </option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.subjectId || ''}
                  onChange={(e) => handleFilterChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={!localFilters.courseId || loading.subjects}
                >
                  <option value="">
                    {loading.subjects ? 'Loading subjects...' : 'All Subjects'}
                  </option>
                  {getFilteredSubjects().map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Status</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.attendanceStatus || ''}
                  onChange={(e) => handleFilterChange('attendanceStatus', e.target.value as any)}
                >
                  <option value="">All Statuses</option>
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT_EXCUSED">Absent (Excused)</option>
                  <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
                  <option value="LATE">Late</option>
                  <option value="EARLY_DEPARTURE">Early Departure</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Type</span>
                </label>
                <select
                  className="select select-bordered select-sm"
                  value={localFilters.attendanceType || ''}
                  onChange={(e) => handleFilterChange('attendanceType', e.target.value as any)}
                >
                  <option value="">All Types</option>
                  <option value="DAILY">Daily</option>
                  <option value="PERIOD">Period</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={localFilters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">End Date</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered input-sm"
                  value={localFilters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Academic Year</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered input-sm"
                  value={localFilters.academicYear || ''}
                  onChange={(e) => handleFilterChange('academicYear', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={clearAllFilters}
                className="btn btn-ghost btn-sm"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="btn btn-primary btn-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Records Table */}
      <div className="bg-base-100 rounded-lg border">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={selectedRecords.length === attendanceRecords.length && attendanceRecords.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Student</th>
                <th>Class</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Times</th>
                <th>Marked By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <td colSpan={9} className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => handleSelectRecord(record.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{record.studentName}</div>
                        <div className="text-sm text-gray-500">ID: {record.studentEntityId}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{record.className}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(record.attendanceDate)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(record.attendanceType)}
                        <span className="text-sm">
                          {record.attendanceType}
                          {record.attendanceType === 'PERIOD' && record.periodNumber && (
                            <span className="text-xs text-gray-500"> (P{record.periodNumber})</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.attendanceStatus)}
                        <span className={`badge badge-sm ${getStatusBadgeClass(record.attendanceStatus)}`}>
                          {record.attendanceStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {record.arrivalTime && (
                          <div>Arrival: {formatTime(record.arrivalTime)}</div>
                        )}
                        {record.departureTime && (
                          <div>Departure: {formatTime(record.departureTime)}</div>
                        )}
                        {!record.arrivalTime && !record.departureTime && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{record.markedByName}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(record.markedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                          <li>
                            <a onClick={() => handleViewDetails(record.id)}>
                              <Eye className="w-4 h-4" />
                              View Details
                            </a>
                          </li>
                          {canEdit && (
                            <li>
                              <a onClick={() => handleEdit(record.id)}>
                                <Edit className="w-4 h-4" />
                                Edit
                              </a>
                            </li>
                          )}
                          {canDelete && (
                            <li>
                              <a onClick={() => handleDelete(record.id)} className="text-error">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {attendanceRecords.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {attendanceRecords.length} records
            </div>
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">3</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceListPage; 