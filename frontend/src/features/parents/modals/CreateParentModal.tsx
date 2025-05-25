import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { createParent, fetchParents } from '../parentsSlice';
import { closeModal } from '../../common/modalSlice';
import { extractErrorMessage } from '../../../utils/errorUtils';
import { CreateParentRequest } from '../../../api/services/parentApi';
import { USER_ROLES } from '../../../api/services/userApi';
import { Users, Plus } from 'lucide-react';

interface CreateParentModalProps {
  extraObject?: any;
}

const CreateParentModal: React.FC<CreateParentModalProps> = () => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateParentRequest>({
    firstName: '',
    lastName: '',
    email: '',
    role: USER_ROLES.PARENT,
    surname: '',
    gender: 'OTHER',
    nationality: '',
    dateOfBirth: '',
    identityNumber: '',
    birthCertificateNumber: '',
    qualification: '',
    parentId: undefined,
    schoolId: undefined,
    active: true,
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 2 and 50 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 2 and 50 characters';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    } else if (formData.surname.length < 2 || formData.surname.length > 50) {
      newErrors.surname = 'Surname must be between 2 and 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      await dispatch(createParent(formData)).unwrap();
      setIsSuccess(true);
      
      // Refresh the parents list
      await dispatch(fetchParents());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (err: any) {
      setErrors({ submit: extractErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Parent Created Successfully!</h3>
        <p className="text-gray-600">The new parent account has been added to the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Parent</h3>
          <p className="text-sm text-gray-600">Add a new parent account to the system</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display error message if any */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter first name"
              maxLength={50}
              disabled={isSubmitting}
              required
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter last name"
              maxLength={50}
              disabled={isSubmitting}
              required
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.surname ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter surname"
              maxLength={50}
              disabled={isSubmitting}
              required
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter email address"
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter password"
              disabled={isSubmitting}
              required
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.gender ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              disabled={isSubmitting}
              required
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.nationality ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              placeholder="Enter nationality"
              disabled={isSubmitting}
              required
            />
            {errors.nationality && (
              <p className="mt-1 text-sm text-red-600">{errors.nationality}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              disabled={isSubmitting}
              required
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>

          {/* Identity Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <input
              type="text"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter ID number"
              disabled={isSubmitting}
            />
          </div>

          {/* Birth Certificate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Certificate Number
            </label>
            <input
              type="text"
              name="birthCertificateNumber"
              value={formData.birthCertificateNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter birth certificate number"
              disabled={isSubmitting}
            />
          </div>

          {/* Qualification */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter qualification"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Active Status */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={isSubmitting}
          />
          <label className="ml-2 block text-sm text-gray-700">
            Active Account
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Parent
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateParentModal; 