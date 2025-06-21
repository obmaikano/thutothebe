import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { createAnnouncement } from '../announcementsSlice';
import { closeModal } from '../../common/modalSlice';
import { useAuth } from '../../../contexts/AuthContext';
import { CreateAnnouncementRequest } from '../../../api/services/announcementApi';
import { Calendar, Users, Tag, MapPin, Building, UserCheck, GraduationCap } from 'lucide-react';
import regionApi, { Region } from '../../../api/services/regionApi';
import schoolApi, { School } from '../../../api/services/schoolApi';
import classApi, { Class } from '../../../api/services/classApi';
import departmentApi, { Department } from '../../../api/services/departmentApi';
import { getPermissionLevel } from '../../../utils/permissionUtils';

interface CreateAnnouncementModalProps {
  extraObject?: any;
}

// Role hierarchy for target role filtering
const ROLE_HIERARCHY = {
  'SUPER_ADMIN': 10,
  'MINISTRY_EXECUTIVE': 9,
  'MINISTRY_STAFF': 8,
  'DIRECTOR': 8,
  'REGIONAL_ADMIN': 7,
  'REGIONAL_OFFICER': 5,
  'SCHOOL_ADMIN': 6,
  'SCHOOL_HEAD': 5,
  'DEPARTMENT_HEAD': 4,
  'SENIOR_TEACHER': 3,
  'TEACHER': 2,
  'STUDENT': 1,
  'PARENT': 1
};

