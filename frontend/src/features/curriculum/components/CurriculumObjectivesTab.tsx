import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAuth } from '../../../contexts/AuthContext';
import curriculumApi, { Curriculum } from '../../../api/services/curriculumApi';
import {
  Plus,
  Target,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Award,
  X,
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface CurriculumObjective {
  id: number;
  curriculumId: number;
  code: string;
  title: string;
  description: string;
  type: 'COGNITIVE' | 'AFFECTIVE' | 'PSYCHOMOTOR' | 'BEHAVIORAL';
  bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  measurableOutcome: string;
  assessmentMethod: string;
  timeframe: string;
  linkedStandardIds: number[];
  linkedUnitIds: number[];
  isCore: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

interface CurriculumObjectivesTabProps {
  curriculumId: number;
}

const CurriculumObjectivesTab: React.FC<CurriculumObjectivesTabProps> = ({ curriculumId }) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  
  // Local state
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [objectives, setObjectives] = useState<CurriculumObjective[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBloomLevel, setFilterBloomLevel] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<CurriculumObjective | null>(null);
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
    type: 'COGNITIVE' | 'AFFECTIVE' | 'PSYCHOMOTOR' | 'BEHAVIORAL';
    bloomLevel: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
    measurableOutcome: string;
    assessmentMethod: string;
    timeframe: string;
    linkedStandardIds: number[];
    linkedUnitIds: number[];
    isCore: boolean;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>({
    code: '',
    title: '',
    description: '',
    type: 'COGNITIVE',
    bloomLevel: 'UNDERSTAND',
    measurableOutcome: '',
    assessmentMethod: '',
    timeframe: '',
    linkedStandardIds: [],
    linkedUnitIds: [],
    isCore: true,
    priority: 'MEDIUM'
  });

  // Permission checks
  const canManageObjectives = user && [
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

  const loadCurriculumAndObjectives = useCallback(async () => {
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
      
      // Parse objectives from metadata
      if (curriculumData.metadata) {
        try {
          const metadata = JSON.parse(curriculumData.metadata);
          const objectivesData = metadata.learningObjectives || [];
          
          // Convert metadata objectives to proper format
          const formattedObjectives: CurriculumObjective[] = objectivesData.map((objective: any, index: number) => ({
            id: objective.id || (Date.now() + index),
            curriculumId,
            code: objective.code || `OBJ-${String(index + 1).padStart(3, '0')}`,
            title: objective.title || '',
            description: objective.description || '',
            type: objective.type || 'COGNITIVE',
            bloomLevel: objective.bloomLevel || 'UNDERSTAND',
            measurableOutcome: objective.measurableOutcome || '',
            assessmentMethod: objective.assessmentMethod || '',
            timeframe: objective.timeframe || '',
            linkedStandardIds: Array.isArray(objective.linkedStandardIds) ? objective.linkedStandardIds : [],
            linkedUnitIds: Array.isArray(objective.linkedUnitIds) ? objective.linkedUnitIds : [],
            isCore: objective.isCore !== undefined ? objective.isCore : true,
            priority: objective.priority || 'MEDIUM',
            active: objective.active !== undefined ? objective.active : true,
            createdAt: objective.createdAt || new Date().toISOString(),
            modifiedAt: objective.modifiedAt || new Date().toISOString()
          }));
          
          setObjectives(formattedObjectives);
          showNotification('success', 'Objectives loaded successfully');
        } catch (parseError) {
          console.error('Failed to parse curriculum metadata:', parseError);
          setObjectives([]);
          showNotification('info', 'No objectives found in curriculum metadata');
        }
      } else {
        setObjectives([]);
        showNotification('info', 'No objectives defined for this curriculum');
      }
    } catch (err: any) {
      console.error('Failed to load curriculum and objectives:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load curriculum data');
      showNotification('error', 'Failed to load curriculum data');
    } finally {
      setLoading(false);
    }
  }, [curriculumId, showNotification]);

  useEffect(() => {
    if (curriculumId) {
      loadCurriculumAndObjectives();
    }
  }, [curriculumId, loadCurriculumAndObjectives]);

  const saveObjectivesToBackend = async (updatedObjectives: CurriculumObjective[]) => {
    if (!curriculum) return;
    
    try {
      setSaving(true);
      
      // Update metadata with new objectives
      const currentMetadata = curriculum.metadata ? JSON.parse(curriculum.metadata) : {};
      const updatedMetadata = {
        ...currentMetadata,
        learningObjectives: updatedObjectives.map(objective => ({
          id: objective.id,
          code: objective.code,
          title: objective.title,
          description: objective.description,
          type: objective.type,
          bloomLevel: objective.bloomLevel,
          measurableOutcome: objective.measurableOutcome,
          assessmentMethod: objective.assessmentMethod,
          timeframe: objective.timeframe,
          linkedStandardIds: objective.linkedStandardIds,
          linkedUnitIds: objective.linkedUnitIds,
          isCore: objective.isCore,
          priority: objective.priority,
          active: objective.active,
          createdAt: objective.createdAt,
          modifiedAt: objective.modifiedAt
        }))
      };
      
      // Update curriculum with new metadata
      await curriculumApi.update(curriculumId, {
        metadata: JSON.stringify(updatedMetadata)
      });
      
      // Update local state
      setCurriculum(prev => prev ? { ...prev, metadata: JSON.stringify(updatedMetadata) } : null);
      
    } catch (err: any) {
      console.error('Failed to save objectives:', err);
      throw new Error(err.response?.data?.message || 'Failed to save objectives');
    } finally {
      setSaving(false);
    }
  };

  // Filter objectives
  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || objective.type === filterType;
    const matchesBloomLevel = filterBloomLevel === 'all' || objective.bloomLevel === filterBloomLevel;
    const matchesPriority = filterPriority === 'all' || objective.priority === filterPriority;
    return matchesSearch && matchesType && matchesBloomLevel && matchesPriority && objective.active;
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      type: 'COGNITIVE',
      bloomLevel: 'UNDERSTAND',
      measurableOutcome: '',
      assessmentMethod: '',
      timeframe: '',
      linkedStandardIds: [],
      linkedUnitIds: [],
      isCore: true,
      priority: 'MEDIUM'
    });
  };

  const handleAddObjective = () => {
    if (!canManageObjectives) {
      showNotification('error', 'You do not have permission to add objectives');
      return;
    }
    resetForm();
    setShowAddModal(true);
  };

  const handleEditObjective = (objective: CurriculumObjective) => {
    if (!canManageObjectives) {
      showNotification('error', 'You do not have permission to edit objectives');
      return;
    }
    
    setSelectedObjective(objective);
    setFormData({
      code: objective.code,
      title: objective.title,
      description: objective.description,
      type: objective.type,
      bloomLevel: objective.bloomLevel,
      measurableOutcome: objective.measurableOutcome,
      assessmentMethod: objective.assessmentMethod,
      timeframe: objective.timeframe,
      linkedStandardIds: objective.linkedStandardIds,
      linkedUnitIds: objective.linkedUnitIds,
      isCore: objective.isCore,
      priority: objective.priority
    });
    setShowEditModal(true);
  };

  const handleSaveObjective = async () => {
    if (!curriculum) return;
    
    try {
      const now = new Date().toISOString();
      
      if (showEditModal && selectedObjective) {
        // Update existing objective
        const updatedObjectives = objectives.map(obj => 
          obj.id === selectedObjective.id 
            ? { ...obj, ...formData, modifiedAt: now }
            : obj
        );
        
        await saveObjectivesToBackend(updatedObjectives);
        setObjectives(updatedObjectives);
        showNotification('success', 'Objective updated successfully');
      } else {
        // Add new objective
        const newObjective: CurriculumObjective = {
          id: Date.now(),
          curriculumId,
          ...formData,
          active: true,
          createdAt: now,
          modifiedAt: now
        };
        
        const updatedObjectives = [...objectives, newObjective];
        await saveObjectivesToBackend(updatedObjectives);
        setObjectives(updatedObjectives);
        showNotification('success', 'Objective created successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedObjective(null);
      resetForm();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to save objective');
    }
  };

  const handleDeleteObjective = async (objectiveId: number) => {
    if (!canManageObjectives) {
      showNotification('error', 'You do not have permission to delete objectives');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this objective? This action cannot be undone.')) {
      try {
        const updatedObjectives = objectives.map(obj => 
          obj.id === objectiveId ? { ...obj, active: false, modifiedAt: new Date().toISOString() } : obj
        );
        
        await saveObjectivesToBackend(updatedObjectives);
        setObjectives(updatedObjectives);
        showNotification('success', 'Objective deleted successfully');
      } catch (err: any) {
        showNotification('error', err.message || 'Failed to delete objective');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleRefresh = () => {
    loadCurriculumAndObjectives();
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'COGNITIVE': { color: 'bg-blue-100 text-blue-800', label: 'Cognitive' },
      'AFFECTIVE': { color: 'bg-red-100 text-red-800', label: 'Affective' },
      'PSYCHOMOTOR': { color: 'bg-green-100 text-green-800', label: 'Psychomotor' },
      'BEHAVIORAL': { color: 'bg-purple-100 text-purple-800', label: 'Behavioral' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.COGNITIVE;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getBloomLevelBadge = (level: string) => {
    const levelConfig = {
      'REMEMBER': { color: 'bg-gray-100 text-gray-800', label: 'Remember' },
      'UNDERSTAND': { color: 'bg-blue-100 text-blue-800', label: 'Understand' },
      'APPLY': { color: 'bg-green-100 text-green-800', label: 'Apply' },
      'ANALYZE': { color: 'bg-yellow-100 text-yellow-800', label: 'Analyze' },
      'EVALUATE': { color: 'bg-orange-100 text-orange-800', label: 'Evaluate' },
      'CREATE': { color: 'bg-red-100 text-red-800', label: 'Create' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.UNDERSTAND;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'HIGH': { color: 'bg-red-100 text-red-800', label: 'High' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      'LOW': { color: 'bg-gray-100 text-gray-800', label: 'Low' }
    };
    
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.MEDIUM;
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Learning Objectives</h2>
            <p className="text-sm text-gray-600">Define and manage specific learning objectives for this curriculum</p>
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
            {canManageObjectives && (
              <button
                onClick={handleAddObjective}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                disabled={saving}
              >
                <Plus className="h-4 w-4" />
                Add Objective
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search objectives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Types</option>
            <option value="COGNITIVE">Cognitive</option>
            <option value="AFFECTIVE">Affective</option>
            <option value="PSYCHOMOTOR">Psychomotor</option>
            <option value="BEHAVIORAL">Behavioral</option>
          </select>
          
          <select
            value={filterBloomLevel}
            onChange={(e) => setFilterBloomLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Bloom Levels</option>
            <option value="REMEMBER">Remember</option>
            <option value="UNDERSTAND">Understand</option>
            <option value="APPLY">Apply</option>
            <option value="ANALYZE">Analyze</option>
            <option value="EVALUATE">Evaluate</option>
            <option value="CREATE">Create</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Objectives List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Objectives ({filteredObjectives.length})</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredObjectives.length === 0 ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-2">No objectives found</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || filterType !== 'all' || filterBloomLevel !== 'all' || filterPriority !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No learning objectives have been defined for this curriculum yet.'
                  }
                </p>
                {(!searchTerm && filterType === 'all' && filterBloomLevel === 'all' && filterPriority === 'all' && canManageObjectives) && (
                  <button
                    onClick={handleAddObjective}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Objective
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredObjectives.map((objective) => (
                <div key={objective.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{objective.title}</h4>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(objective.type)}
                          {getBloomLevelBadge(objective.bloomLevel)}
                          {getPriorityBadge(objective.priority)}
                          {objective.isCore && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Core
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="font-mono">{objective.code}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {objective.timeframe}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Modified: {new Date(objective.modifiedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {canManageObjectives && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditObjective(objective)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit objective"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteObjective(objective.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete objective"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{objective.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Measurable Outcome:</h5>
                      <p className="text-gray-600 mb-3">{objective.measurableOutcome}</p>
                      
                      <div className="mt-2 flex flex-wrap gap-2">
                        {objective.linkedStandardIds.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {objective.linkedStandardIds.length} Standard(s)
                          </span>
                        )}
                        {objective.linkedUnitIds.length > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {objective.linkedUnitIds.length} Unit(s)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Assessment Method:</h5>
                      <p className="text-gray-600">{objective.assessmentMethod}</p>
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
                {showEditModal ? 'Edit Objective' : 'Add New Objective'}
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
                      placeholder="e.g., OBJ-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeframe
                    </label>
                    <input
                      type="text"
                      value={formData.timeframe}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 4 weeks"
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
                    placeholder="Enter objective title"
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
                    placeholder="Enter objective description"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="COGNITIVE">Cognitive</option>
                      <option value="AFFECTIVE">Affective</option>
                      <option value="PSYCHOMOTOR">Psychomotor</option>
                      <option value="BEHAVIORAL">Behavioral</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bloom Level
                    </label>
                    <select
                      value={formData.bloomLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, bloomLevel: e.target.value as any }))}
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Measurable Outcome
                  </label>
                  <textarea
                    value={formData.measurableOutcome}
                    onChange={(e) => setFormData(prev => ({ ...prev, measurableOutcome: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Define measurable outcome"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assessment Method
                  </label>
                  <textarea
                    value={formData.assessmentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, assessmentMethod: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Define assessment methods"
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
                    <span className="text-sm font-medium text-gray-700">Core Objective</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedObjective(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveObjective}
                  disabled={saving || !formData.title || !formData.description}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : showEditModal ? 'Update Objective' : 'Create Objective'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumObjectivesTab; 