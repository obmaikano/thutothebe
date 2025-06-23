import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { createCourse } from '../../courses/coursesSlice';
import { fetchClasses } from '../../classes/classesSlice';
import { fetchTeachers } from '../../teachers/teachersSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { CourseType, Term } from '../../../api/services/courseApi';

interface SubjectAssignTeacherModalProps {
  extraObject?: {
    classes?: any[];
    teachers?: any[];
    subjects?: any[];
    bulk?: boolean;
  };
}

export const SubjectAssignTeacherModal: React.FC<SubjectAssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { classes } = useAppSelector(state => state.classes);
  const { teachers } = useAppSelector(state => state.teachers);
  const { subjects } = useAppSelector(state => state.subjects);
  const { status } = useAppSelector(state => state.courses);

  const [formData, setFormData] = useState({
    subjectId: '',
    classId: '',
    teacherId: '',
    term: 'FIRST_TERM' as keyof Term,
    year: new Date().getFullYear(),
    type: 'CORE' as keyof CourseType,
    isPrimary: true
  });

  const [bulkData, setBulkData] = useState<Array<{
    subjectId: string;
    classId: string;
    teacherId: string;
    term: keyof Term;
    year: number;
    type: keyof CourseType;
    isPrimary: boolean;
  }>>([]);

  const [isBulkMode, setIsBulkMode] = useState(extraObject?.bulk || false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data if not provided in extraObject
    if (!extraObject?.classes || !extraObject?.teachers || !extraObject?.subjects) {
      dispatch(fetchClasses());
      dispatch(fetchTeachers());
      dispatch(fetchSubjects());
    }
  }, [dispatch, extraObject]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulkInputChange = (index: number, field: string, value: any) => {
    setBulkData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addBulkRow = () => {
    setBulkData(prev => [...prev, {
      subjectId: '',
      classId: '',
      teacherId: '',
      term: 'FIRST_TERM',
      year: new Date().getFullYear(),
      type: 'CORE',
      isPrimary: true
    }]);
  };

  const removeBulkRow = (index: number) => {
    setBulkData(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (isBulkMode) {
      return bulkData.every(item => 
        item.subjectId && item.classId && item.teacherId
      );
    }
    return formData.subjectId && formData.classId && formData.teacherId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isBulkMode) {
        // Handle bulk creation
        for (const item of bulkData) {
          const courseData = {
            code: `${subjects.find(s => s.id === parseInt(item.subjectId))?.code?.substring(0, 3) || 'SUB'}-${classes.find(c => c.id === parseInt(item.classId))?.name?.substring(0, 3) || 'CLS'}-${item.year.toString().slice(-2)}`,
            name: `${subjects.find(s => s.id === parseInt(item.subjectId))?.name || 'Subject'} - ${classes.find(c => c.id === parseInt(item.classId))?.name || 'Class'}`,
            subjectId: parseInt(item.subjectId),
            classId: parseInt(item.classId),
            term: item.term,
            year: item.year,
            active: true,
            type: item.type,
            instructorIds: [parseInt(item.teacherId)]
          };

          await dispatch(createCourse(courseData)).unwrap();
        }
      } else {
        // Handle single creation
        const courseData = {
          code: `${subjects.find(s => s.id === parseInt(formData.subjectId))?.code?.substring(0, 3) || 'SUB'}-${classes.find(c => c.id === parseInt(formData.classId))?.name?.substring(0, 3) || 'CLS'}-${formData.year.toString().slice(-2)}`,
          name: `${subjects.find(s => s.id === parseInt(formData.subjectId))?.name || 'Subject'} - ${classes.find(c => c.id === parseInt(formData.classId))?.name || 'Class'}`,
          subjectId: parseInt(formData.subjectId),
          classId: parseInt(formData.classId),
          term: formData.term,
          year: formData.year,
          active: true,
          type: formData.type,
          instructorIds: [parseInt(formData.teacherId)]
        };

        await dispatch(createCourse(courseData)).unwrap();
      }

      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create course allocation');
    } finally {
      setIsLoading(false);
    }
  };

  const availableClasses = extraObject?.classes || classes;
  const availableTeachers = extraObject?.teachers || teachers;
  const availableSubjects = extraObject?.subjects || subjects;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {isBulkMode ? 'Bulk Subject Allocation' : 'Allocate Subject to Teacher'}
        </h3>
        <button
          type="button"
          onClick={() => setIsBulkMode(!isBulkMode)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isBulkMode ? 'Single Mode' : 'Bulk Mode'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isBulkMode ? (
          // Bulk allocation form
          <div className="space-y-4">
            {bulkData.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Allocation {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeBulkRow(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <select
                      value={item.subjectId}
                      onChange={(e) => handleBulkInputChange(index, 'subjectId', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Subject</option>
                      {availableSubjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Class *
                    </label>
                    <select
                      value={item.classId}
                      onChange={(e) => handleBulkInputChange(index, 'classId', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Class</option>
                      {availableClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teacher *
                    </label>
                    <select
                      value={item.teacherId}
                      onChange={(e) => handleBulkInputChange(index, 'teacherId', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Teacher</option>
                      {availableTeachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.firstName} {teacher.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Term
                    </label>
                    <select
                      value={item.term}
                      onChange={(e) => handleBulkInputChange(index, 'term', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="FIRST_TERM">First Term</option>
                      <option value="SECOND_TERM">Second Term</option>
                      <option value="THIRD_TERM">Third Term</option>
                      <option value="SEMESTER_1">Semester 1</option>
                      <option value="SEMESTER_2">Semester 2</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addBulkRow}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              + Add Another Allocation
            </button>
          </div>
        ) : (
          // Single allocation form
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => handleInputChange('subjectId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class *
              </label>
              <select
                value={formData.classId}
                onChange={(e) => handleInputChange('classId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Class</option>
                {availableClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher *
              </label>
              <select
                value={formData.teacherId}
                onChange={(e) => handleInputChange('teacherId', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Teacher</option>
                {availableTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term
              </label>
              <select
                value={formData.term}
                onChange={(e) => handleInputChange('term', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="FIRST_TERM">First Term</option>
                <option value="SECOND_TERM">Second Term</option>
                <option value="THIRD_TERM">Third Term</option>
                <option value="SEMESTER_1">Semester 1</option>
                <option value="SEMESTER_2">Semester 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={2000}
                max={2030}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CORE">Core</option>
                <option value="ELECTIVE">Elective</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading || !validateForm()}
          >
            {isLoading ? 'Creating...' : isBulkMode ? 'Create Allocations' : 'Create Allocation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubjectAssignTeacherModal; 