// All available target roles
const ALL_TARGET_ROLES = [
  { value: 'STUDENT', label: 'Students' },
  { value: 'TEACHER', label: 'Teachers' },
  { value: 'SENIOR_TEACHER', label: 'Senior Teachers' },
  { value: 'DEPARTMENT_HEAD', label: 'Department Heads' },
  { value: 'SCHOOL_HEAD', label: 'School Heads' },
  { value: 'SCHOOL_ADMIN', label: 'School Admins' },
  { value: 'REGIONAL_OFFICER', label: 'Regional Officers' },
  { value: 'REGIONAL_ADMIN', label: 'Regional Admins' },
  { value: 'DIRECTOR', label: 'Directors' },
  { value: 'MINISTRY_STAFF', label: 'Ministry Staff' },
  { value: 'MINISTRY_EXECUTIVE', label: 'Ministry Executives' },
  { value: 'PARENT', label: 'Parents' }
];

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { status } = useAppSelector(state => state.announcements);

  // Data state
  const [regions, setRegions] = useState<Region[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState<CreateAnnouncementRequest>({
    title: '',
    content: '',
    type: 'GENERAL',
    priority: 'NORMAL',
    creatorId: user?.id || 0,
    creatorRole: user?.role || 'TEACHER',
    commentsEnabled: false,
    acknowledgmentRequired: false,
    active: true,
    targetRegionId: undefined,
    targetSchoolId: undefined,
    targetRole: '',
    targetDepartment: '',
    targetClass: '',
    startDate: '',
    endDate: '',
    tags: [],
    attachmentUrls: []
  });

  const [tagInput, setTagInput] = useState('');

  // Determine if user can access region-level features
  const canAccessRegionLevel = user && ['SUPER_ADMIN', 'MINISTRY_EXECUTIVE', 'MINISTRY_STAFF', 'DIRECTOR', 'REGIONAL_ADMIN', 'REGIONAL_OFFICER'].includes(user.role);

  // Filter target roles based on user's role hierarchy
  const getAvailableTargetRoles = () => {
    if (!user?.role) return ALL_TARGET_ROLES;
    
    const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] || 0;
    
    return ALL_TARGET_ROLES.filter(role => {
      const roleLevel = ROLE_HIERARCHY[role.value as keyof typeof ROLE_HIERARCHY] || 0;
      // Users can only target roles at or below their level
      return roleLevel <= userLevel;
    });
  };

  const availableTargetRoles = getAvailableTargetRoles();

  // Load initial data
  useEffect(() => {
    if (canAccessRegionLevel) {
      loadRegions();
    } else {
      // For school-level users, load schools directly
      loadSchools();
    }
  }, [canAccessRegionLevel]);

  // Load regions (only for users with region access)
  const loadRegions = async () => {
    if (!canAccessRegionLevel) return;
    
    setLoadingRegions(true);
    try {
      const response = await regionApi.getActiveRegions();
      const regionsData = response.data.data;
      if (Array.isArray(regionsData)) {
        setRegions(regionsData);
      } else if (regionsData) {
        setRegions([regionsData]);
      } else {
        setRegions([]);
      }
    } catch (error) {
      console.error('Failed to load regions:', error);
      setRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  };

  // Load schools based on selected region or user's school
  const loadSchools = async (regionId?: number) => {
    setLoadingSchools(true);
    try {
      let response;
      if (regionId) {
        response = await schoolApi.getByRegionId(regionId);
      } else if (user?.schoolId) {
        // For school-level users, only show their school
        const schoolResponse = await schoolApi.getById(user.schoolId);
        const schoolData = schoolResponse.data.data;
        if (schoolData && !Array.isArray(schoolData)) {
          setSchools([schoolData]);
        } else {
          setSchools([]);
        }
        setLoadingSchools(false);
        return;
      } else {
        response = await schoolApi.getAll();
      }
      
      const schoolsData = response.data.data;
      if (Array.isArray(schoolsData)) {
        setSchools(schoolsData);
      } else if (schoolsData) {
        setSchools([schoolsData]);
      } else {
        setSchools([]);
      }
    } catch (error) {
      console.error('Failed to load schools:', error);
      setSchools([]);
    } finally {
      setLoadingSchools(false);
    }
  };

  // Load classes based on selected school
  const loadClasses = async (schoolId?: number) => {
    setLoadingClasses(true);
    try {
      let response;
      if (schoolId) {
        response = await classApi.getBySchool(schoolId);
      } else {
        response = await classApi.getAll();
      }
      
      const classesData = response.data.data;
      if (Array.isArray(classesData)) {
        setClasses(classesData);
      } else if (classesData) {
        setClasses([classesData]);
      } else {
        setClasses([]);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Load departments based on selected school
  const loadDepartments = async (schoolId?: number) => {
    setLoadingDepartments(true);
    try {
      let response;
      if (schoolId) {
        response = await departmentApi.getActiveBySchool(schoolId);
      } else {
        response = await departmentApi.getActive();
      }
      
      const departmentsData = response.data.data;
      if (Array.isArray(departmentsData)) {
        setDepartments(departmentsData);
      } else if (departmentsData) {
        setDepartments([departmentsData]);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Handle region change
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value ? parseInt(e.target.value) : undefined;
    setFormData(prev => ({
      ...prev,
      targetRegionId: regionId,
      targetSchoolId: undefined, // Reset school when region changes
      targetClass: '', // Reset class when region changes
      targetDepartment: '' // Reset department when region changes
    }));
    setSchools([]);
    setClasses([]);
    setDepartments([]);
    
    if (regionId) {
      loadSchools(regionId);
    }
  };

  // Handle school change
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const schoolId = e.target.value ? parseInt(e.target.value) : undefined;
    setFormData(prev => ({
      ...prev,
      targetSchoolId: schoolId,
      targetClass: '', // Reset class when school changes
      targetDepartment: '' // Reset department when school changes
    }));
    setClasses([]);
    setDepartments([]);
    
    if (schoolId) {
      loadClasses(schoolId);
      loadDepartments(schoolId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      const submissionData = {
        ...formData,
        tags: formData.tags?.length ? formData.tags : undefined,
        targetRegionId: formData.targetRegionId || undefined,
        targetSchoolId: formData.targetSchoolId || undefined,
        targetRole: formData.targetRole || undefined,
        targetDepartment: formData.targetDepartment || undefined,
        targetClass: formData.targetClass || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      };

      await dispatch(createAnnouncement({
        creatorId: user.id,
        announcementData: submissionData
      })).unwrap();
      dispatch(closeModal({}));
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value === '' ? undefined : value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter announcement title"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter announcement content"
          />
        </div>

        {/* Type and Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="GENERAL">General</option>
              <option value="ACADEMIC">Academic</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="EVENT">Event</option>
              <option value="HOLIDAY">Holiday</option>
              <option value="EXAM">Exam</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Target Audience
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Region Selection - Only for users with region access */}
            {canAccessRegionLevel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Target Region
                </label>
                <select
                  name="targetRegionId"
                  value={formData.targetRegionId || ''}
                  onChange={handleRegionChange}
                  disabled={loadingRegions}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">All Regions</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                {loadingRegions && (
                  <p className="text-sm text-gray-500 mt-1">Loading regions...</p>
                )}
              </div>
            )}

            {/* School Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Building className="h-4 w-4" />
                Target School
              </label>
              <select
                name="targetSchoolId"
                value={formData.targetSchoolId || ''}
                onChange={handleSchoolChange}
                disabled={loadingSchools}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              {loadingSchools && (
                <p className="text-sm text-gray-500 mt-1">Loading schools...</p>
              )}
            </div>

            {/* Target Role - Filtered based on user's role hierarchy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <UserCheck className="h-4 w-4" />
                Target Role
              </label>
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                {availableTargetRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Department - Fetched from backend */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Target Department
              </label>
              <select
                name="targetDepartment"
                value={formData.targetDepartment}
                onChange={handleChange}
                disabled={loadingDepartments}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
              {loadingDepartments && (
                <p className="text-sm text-gray-500 mt-1">Loading departments...</p>
              )}
            </div>

            {/* Target Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Target Class
              </label>
              <select
                name="targetClass"
                value={formData.targetClass}
                onChange={handleChange}
                disabled={loadingClasses}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Select a class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
              {loadingClasses && (
                <p className="text-sm text-gray-500 mt-1">Loading classes...</p>
              )}
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5 text-blue-600" />
            Tags
          </h3>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="commentsEnabled"
                checked={formData.commentsEnabled}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="text-sm text-gray-700">Enable comments</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="acknowledgmentRequired"
                checked={formData.acknowledgmentRequired}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <span className="text-sm text-gray-700">Require acknowledgment</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => dispatch(closeModal({}))}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {status === 'loading' ? 'Creating...' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncementModal; 