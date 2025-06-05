import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import curriculumApi, { Curriculum } from '../../../api/services/curriculumApi';
import {
  Plus,
  BookOpen,
  Target,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Award,
  Clock,
  Users,
  X,
  Eye,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface CurriculumStandard {
  id: number;
  curriculumId: number;
  code: string;
  title: string;
  description: string;
  category: 'KNOWLEDGE' | 'SKILLS' | 'UNDERSTANDING' | 'APPLICATION' | 'ANALYSIS' | 'SYNTHESIS' | 'EVALUATION' | 'COMPETENCIES';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  assessmentCriteria: string;
  learningOutcomes: string[];
  prerequisites: string[];
  isCore: boolean;
  weightPercentage: number;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface CurriculumStandardsTabProps {
  curriculumId: number;
}

const CurriculumStandardsTab: React.FC<CurriculumStandardsTabProps> = ({ curriculumId }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // Local state
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [standards, setStandards] = useState<CurriculumStandard[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<CurriculumStandard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form data for modals
  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    description: string;
    category: 'KNOWLEDGE' | 'SKILLS' | 'UNDERSTANDING' | 'APPLICATION' | 'ANALYSIS' | 'SYNTHESIS' | 'EVALUATION' | 'COMPETENCIES';
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    assessmentCriteria: string;
    learningOutcomes: string[];
    prerequisites: string[];
    isCore: boolean;
    weightPercentage: number;
  }>({
    code: '',
    title: '',
    description: '',
    category: 'KNOWLEDGE',
    level: 'INTERMEDIATE',
    assessmentCriteria: '',
    learningOutcomes: [],
    prerequisites: [],
    isCore: true,
    weightPercentage: 25
  });

  // Permission checks
  const canManageStandards = user && [
    'SUPER_ADMIN',
    'MINISTRY_EXECUTIVE',
    'MINISTRY_STAFF',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SCHOOL_HEAD',
    'DEPARTMENT_HEAD'
  ].includes(user.role);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const loadCurriculumAndStandards = useCallback(async () => {
    if (!curriculumId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await curriculumApi.getById(curriculumId);
      const curriculumData = response.data.data as Curriculum;
      
      if (!curriculumData) {
        throw new Error('Curriculum not found');
      }
      
      setCurriculum(curriculumData);
      
      // Parse standards from metadata
      if (curriculumData.metadata) {
        try {
          const metadata = JSON.parse(curriculumData.metadata);
          const standardsData = metadata.learningStandards || [];
          
          // Convert metadata standards to proper format
          const formattedStandards: CurriculumStandard[] = standardsData.map((standard: any, index: number) => ({
            id: standard.id || (Date.now() + index),
            curriculumId,
            code: standard.code || `STD-${String(index + 1).padStart(3, '0')}`,
            title: standard.title || '',
            description: standard.description || '',
            category: standard.category || 'KNOWLEDGE',
            level: standard.level || 'INTERMEDIATE',
            assessmentCriteria: standard.assessmentCriteria || '',
            learningOutcomes: Array.isArray(standard.learningOutcomes) ? standard.learningOutcomes : [],
            prerequisites: Array.isArray(standard.prerequisites) ? standard.prerequisites : [],
            isCore: standard.isCore !== undefined ? standard.isCore : true,
            weightPercentage: standard.weightPercentage || 25,
            active: standard.active !== undefined ? standard.active : true,
            createdAt: standard.createdAt || new Date().toISOString(),
            modifiedAt: standard.modifiedAt || new Date().toISOString()
          }));
          
          setStandards(formattedStandards);
          showNotification('success', 'Standards loaded successfully');
        } catch (parseError) {
          console.error('Failed to parse curriculum metadata:', parseError);
          setStandards([]);
          showNotification('info', 'No standards found in curriculum metadata');
        }
      } else {
        setStandards([]);
        showNotification('info', 'No standards defined for this curriculum');
      }
    } catch (err: any) {
      console.error('Failed to load curriculum and standards:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load curriculum data');
      showNotification('error', 'Failed to load curriculum data');
    } finally {
      setLoading(false);
    }
  }, [curriculumId, showNotification]);

  useEffect(() => {
    if (curriculumId) {
      loadCurriculumAndStandards();
    }
  }, [curriculumId, loadCurriculumAndStandards]);

  const saveStandardsToBackend = async (updatedStandards: CurriculumStandard[]) => {
    if (!curriculum) return;
    
    try {
      setSaving(true);
      
      // Update metadata with new standards
      const currentMetadata = curriculum.metadata ? JSON.parse(curriculum.metadata) : {};
      const updatedMetadata = {
        ...currentMetadata,
        learningStandards: updatedStandards.map(standard => ({
          id: standard.id,
          code: standard.code,
          title: standard.title,
          description: standard.description,
          category: standard.category,
          level: standard.level,
          assessmentCriteria: standard.assessmentCriteria,
          learningOutcomes: standard.learningOutcomes,
          prerequisites: standard.prerequisites,
          isCore: standard.isCore,
          weightPercentage: standard.weightPercentage,
          active: standard.active,
          createdAt: standard.createdAt,
          modifiedAt: standard.modifiedAt
        }))
      };
      
      // Update curriculum with new metadata
      await curriculumApi.update(curriculumId, {
        metadata: JSON.stringify(updatedMetadata)
      });
      
      // Update local state
      setCurriculum(prev => prev ? { ...prev, metadata: JSON.stringify(updatedMetadata) } : null);
      
    } catch (err: any) {
      console.error('Failed to save standards:', err);
      throw new Error(err.response?.data?.message || 'Failed to save standards');
    } finally {
      setSaving(false);
    }
  };

  // Filter standards
  const filteredStandards = standards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || standard.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || standard.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel && standard.active;
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      category: 'KNOWLEDGE',
      level: 'INTERMEDIATE',
      assessmentCriteria: '',
      learningOutcomes: [],
      prerequisites: [],
      isCore: true,
      weightPercentage: 25
    });
  };

  const handleAddStandard = () => {
    if (!canManageStandards) {
      showNotification('error', 'You do not have permission to add standards');
      return;
    }
    resetForm();
    setShowAddModal(true);
  };

  const handleEditStandard = (standard: CurriculumStandard) => {
    if (!canManageStandards) {
      showNotification('error', 'You do not have permission to edit standards');
      return;
    }
    
    setSelectedStandard(standard);
    setFormData({
      code: standard.code,
      title: standard.title,
      description: standard.description,
      category: standard.category,
      level: standard.level,
      assessmentCriteria: standard.assessmentCriteria,
      learningOutcomes: standard.learningOutcomes,
      prerequisites: standard.prerequisites,
      isCore: standard.isCore,
      weightPercentage: standard.weightPercentage
    });
    setShowEditModal(true);
  };

  const handleSaveStandard = async () => {
    if (!curriculum) return;
    
    try {
      const now = new Date().toISOString();
      
      if (showEditModal && selectedStandard) {
        // Update existing standard
        const updatedStandards = standards.map(std => 
          std.id === selectedStandard.id 
            ? { ...std, ...formData, modifiedAt: now }
            : std
        );
        
        await saveStandardsToBackend(updatedStandards);
        setStandards(updatedStandards);
        showNotification('success', 'Standard updated successfully');
      } else {
        // Add new standard
        const newStandard: CurriculumStandard = {
          id: Date.now(),
          curriculumId,
          ...formData,
          active: true,
          createdAt: now,
          modifiedAt: now
        };
        
        const updatedStandards = [...standards, newStandard];
        await saveStandardsToBackend(updatedStandards);
        setStandards(updatedStandards);
        showNotification('success', 'Standard created successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedStandard(null);
      resetForm();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save standard');
    }
  };

  const handleDeleteStandard = async (standardId: number) => {
    if (!canManageStandards) {
      showNotification('error', 'You do not have permission to delete standards');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this standard? This action cannot be undone.')) {
      try {
        const updatedStandards = standards.map(std => 
          std.id === standardId ? { ...std, active: false, modifiedAt: new Date().toISOString() } : std
        );
        
        await saveStandardsToBackend(updatedStandards);
        setStandards(updatedStandards);
        showNotification('success', 'Standard deleted successfully');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to delete standard');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleRefresh = () => {
    loadCurriculumAndStandards();
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'KNOWLEDGE': { color: 'bg-blue-100 text-blue-800', label: 'Knowledge' },
      'SKILLS': { color: 'bg-green-100 text-green-800', label: 'Skills' },
      'UNDERSTANDING': { color: 'bg-purple-100 text-purple-800', label: 'Understanding' },
      'APPLICATION': { color: 'bg-orange-100 text-orange-800', label: 'Application' },
      'ANALYSIS': { color: 'bg-yellow-100 text-yellow-800', label: 'Analysis' },
      'SYNTHESIS': { color: 'bg-pink-100 text-pink-800', label: 'Synthesis' },
      'EVALUATION': { color: 'bg-red-100 text-red-800', label: 'Evaluation' },
      'COMPETENCIES': { color: 'bg-indigo-100 text-indigo-800', label: 'Competencies' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.KNOWLEDGE;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'BEGINNER': { color: 'bg-gray-100 text-gray-800', label: 'Beginner' },
      'INTERMEDIATE': { color: 'bg-blue-100 text-blue-800', label: 'Intermediate' },
      'ADVANCED': { color: 'bg-purple-100 text-purple-800', label: 'Advanced' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.INTERMEDIATE;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle className="w-5 h-5" />
          <span>{error}</span>
          <button onClick={clearError} className="btn btn-sm btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`alert ${
          notification.type === 'success' ? 'alert-success' : 
          notification.type === 'error' ? 'alert-error' : 'alert-info'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
           notification.type === 'error' ? <AlertTriangle className="w-5 h-5" /> : 
           <AlertTriangle className="w-5 h-5" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Learning Standards</h2>
            <p className="text-sm text-gray-600">Define and manage curriculum standards and competencies</p>
            {curriculum && (
              <p className="text-xs text-gray-500 mt-1">
                Curriculum: {curriculum.title} • {curriculum.gradeLevel.replace('_', ' ')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading || saving}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            {canManageStandards && (
              <button
                onClick={handleAddStandard}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                disabled={saving}
              >
                <Plus className="h-4 w-4" />
                Add Standard
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search standards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="KNOWLEDGE">Knowledge</option>
            <option value="SKILLS">Skills</option>
            <option value="UNDERSTANDING">Understanding</option>
            <option value="APPLICATION">Application</option>
            <option value="ANALYSIS">Analysis</option>
            <option value="SYNTHESIS">Synthesis</option>
            <option value="EVALUATION">Evaluation</option>
            <option value="COMPETENCIES">Competencies</option>
          </select>
          
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Standards List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Standards ({filteredStandards.length})</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredStandards.length === 0 ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-2">No standards found</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || filterCategory !== 'all' || filterLevel !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No learning standards have been defined for this curriculum yet.'
                  }
                </p>
                {(!searchTerm && filterCategory === 'all' && filterLevel === 'all' && canManageStandards) && (
                  <button
                    onClick={handleAddStandard}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Standard
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStandards.map((standard) => (
                <div key={standard.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{standard.title}</h4>
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(standard.category)}
                          {getLevelBadge(standard.level)}
                          {standard.isCore && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Core
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-mono">{standard.code}</span>
                        <span>{standard.weightPercentage}% weight</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Modified: {new Date(standard.modifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {canManageStandards && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditStandard(standard)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit standard"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStandard(standard.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete standard"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{standard.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Assessment Criteria:</h5>
                      <p className="text-gray-600 mb-3">{standard.assessmentCriteria}</p>
                      
                      {standard.prerequisites.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">Prerequisites:</h5>
                          <ul className="text-gray-600 text-xs space-y-1">
                            {standard.prerequisites.map((prereq, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-gray-400">•</span>
                                {prereq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Learning Outcomes:</h5>
                      {standard.learningOutcomes.length > 0 ? (
                        <ul className="text-gray-600 text-xs space-y-1">
                          {standard.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-xs">No learning outcomes defined</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {showEditModal ? 'Edit Standard' : 'Add New Standard'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., STD-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.weightPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, weightPercentage: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter standard title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter standard description"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="KNOWLEDGE">Knowledge</option>
                      <option value="SKILLS">Skills</option>
                      <option value="UNDERSTANDING">Understanding</option>
                      <option value="APPLICATION">Application</option>
                      <option value="ANALYSIS">Analysis</option>
                      <option value="SYNTHESIS">Synthesis</option>
                      <option value="EVALUATION">Evaluation</option>
                      <option value="COMPETENCIES">Competencies</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Criteria
                  </label>
                  <textarea
                    value={formData.assessmentCriteria}
                    onChange={(e) => setFormData(prev => ({ ...prev, assessmentCriteria: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter assessment criteria"
                  />
                </div>
                
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isCore}
                      onChange={(e) => setFormData(prev => ({ ...prev, isCore: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Core Standard</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedStandard(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStandard}
                  disabled={saving || !formData.title || !formData.description}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : showEditModal ? 'Update Standard' : 'Create Standard'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumStandardsTab; 