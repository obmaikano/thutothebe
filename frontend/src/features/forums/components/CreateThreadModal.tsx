import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createThread } from '../threadsSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { validateThread, sanitizeContent, threadCreationLimiter } from '../../../utils/validation/forumValidation';
import { forumErrorHandler } from '../../../utils/errorHandling/forumErrorHandler';
import { canUserCreateThread } from '../../../utils/permissions/forumPermissions';

interface CreateThreadModalProps {
  extraObject?: { forumId: number };
}

const CreateThreadModal: React.FC<CreateThreadModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.threads);
  const { user } = useAppSelector((state) => state.auth);
  const { currentForum } = useAppSelector((state) => state.forums);
  
  const forumId = extraObject?.forumId || currentForum?.id || 0;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    pinned: false,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string>('');

  const isLoading = status === 'loading' || isSubmitting;

  // Check permissions on mount
  useEffect(() => {
    if (user && currentForum && !canUserCreateThread(user, currentForum)) {
      dispatch(showNotification({
        message: 'You do not have permission to create threads in this forum',
        status: 0
      }));
      dispatch(closeModal({}));
    }
  }, [user, currentForum, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      dispatch(showNotification({
        message: 'You must be logged in to create a thread',
        status: 0
      }));
      return;
    }

    if (!forumId) {
      dispatch(showNotification({
        message: 'No forum selected for thread creation',
        status: 0
      }));
      return;
    }

    // Check rate limiting
    if (!threadCreationLimiter.isAllowed(user.id.toString())) {
      const remaining = threadCreationLimiter.getRemainingAttempts(user.id.toString());
      setRateLimitError(`Rate limit exceeded. ${remaining} attempts remaining.`);
      return;
    }

    setIsSubmitting(true);
    setRateLimitError('');

    try {
      // Sanitize input
      const sanitizedData = {
        title: sanitizeContent(formData.title.trim()),
        content: sanitizeContent(formData.content.trim()),
        forumId: forumId
      };

      // Validate input
      const validation = validateThread(sanitizedData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setWarnings(validation.warnings);
        setIsSubmitting(false);
        return;
      }

      setErrors({});
      setWarnings(validation.warnings);

      // Create thread
      await dispatch(createThread({
        ...sanitizedData,
        authorId: user.id,
        pinned: formData.pinned,
        active: formData.active
      })).unwrap();
      
      dispatch(showNotification({
        message: 'Thread created successfully!',
        status: 1
      }));
      
      dispatch(closeModal({}));
    } catch (error: any) {
      const forumError = forumErrorHandler.handleApiError(error, {
        action: 'create_thread',
        userId: user.id,
        resourceId: forumId
      });
      
      dispatch(showNotification({
        message: forumErrorHandler.getUserFriendlyMessage(forumError),
        status: 0
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Thread</h2>
        <p className="text-gray-600">Start a new discussion in this forum</p>
        {currentForum && (
          <p className="text-sm text-gray-500 mt-1">
            Forum: <span className="font-medium">{currentForum.title}</span>
          </p>
        )}
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Thread Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
            placeholder="Enter thread title (5-300 characters)"
            disabled={isLoading}
            maxLength={300}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title ? (
              <p className="text-red-500 text-sm">{errors.title}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {formData.title.length}/300 characters
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows={8}
            className={`textarea textarea-bordered w-full ${errors.content ? 'textarea-error' : ''}`}
            placeholder="Write your thread content here (10-10000 characters)"
            disabled={isLoading}
            maxLength={10000}
            required
          />
          <div className="flex justify-between items-center mt-1">
            {errors.content ? (
              <p className="text-red-500 text-sm">{errors.content}</p>
            ) : (
              <p className="text-gray-500 text-sm">
                {formData.content.length}/10000 characters
              </p>
            )}
          </div>
        </div>

        {/* Advanced options for moderators */}
        {user && ['TEACHER', 'SCHOOL_ADMIN', 'REGIONAL_ADMIN', 'MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role) && (
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Moderator Options</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinned"
                  name="pinned"
                  checked={formData.pinned}
                  onChange={handleInputChange}
                  className="checkbox checkbox-sm mr-2"
                  disabled={isLoading}
                />
                <label htmlFor="pinned" className="text-sm text-gray-700">
                  Pin this thread (appears at the top of the forum)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="checkbox checkbox-sm mr-2"
                  disabled={isLoading}
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Active (thread is visible and accepts replies)
                </label>
              </div>
            </div>
          </div>
        )}

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
            disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              'Create Thread'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateThreadModal; 