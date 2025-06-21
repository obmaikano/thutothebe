import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createAttendanceRecord, updateAttendanceRecord } from '../attendanceSlice';
import { CreateAttendanceRequest } from '../../../api/services/attendanceApi';
import { closeModal } from '../../common/modalSlice';
import studentApi, { Student } from '../../../api/services/studentApi';
import classApi, { Class } from '../../../api/services/classApi';
import courseApi, { Course } from '../../../api/services/courseApi';
import subjectApi, { Subject } from '../../../api/services/subjectApi';
import { Calendar, Clock, User, BookOpen, AlertCircle } from 'lucide-react';

interface MarkAttendanceModalProps {
  extraObject?: {
    attendanceId?: number;
    studentId?: number;
    classId?: number;
    date?: string;
    mode?: 'create' | 'edit';
    onSuccess?: () => void;
  };
}

const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(state => state.attendance);
  const { user } = useAppSelector(state => state.auth);
  
  const isEditMode = extraObject?.mode === 'edit' || !!extraObject?.attendanceId;
  
  // Form state
  const [formData, setFormData] = useState<CreateAttendanceRequest>({
    // Required fields (matching @NotNull annotations)
    studentEntityId: extraObject?.studentId || 0,
    classId: extraObject?.classId || 0,
    markedById: user?.id || 0,  // @NotNull - will be set by Redux thunk
    attendanceDate: extraObject?.date || new Date().toISOString().split('T')[0],
    attendanceStatus: 'PRESENT',
    attendanceType: 'DAILY',
    academicYear: new Date().getFullYear(),
    
    // Optional fields
    courseId: undefined,
    subjectId: undefined,
    periodNumber: undefined,
    periodStartTime: undefined,
    periodEndTime: undefined,
    arrivalTime: undefined,
    departureTime: undefined,
    term: 'FIRST_TERM',
    remarks: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (user?.role === 'TEACHER' && user?.id) {
      loadStudentsByTeacher(user.id);
    } else {
      loadStudents();
    }
  }, [user]);

  // Load courses when class is selected
  useEffect(() => {
    if (formData.classId) {
      loadCoursesByClass(formData.classId);
    }
  }, [formData.classId]);

  // Load subjects when course is selected
  useEffect(() => {
    if (formData.courseId) {
      loadSubjectsByCourse(formData.courseId);
    }
  }, [formData.courseId]);

  // Load existing attendance record for editing
  useEffect(() => {
    if (isEditMode && extraObject?.attendanceId) {
      // This would typically fetch from the API
      console.log('Loading attendance record for editing:', extraObject.attendanceId);
    }
  }, [isEditMode, extraObject?.attendanceId]);

  const loadStudents = async () => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await studentApi.getActive();
      if (response.data.data && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(prev => ({ ...prev, students: false }));
    }
  };

  const loadStudentsByTeacher = async (teacherId: number) => {
    setLoading(prev => ({ ...prev, students: true }));
    try {
      const response = await studentApi.getActiveByTeacher(teacherId);
      if (response.data.data && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load students by teacher:', error);
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

  const handleInputChange = (field: keyof CreateAttendanceRequest, value: any) => {
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
    } else if (field === 'courseId') {
      setFormData(prev => ({
        ...prev,
        subjectId: undefined
      }));
      setSubjects([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validations (matching @NotNull annotations)
    if (!formData.studentEntityId) {
      newErrors.studentEntityId = 'Student is required';
    }
    if (!formData.classId) {
      newErrors.classId = 'Class is required';
    }
    if (!formData.attendanceDate) {
      newErrors.attendanceDate = 'Date is required';
    }
    if (!formData.attendanceStatus) {
      newErrors.attendanceStatus = 'Status is required';
    }
    if (!formData.attendanceType) {
      newErrors.attendanceType = 'Type is required';
    }
    if (!formData.academicYear) {
      newErrors.academicYear = 'Academic year is required';
    }

    // Academic year range validation (2000-2100)
    if (formData.academicYear && (formData.academicYear < 2000 || formData.academicYear > 2100)) {
      newErrors.academicYear = 'Academic year must be between 2000 and 2100';
    }

    // Future date validation (@PastOrPresent)
    if (formData.attendanceDate) {
      const selectedDate = new Date(formData.attendanceDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (selectedDate > today) {
        newErrors.attendanceDate = 'Attendance date cannot be in the future';
      }
    }

    // Period-specific validations
    if (formData.attendanceType === 'PERIOD') {
      if (!formData.periodNumber) {
        newErrors.periodNumber = 'Period number is required for period-based attendance';
      }
      if (!formData.periodStartTime || !formData.periodEndTime) {
        newErrors.periodTime = 'Period start and end times are required for period attendance';
      }
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
      if (isEditMode && extraObject?.attendanceId) {
        await dispatch(updateAttendanceRecord({
          id: extraObject.attendanceId,
          attendanceData: formData
        })).unwrap();
      } else {
        await dispatch(createAttendanceRecord(formData)).unwrap();
      }
      
      dispatch(closeModal({}));
      if (extraObject?.onSuccess) {
        extraObject.onSuccess();
      }
    } catch (error) {
      console.error('Failed to save attendance:', error);
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

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {isEditMode ? 'Edit Attendance Record' : 'Mark Attendance'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEditMode ? 'Update the attendance information' : 'Record student attendance'}
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

        {/* Student and Class Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <User className="w-4 h-4 inline mr-1" />
                Student *
              </span>
            </label>
            <select
              className={`select select-bordered ${errors.studentEntityId ? 'select-error' : ''}`}
              value={formData.studentEntityId}
              onChange={(e) => handleInputChange('studentEntityId', parseInt(e.target.value))}
              disabled={isEditMode || loading.students}
            >
              <option value={0}>
                {loading.students ? 'Loading students...' : 'Select Student'}
              </option>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName} ({student.admissionNumber})
                </option>
              ))}
            </select>
            {errors.studentEntityId && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.studentEntityId}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Class *</span>
            </label>
            <select
              className={`select select-bordered ${errors.classId ? 'select-error' : ''}`}
              value={formData.classId}
              onChange={(e) => handleInputChange('classId', parseInt(e.target.value))}
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
        </div>

        {/* Course and Subject Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Course
              </span>
            </label>
            <select
              className="select select-bordered"
              value={formData.courseId || ''}
              onChange={(e) => handleInputChange('courseId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!formData.classId || loading.courses}
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
              value={formData.subjectId || ''}
              onChange={(e) => handleInputChange('subjectId', e.target.value ? parseInt(e.target.value) : undefined)}
              disabled={!formData.courseId || loading.subjects}
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
        </div>

        {/* Date and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Date *</span>
            </label>
            <input
              type="date"
              className={`input input-bordered ${errors.attendanceDate ? 'input-error' : ''}`}
              value={formData.attendanceDate}
              onChange={(e) => handleInputChange('attendanceDate', e.target.value)}
            />
            {errors.attendanceDate && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.attendanceDate}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Attendance Type *</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.attendanceType}
              onChange={(e) => handleInputChange('attendanceType', e.target.value as 'DAILY' | 'PERIOD' | 'EVENT')}
            >
              <option value="DAILY">Daily</option>
              <option value="PERIOD">Period</option>
              <option value="EVENT">Event</option>
            </select>
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
                  onChange={(e) => handleInputChange('periodNumber', e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  max="10"
                />
                {errors.periodNumber && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.periodNumber}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Start Time *</span>
                </label>
                <input
                  type="time"
                  className="input input-bordered"
                  value={formData.periodStartTime || ''}
                  onChange={(e) => handleInputChange('periodStartTime', e.target.value)}
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
                  onChange={(e) => handleInputChange('periodEndTime', e.target.value)}
                />
              </div>
            </div>
            {errors.periodTime && (
              <div className="text-error text-sm">{errors.periodTime}</div>
            )}
          </div>
        )}

        {/* Status and Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Status *</span>
            </label>
            <select
              className={`select select-bordered ${errors.attendanceStatus ? 'select-error' : ''}`}
              value={formData.attendanceStatus}
              onChange={(e) => handleInputChange('attendanceStatus', e.target.value as any)}
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT_EXCUSED">Absent (Excused)</option>
              <option value="ABSENT_UNEXCUSED">Absent (Unexcused)</option>
              <option value="LATE">Late</option>
              <option value="EARLY_DEPARTURE">Early Departure</option>
            </select>
            {errors.attendanceStatus && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.attendanceStatus}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                <Clock className="w-4 h-4 inline mr-1" />
                Arrival Time
              </span>
            </label>
            <input
              type="time"
              className="input input-bordered"
              value={formData.arrivalTime || ''}
              onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Departure Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered"
              value={formData.departureTime || ''}
              onChange={(e) => handleInputChange('departureTime', e.target.value)}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Academic Year *</span>
            </label>
            <input
              type="number"
              className={`input input-bordered ${errors.academicYear ? 'input-error' : ''}`}
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', parseInt(e.target.value))}
              min="2020"
              max="2030"
            />
            {errors.academicYear && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.academicYear}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Term *</span>
            </label>
            <select
              className="select select-bordered"
              value={formData.term}
              onChange={(e) => handleInputChange('term', e.target.value as 'FIRST_TERM' | 'SECOND_TERM' | 'THIRD_TERM')}
            >
              <option value="FIRST_TERM">First Term</option>
              <option value="SECOND_TERM">Second Term</option>
              <option value="THIRD_TERM">Third Term</option>
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Remarks</span>
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Add any additional notes or comments..."
            value={formData.remarks || ''}
            onChange={(e) => handleInputChange('remarks', e.target.value)}
            rows={3}
          />
        </div>

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
            disabled={isSubmitting || status === 'loading'}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                {isEditMode ? 'Update Attendance' : 'Mark Attendance'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarkAttendanceModal; 