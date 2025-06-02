import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchGrades, updateGrade, clearError } from '../gradesSlice';
import { fetchStudents } from '../../students/studentsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { Grade, UpdateGradeRequest } from '../../../api/services/gradeApi';
import { Save, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const bulkUpdateSchema = z.object({
  courseId: z.number().min(1, 'Course is required'),
  gradeType: z.enum(['ASSIGNMENT', 'ASSESSMENT', 'QUIZ', 'EXAM', 'PROJECT']).optional(),
  updateType: z.enum(['SCORE', 'FEEDBACK', 'WEIGHT', 'FINAL_STATUS']),
  scoreValue: z.number().min(0).optional(),
  feedbackValue: z.string().optional(),
  weightValue: z.number().min(0).max(100).optional(),
  isFinalValue: z.boolean().optional(),
});

type BulkUpdateFormData = z.infer<typeof bulkUpdateSchema>;

interface GradeBulkUpdateModalProps {
  extraObject?: {
    selectedGrades?: Grade[];
    courseId?: number;
  };
}

const GradeBulkUpdateModal: React.FC<GradeBulkUpdateModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status, error, grades } = useAppSelector(state => state.grades);
  const { students } = useAppSelector(state => state.students);
  const { courses } = useAppSelector(state => state.courses);
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);
  const [updateProgress, setUpdateProgress] = useState<{ completed: number; total: number; errors: string[] }>({
    completed: 0,
    total: 0,
    errors: []
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors: formErrors, isValid },
  } = useForm<BulkUpdateFormData>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      courseId: extraObject?.courseId || 0,
      updateType: 'SCORE',
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
    if (extraObject?.selectedGrades) {
      setSelectedGrades(extraObject.selectedGrades);
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, extraObject]);

  useEffect(() => {
    if (watchedValues.courseId && !extraObject?.selectedGrades) {
      // Fetch grades for the selected course
      const courseGrades = grades.filter(grade => grade.courseId === watchedValues.courseId);
      setSelectedGrades(courseGrades);
    }
  }, [watchedValues.courseId, grades, extraObject]);

  const handleGradeSelection = (grade: Grade, isSelected: boolean) => {
    if (isSelected) {
      setSelectedGrades(prev => [...prev, grade]);
    } else {
      setSelectedGrades(prev => prev.filter(g => g.id !== grade.id));
    }
  };

  const handleSelectAll = () => {
    const courseGrades = grades.filter(grade => grade.courseId === watchedValues.courseId);
    setSelectedGrades(courseGrades);
  };

  const handleDeselectAll = () => {
    setSelectedGrades([]);
  };

  const onSubmit = async (data: BulkUpdateFormData) => {
    if (selectedGrades.length === 0) {
      return;
    }

    setIsUpdating(true);
    setUpdateProgress({ completed: 0, total: selectedGrades.length, errors: [] });

    const updateData: Partial<UpdateGradeRequest> = {};
    
    switch (data.updateType) {
      case 'SCORE':
        if (data.scoreValue !== undefined) {
          updateData.score = data.scoreValue;
        }
        break;
      case 'FEEDBACK':
        if (data.feedbackValue !== undefined) {
          updateData.feedback = data.feedbackValue;
        }
        break;
      case 'WEIGHT':
        if (data.weightValue !== undefined) {
          updateData.weight = data.weightValue;
        }
        break;
      case 'FINAL_STATUS':
        if (data.isFinalValue !== undefined) {
          updateData.isFinal = data.isFinalValue;
        }
        break;
    }

    const errors: string[] = [];
    let completed = 0;

    for (const grade of selectedGrades) {
      try {
        await dispatch(updateGrade({ id: grade.id, gradeData: updateData })).unwrap();
        completed++;
        setUpdateProgress(prev => ({ ...prev, completed }));
      } catch (error) {
        const errorMessage = `Failed to update grade for student ${grade.studentId}: ${error}`;
        errors.push(errorMessage);
        setUpdateProgress(prev => ({ ...prev, errors: [...prev.errors, errorMessage] }));
      }
    }

    setUpdateProgress(prev => ({ ...prev, completed, errors }));
    setIsUpdating(false);

    if (errors.length === 0) {
      setTimeout(() => {
        dispatch(closeModal());
      }, 2000);
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`;
  };

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : `Course ${courseId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Bulk Update Grades</h3>
          <p className="text-sm text-gray-600 mt-1">
            Update multiple grades at once for efficiency
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedGrades.length} grade(s) selected
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Update Progress */}
      {isUpdating && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Upload size={16} className="text-blue-600" />
            <span className="font-medium text-blue-900">Updating Grades...</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(updateProgress.completed / updateProgress.total) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-blue-700 mt-1">
            {updateProgress.completed} of {updateProgress.total} completed
          </div>
        </div>
      )}

      {/* Success/Error Summary */}
      {!isUpdating && updateProgress.total > 0 && (
        <div className={`border p-4 rounded-lg ${updateProgress.errors.length === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            {updateProgress.errors.length === 0 ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium text-green-900">All grades updated successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-yellow-600" />
                <span className="font-medium text-yellow-900">
                  {updateProgress.completed} of {updateProgress.total} grades updated
                </span>
              </>
            )}
          </div>
          {updateProgress.errors.length > 0 && (
            <div className="text-sm text-yellow-700">
              <div className="font-medium mb-1">Errors:</div>
              <ul className="list-disc list-inside space-y-1">
                {updateProgress.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                {...register('courseId', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!!extraObject?.courseId}
              >
                <option value={0}>Select a course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
              {formErrors.courseId && (
                <p className="text-red-500 text-xs mt-1">{formErrors.courseId.message}</p>
              )}
            </div>

            {/* Grade Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Type (Optional Filter)
              </label>
              <select
                {...register('gradeType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="ASSIGNMENT">Assignment</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="QUIZ">Quiz</option>
                <option value="EXAM">Exam</option>
                <option value="PROJECT">Project</option>
              </select>
            </div>

            {/* Update Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What to Update *
              </label>
              <select
                {...register('updateType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SCORE">Score</option>
                <option value="FEEDBACK">Feedback</option>
                <option value="WEIGHT">Weight</option>
                <option value="FINAL_STATUS">Final Status</option>
              </select>
            </div>

            {/* Update Value Fields */}
            {watchedValues.updateType === 'SCORE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Score *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('scoreValue', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {watchedValues.updateType === 'FEEDBACK' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Feedback *
                </label>
                <textarea
                  {...register('feedbackValue')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter feedback for all selected grades..."
                />
              </div>
            )}

            {watchedValues.updateType === 'WEIGHT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Weight *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register('weightValue', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {watchedValues.updateType === 'FINAL_STATUS' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Grade Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('isFinalValue')}
                      value="true"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mark as Final</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('isFinalValue')}
                      value="false"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remove Final Status</span>
                  </label>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => dispatch(closeModal())}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || selectedGrades.length === 0 || isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save size={16} />
                )}
                Update {selectedGrades.length} Grade(s)
              </button>
            </div>
          </form>
        </div>

        {/* Selected Grades Preview */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Selected Grades</h4>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                disabled={!watchedValues.courseId}
              >
                Select All
              </button>
              <button
                onClick={handleDeselectAll}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2">
            {selectedGrades.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No grades selected
              </div>
            ) : (
              selectedGrades.map(grade => (
                <div key={grade.id} className="bg-white p-3 rounded border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {getStudentName(grade.studentId)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {grade.gradeType} • Score: {grade.score}/{grade.maxScore}
                      </div>
                    </div>
                    <button
                      onClick={() => handleGradeSelection(grade, false)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeBulkUpdateModal; 