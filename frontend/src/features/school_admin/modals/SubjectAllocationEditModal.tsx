import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { updateCourse, fetchCourses } from '../../courses/coursesSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { BookOpen, Edit, User, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Select } from '../../../components/common/Select';
import { NumberInput } from '../../../components/common/inputs/NumberInput';
import courseApi, { Course, Term, CourseType } from '../../../api/services/courseApi';

interface SubjectAllocationEditModalProps {
  extraObject?: {
    allocation: any;
    classes: any[];
    teachers: any[];
    subjects: any[];
  };
}

const SubjectAllocationEditModal: React.FC<SubjectAllocationEditModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { subjects } = useAppSelector(state => state.subjects);
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subjectId: '',
    teacherId: '',
    classId: '',
    term: '',
    year: new Date().getFullYear(),
    type: 'CORE',
    active: true
  });

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
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
        setDataLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  // Initialize form data when allocation is available
  useEffect(() => {
    if (extraObject?.allocation) {
      const allocation = extraObject.allocation;
      const courseData = allocation.courseData || {};
      setFormData({
        subjectId: (allocation.subjectId || courseData.subjectId)?.toString() || '',
        teacherId: (allocation.teacherId || (courseData.instructorIds && courseData.instructorIds[0]))?.toString() || '',
        classId: (allocation.classId || courseData.classId)?.toString() || '',
        term: courseData.term || 'FIRST_TERM',
        year: courseData.year || new Date().getFullYear(),
        type: courseData.type || 'CORE',
        active: courseData.active !== false
      });
    }
  }, [extraObject?.allocation]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.subjectId) return 'Subject is required';
    if (!formData.teacherId) return 'Teacher is required';
    if (!formData.classId) return 'Class is required';
    if (!formData.term) return 'Term is required';
    if (!formData.year) return 'Year is required';
    if (formData.year < 2000 || formData.year > 2100) return 'Year must be between 2000 and 2100';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!extraObject?.allocation) return;

    try {
      setLoading(true);
      setError(null);
      
      const courseData: Partial<Course> = {
        subjectId: parseInt(formData.subjectId),
        classId: parseInt(formData.classId),
        term: formData.term as keyof Term,
        year: formData.year,
        active: formData.active,
        type: formData.type as keyof CourseType,
        instructorIds: [parseInt(formData.teacherId)]
      };

      await dispatch(updateCourse({ 
        id: extraObject.allocation.courseData.id, 
        courseData 
      })).unwrap();
      
      setIsSuccess(true);
      
      // Refresh the courses list
      await dispatch(fetchCourses());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error: any) {
      console.error('Failed to update allocation:', error);
      setError(error.message || 'Failed to update allocation');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Data</h3>
        <p className="text-gray-600">Please wait while we load the form data...</p>
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
        <p className="text-gray-600 mb-4">No subject allocation information was provided for editing.</p>
        <button
          onClick={handleClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <BookOpen className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Allocation Updated Successfully!</h3>
        <p className="text-gray-600">The subject allocation information has been saved.</p>
      </div>
    );
  }

  const allocation = extraObject.allocation;
  const availableClasses = extraObject.classes || classes;
  const availableTeachers = extraObject.teachers || teachers;
  const availableSubjects = extraObject.subjects || subjects;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Subject Allocation</h3>
          <p className="text-sm text-gray-600">Update the allocation for "{allocation.subject}"</p>
        </div>
      </div>

      {/* Current Allocation Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{allocation.subject}</div>
            <div className="text-sm text-gray-500">Currently assigned to {allocation.teacher}</div>
            <div className="text-sm text-gray-500">{allocation.class} • {allocation.term}</div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <Select
              name="subjectId"
              value={formData.subjectId}
              onChange={(e) => handleInputChange('subjectId', e.target.value)}
              options={[
                { value: '', label: 'Select a subject' },
                ...availableSubjects.map((subject) => ({ 
                  value: subject.id.toString(), 
                  label: `${subject.name} (${subject.code})` 
                }))
              ]}
              required
              disabled={loading}
            />
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher *
            </label>
            <Select
              name="teacherId"
              value={formData.teacherId}
              onChange={(e) => handleInputChange('teacherId', e.target.value)}
              options={[
                { value: '', label: 'Select a teacher' },
                ...availableTeachers.map((teacher) => ({ 
                  value: teacher.id.toString(), 
                  label: `${teacher.firstName} ${teacher.lastName}` 
                }))
              ]}
              required
              disabled={loading}
            />
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class *
            </label>
            <Select
              name="classId"
              value={formData.classId}
              onChange={(e) => handleInputChange('classId', e.target.value)}
              options={[
                { value: '', label: 'Select a class' },
                ...availableClasses.map((classItem) => ({ 
                  value: classItem.id.toString(), 
                  label: `${classItem.name} (Grade ${classItem.gradeLevel})` 
                }))
              ]}
              required
              disabled={loading}
            />
          </div>

          {/* Term */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Term *
            </label>
            <Select
              name="term"
              value={formData.term}
              onChange={(e) => handleInputChange('term', e.target.value)}
              options={[
                { value: 'FIRST_TERM', label: 'First Term' },
                { value: 'SECOND_TERM', label: 'Second Term' },
                { value: 'THIRD_TERM', label: 'Third Term' }
              ]}
              required
              disabled={loading}
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <NumberInput
              value={formData.year}
              onChange={(value) => handleInputChange('year', value)}
              min={2000}
              max={2100}
              required
              disabled={loading}
            />
          </div>

          {/* Course Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Type
            </label>
            <Select
              name="type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={[
                { value: 'CORE', label: 'Core' },
                { value: 'ELECTIVE', label: 'Elective' }
              ]}
              disabled={loading}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            id="active"
            name="active"
            type="checkbox"
            checked={formData.active}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            disabled={loading}
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
            Active allocation
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Update Allocation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectAllocationEditModal; 