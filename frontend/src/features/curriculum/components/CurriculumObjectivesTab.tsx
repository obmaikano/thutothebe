import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
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
  Calendar
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
  
  // Local state
  const [objectives, setObjectives] = useState<CurriculumObjective[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterBloomLevel, setFilterBloomLevel] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<CurriculumObjective | null>(null);
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

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Mock data - replace with actual API calls
  const mockObjectives: CurriculumObjective[] = [
    {
      id: 1,
      curriculumId,
      code: 'OBJ-001',
      title: 'Analyze Literary Texts',
      description: 'Students will analyze various forms of literary texts to identify themes, characters, and literary devices.',
      type: 'COGNITIVE',
      bloomLevel: 'ANALYZE',
      measurableOutcome: 'Students can identify and explain at least 3 literary devices in a given text with 80% accuracy.',
      assessmentMethod: 'Written analysis, oral presentation, and peer discussion',
      timeframe: '4 weeks',
      linkedStandardIds: [1, 2],
      linkedUnitIds: [1],
      isCore: true,
      priority: 'HIGH',
      active: true,
      createdAt: '2024-01-15T10:00:00Z',
      modifiedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      curriculumId,
      code: 'OBJ-002',
      title: 'Apply Mathematical Concepts',
      description: 'Students will apply mathematical concepts to solve real-world problems involving algebra and geometry.',
      type: 'COGNITIVE',
      bloomLevel: 'APPLY',
      measurableOutcome: 'Students can solve 8 out of 10 real-world math problems correctly using appropriate formulas.',
      assessmentMethod: 'Problem-solving exercises, project-based assessment',
      timeframe: '6 weeks',
      linkedStandardIds: [2],
      linkedUnitIds: [2, 3],
      isCore: true,
      priority: 'HIGH',
      active: true,
      createdAt: '2024-01-16T09:15:00Z',
      modifiedAt: '2024-01-22T11:45:00Z'
    },
    {
      id: 3,
      curriculumId,
      code: 'OBJ-003',
      title: 'Demonstrate Scientific Method',
      description: 'Students will demonstrate understanding of the scientific method through hands-on experiments.',
      type: 'PSYCHOMOTOR',
      bloomLevel: 'CREATE',
      measurableOutcome: 'Students can design and conduct a complete scientific experiment with proper controls.',
      assessmentMethod: 'Laboratory practical, experiment report, peer evaluation',
      timeframe: '3 weeks',
      linkedStandardIds: [3],
      linkedUnitIds: [4],
      isCore: false,
      priority: 'MEDIUM',
      active: true,
      createdAt: '2024-01-17T13:20:00Z',
      modifiedAt: '2024-01-23T16:10:00Z'
    },
    {
      id: 4,
      curriculumId,
      code: 'OBJ-004',
      title: 'Develop Collaborative Skills',
      description: 'Students will develop effective collaboration and communication skills through group projects.',
      type: 'AFFECTIVE',
      bloomLevel: 'EVALUATE',
      measurableOutcome: 'Students demonstrate effective teamwork in 90% of group activities as measured by peer feedback.',
      assessmentMethod: 'Peer assessment, self-reflection, group project outcomes',
      timeframe: 'Ongoing',
      linkedStandardIds: [],
      linkedUnitIds: [1, 2, 3, 4],
      isCore: false,
      priority: 'MEDIUM',
      active: true,
      createdAt: '2024-01-18T08:30:00Z',
      modifiedAt: '2024-01-24T12:15:00Z'
    }
  ];

  const loadObjectives = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setObjectives(mockObjectives);
      showNotification('success', 'Objectives loaded successfully');
    } catch (error) {
      showNotification('error', 'Failed to load objectives');
    } finally {
      setLoading(false);
    }
  }, [curriculumId, showNotification]);

  useEffect(() => {
    if (curriculumId) {
      loadObjectives();
    }
  }, [curriculumId, loadObjectives]);

  // Filter objectives
  const filteredObjectives = objectives.filter(objective => {
    const matchesSearch = objective.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         objective.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || objective.type === filterType;
    const matchesBloomLevel = filterBloomLevel === 'all' || objective.bloomLevel === filterBloomLevel;
    const matchesPriority = filterPriority === 'all' || objective.priority === filterPriority;
    return matchesSearch && matchesType && matchesBloomLevel && matchesPriority;
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
    resetForm();
    setShowAddModal(true);
  };

  const handleEditObjective = (objective: CurriculumObjective) => {
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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (showEditModal && selectedObjective) {
        // Update existing objective
        setObjectives(prev => prev.map(obj => 
          obj.id === selectedObjective.id 
            ? { ...obj, ...formData, modifiedAt: new Date().toISOString() }
            : obj
        ));
        showNotification('success', 'Objective updated successfully');
      } else {
        // Add new objective
        const newObjective: CurriculumObjective = {
          id: Date.now(),
          curriculumId,
          ...formData,
          active: true,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        };
        setObjectives(prev => [...prev, newObjective]);
        showNotification('success', 'Objective created successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedObjective(null);
      resetForm();
    } catch (error) {
      showNotification('error', 'Failed to save objective');
    }
  };

  const handleDeleteObjective = async (objectiveId: number) => {
    if (window.confirm('Are you sure you want to delete this objective? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setObjectives(prev => prev.filter(obj => obj.id !== objectiveId));
        showNotification('success', 'Objective deleted successfully');
      } catch (error) {
        showNotification('error', 'Failed to delete objective');
      }
    }
  };

  const getTypeBadge = (type: string) => {
    const config = {
      'COGNITIVE': { color: 'bg-blue-100 text-blue-800', icon: BookOpen },
      'AFFECTIVE': { color: 'bg-green-100 text-green-800', icon: Users },
      'PSYCHOMOTOR': { color: 'bg-purple-100 text-purple-800', icon: Target },
      'BEHAVIORAL': { color: 'bg-orange-100 text-orange-800', icon: Award }
    };
    const { color, icon: Icon } = config[type as keyof typeof config] || config.COGNITIVE;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {type}
      </span>
    );
  };

  const getBloomLevelBadge = (level: string) => {
    const config = {
      'REMEMBER': { color: 'bg-gray-100 text-gray-800', order: 1 },
      'UNDERSTAND': { color: 'bg-blue-100 text-blue-800', order: 2 },
      'APPLY': { color: 'bg-green-100 text-green-800', order: 3 },
      'ANALYZE': { color: 'bg-yellow-100 text-yellow-800', order: 4 },
      'EVALUATE': { color: 'bg-orange-100 text-orange-800', order: 5 },
      'CREATE': { color: 'bg-red-100 text-red-800', order: 6 }
    };
    const { color } = config[level as keyof typeof config] || config.UNDERSTAND;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {level}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      'HIGH': { color: 'bg-red-100 text-red-800' },
      'MEDIUM': { color: 'bg-yellow-100 text-yellow-800' },
      'LOW': { color: 'bg-green-100 text-green-800' }
    };
    const { color } = config[priority as keyof typeof config] || config.MEDIUM;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {priority} PRIORITY
      </span>
    );
  };

  const getStats = () => {
    return {
      total: objectives.length,
      core: objectives.filter(obj => obj.isCore).length,
      cognitive: objectives.filter(obj => obj.type === 'COGNITIVE').length,
      affective: objectives.filter(obj => obj.type === 'AFFECTIVE').length,
      psychomotor: objectives.filter(obj => obj.type === 'PSYCHOMOTOR').length,
      highPriority: objectives.filter(obj => obj.priority === 'HIGH').length
    };
  };

  const stats = getStats();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`rounded-lg border p-3 flex-shrink-0 ${
          notification.type === 'success' ? 'bg-green-50 border-green-200' : 
          notification.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
              {notification.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
              <span className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' : 
                notification.type === 'error' ? 'text-red-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className={`p-1 rounded-md transition-colors ${
                notification.type === 'success' ? 'hover:bg-green-100 text-green-600' : 
                notification.type === 'error' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-blue-100 text-blue-600'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Learning Objectives</h2>
            <p className="text-sm text-gray-600">Define and manage specific learning objectives for this curriculum</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadObjectives}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={handleAddObjective}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Objective
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search objectives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
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
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Total Objectives</p>
                <p className="text-lg font-bold text-blue-900">{stats.total}</p>
              </div>
              <Target className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Core Objectives</p>
                <p className="text-lg font-bold text-green-900">{stats.core}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Cognitive</p>
                <p className="text-lg font-bold text-purple-900">{stats.cognitive}</p>
              </div>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-1">Affective</p>
                <p className="text-lg font-bold text-orange-900">{stats.affective}</p>
              </div>
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-600 mb-1">Psychomotor</p>
                <p className="text-lg font-bold text-indigo-900">{stats.psychomotor}</p>
              </div>
              <Award className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">High Priority</p>
                <p className="text-lg font-bold text-red-900">{stats.highPriority}</p>
              </div>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Objectives List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Objectives ({filteredObjectives.length})</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
                <p className="mt-3 text-sm text-gray-600">Loading objectives...</p>
              </div>
            </div>
          ) : filteredObjectives.length === 0 ? (
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
                {(!searchTerm && filterType === 'all' && filterBloomLevel === 'all' && filterPriority === 'all') && (
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
                <div
                  key={objective.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{objective.title}</h4>
                        <span className="text-sm text-gray-500 font-mono">({objective.code})</span>
                        {getTypeBadge(objective.type)}
                        {getBloomLevelBadge(objective.bloomLevel)}
                        {getPriorityBadge(objective.priority)}
                        {objective.isCore && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Core
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{objective.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Measurable Outcome:</h5>
                          <p className="text-gray-600 mb-3">{objective.measurableOutcome}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Assessment Method:</h5>
                          <p className="text-gray-600">{objective.assessmentMethod}</p>
                          
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
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3 flex-shrink-0">
                      <button
                        onClick={() => handleEditObjective(objective)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit objective"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteObjective(objective.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete objective"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Objective Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {showEditModal ? 'Edit Objective' : 'Add New Objective'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="OBJ-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                    <input
                      type="text"
                      value={formData.timeframe}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="4 weeks"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Objective title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="Describe what students will learn..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="COGNITIVE">Cognitive</option>
                      <option value="AFFECTIVE">Affective</option>
                      <option value="PSYCHOMOTOR">Psychomotor</option>
                      <option value="BEHAVIORAL">Behavioral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bloom Level</label>
                    <select
                      value={formData.bloomLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, bloomLevel: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isCore}
                        onChange={(e) => setFormData(prev => ({ ...prev, isCore: e.target.checked }))}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Core Objective</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurable Outcome</label>
                  <textarea
                    value={formData.measurableOutcome}
                    onChange={(e) => setFormData(prev => ({ ...prev, measurableOutcome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="Students can demonstrate... with X% accuracy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Method</label>
                  <textarea
                    value={formData.assessmentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, assessmentMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="How will this objective be assessed?"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedObjective(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveObjective}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showEditModal ? 'Update Objective' : 'Create Objective'}
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