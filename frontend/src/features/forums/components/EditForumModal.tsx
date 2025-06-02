import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateForum } from '../forumsSlice';
import { fetchCourses } from '../../courses/coursesSlice';
import { closeModal } from '../../common/modalSlice';
import { showNotification } from '../../common/headerSlice';
import { Forum } from '../../../api/services/forumApi';

interface EditForumModalProps {
  extraObject?: Forum;
}

const EditForumModal: React.FC<EditForumModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.forums);
  const { courses } = useAppSelector((state) => state.courses);
  
  const [formData, setFormData] = useState({
    title: extraObject?.title || '',
    description: extraObject?.description || '',
    courseId: extraObject?.courseId?.toString() || '',
    active: extraObject?.active ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isLoading = status === 'loading';

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !extraObject) return;

    try {
      await dispatch(updateForum({
        id: extraObject.id,
        forumData: {
          title: formData.title.trim(),
          description: formData.description.trim(),
          courseId: parseInt(formData.courseId),
          active: formData.active
        }
      })).unwrap();

      dispatch(showNotification({
        message: 'Forum updated successfully',
        status: 1
      }));
      dispatch(closeModal());
    } catch (error: any) {
      dispatch(showNotification({
        message: error || 'Failed to update forum',
        status: 0
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          placeholder="Enter forum title"
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

      {/* Description */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          name="description"
          placeholder="Enter forum description"
          className="textarea textarea-bordered w-full"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      {/* Course */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Course *</span>
        </label>
        <select
          name="courseId"
          className={`select select-bordered w-full ${errors.courseId ? 'select-error' : ''}`}
          value={formData.courseId}
          onChange={handleInputChange}
          disabled={isLoading}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        {errors.courseId && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.courseId}</span>
          </label>
        )}
      </div>

      {/* Active Status */}
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

      {/* Submit Button */}
      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => dispatch(closeModal())}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Forum'}
        </button>
      </div>
    </form>
  );
};

export default EditForumModal; 