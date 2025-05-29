import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { Quiz, CreateQuizRequest, UpdateQuizRequest } from '../../../api/services/quizApi';
import { createQuiz, updateQuiz } from '../quizzesSlice';
import { fetchCourses } from '../../courses/coursesSlice';

interface QuizFormProps {
  quiz?: Quiz | null;
  onSubmit?: (quiz: Quiz) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

export const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const { courses } = useAppSelector(state => state.courses || { courses: [] });
  const { user } = useAppSelector(state => state.auth);
  
  const [formData, setFormData] = useState<CreateQuizRequest>({
    code: '',
    title: '',
    description: '',
    courseId: 0,
    instructorId: user?.id || 0,
    startDate: '',
    endDate: '',
    timeLimit: 60,
    totalPoints: 100,
    status: 'DRAFT',
    gradingType: 'AUTO',
    autoGradeImmediately: true,
    showResultsImmediately: false,
    maxAttempts: 1,
    active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (quiz && mode === 'edit') {
      setFormData({
        code: quiz.code,
        title: quiz.title,
        description: quiz.description || '',
        courseId: quiz.courseId,
        instructorId: quiz.instructorId,
        startDate: quiz.startDate.split('T')[0], // Convert to date format
        endDate: quiz.endDate.split('T')[0],
        timeLimit: quiz.timeLimit,
        totalPoints: quiz.totalPoints,
        status: quiz.status,
        gradingType: quiz.gradingType || 'AUTO',
        autoGradeImmediately: quiz.autoGradeImmediately || true,
        showResultsImmediately: quiz.showResultsImmediately || false,
        maxAttempts: quiz.maxAttempts || 1,
        active: quiz.active
      });
    }
  }, [quiz, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Quiz code is required';
    } else if (formData.code.length < 2 || formData.code.length > 20) {
      newErrors.code = 'Quiz code must be between 2 and 20 characters';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    } else if (formData.title.length < 3 || formData.title.length > 200) {
      newErrors.title = 'Quiz title must be between 3 and 200 characters';
    }

    if (!formData.courseId || formData.courseId === 0) {
      newErrors.courseId = 'Please select a course';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (formData.timeLimit < 1 || formData.timeLimit > 480) {
      newErrors.timeLimit = 'Time limit must be between 1 and 480 minutes';
    }

    if (formData.totalPoints < 1 || formData.totalPoints > 1000) {
      newErrors.totalPoints = 'Total points must be between 1 and 1000';
    }

    if (formData.maxAttempts < 1 || formData.maxAttempts > 10) {
      newErrors.maxAttempts = 'Max attempts must be between 1 and 10';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let parsedValue: any = value;
    
    if (type === 'checkbox') {
      parsedValue = checked;
    } else if (type === 'number') {
      parsedValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let result: Quiz;
      
      if (mode === 'edit' && quiz) {
        const updateData: UpdateQuizRequest = formData;
        result = await dispatch(updateQuiz({ id: quiz.id, quizData: updateData })).unwrap() as Quiz;
      } else {
        result = await dispatch(createQuiz(formData)).unwrap() as Quiz;
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      console.error('Failed to save quiz:', error);
      setErrors({ submit: error.message || 'Failed to save quiz' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quiz Code */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Quiz Code *</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.code ? 'input-error' : ''}`}
              placeholder="e.g., QUIZ001, MATH-Q1"
              maxLength={20}
              disabled={isSubmitting}
            />
            {errors.code && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.code}</span>
              </label>
            )}
          </div>

          {/* Course Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Course *</span>
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className={`select select-bordered ${errors.courseId ? 'select-error' : ''}`}
              disabled={isSubmitting}
            >
              <option value={0}>Select a course</option>
              {(courses || []).map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {errors.courseId && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.courseId}</span>
              </label>
            )}
          </div>
        </div>

        {/* Quiz Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Quiz Title *</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
            placeholder="e.g., Chapter 1 Quiz, Midterm Exam"
            maxLength={200}
            disabled={isSubmitting}
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title}</span>
            </label>
          )}
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
            placeholder="Brief description of the quiz (optional)"
            rows={3}
            maxLength={1000}
            disabled={isSubmitting}
          />
          <label className="label">
            <span className="label-text-alt">{(formData.description || '').length}/1000 characters</span>
          </label>
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description}</span>
            </label>
          )}
        </div>
      </div>

      {/* Schedule & Timing */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Schedule & Timing</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Start Date *</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.startDate ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.startDate && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.startDate}</span>
              </label>
            )}
          </div>

          {/* End Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">End Date *</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.endDate ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.endDate && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.endDate}</span>
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Limit */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Time Limit (minutes) *</span>
            </label>
            <input
              type="number"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.timeLimit ? 'input-error' : ''}`}
              min={1}
              max={480}
              disabled={isSubmitting}
            />
            {errors.timeLimit && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.timeLimit}</span>
              </label>
            )}
          </div>

          {/* Total Points */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Total Points *</span>
            </label>
            <input
              type="number"
              name="totalPoints"
              value={formData.totalPoints}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.totalPoints ? 'input-error' : ''}`}
              min={1}
              max={1000}
              disabled={isSubmitting}
            />
            {errors.totalPoints && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.totalPoints}</span>
              </label>
            )}
          </div>

          {/* Max Attempts */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Max Attempts *</span>
            </label>
            <input
              type="number"
              name="maxAttempts"
              value={formData.maxAttempts}
              onChange={handleInputChange}
              className={`input input-bordered ${errors.maxAttempts ? 'input-error' : ''}`}
              min={1}
              max={10}
              disabled={isSubmitting}
            />
            {errors.maxAttempts && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.maxAttempts}</span>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Quiz Settings</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Grading Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Grading Type</span>
            </label>
            <select
              name="gradingType"
              value={formData.gradingType}
              onChange={handleInputChange}
              className="select select-bordered"
              disabled={isSubmitting}
            >
              <option value="AUTO">Automatic</option>
              <option value="MANUAL">Manual</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="select select-bordered"
              disabled={isSubmitting}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Auto-grade immediately</span>
              <input
                type="checkbox"
                name="autoGradeImmediately"
                checked={formData.autoGradeImmediately}
                onChange={handleInputChange}
                className="checkbox checkbox-primary"
                disabled={isSubmitting}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                Automatically grade quiz when submitted (for auto-gradable questions)
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Show results immediately</span>
              <input
                type="checkbox"
                name="showResultsImmediately"
                checked={formData.showResultsImmediately}
                onChange={handleInputChange}
                className="checkbox checkbox-primary"
                disabled={isSubmitting}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                Show quiz results to students immediately after submission
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text font-medium">Active Status</span>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="checkbox checkbox-primary"
                disabled={isSubmitting}
              />
            </label>
            <label className="label">
              <span className="label-text-alt">
                {formData.active ? 'Quiz is active and available' : 'Quiz is inactive'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="alert alert-error">
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </div>
    </form>
  );
};

export default QuizForm; 