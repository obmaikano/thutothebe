import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchAttendanceByClass, 
  createBulkAttendance, 
  updateBulkAttendance,
  quickMarkAllPresent,
  quickMarkAllAbsent,
  notifyParents,
  fetchAttendanceStats
} from '../attendanceSlice';
import { BulkAttendanceRequest } from '../../../api/services/attendanceApi';
import studentApi, { Student } from '../../../api/services/studentApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import subjectApi, { Subject } from '../../../api/services/subjectApi';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  UserCheck, 
  Save,
  Bell,
  BarChart3,
  Filter,
  RefreshCw
} from 'lucide-react';

interface StudentAttendance {
  studentEntityId: number;
  studentName: string;
  admissionNumber: string;
  attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';
  arrivalTime?: string;
  departureTime?: string;
  remarks?: string;
  existingRecordId?: number;
}

const AttendanceMarkingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { attendanceRecords, attendanceStats, status, error } = useAppSelector(state => state.attendance);
  const { user } = useAppSelector(state => state.auth);

  // Form state
  const [selectedClass, setSelectedClass] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceType, setAttendanceType] = useState<'DAILY' | 'PERIOD' | 'EVENT'>('DAILY');
  const [periodNumber, setPeriodNumber] = useState<number | undefined>(undefined);
  const [periodStartTime, setPeriodStartTime] = useState<string>('');
  const [periodEndTime, setPeriodEndTime] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<number>(new Date().getFullYear());
  const [term, setTerm] = useState<'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM'>('FIRST_TERM');
  const [courseId, setCourseId] = useState<number | undefined>(undefined);
  const [subjectId, setSubjectId] = useState<number | undefined>(undefined);

  const [studentAttendances, setStudentAttendances] = useState<StudentAttendance[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingRecords, setHasExistingRecords] = useState(false);

  // Data state
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState({
    classes: false,
    courses: false,
    subjects: false,
    students: false
  });

  // Load initial data
  useEffect(() => {
    loadClasses();
  }, [user]);

  // Load courses when class is selected
  useEffect(() => {
    if (selectedClass) {
      loadCoursesByClass(selectedClass);
    }
  }, [selectedClass]);

  // Load subjects when course is selected
  useEffect(() => {
    if (courseId) {
      loadSubjectsByCourse(courseId);
    }
  }, [courseId]);

  // Load existing attendance records when class or date changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      dispatch(fetchAttendanceByClass({ 
        classId: selectedClass, 
        filters: { 
          attendanceDate: selectedDate,
          attendanceType,
          periodNumber: attendanceType === 'PERIOD' ? periodNumber : undefined
        } 
      }));
    }
  }, [dispatch, selectedClass, selectedDate, attendanceType, periodNumber]);

  // Initialize student attendances when class is selected
  useEffect(() => {
    if (selectedClass) {
      loadStudentsByClass(selectedClass);
    }
  }, [selectedClass, attendanceRecords]);

  // Load attendance stats
  useEffect(() => {
    if (selectedClass && selectedDate) {
      dispatch(fetchAttendanceStats({
        classId: selectedClass,
        attendanceDate: selectedDate,
        academicYear,
        term
      }));
    }
  }, [dispatch, selectedClass, selectedDate, academicYear, term]);

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

  const loadStudentsByClass = async (classId: number) => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await studentApi.getActiveByClass(classId);
      if (response.data.data && Array.isArray(response.data.data)) {
        const initialAttendances: StudentAttendance[] = response.data.data.map((student: Student) => {
          const existingRecord = attendanceRecords.find(
            record => record.studentEntityId === student.id
          );
          
          return {
            studentEntityId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            admissionNumber: student.admissionNumber,
            attendanceStatus: existingRecord?.attendanceStatus || 'PRESENT',
            arrivalTime: existingRecord?.arrivalTime,
            departureTime: existingRecord?.departureTime,
            remarks: existingRecord?.remarks,
            existingRecordId: existingRecord?.id
          };
        });
        
        setStudentAttendances(initialAttendances);
        setHasExistingRecords(attendanceRecords.length > 0);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const handleStudentAttendanceChange = (studentId: number, field: keyof StudentAttendance, value: any) => {
    setStudentAttendances(prev => 
      prev.map(student => 
        student.studentEntityId === studentId 
          ? { ...student, [field]: value }
          : student
      )
    );
  };

  const handleQuickMarkAll = (status: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED') => {
    setStudentAttendances(prev => 
      prev.map(student => ({
        ...student,
        attendanceStatus: status,
        arrivalTime: status === 'PRESENT' ? '08:00' : undefined
      }))
    );
  };

  const handleQuickMarkAllAPI = async (status: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED') => {
    if (!selectedClass || !selectedDate) return;

    try {
      if (status === 'PRESENT') {
        await dispatch(quickMarkAllPresent({
          classId: selectedClass,
          date: selectedDate,
          type: attendanceType,
          periodNumber: attendanceType === 'PERIOD' ? periodNumber : undefined,
          markedById: user?.id
        })).unwrap();
      } else {
        await dispatch(quickMarkAllAbsent({
          classId: selectedClass,
          date: selectedDate,
          type: attendanceType,
          periodNumber: attendanceType === 'PERIOD' ? periodNumber : undefined,
          markedById: user?.id,
          absentType: status
        })).unwrap();
      }
      
      // Refresh the data
      dispatch(fetchAttendanceByClass({ 
        classId: selectedClass, 
        filters: { attendanceDate: selectedDate } 
      }));
    } catch (error) {
      console.error('Failed to quick mark attendance:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedDate) return;

    setIsSubmitting(true);
    
    try {
      const bulkData: BulkAttendanceRequest = {
        classId: selectedClass,
        courseId,
        subjectId,
        attendanceDate: selectedDate,
        attendanceType,
        periodNumber: attendanceType === 'PERIOD' ? periodNumber : undefined,
        periodStartTime: attendanceType === 'PERIOD' ? periodStartTime : undefined,
        periodEndTime: attendanceType === 'PERIOD' ? periodEndTime : undefined,
        academicYear,
        term,
        studentAttendances: studentAttendances.map(student => ({
          studentId: student.studentEntityId,
          attendanceStatus: student.attendanceStatus,
          arrivalTime: student.arrivalTime,
          departureTime: student.departureTime,
          remarks: student.remarks
        }))
      };

      if (hasExistingRecords) {
        await dispatch(updateBulkAttendance(bulkData)).unwrap();
      } else {
        await dispatch(createBulkAttendance(bulkData)).unwrap();
      }
      
      // Refresh the data
      dispatch(fetchAttendanceByClass({ 
        classId: selectedClass, 
        filters: { attendanceDate: selectedDate } 
      }));
    } catch (error) {
      console.error('Failed to save attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyParents = async () => {
    const absentStudentIds = studentAttendances
      .filter(student => 
        student.attendanceStatus === 'ABSENT_EXCUSED' || 
        student.attendanceStatus === 'ABSENT_UNEXCUSED'
      )
      .map(student => student.existingRecordId)
      .filter(id => id !== undefined) as number[];

    if (absentStudentIds.length === 0) return;

    try {
      await dispatch(notifyParents(absentStudentIds)).unwrap();
    } catch (error) {
      console.error('Failed to notify parents:', error);
    }
  };

  const getAttendanceStats = () => {
    const total = studentAttendances.length;
    const present = studentAttendances.filter(s => s.attendanceStatus === 'PRESENT').length;
    const absent = studentAttendances.filter(s => 
      s.attendanceStatus === 'ABSENT_EXCUSED' || s.attendanceStatus === 'ABSENT_UNEXCUSED'
    ).length;
    const late = studentAttendances.filter(s => s.attendanceStatus === 'LATE').length;
    const earlyDeparture = studentAttendances.filter(s => s.attendanceStatus === 'EARLY_DEPARTURE').length;
    
    return { total, present, absent, late, earlyDeparture };
  };

  const stats = getAttendanceStats();
  const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      !courseId || courses.find(c => c.id === courseId)?.subjectId === subject.id
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mark Attendance</h1>
          <p className="text-gray-600">Record student attendance for your classes</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-ghost btn-sm"
          >
            <RefreshCw className="w-4 h-4" />
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

      {/* Filters */}
      <div className="bg-base-100 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Attendance Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Class *</span>
            </label>
            <select
              className="select select-bordered"
              value={selectedClass}
              onChange={(e) => setSelectedClass(parseInt(e.target.value))}
              disabled={loading.classes}
            >
              <option value={0}>
                {loading.classes ? 'Loading classes...' : 'Select Class'}
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
              <span className="label-text font-medium">Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Type *</span>
            </label>
            <select
              className="select select-bordered"
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value as 'DAILY' | 'PERIOD' | 'EVENT')}
            >
              <option value="DAILY">Daily</option>
              <option value="PERIOD">Period</option>
              <option value="EVENT">Event</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Course</span>
            </label>
            <select
              className="select select-bordered"
              value={courseId || ''}
              onChange={(e) => setCourseId(e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!selectedClass || loading.courses}
            >
              <option value="">
                {loading.courses ? 'Loading courses...' : 'Select Course (Optional)'}
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
              className="select select-bordered"
              value={subjectId || ''}
              onChange={(e) => setSubjectId(e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!courseId || loading.subjects}
            >
              <option value="">
                {loading.subjects ? 'Loading subjects...' : 'Select Subject (Optional)'}
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
              <span className="label-text font-medium">Academic Year</span>
            </label>
            <input
              type="number"
              className="input input-bordered"
              value={academicYear}
              onChange={(e) => setAcademicYear(parseInt(e.target.value))}
              min="2020"
              max="2030"
            />
          </div>
        </div>

        {/* Period Details */}
        {attendanceType === 'PERIOD' && (
          <div className="mt-4 p-4 bg-base-200 rounded-lg">
            <h4 className="font-medium mb-3">Period Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Period Number *</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={periodNumber || ''}
                  onChange={(e) => setPeriodNumber(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Time</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={periodStartTime}
                  onChange={(e) => setPeriodStartTime(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">End Time</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={periodEndTime}
                  onChange={(e) => setPeriodEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {selectedClass && (
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickMarkAll('PRESENT')}
              className="btn btn-sm btn-success"
              disabled={studentAttendances.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark All Present
            </button>
            <button
              onClick={() => handleQuickMarkAll('ABSENT_UNEXCUSED')}
              className="btn btn-sm btn-error"
              disabled={studentAttendances.length === 0}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Mark All Absent
            </button>
            <button
              onClick={() => handleQuickMarkAll('ABSENT_EXCUSED')}
              className="btn btn-sm btn-warning"
              disabled={studentAttendances.length === 0}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Mark All Excused
            </button>
          </div>
        </div>
      )}

      {/* Attendance Statistics */}
      {selectedClass && (
        <div className="stats stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Present</div>
            <div className="stat-value text-success">{stats.present}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-error">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Absent</div>
            <div className="stat-value text-error">{stats.absent}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-info">
              <Clock className="w-8 h-8" />
            </div>
            <div className="stat-title">Late</div>
            <div className="stat-value text-info">{stats.late}</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="stat-title">Attendance Rate</div>
            <div className="stat-value text-secondary">{attendanceRate}%</div>
          </div>
        </div>
      )}

      {/* Student Roster */}
      {selectedClass && (
        <div className="bg-base-100 rounded-lg border">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <h4 className="font-medium">Student Roster</h4>
              <p className="text-sm text-gray-600">
                {loading.students ? 'Loading students...' : 
                 hasExistingRecords ? 'Update attendance records' : 'Mark attendance for each student'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleNotifyParents}
                className="btn btn-sm btn-outline"
                disabled={stats.absent === 0}
              >
                <Bell className="w-4 h-4 mr-1" />
                Notify Parents
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-sm btn-primary"
                disabled={isSubmitting || status === 'loading' || studentAttendances.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    {hasExistingRecords ? 'Update Attendance' : 'Save Attendance'}
                  </>
                )}
              </button>
            </div>
          </div>
          
          {loading.students ? (
            <div className="p-8 text-center">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : studentAttendances.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found for this class
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Admission No.</th>
                    <th>Status</th>
                    <th>Arrival Time</th>
                    <th>Departure Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {studentAttendances.map((student) => (
                    <tr key={student.studentEntityId}>
                      <td>
                        <div className="font-medium">{student.studentName}</div>
                      </td>
                      <td>
                        <div className="text-sm">{student.admissionNumber}</div>
                      </td>
                      <td>
                        <select
                          className="select select-sm select-bordered"
                          value={student.attendanceStatus}
                          onChange={(e) => handleStudentAttendanceChange(
                            student.studentEntityId, 
                            'attendanceStatus', 
                            e.target.value as any
                          )}
                        >
                          <option value="PRESENT">Present</option>
                          <option value="ABSENT_EXCUSED">Absent (Excused)</option>
                          <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
                          <option value="LATE">Late</option>
                          <option value="EARLY_DEPARTURE">Early Departure</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="time"
                          className="input input-sm input-bordered"
                          value={student.arrivalTime || ''}
                          onChange={(e) => handleStudentAttendanceChange(
                            student.studentEntityId, 
                            'arrivalTime', 
                            e.target.value
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="input input-sm input-bordered"
                          value={student.departureTime || ''}
                          onChange={(e) => handleStudentAttendanceChange(
                            student.studentEntityId, 
                            'departureTime', 
                            e.target.value
                          )}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-sm input-bordered"
                          placeholder="Optional remarks..."
                          value={student.remarks || ''}
                          onChange={(e) => handleStudentAttendanceChange(
                            student.studentEntityId, 
                            'remarks', 
                            e.target.value
                          )}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* No Class Selected */}
      {!selectedClass && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
          <p className="text-gray-600">Choose a class from the dropdown above to start marking attendance.</p>
        </div>
      )}
    </div>
  );
};

export { AttendanceMarkingPage }; 