import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createForum } from '../forumsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { validateForum, sanitizeContent, forumCreationLimiter } from '../../../utils/validation/forumValidation';
import { forumErrorHandler } from '../../../utils/errorHandling/forumErrorHandler';
import { canUserCreateForum } from '../../../utils/permissions/forumPermissions';

const CreateForumModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.forums);
  const { courses } = useAppSelector((state) => state.courses);
  const { user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>('');

  const isLoading = status === 'loading' || isSubmitting;

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Check permissions on mount
  useEffect(() => {
    if (user && !canUserCreateForum(user)) {
      dispatch(showNotification({
        message: 'You do not have permission to create forums',
        status: 0
      }));
      dispatch(closeModal({}));
    }
  }, [user, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      dispatch(showNotification({
        message: 'You must be logged in to create a forum',
        status: 0
      }));
      return;
    }

    // Check rate limiting
    if (!forumCreationLimiter.isAllowed(user.id.toString())) {
      const remaining = forumCreationLimiter.getRemainingAttempts(user.id.toString());
      setRateLimitError(`Rate limit exceeded. ${remaining} attempts remaining.`);
      return;
    }

    setIsSubmitting(true);
    setRateLimitError('');

    try {
      // Sanitize input
      const sanitizedData = {
        title: sanitizeContent(formData.title.trim()),
        description: sanitizeContent(formData.description.trim()),
        courseId: formData.courseId
      };

      // Validate input
      const validation = validateForum(sanitizedData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setWarnings(validation.warnings);
        setIsSubmitting(false);
        return;
      }

      setErrors({});
      setWarnings(validation.warnings);

      // Create forum
      await dispatch(createForum({
        ...sanitizedData,
        active: true
      })).unwrap();
      
      dispatch(showNotification({
        message: 'Forum created successfully!',
        status: 1
      }));
      
      dispatch(closeModal({}));
    } catch (error: any) {
      const forumError = forumErrorHandler.handleApiError(error, {
        action: 'create_forum',
        userId: user.id
      });
      
      dispatch(showNotification({
        message: forumErrorHandler.getUserFriendlyMessage(forumError),
        status: 0
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'courseId' ? parseInt(value) : value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    dispatch(closeModal({}));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Forum</h2>
        <p className="text-gray-600">Create a discussion forum for course-related conversations</p>
      </div>

      {rateLimitError && (
        <div className="alert alert-warning mb-4">
          <div className="flex">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{rateLimitError}</span>
          </div>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="alert alert-info mb-4">
          <div>
            <h4 className="font-semibold mb-1">Suggestions:</h4>
            <ul className="list-disc list-inside text-sm">
              {warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
            Course <span className="text-red-500">*</span>
          </label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleInputChange}
            className={`select select-bordered w-full ${errors.courseId ? 'select-error' : ''}`}
            disabled={isLoading}
            required
          >
            <option value={0}>Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} - {course.code}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Forum Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
            placeholder="Enter forum title (3-200 characters)"
            disabled={isLoading}
            maxLength={200}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title ? (
              <p className="text-red-500 text-sm">{errors.title}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {formData.title.length}/200 characters
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`textarea textarea-bordered w-full ${errors.description ? 'textarea-error' : ''}`}
            placeholder="Describe the purpose and topics for this forum (optional, max 1000 characters)"
            disabled={isLoading}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description ? (
              <p className="text-red-500 text-sm">{errors.description}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {formData.description.length}/1000 characters
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !formData.title.trim() || !formData.courseId}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              'Create Forum'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForumModal; 