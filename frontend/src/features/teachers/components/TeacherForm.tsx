import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { createTeacher, updateTeacher } from '../teachersSlice';
import { Teacher, CreateTeacherRequest, UpdateTeacherRequest } from '../../../api/services/teacherApi';

interface TeacherFormProps {
  mode: 'create' | 'edit';
  teacher?: Teacher;
  onSubmit: (teacher: Teacher) => void;
  onCancel: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ mode, teacher, onSubmit, onCancel }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    qualification: '',
    schoolId: 1, // Default school ID - should be dynamic in real implementation
    active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && teacher) {
      setFormData({
        staffId: teacher.staffId,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        qualification: teacher.qualification || '',
        schoolId: teacher.schoolId,
        active: teacher.active
      });
    }
  }, [mode, teacher]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.staffId.trim()) {
      newErrors.staffId = 'Staff ID is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      if (mode === 'create') {
        const teacherData: CreateTeacherRequest = {
          staffId: formData.staffId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          qualification: formData.qualification,
          schoolId: formData.schoolId,
          active: formData.active
        };
        const result = await dispatch(createTeacher(teacherData)).unwrap();
        onSubmit(result as Teacher);
      } else if (teacher) {
        const teacherData: UpdateTeacherRequest = {
          staffId: formData.staffId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          qualification: formData.qualification,
          schoolId: formData.schoolId,
          active: formData.active
        };
        const result = await dispatch(updateTeacher({ id: teacher.id, teacherData })).unwrap();
        onSubmit(result as Teacher);
      }
    } catch (error) {
      console.error('Failed to save teacher:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-1">
            Staff ID *
          </label>
          <input
            type="text"
            id="staffId"
            name="staffId"
            value={formData.staffId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.staffId ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter staff ID"
          />
          {errors.staffId && <p className="text-red-500 text-xs mt-1">{errors.staffId}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">
          Qualification
        </label>
        <input
          type="text"
          id="qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter qualification (e.g., Bachelor's in Education)"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
          Active
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Teacher' : 'Update Teacher'}
        </button>
      </div>
    </form>
  );
};

export default TeacherForm; 