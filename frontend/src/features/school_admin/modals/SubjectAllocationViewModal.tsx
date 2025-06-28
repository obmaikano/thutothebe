import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { BookOpen, User, Calendar, BarChart3, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface SubjectAllocationViewModalProps {
  extraObject?: {
    allocation: any;
    classes: any[];
    teachers: any[];
    subjects: any[];
  };
}

const SubjectAllocationViewModal: React.FC<SubjectAllocationViewModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { subjects } = useAppSelector(state => state.subjects);
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          dispatch(fetchSubjects()),
          dispatch(fetchClasses()),
          dispatch(fetchTeachers())
        ]);
      } catch (error: any) {
        console.error('Error loading data:', error);
        setError(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Data</h3>
        <p className="text-gray-600">Please wait while we load the allocation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (!extraObject?.allocation) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <BookOpen className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Allocation Data</h3>
        <p className="text-gray-600 mb-4">No subject allocation information was provided for viewing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  const allocation = extraObject.allocation;
  const availableClasses = extraObject.classes || classes;
  const availableTeachers = extraObject.teachers || teachers;
  const availableSubjects = extraObject.subjects || subjects;

  // Helper functions to get names from IDs with real data
  const getSubjectName = (subjectId: number) => {
    const subject = availableSubjects.find(s => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : `Subject ID: ${subjectId}`;
  };

  const getClassName = (classId: number) => {
    const classItem = availableClasses.find(c => c.id === classId);
    return classItem ? `${classItem.name} (Grade ${classItem.gradeLevel})` : `Class ID: ${classId}`;
  };

  const getTeacherName = (teacherId: number) => {
    const teacher = availableTeachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : `Teacher ID: ${teacherId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get real course data
  const courseData = allocation.courseData || {};
  const subjectId = allocation.subjectId || courseData.subjectId;
  const classId = allocation.classId || courseData.classId;
  const teacherId = allocation.teacherId || (courseData.instructorIds && courseData.instructorIds[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BookOpen className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Subject Allocation Details</h3>
          <p className="text-sm text-gray-600">View information for "{allocation.subject}" allocation</p>
        </div>
      </div>

      {/* Allocation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{allocation.subject}</div>
            <div className="text-sm text-gray-500">Assigned to {allocation.teacher}</div>
            <div className="text-sm text-gray-500">{allocation.class} • {allocation.term}</div>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}>
              {allocation.status}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          Progress Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{allocation.progress}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(allocation.progress)}`}
                style={{ width: `${allocation.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{allocation.completedLessons}</div>
            <div className="text-sm text-gray-600">Completed Lessons</div>
            <div className="text-xs text-gray-500">of {allocation.totalLessons} total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{allocation.assessments}</div>
            <div className="text-sm text-gray-600">Assessments</div>
            <div className="text-xs text-gray-500">completed</div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Allocation Details</h4>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Subject
              </div>
              <div className="text-gray-700">{getSubjectName(subjectId)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                Assigned Teacher
              </div>
              <div className="text-gray-700">{getTeacherName(teacherId)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                Class
              </div>
              <div className="text-gray-700">{getClassName(classId)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-600" />
                Academic Period
              </div>
              <div className="text-gray-700">{allocation.term}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                Last Updated
              </div>
              <div className="text-gray-700">{formatDate(allocation.lastUpdate)}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 mb-1 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Course Type
              </div>
              <div className="text-gray-700">{courseData.type || 'CORE'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Performance Metrics</h4>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Curriculum Delivery</span>
                <span className="text-sm text-gray-500">{allocation.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(allocation.progress)}`}
                  style={{ width: `${allocation.progress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Lesson Completion</span>
                <span className="text-sm text-gray-500">{allocation.completedLessons}/{allocation.totalLessons}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${allocation.totalLessons > 0 ? getProgressColor((allocation.completedLessons / allocation.totalLessons) * 100) : 'bg-gray-400'}`}
                  style={{ width: `${allocation.totalLessons > 0 ? (allocation.completedLessons / allocation.totalLessons) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            Status Information
          </h4>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Allocation Status</span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(allocation.status)}`}>
              {allocation.status}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {allocation.status === 'ACTIVE' && 'This allocation is currently active and being delivered.'}
            {allocation.status === 'PENDING' && 'This allocation is pending activation or approval.'}
            {allocation.status === 'COMPLETED' && 'This allocation has been completed successfully.'}
            {allocation.status === 'SUSPENDED' && 'This allocation has been temporarily suspended.'}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubjectAllocationViewModal; 