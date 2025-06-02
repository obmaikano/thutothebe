import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModal } from '../../common/modalSlice';
import { updateCurriculum, updateCurriculumSubjects } from '../curriculumSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchRegions } from '../../regions/regionsSlice';
import { UpdateCurriculumRequest, Curriculum } from '../../../api/services/curriculumApi';
import { Save, X } from 'lucide-react';

interface EditCurriculumModalProps {
  extraObject: Curriculum;
}

const EditCurriculumModal: React.FC<EditCurriculumModalProps> = ({ extraObject: curriculum }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.curriculum);
  const { subjects } = useAppSelector(state => state.subjects);
  const { schools } = useAppSelector(state => state.schools);
  const { regions } = useAppSelector(state => state.regions);
  const { user } = useAppSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: curriculum?.title || '',
    description: curriculum?.description || '',
    curriculumType: curriculum?.curriculumType || 'SCHOOL_SPECIFIC' as UpdateCurriculumRequest['curriculumType'],
    gradeLevel: curriculum?.gradeLevel || 'STANDARD_1' as UpdateCurriculumRequest['gradeLevel'],
    status: curriculum?.status || 'DRAFT' as UpdateCurriculumRequest['status'],
    academicYear: curriculum?.academicYear || new Date().getFullYear(),
    effectiveDate: curriculum?.effectiveDate || '',
    expiryDate: curriculum?.expiryDate || '',
    learningOutcomes: curriculum?.learningOutcomes || '',
    durationWeeks: curriculum?.durationWeeks || 40,
    totalHours: curriculum?.totalHours || 800,
    regionId: curriculum?.regionId,
    schoolId: curriculum?.schoolId,
    subjectIds: curriculum?.subjectIds || [],
    active: curriculum?.active ?? true,
    curriculumVersion: curriculum?.curriculumVersion || 1,
    metadata: curriculum?.metadata || ''
  });

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchSchools());
    dispatch(fetchRegions());
  }, [dispatch]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubjectToggle = (subjectId: number) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter(id => id !== subjectId)
        : [...prev.subjectIds, subjectId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!curriculum?.id) {
      setError('Curriculum ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Update curriculum basic information
      await dispatch(updateCurriculum({ 
        id: curriculum.id, 
        curriculumData: formData as UpdateCurriculumRequest 
      })).unwrap();
      
      // Update curriculum subjects if they have changed
      if (JSON.stringify(formData.subjectIds.sort()) !== JSON.stringify((curriculum.subjectIds || []).sort())) {
        console.log('Updating curriculum subjects:', formData.subjectIds);
        await dispatch(updateCurriculumSubjects({ 
          curriculumId: curriculum.id, 
          subjectIds: formData.subjectIds 
        })).unwrap();
      }
      
      dispatch(closeModal({}));
    } catch (error: any) {
      setError(error.message || 'Failed to update curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const canEditCurriculum = () => {
    if (!user || !curriculum) return false;
    
    // Check if user is the creator
    if (curriculum.createdById === user.id) return true;
    
    // Check role-based permissions
    const editorRoles = ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];
    if (!editorRoles.includes(user.role)) return false;
    
    // Check scope permissions
    if (curriculum.curriculumType === 'NATIONAL' && !['MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role)) return false;
    if (curriculum.regionId && user.regionId !== curriculum.regionId) return false;
    if (curriculum.schoolId && user.schoolId !== curriculum.schoolId) return false;
    
    return true;
  };

  if (!canEditCurriculum()) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
          <p className="text-red-600">You don't have permission to edit this curriculum.</p>
          <button 
            onClick={handleClose}
            className="mt-4 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter curriculum title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the curriculum objectives and scope"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curriculum Type
            </label>
            <select
              value={formData.curriculumType}
              onChange={(e) => handleInputChange('curriculumType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="NATIONAL">National</option>
              <option value="REGIONAL">Regional</option>
              <option value="SCHOOL_SPECIFIC">School-Based</option>
              <option value="INTERNATIONAL">International</option>
              <option value="VOCATIONAL">Vocational</option>
              <option value="SPECIAL_NEEDS">Special Needs</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              value={formData.gradeLevel}
              onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PRE_KINDERGARTEN">Pre-Kindergarten</option>
              <option value="KINDERGARTEN">Kindergarten</option>
              <option value="STANDARD_1">Standard 1</option>
              <option value="STANDARD_2">Standard 2</option>
              <option value="STANDARD_3">Standard 3</option>
              <option value="STANDARD_4">Standard 4</option>
              <option value="STANDARD_5">Standard 5</option>
              <option value="STANDARD_6">Standard 6</option>
              <option value="STANDARD_7">Standard 7</option>
              <option value="FORM_1">Form 1</option>
              <option value="FORM_2">Form 2</option>
              <option value="FORM_3">Form 3</option>
              <option value="FORM_4">Form 4</option>
              <option value="FORM_5">Form 5</option>
              <option value="FORM_6">Form 6</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <input
              type="number"
              value={formData.academicYear}
              onChange={(e) => handleInputChange('academicYear', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="2020"
              max="2030"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Duration & Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Duration & Dates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Weeks)
            </label>
            <input
              type="number"
              value={formData.durationWeeks}
              onChange={(e) => handleInputChange('durationWeeks', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
              max="52"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Hours
            </label>
            <input
              type="number"
              value={formData.totalHours}
              onChange={(e) => handleInputChange('totalHours', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effective Date
            </label>
            <input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scope */}
      {(formData.curriculumType === 'REGIONAL' || formData.curriculumType === 'SCHOOL_SPECIFIC') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Scope</h3>
          
          {(formData.curriculumType === 'REGIONAL' || formData.curriculumType === 'SCHOOL_SPECIFIC') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <select
                value={formData.regionId || ''}
                onChange={(e) => handleInputChange('regionId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Region</option>
                {regions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {formData.curriculumType === 'SCHOOL_SPECIFIC' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <select
                value={formData.schoolId || ''}
                onChange={(e) => handleInputChange('schoolId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select School</option>
                {schools
                  .filter(school => !formData.regionId || school.regionId === formData.regionId)
                  .map(school => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Associated Subjects */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Associated Subjects</h3>
        
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="space-y-2">
            {subjects.map(subject => (
              <label key={subject.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.subjectIds.includes(subject.id)}
                  onChange={() => handleSubjectToggle(subject.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{subject.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Learning Outcomes</h3>
        
        <textarea
          value={formData.learningOutcomes}
          onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the expected learning outcomes and competencies students will achieve..."
        />
      </div>

      {/* Active Status */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
        
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.active}
            onChange={(e) => handleInputChange('active', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Active curriculum</span>
        </label>
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Update Curriculum
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default EditCurriculumModal; 