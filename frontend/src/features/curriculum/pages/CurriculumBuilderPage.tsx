import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurriculumById, createCurriculum, updateCurriculum, clearCurriculumError } from '../curriculumSlice';
import { fetchSubjects } from '../../subjects/subjectsSlice';
import { fetchSchools } from '../../schools/schoolsSlice';
import { fetchRegions } from '../../regions/regionsSlice';
import { CreateCurriculumRequest, UpdateCurriculumRequest, Curriculum } from '../../../api/services/curriculumApi';
import { Save, ArrowLeft, Plus, Trash2, Edit, BookOpen, Target, Clock, Users } from 'lucide-react';

const CurriculumBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentCurriculum, status, error } = useAppSelector(state => state.curriculum);
  const { subjects } = useAppSelector(state => state.subjects);
  const { schools } = useAppSelector(state => state.schools);
  const { regions } = useAppSelector(state => state.regions);
  const { user } = useAppSelector(state => state.auth);

  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    curriculumType: 'SCHOOL_SPECIFIC' as Curriculum['curriculumType'],
    gradeLevel: 'STANDARD_1' as Curriculum['gradeLevel'],
    status: 'DRAFT' as Curriculum['status'],
    academicYear: new Date().getFullYear(),
    effectiveDate: '',
    expiryDate: '',
    learningOutcomes: '',
    durationWeeks: 40,
    totalHours: 800,
    regionId: undefined as number | undefined,
    schoolId: undefined as number | undefined,
    createdById: user?.id || 0,
    subjectIds: [] as number[],
    active: true,
    curriculumVersion: 1,
    metadata: ''
  });

  const [learningStandards, setLearningStandards] = useState([
    { id: Date.now(), title: '', description: '', category: 'KNOWLEDGE', bloomsLevel: 'REMEMBER', estimatedHours: 10 }
  ]);

  const [learningObjectives, setLearningObjectives] = useState([
    { id: Date.now(), title: '', description: '', type: 'COGNITIVE', bloomsLevel: 'REMEMBER', estimatedTime: 60 }
  ]);

  useEffect(() => {
    dispatch(fetchSubjects());
    dispatch(fetchSchools());
    dispatch(fetchRegions());

    if (isEditMode && id) {
      dispatch(fetchCurriculumById(Number(id)));
    }

    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch, isEditMode, id]);

  useEffect(() => {
    if (isEditMode && currentCurriculum) {
      setFormData({
        title: currentCurriculum.title,
        description: currentCurriculum.description || '',
        curriculumType: currentCurriculum.curriculumType,
        gradeLevel: currentCurriculum.gradeLevel,
        status: currentCurriculum.status,
        academicYear: currentCurriculum.academicYear,
        effectiveDate: currentCurriculum.effectiveDate || '',
        expiryDate: currentCurriculum.expiryDate || '',
        learningOutcomes: currentCurriculum.learningOutcomes || '',
        durationWeeks: currentCurriculum.durationWeeks || 40,
        totalHours: currentCurriculum.totalHours || 800,
        regionId: currentCurriculum.regionId,
        schoolId: currentCurriculum.schoolId,
        createdById: currentCurriculum.createdById,
        subjectIds: currentCurriculum.subjectIds || [],
        active: currentCurriculum.active,
        curriculumVersion: currentCurriculum.curriculumVersion || 1,
        metadata: currentCurriculum.metadata || ''
      });
    }
  }, [isEditMode, currentCurriculum]);

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

  const addLearningStandard = () => {
    setLearningStandards(prev => [
      ...prev,
      { id: Date.now(), title: '', description: '', category: 'KNOWLEDGE', bloomsLevel: 'REMEMBER', estimatedHours: 10 }
    ]);
  };

  const removeLearningStandard = (id: number) => {
    setLearningStandards(prev => prev.filter(standard => standard.id !== id));
  };

  const updateLearningStandard = (id: number, field: string, value: any) => {
    setLearningStandards(prev => prev.map(standard => 
      standard.id === id ? { ...standard, [field]: value } : standard
    ));
  };

  const addLearningObjective = () => {
    setLearningObjectives(prev => [
      ...prev,
      { id: Date.now(), title: '', description: '', type: 'COGNITIVE', bloomsLevel: 'REMEMBER', estimatedTime: 60 }
    ]);
  };

  const removeLearningObjective = (id: number) => {
    setLearningObjectives(prev => prev.filter(objective => objective.id !== id));
  };

  const updateLearningObjective = (id: number, field: string, value: any) => {
    setLearningObjectives(prev => prev.map(objective => 
      objective.id === id ? { ...objective, [field]: value } : objective
    ));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const curriculumData = {
        ...formData,
        metadata: JSON.stringify({
          learningStandards,
          learningObjectives,
          customFields: formData.metadata ? JSON.parse(formData.metadata) : {}
        })
      };

      if (isEditMode && id) {
        await dispatch(updateCurriculum({ 
          id: Number(id), 
          curriculumData: curriculumData as UpdateCurriculumRequest 
        })).unwrap();
      } else {
        await dispatch(createCurriculum(curriculumData as CreateCurriculumRequest)).unwrap();
      }

      navigate('/app/curriculum');
    } catch (error) {
      console.error('Failed to save curriculum:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canEditCurriculum = () => {
    if (!user) return false;
    
    if (isEditMode && currentCurriculum) {
      // Check if user is the creator
      if (currentCurriculum.createdById === user.id) return true;
      
      // Check role-based permissions
      const editorRoles = ['MINISTRY_STAFF', 'REGIONAL_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN'];
      if (!editorRoles.includes(user.role)) return false;
      
      // Check scope permissions
      if (currentCurriculum.curriculumType === 'NATIONAL' && !['MINISTRY_STAFF', 'SUPER_ADMIN'].includes(user.role)) return false;
      if (currentCurriculum.regionId && user.regionId !== currentCurriculum.regionId) return false;
      if (currentCurriculum.schoolId && user.schoolId !== currentCurriculum.schoolId) return false;
    }
    
    return true;
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (isEditMode && !canEditCurriculum()) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">You don't have permission to edit this curriculum.</p>
          <button 
            onClick={() => navigate('/app/curriculum')}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Curriculum List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/app/curriculum')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Curriculum' : 'Create New Curriculum'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEditMode ? 'Modify curriculum details and structure' : 'Design a comprehensive educational curriculum'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading || !formData.title.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Curriculum'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curriculum Title *
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

              <div className="md:col-span-2">
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

          {/* Learning Standards */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Standards
              </h2>
              <button
                onClick={addLearningStandard}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Standard
              </button>
            </div>

            <div className="space-y-4">
              {learningStandards.map((standard, index) => (
                <div key={standard.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Standard {index + 1}</h3>
                    {learningStandards.length > 1 && (
                      <button
                        onClick={() => removeLearningStandard(standard.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={standard.title}
                        onChange={(e) => updateLearningStandard(standard.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Standard title"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <textarea
                        value={standard.description}
                        onChange={(e) => updateLearningStandard(standard.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Standard description"
                      />
                    </div>
                    
                    <div>
                      <select
                        value={standard.category}
                        onChange={(e) => updateLearningStandard(standard.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="KNOWLEDGE">Knowledge</option>
                        <option value="SKILLS">Skills</option>
                        <option value="UNDERSTANDING">Understanding</option>
                        <option value="APPLICATION">Application</option>
                        <option value="ANALYSIS">Analysis</option>
                        <option value="SYNTHESIS">Synthesis</option>
                        <option value="EVALUATION">Evaluation</option>
                      </select>
                    </div>
                    
                    <div>
                      <select
                        value={standard.bloomsLevel}
                        onChange={(e) => updateLearningStandard(standard.id, 'bloomsLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="REMEMBER">Remember</option>
                        <option value="UNDERSTAND">Understand</option>
                        <option value="APPLY">Apply</option>
                        <option value="ANALYZE">Analyze</option>
                        <option value="EVALUATE">Evaluate</option>
                        <option value="CREATE">Create</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Learning Objectives
              </h2>
              <button
                onClick={addLearningObjective}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Objective
              </button>
            </div>

            <div className="space-y-4">
              {learningObjectives.map((objective, index) => (
                <div key={objective.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900">Objective {index + 1}</h3>
                    {learningObjectives.length > 1 && (
                      <button
                        onClick={() => removeLearningObjective(objective.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={objective.title}
                        onChange={(e) => updateLearningObjective(objective.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Objective title"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <textarea
                        value={objective.description}
                        onChange={(e) => updateLearningObjective(objective.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Objective description"
                      />
                    </div>
                    
                    <div>
                      <select
                        value={objective.type}
                        onChange={(e) => updateLearningObjective(objective.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="COGNITIVE">Cognitive</option>
                        <option value="AFFECTIVE">Affective</option>
                        <option value="PSYCHOMOTOR">Psychomotor</option>
                      </select>
                    </div>
                    
                    <div>
                      <select
                        value={objective.bloomsLevel}
                        onChange={(e) => updateLearningObjective(objective.id, 'bloomsLevel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="REMEMBER">Remember</option>
                        <option value="UNDERSTAND">Understand</option>
                        <option value="APPLY">Apply</option>
                        <option value="ANALYZE">Analyze</option>
                        <option value="EVALUATE">Evaluate</option>
                        <option value="CREATE">Create</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Duration & Hours */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Duration & Hours
            </h3>
            
            <div className="space-y-4">
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
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Scope
            </h3>
            
            <div className="space-y-4">
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
          </div>

          {/* Subjects */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Associated Subjects
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
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

          {/* Learning Outcomes */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Learning Outcomes
            </h3>
            
            <textarea
              value={formData.learningOutcomes}
              onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the expected learning outcomes and competencies students will achieve..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumBuilderPage; 