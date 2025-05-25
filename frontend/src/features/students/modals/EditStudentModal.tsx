import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { fetchStudents, updateStudent } from '../studentsSlice';
import { Student, UpdateStudentRequest } from '../../../api/services/studentApi';
import { Users, Edit, User, GraduationCap, Phone, Heart, Check } from 'lucide-react';

interface EditStudentModalProps {
  extraObject?: Student;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');

  // Form state - initialize with existing student data
  const [formData, setFormData] = useState<UpdateStudentRequest>({
    id: extraObject?.id || 0,
    admissionNumber: extraObject?.admissionNumber || '',
    firstName: extraObject?.firstName || '',
    lastName: extraObject?.lastName || '',
    dateOfBirth: extraObject?.dateOfBirth || '',
    gender: extraObject?.gender || 'MALE',
    phone: extraObject?.phone || '',
    email: extraObject?.email || '',
    address: extraObject?.address || '',
    academicYear: extraObject?.academicYear || new Date().getFullYear(),
    classId: extraObject?.classId,
    medicalConditions: extraObject?.medicalConditions || '',
    disabilities: extraObject?.disabilities || '',
    emergencyContactName: extraObject?.emergencyContactName || '',
    emergencyContactPhone: extraObject?.emergencyContactPhone || '',
    emergencyContactRelation: extraObject?.emergencyContactRelation || '',
    schoolId: extraObject?.schoolId || 1,
    userId: extraObject?.userId,
    personId: extraObject?.personId,
    active: extraObject?.active ?? true,
    status: extraObject?.status || 'PENDING',
    onboardingNotes: extraObject?.onboardingNotes || '',
    subjectIds: extraObject?.subjectIds || []
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (extraObject) {
      setFormData({
        id: extraObject.id,
        admissionNumber: extraObject.admissionNumber,
        firstName: extraObject.firstName,
        lastName: extraObject.lastName,
        dateOfBirth: extraObject.dateOfBirth,
        gender: extraObject.gender,
        phone: extraObject.phone || '',
        email: extraObject.email,
        address: extraObject.address || '',
        academicYear: extraObject.academicYear,
        classId: extraObject.classId,
        medicalConditions: extraObject.medicalConditions || '',
        disabilities: extraObject.disabilities || '',
        emergencyContactName: extraObject.emergencyContactName,
        emergencyContactPhone: extraObject.emergencyContactPhone,
        emergencyContactRelation: extraObject.emergencyContactRelation,
        schoolId: extraObject.schoolId,
        userId: extraObject.userId,
        personId: extraObject.personId,
        active: extraObject.active,
        status: extraObject.status,
        onboardingNotes: extraObject.onboardingNotes || '',
        subjectIds: extraObject.subjectIds || []
      });
    }
  }, [extraObject]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleInputChange = (field: keyof UpdateStudentRequest, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateTab = (tab: string): boolean => {
    const errors: Record<string, string> = {};

    switch (tab) {
      case 'personal':
        if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
        if (!formData.email?.trim()) errors.email = 'Email is required';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        break;
      case 'academic':
        if (!formData.admissionNumber?.trim()) errors.admissionNumber = 'Admission number is required';
        if (!formData.academicYear) errors.academicYear = 'Academic year is required';
        break;
      case 'emergency':
        if (!formData.emergencyContactName?.trim()) errors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactPhone?.trim()) errors.emergencyContactPhone = 'Emergency contact phone is required';
        if (!formData.emergencyContactRelation?.trim()) errors.emergencyContactRelation = 'Emergency contact relation is required';
        break;
      case 'health':
        // Health information is optional
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextTab = () => {
    if (validateTab(activeTab)) {
      const tabs = ['personal', 'academic', 'emergency', 'health'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
  };

  const handlePrevTab = () => {
    const tabs = ['personal', 'academic', 'emergency', 'health'];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    // Validate all tabs
    const allTabsValid = ['personal', 'academic', 'emergency', 'health'].every(tab => validateTab(tab));
    
    if (!allTabsValid) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.id) {
      setError('Student ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(updateStudent({ id: formData.id, studentData: formData })).unwrap();
      setIsSuccess(true);
      
      // Refresh the students list
      await dispatch(fetchStudents());
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update student';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Updated Successfully!</h3>
        <p className="text-gray-600">The student information has been updated in the system.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'emergency', label: 'Emergency Contact', icon: Phone },
    { id: 'health', label: 'Health Info', icon: Heart }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Edit className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Student</h3>
          <p className="text-sm text-gray-600">
            Update {extraObject?.firstName} {extraObject?.lastName}'s information
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {index + 1}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender || 'MALE'}
                  onChange={(e) => handleInputChange('gender', e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter home address"
              />
            </div>
          </div>
        )}

        {/* Academic Information Tab */}
        {activeTab === 'academic' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission Number *
                </label>
                <input
                  type="text"
                  value={formData.admissionNumber || ''}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value.toUpperCase())}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.admissionNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter admission number"
                />
                {validationErrors.admissionNumber && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.admissionNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year *
                </label>
                <input
                  type="number"
                  value={formData.academicYear || ''}
                  onChange={(e) => handleInputChange('academicYear', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.academicYear ? 'border-red-300' : 'border-gray-300'
                  }`}
                  min="2020"
                  max="2030"
                />
                {validationErrors.academicYear && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.academicYear}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || 'PENDING'}
                  onChange={(e) => handleInputChange('status', e.target.value as 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED' | 'WITHDRAWN')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="GRADUATED">Graduated</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Status
                </label>
                <select
                  value={formData.active ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('active', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class ID
                </label>
                <input
                  type="number"
                  value={formData.classId || ''}
                  onChange={(e) => handleInputChange('classId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter class ID (optional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Onboarding Notes
              </label>
              <textarea
                value={formData.onboardingNotes || ''}
                onChange={(e) => handleInputChange('onboardingNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about the student's onboarding process"
              />
            </div>
          </div>
        )}

        {/* Emergency Contact Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Emergency Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName || ''}
                  onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.emergencyContactName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter emergency contact name"
                />
                {validationErrors.emergencyContactName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.emergencyContactName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.emergencyContactPhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter emergency contact phone"
                />
                {validationErrors.emergencyContactPhone && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.emergencyContactPhone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  value={formData.emergencyContactRelation || ''}
                  onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.emergencyContactRelation ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select relationship</option>
                  <option value="Parent">Parent</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Uncle/Aunt">Uncle/Aunt</option>
                  <option value="Other">Other</option>
                </select>
                {validationErrors.emergencyContactRelation && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.emergencyContactRelation}</p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> This contact will be notified in case of emergencies. 
                Please ensure the information is accurate and up-to-date.
              </p>
            </div>
          </div>
        )}

        {/* Health Information Tab */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Health Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Conditions
                </label>
                <textarea
                  value={formData.medicalConditions || ''}
                  onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List any medical conditions, allergies, or ongoing treatments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disabilities or Special Needs
                </label>
                <textarea
                  value={formData.disabilities || ''}
                  onChange={(e) => handleInputChange('disabilities', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe any disabilities or special accommodations needed"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Privacy Notice:</strong> This health information is confidential and will only be 
                accessed by authorized personnel for the student's care and safety.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handlePrevTab}
          disabled={activeTab === 'personal'}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          
          {activeTab === 'health' ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Users size={16} />
                  Update Student
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNextTab}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditStudentModal; 