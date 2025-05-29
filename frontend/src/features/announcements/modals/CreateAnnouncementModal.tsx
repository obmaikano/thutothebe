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

interface CreateAnnouncementModalProps {
  extraObject?: any;
}

// Common departments in educational institutions
const DEPARTMENTS = [
  { id: 'MATHEMATICS', name: 'Mathematics' },
  { id: 'ENGLISH', name: 'English' },
  { id: 'SCIENCE', name: 'Science' },
  { id: 'SOCIAL_STUDIES', name: 'Social Studies' },
  { id: 'PHYSICAL_EDUCATION', name: 'Physical Education' },
  { id: 'ARTS', name: 'Arts' },
  { id: 'MUSIC', name: 'Music' },
  { id: 'TECHNOLOGY', name: 'Technology' },
  { id: 'LANGUAGES', name: 'Languages' },
  { id: 'ADMINISTRATION', name: 'Administration' },
  { id: 'GUIDANCE', name: 'Guidance & Counseling' },
  { id: 'LIBRARY', name: 'Library' },
  { id: 'HEALTH', name: 'Health Services' }
];

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { status } = useAppSelector(state => state.announcements);

  // Data state
  const [regions, setRegions] = useState<Region[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);

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

  // Load initial data
  useEffect(() => {
    loadRegions();
  }, []);

  // Load schools when region changes
  useEffect(() => {
    if (formData.targetRegionId) {
      loadSchoolsByRegion(formData.targetRegionId);
    } else {
      setSchools([]);
      setClasses([]);
      setFormData(prev => ({ ...prev, targetSchoolId: undefined, targetClass: '' }));
    }
  }, [formData.targetRegionId]);

  // Load classes when school changes
  useEffect(() => {
    if (formData.targetSchoolId) {
      loadClassesBySchool(formData.targetSchoolId);
    } else {
      setClasses([]);
      setFormData(prev => ({ ...prev, targetClass: '' }));
    }
  }, [formData.targetSchoolId]);

  const loadRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await regionApi.getActiveRegions();
      if (response.data.data && Array.isArray(response.data.data)) {
        setRegions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadSchoolsByRegion = async (regionId: number) => {
    setLoadingSchools(true);
    try {
      const response = await schoolApi.getActiveByRegionId(regionId);
      if (response.data.data && Array.isArray(response.data.data)) {
        setSchools(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load schools:', error);
    } finally {
      setLoadingSchools(false);
    }
  };

  const loadClassesBySchool = async (schoolId: number) => {
    setLoadingClasses(true);
    try {
      const response = await classApi.getActiveBySchool(schoolId);
      if (response.data.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load classes:', error);
    } finally {
      setLoadingClasses(false);
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
            {/* Target Region */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Target Region
                {loadingRegions && <span className="loading loading-spinner loading-xs ml-2"></span>}
              </label>
              <select
                name="targetRegionId"
                value={formData.targetRegionId || ''}
                onChange={handleChange}
                disabled={loadingRegions}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{loadingRegions ? 'Loading regions...' : 'Select a region'}</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target School */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Building className="h-4 w-4" />
                Target School
                {loadingSchools && <span className="loading loading-spinner loading-xs ml-2"></span>}
              </label>
              <select
                name="targetSchoolId"
                value={formData.targetSchoolId || ''}
                onChange={handleChange}
                disabled={loadingSchools || !formData.targetRegionId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!formData.targetRegionId ? 'Select a region first' : 
                   loadingSchools ? 'Loading schools...' : 'Select a school'}
                </option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Role */}
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
                <option value="STUDENT">Students</option>
                <option value="TEACHER">Teachers</option>
                <option value="SENIOR_TEACHER">Senior Teachers</option>
                <option value="DEPARTMENT_HEAD">Department Heads</option>
                <option value="SCHOOL_HEAD">School Heads</option>
                <option value="SCHOOL_ADMIN">School Admins</option>
                <option value="REGIONAL_OFFICER">Regional Officers</option>
                <option value="REGIONAL_ADMIN">Regional Admins</option>
                <option value="DIRECTOR">Directors</option>
                <option value="MINISTRY_STAFF">Ministry Staff</option>
                <option value="MINISTRY_EXECUTIVE">Ministry Executives</option>
                <option value="PARENT">Parents</option>
              </select>
            </div>

            {/* Target Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Target Department
              </label>
              <select
                name="targetDepartment"
                value={formData.targetDepartment}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a department</option>
                {DEPARTMENTS.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Class */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                Target Class
                {loadingClasses && <span className="loading loading-spinner loading-xs ml-2"></span>}
              </label>
              <select
                name="targetClass"
                value={formData.targetClass}
                onChange={handleChange}
                disabled={loadingClasses || !formData.targetSchoolId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!formData.targetSchoolId ? 'Select a school first' : 
                   loadingClasses ? 'Loading classes...' : 'Select a class'}
                </option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.name}>
                    {classItem.name}
                  </option>
                ))}
              </select>
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