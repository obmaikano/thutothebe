import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateThread } from '../threadsSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { Thread } from '../../../api/services/threadApi';

interface EditThreadModalProps {
  extraObject?: Thread;
}

const EditThreadModal: React.FC<EditThreadModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.threads);
  
  const [formData, setFormData] = useState({
    title: extraObject?.title || '',
    content: extraObject?.content || '',
    pinned: extraObject?.pinned || false,
    active: extraObject?.active ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = status === 'loading';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !extraObject) return;

    try {
      await dispatch(updateThread({
        id: extraObject.id,
        threadData: {
          title: formData.title.trim(),
          content: formData.content.trim(),
          pinned: formData.pinned,
          active: formData.active
        }
      })).unwrap();

      dispatch(showNotification({
        message: 'Thread updated successfully',
        status: 1
      }));
      dispatch(closeModal({}));
    } catch (error: any) {
      dispatch(showNotification({
        message: error || 'Failed to update thread',
        status: 0
      }));
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

  if (!extraObject) {
    return (
      <div className="text-center py-4">
        <p className="text-error">No thread selected for editing</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Title *</span>
        </label>
        <input
          type="text"
          name="title"
          placeholder="Enter thread title"
          className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
          value={formData.title}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {errors.title && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.title}</span>
          </label>
        )}
      </div>

      {/* Content */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Content *</span>
        </label>
        <textarea
          name="content"
          placeholder="Enter thread content"
          className={`textarea textarea-bordered w-full ${errors.content ? 'textarea-error' : ''}`}
          rows={6}
          value={formData.content}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        {errors.content && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.content}</span>
          </label>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2">
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Pin this thread</span>
            <input
              type="checkbox"
              name="pinned"
              className="checkbox"
              checked={formData.pinned}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Active</span>
            <input
              type="checkbox"
              name="active"
              className="checkbox"
              checked={formData.active}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => dispatch(closeModal({}))}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Thread'}
        </button>
      </div>
    </form>
  );
};

export default EditThreadModal; 