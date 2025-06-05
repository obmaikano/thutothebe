import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { User, CreateUserRequest, UpdateUserRequest, USER_ROLE_OPTIONS, GENDER_OPTIONS } from '../../../api/services/userApi';
import { createUser, updateUser } from '../usersSlice';
import SearchableSchoolSelect from './SearchableSchoolSelect';
import SearchableRegionSelect from './SearchableRegionSelect';
import { NATIONALITY_LABELS } from '../../../api/services/enumApi';

interface UserFormProps {
  user?: User | null;
  onSubmit?: (user: User) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    surname: user?.surname || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'STUDENT',
    gender: user?.gender || 'MALE',
    nationality: user?.nationality || '',
    dateOfBirth: user?.dateOfBirth || '',
    identityNumber: user?.identityNumber || '',
    birthCertificateNumber: user?.birthCertificateNumber || '',
    qualification: user?.qualification || '',
    schoolId: user?.schoolId || null,
    regionId: user?.regionId || null,
    parentId: user?.parentId || '',
    active: user?.active ?? true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    setError(null);
  };

  const handleSchoolChange = (schoolId: number | null) => {
    setFormData(prev => ({
      ...prev,
      schoolId
    }));
    setError(null);
  };

  const handleRegionChange = (regionId: number | null) => {
    setFormData(prev => ({
      ...prev,
      regionId
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.surname.trim()) {
      setError('Surname is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (mode === 'create' && !formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (mode === 'create' && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }
    if (!formData.nationality.trim()) {
      setError('Nationality is required');
      return false;
    }
    
    // Age-based validation for identity documents
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasHadBirthday = today.getMonth() > birthDate.getMonth() || 
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    const actualAge = hasHadBirthday ? age : age - 1;
    
    if (actualAge >= 16 && !formData.identityNumber.trim()) {
      setError('Identity number is required for users 16 years and older');
      return false;
    }
    
    if (actualAge < 16 && !formData.birthCertificateNumber.trim()) {
      setError('Birth certificate number is required for users under 16');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (mode === 'create') {
        const createData: CreateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth,
          identityNumber: formData.identityNumber || undefined,
          birthCertificateNumber: formData.birthCertificateNumber || undefined,
          qualification: formData.qualification || undefined,
          schoolId: formData.schoolId || undefined,
          regionId: formData.regionId || undefined,
          parentId: formData.parentId ? Number(formData.parentId) : undefined,
          active: formData.active
        };
        
        result = await dispatch(createUser(createData)).unwrap();
      } else {
        const updateData: UpdateUserRequest = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          surname: formData.surname,
          email: formData.email,
          role: formData.role,
          gender: formData.gender as 'MALE' | 'FEMALE' | 'OTHER',
          nationality: formData.nationality,
          dateOfBirth: formData.dateOfBirth,
          identityNumber: formData.identityNumber || undefined,
          birthCertificateNumber: formData.birthCertificateNumber || undefined,
          qualification: formData.qualification || undefined,
          schoolId: formData.schoolId || undefined,
          regionId: formData.regionId || undefined,
          parentId: formData.parentId ? Number(formData.parentId) : undefined,
          active: formData.active
        };
        
        result = await dispatch(updateUser({ 
          id: user!.id, 
          userData: updateData 
        })).unwrap();
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error: any) {
      setError(error.message || `Failed to ${mode} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const isStudentRole = formData.role === 'STUDENT';
  const isTeacherRole = ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD'].includes(formData.role);
  const isRegionalRole = ['REGIONAL_ADMIN', 'REGIONAL_OFFICER', 'DIRECTOR'].includes(formData.role);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surname *
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {USER_ROLE_OPTIONS.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {GENDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality *
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Nationality</option>
              {Object.entries(NATIONALITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identity Number
            </label>
            <input
              type="text"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleInputChange}
              placeholder="For users 16 years and older"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Birth Certificate Number
            </label>
            <input
              type="text"
              name="birthCertificateNumber"
              value={formData.birthCertificateNumber}
              onChange={handleInputChange}
              placeholder="For users under 16 years"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Role-specific Information */}
      {isTeacherRole && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Teacher Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              placeholder="e.g., Bachelor of Education"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {isStudentRole && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Student Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent ID
            </label>
            <input
              type="number"
              name="parentId"
              value={formData.parentId}
              onChange={handleInputChange}
              placeholder="Parent's user ID (if applicable)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Regional Information */}
      {isRegionalRole && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Regional Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region {isRegionalRole ? '*' : ''}
            </label>
            <SearchableRegionSelect
              value={formData.regionId || ''}
              onChange={handleRegionChange}
              placeholder="Select a region"
              required={isRegionalRole}
            />
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Additional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <SearchableSchoolSelect
              value={formData.schoolId || ''}
              onChange={handleSchoolChange}
              placeholder="Select a school (optional)"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active User
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm; 