import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createBulkAttendance, updateBulkAttendance } from '../attendanceSlice';
import { BulkAttendanceRequest } from '../../../api/services/attendanceApi';
import { closeModal } from '../../common/modalSlice';
import studentApi, { Student } from '../../../api/services/studentApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import subjectApi, { Subject } from '../../../api/services/subjectApi';
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, UserCheck } from 'lucide-react';

interface BulkAttendanceModalProps {
  extraObject?: {
    classId?: number;
    date?: string;
    mode?: 'create' | 'edit';
    existingAttendance?: any[];
  };
}

interface StudentAttendance {
  studentEntityId: number;
  studentName: string;
  admissionNumber: string;
  attendanceStatus: 'PRESENT' | 'ABSENT_EXCUSED' | 'ABSENT_UNEXCUSED' | 'LATE' | 'EARLY_DEPARTURE';
  arrivalTime?: string;
  departureTime?: string;
  remarks?: string;
}

const BulkAttendanceModal: React.FC<BulkAttendanceModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.attendance);
  const { user } = useAppSelector(state => state.auth);
  
  const isEditMode = extraObject?.mode === 'edit';
  
  // Form state
  const [formData, setFormData] = useState<Omit<BulkAttendanceRequest, 'studentAttendances'>>({
    classId: extraObject?.classId || 0,
    courseId: undefined,
    subjectId: undefined,
    attendanceDate: extraObject?.date || new Date().toISOString().split('T')[0],
    attendanceType: 'DAILY',
    periodNumber: undefined,
    periodStartTime: undefined,
    periodEndTime: undefined,
    academicYear: new Date().getFullYear(),
    term: 'FIRST_TERM'
  });

  const [studentAttendances, setStudentAttendances] = useState<StudentAttendance[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (formData.classId) {
      loadCoursesByClass(formData.classId);
      loadStudentsByClass(formData.classId);
    }
  }, [formData.classId]);

  // Load subjects when course is selected
  useEffect(() => {
    if (formData.courseId) {
      loadSubjectsByCourse(formData.courseId);
    }
  }, [formData.courseId]);

  useEffect(() => {
    if (isEditMode && extraObject?.existingAttendance) {
      // Load existing attendance records for editing
      const existingAttendances: StudentAttendance[] = extraObject.existingAttendance.map((record: any) => ({
        studentEntityId: record.studentEntityId,
        studentName: record.studentName,
        admissionNumber: record.admissionNumber || '',
        attendanceStatus: record.attendanceStatus,
        arrivalTime: record.arrivalTime,
        departureTime: record.departureTime,
        remarks: record.remarks
      }));
      
      setStudentAttendances(existingAttendances);
    }
  }, [isEditMode, extraObject?.existingAttendance]);

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
        const initialAttendances: StudentAttendance[] = response.data.data.map((student: Student) => ({
          studentEntityId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          admissionNumber: student.admissionNumber,
          attendanceStatus: 'PRESENT',
          arrivalTime: undefined,
          departureTime: undefined,
          remarks: undefined
        }));
        
        setStudentAttendances(initialAttendances);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Reset dependent fields
    if (field === 'classId') {
      setFormData(prev => ({
        ...prev,
        courseId: undefined,
        subjectId: undefined
      }));
      setCourses([]);
      setSubjects([]);
      setStudentAttendances([]);
    } else if (field === 'courseId') {
      setFormData(prev => ({
        ...prev,
        subjectId: undefined
      }));
      setSubjects([]);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }
    if (!formData.attendanceDate) {
      newErrors.attendanceDate = 'Date is required';
    }
    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }
    if (formData.attendanceType === 'PERIOD' && !formData.periodNumber) {
      newErrors.periodNumber = 'Period number is required for period attendance';
    }
    if (formData.attendanceType === 'PERIOD' && (!formData.periodStartTime || !formData.periodEndTime)) {
      newErrors.periodTime = 'Period start and end times are required';
    }
    if (studentAttendances.length === 0) {
      newErrors.students = 'At least one student must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const bulkData: BulkAttendanceRequest = {
        ...formData,
        studentAttendances: studentAttendances.map(student => ({
          studentEntityId: student.studentEntityId,
          attendanceStatus: student.attendanceStatus,
          arrivalTime: student.arrivalTime,
          departureTime: student.departureTime,
          remarks: student.remarks
        }))
      };

      if (isEditMode) {
        await dispatch(updateBulkAttendance(bulkData)).unwrap();
      } else {
        await dispatch(createBulkAttendance(bulkData)).unwrap();
      }
      
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to save bulk attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal({}));
  };

  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      !formData.courseId || courses.find(c => c.id === formData.courseId)?.subjectId === subject.id
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'badge-success';
      case 'ABSENT_EXCUSED': return 'badge-warning';
      case 'ABSENT_UNEXCUSED': return 'badge-error';
      case 'LATE': return 'badge-info';
      case 'EARLY_DEPARTURE': return 'badge-secondary';
      default: return 'badge-ghost';
    }
  };

  const getAttendanceStats = () => {
    const total = studentAttendances.length;
    const present = studentAttendances.filter(s => s.attendanceStatus === 'PRESENT').length;
    const absent = studentAttendances.filter(s => 
      s.attendanceStatus === 'ABSENT_EXCUSED' || s.attendanceStatus === 'ABSENT_UNEXCUSED'
    ).length;
    const late = studentAttendances.filter(s => s.attendanceStatus === 'LATE').length;
    
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isEditMode ? 'Edit Bulk Attendance' : 'Mark Bulk Attendance'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditMode ? 'Update attendance for multiple students' : 'Mark attendance for the entire class'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Class and Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Class *</span>
            </label>
            <select
              className={`select select-bordered ${errors.classId ? 'select-error' : ''}`}
              value={formData.classId}
              onChange={(e) => handleFormChange('classId', parseInt(e.target.value))}
              disabled={isEditMode || loading.classes}
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
            {errors.classId && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.classId}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Date *</span>
            </label>
            <input
              type="date"
              className={`input input-bordered ${errors.attendanceDate ? 'input-error' : ''}`}
              value={formData.attendanceDate}
              onChange={(e) => handleFormChange('attendanceDate', e.target.value)}
            />
            {errors.attendanceDate && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.attendanceDate}</span>
              </label>
            )}
          </div>
        </div>

        {/* Course and Subject Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Course (Optional)</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.courseId || ''}
              onChange={(e) => handleFormChange('courseId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!formData.classId || loading.courses}
            >
              <option value="">
                {loading.courses ? 'Loading courses...' : 'Select Course'}
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
              <span className="label-text font-medium">Subject (Optional)</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.subjectId || ''}
              onChange={(e) => handleFormChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!formData.courseId || loading.subjects}
            >
              <option value="">
                {loading.subjects ? 'Loading subjects...' : 'Select Subject'}
              </option>
              {getFilteredSubjects().map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Attendance Type *</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.attendanceType}
              onChange={(e) => handleFormChange('attendanceType', e.target.value as 'DAILY' | 'PERIOD' | 'EVENT')}
            >
              <option value="DAILY">Daily</option>
              <option value="PERIOD">Period</option>
              <option value="EVENT">Event</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Academic Year *</span>
              </label>
              <input
                type="number"
                className={`input input-bordered ${errors.academicYear ? 'input-error' : ''}`}
                value={formData.academicYear}
                onChange={(e) => handleFormChange('academicYear', parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Term *</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.term}
                onChange={(e) => handleFormChange('term', e.target.value as 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM')}
              >
                <option value="FIRST_TERM">First Term</option>
                <option value="SECOND_TERM">Second Term</option>
                <option value="THIRD_TERM">Third Term</option>
              </select>
            </div>
          </div>
        </div>

        {/* Period Details (if PERIOD type) */}
        {formData.attendanceType === 'PERIOD' && (
          <div className="bg-base-200 p-4 rounded-lg space-y-4">
            <h4 className="font-medium text-sm">Period Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Period Number *</span>
                </label>
                <input
                  type="number"
                  className={`input input-bordered ${errors.periodNumber ? 'input-error' : ''}`}
                  value={formData.periodNumber || ''}
                  onChange={(e) => handleFormChange('periodNumber', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Time *</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={formData.periodStartTime || ''}
                  onChange={(e) => handleFormChange('periodStartTime', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">End Time *</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={formData.periodEndTime || ''}
                  onChange={(e) => handleFormChange('periodEndTime', e.target.value)}
                />
              </div>
            </div>
            {errors.periodTime && (
              <div className="text-error text-sm">{errors.periodTime}</div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-base-100 p-4 rounded-lg border">
          <h4 className="font-medium text-sm mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickMarkAll('PRESENT')}
              className="btn btn-sm btn-success"
              disabled={studentAttendances.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleQuickMarkAll('ABSENT_UNEXCUSED')}
              className="btn btn-sm btn-error"
              disabled={studentAttendances.length === 0}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Mark All Absent
            </button>
            <button
              type="button"
              onClick={() => handleQuickMarkAll('ABSENT_EXCUSED')}
              className="btn btn-sm btn-warning"
              disabled={studentAttendances.length === 0}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Mark All Excused
            </button>
          </div>
        </div>

        {/* Attendance Statistics */}
        <div className="stats stats-horizontal shadow">
          <div className="stat">
            <div className="stat-title">Total Students</div>
            <div className="stat-value text-primary">{stats.total}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Present</div>
            <div className="stat-value text-success">{stats.present}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Absent</div>
            <div className="stat-value text-error">{stats.absent}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Late</div>
            <div className="stat-value text-info">{stats.late}</div>
          </div>
        </div>

        {/* Student Roster */}
        {formData.classId > 0 && (
          <div className="bg-base-100 rounded-lg border">
            <div className="p-4 border-b">
              <h4 className="font-medium">Student Roster</h4>
              <p className="text-sm text-gray-600">
                {loading.students ? 'Loading students...' : 'Mark attendance for each student'}
              </p>
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
              <div className="overflow-x-auto max-h-96">
                <table className="table table-zebra">
                  <thead className="sticky top-0 bg-base-200">
                    <tr>
                      <th>Student</th>
                      <th>Admission No.</th>
                      <th>Status</th>
                      <th>Arrival Time</th>
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || status === 'loading' || studentAttendances.length === 0}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update Bulk Attendance' : 'Mark Bulk Attendance'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BulkAttendanceModal; 