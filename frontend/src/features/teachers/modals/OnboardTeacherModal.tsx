import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { onboardTeacher } from '../teachersSlice';
import { TeacherOnboardingRequest } from '../../../api/services/teacherApi';
import { School } from '../../../api/services/schoolApi';
import schoolApi from '../../../api/services/schoolApi';
import enumApi, { getNationalityOptions, getGenderOptions, GradeLevelOption } from '../../../api/services/enumApi';
import { Users, Plus } from 'lucide-react';

interface OnboardTeacherModalProps {
  extraObject?: any;
}

export const OnboardTeacherModal: React.FC<OnboardTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [schools, setSchools] = useState<School[]>([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [nationalities, setNationalities] = useState<GradeLevelOption[]>([]);
  const [genders, setGenders] = useState<GradeLevelOption[]>([]);
  const [loadingEnums, setLoadingEnums] = useState(true);

  const [formData, setFormData] = useState({
    staffId: '',
    firstName: '',
    lastName: '',
    email: '',
    qualification: '',
    schoolId: 0,
    identityNumber: '',
    nationality: '',
    gender: '',
    dateOfBirth: '',
    username: '',
    password: '',
    confirmPassword: '',
    active: true
  });

  // Fetch schools and enums on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSchools(true);
        setLoadingEnums(true);
        
        // Fetch schools
        const schoolsResponse = await schoolApi.getAll();
        const schoolsData = Array.isArray(schoolsResponse.data.data) 
          ? schoolsResponse.data.data 
          : [];
        setSchools(schoolsData);
        
        // Set default school if available
        if (schoolsData.length > 0 && formData.schoolId === 0) {
          setFormData(prev => ({ ...prev, schoolId: schoolsData[0].id }));
        }

        // Fetch nationalities
        const nationalitiesResponse = await enumApi.getNationalities();
        const nationalitiesData = nationalitiesResponse.data.data || [];
        setNationalities(getNationalityOptions(nationalitiesData));

        // Fetch genders
        const gendersResponse = await enumApi.getGenders();
        const gendersData = gendersResponse.data.data || [];
        setGenders(getGenderOptions(gendersData));
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingSchools(false);
        setLoadingEnums(false);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

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
    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = 'Identity number is required';
    }
    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.schoolId === 0) {
      newErrors.schoolId = 'Please select a school';
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
      const onboardingData: TeacherOnboardingRequest = {
        staffId: formData.staffId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        qualification: formData.qualification,
        schoolId: formData.schoolId,
        identityNumber: formData.identityNumber,
        nationality: formData.nationality,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        username: formData.username,
        password: formData.password,
        active: formData.active
      };

      await dispatch(onboardTeacher(onboardingData)).unwrap();
      setIsSuccess(true);
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to onboard teacher:', error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Teacher Onboarded Successfully!</h3>
        <p className="text-gray-600">The new teacher has been onboarded with user account and profile.</p>
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
          <h3 className="text-lg font-semibold text-gray-900">Onboard New Teacher</h3>
          <p className="text-sm text-gray-600">Create user account and teacher profile</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Teacher Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Teacher Information</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Staff ID *
              </label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.staffId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., TCH001"
              />
              {errors.staffId && <p className="text-red-500 text-sm mt-1">{errors.staffId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School *
              </label>
              <select
                name="schoolId"
                value={formData.schoolId}
                onChange={handleChange}
                disabled={loadingSchools}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.schoolId ? 'border-red-500' : 'border-gray-300'
                } ${loadingSchools ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value={0}>Select a school...</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </option>
                ))}
              </select>
              {errors.schoolId && <p className="text-red-500 text-sm mt-1">{errors.schoolId}</p>}
              {loadingSchools && <p className="text-gray-500 text-sm mt-1">Loading schools...</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="First name"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Last name"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Bachelor of Education"
            />
          </div>
        </div>

        {/* User Account Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">User Account Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="username"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">Additional Information</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identity Number *
            </label>
            <input
              type="text"
              name="identityNumber"
              value={formData.identityNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.identityNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1234567890"
            />
            {errors.identityNumber && <p className="text-red-500 text-sm mt-1">{errors.identityNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality *
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.nationality ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a nationality...</option>
              {nationalities.map((nationality) => (
                <option key={nationality.value} value={nationality.value}>
                  {nationality.label}
                </option>
              ))}
            </select>
            {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a gender...</option>
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || loadingSchools || loadingEnums}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Onboarding...' : 'Onboard Teacher'}
          </button>
        </div>
      </form>
    </div>
  );
}; 