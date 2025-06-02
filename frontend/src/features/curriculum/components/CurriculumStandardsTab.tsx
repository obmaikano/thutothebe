import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  Plus,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  FileText,
  Award,
  TrendingUp,
  Users,
  Clock,
  X
} from 'lucide-react';

interface CurriculumStandard {
  id: number;
  curriculumId: number;
  code: string;
  title: string;
  description: string;
  category: 'KNOWLEDGE' | 'SKILLS' | 'ATTITUDES' | 'COMPETENCIES';
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTERY';
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
  
  // Local state
  const [standards, setStandards] = useState<CurriculumStandard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<CurriculumStandard | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Form data for modals
  const [formData, setFormData] = useState<{
    code: string;
    title: string;
    description: string;
    category: 'KNOWLEDGE' | 'SKILLS' | 'ATTITUDES' | 'COMPETENCIES';
    level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'MASTERY';
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
    level: 'BASIC',
    assessmentCriteria: '',
    learningOutcomes: [''],
    prerequisites: [''],
    isCore: true,
    weightPercentage: 10
  });

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Mock data - replace with actual API calls
  const mockStandards: CurriculumStandard[] = [
    {
      id: 1,
      curriculumId,
      code: 'STD-001',
      title: 'Reading Comprehension',
      description: 'Students will demonstrate the ability to read and understand various types of texts.',
      category: 'SKILLS',
      level: 'INTERMEDIATE',
      assessmentCriteria: 'Students can identify main ideas, supporting details, and make inferences from text.',
      learningOutcomes: [
        'Identify main ideas in texts',
        'Recognize supporting details',
        'Make logical inferences',
        'Summarize key points'
      ],
      prerequisites: ['Basic reading skills', 'Vocabulary knowledge'],
      isCore: true,
      weightPercentage: 25,
      active: true,
      createdAt: '2024-01-15T10:00:00Z',
      modifiedAt: '2024-01-20T14:30:00Z'
    },
    {
      id: 2,
      curriculumId,
      code: 'STD-002',
      title: 'Mathematical Problem Solving',
      description: 'Students will apply mathematical concepts to solve real-world problems.',
      category: 'COMPETENCIES',
      level: 'ADVANCED',
      assessmentCriteria: 'Students can analyze problems, select appropriate strategies, and justify solutions.',
      learningOutcomes: [
        'Analyze complex problems',
        'Select appropriate mathematical strategies',
        'Execute problem-solving procedures',
        'Justify and communicate solutions'
      ],
      prerequisites: ['Basic arithmetic', 'Algebraic thinking'],
      isCore: true,
      weightPercentage: 30,
      active: true,
      createdAt: '2024-01-16T09:15:00Z',
      modifiedAt: '2024-01-22T11:45:00Z'
    },
    {
      id: 3,
      curriculumId,
      code: 'STD-003',
      title: 'Scientific Inquiry',
      description: 'Students will demonstrate understanding of scientific methods and inquiry processes.',
      category: 'KNOWLEDGE',
      level: 'INTERMEDIATE',
      assessmentCriteria: 'Students can formulate hypotheses, design experiments, and analyze results.',
      learningOutcomes: [
        'Formulate testable hypotheses',
        'Design controlled experiments',
        'Collect and analyze data',
        'Draw evidence-based conclusions'
      ],
      prerequisites: ['Basic scientific concepts', 'Observation skills'],
      isCore: false,
      weightPercentage: 20,
      active: true,
      createdAt: '2024-01-17T13:20:00Z',
      modifiedAt: '2024-01-23T16:10:00Z'
    }
  ];

  const loadStandards = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStandards(mockStandards);
      showNotification('success', 'Standards loaded successfully');
    } catch (error) {
      showNotification('error', 'Failed to load standards');
    } finally {
      setLoading(false);
    }
  }, [curriculumId, showNotification]);

  useEffect(() => {
    if (curriculumId) {
      loadStandards();
    }
  }, [curriculumId, loadStandards]);

  // Filter standards
  const filteredStandards = standards.filter(standard => {
    const matchesSearch = standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         standard.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || standard.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || standard.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      category: 'KNOWLEDGE',
      level: 'BASIC',
      assessmentCriteria: '',
      learningOutcomes: [''],
      prerequisites: [''],
      isCore: true,
      weightPercentage: 10
    });
  };

  const handleAddStandard = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditStandard = (standard: CurriculumStandard) => {
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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (showEditModal && selectedStandard) {
        // Update existing standard
        setStandards(prev => prev.map(s => 
          s.id === selectedStandard.id 
            ? { ...s, ...formData, modifiedAt: new Date().toISOString() }
            : s
        ));
        showNotification('success', 'Standard updated successfully');
      } else {
        // Add new standard
        const newStandard: CurriculumStandard = {
          id: Date.now(),
          curriculumId,
          ...formData,
          active: true,
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString()
        };
        setStandards(prev => [...prev, newStandard]);
        showNotification('success', 'Standard created successfully');
      }
      
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedStandard(null);
      resetForm();
    } catch (error) {
      showNotification('error', 'Failed to save standard');
    }
  };

  const handleDeleteStandard = async (standardId: number) => {
    if (window.confirm('Are you sure you want to delete this standard? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setStandards(prev => prev.filter(s => s.id !== standardId));
        showNotification('success', 'Standard deleted successfully');
      } catch (error) {
        showNotification('error', 'Failed to delete standard');
      }
    }
  };

  const addLearningOutcome = () => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, '']
    }));
  };

  const removeLearningOutcome = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => i === index ? value : outcome)
    }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const updatePrerequisite = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => i === index ? value : prereq)
    }));
  };

  const getCategoryBadge = (category: string) => {
    const config = {
      'KNOWLEDGE': { color: 'bg-blue-100 text-blue-800', icon: BookOpen },
      'SKILLS': { color: 'bg-green-100 text-green-800', icon: Target },
      'ATTITUDES': { color: 'bg-purple-100 text-purple-800', icon: Users },
      'COMPETENCIES': { color: 'bg-orange-100 text-orange-800', icon: Award }
    };
    const { color, icon: Icon } = config[category as keyof typeof config] || config.KNOWLEDGE;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {category}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const config = {
      'BASIC': { color: 'bg-gray-100 text-gray-800' },
      'INTERMEDIATE': { color: 'bg-yellow-100 text-yellow-800' },
      'ADVANCED': { color: 'bg-red-100 text-red-800' },
      'MASTERY': { color: 'bg-indigo-100 text-indigo-800' }
    };
    const { color } = config[level as keyof typeof config] || config.BASIC;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {level}
      </span>
    );
  };

  const getStats = () => {
    return {
      total: standards.length,
      core: standards.filter(s => s.isCore).length,
      knowledge: standards.filter(s => s.category === 'KNOWLEDGE').length,
      skills: standards.filter(s => s.category === 'SKILLS').length,
      competencies: standards.filter(s => s.category === 'COMPETENCIES').length,
      totalWeight: standards.reduce((sum, s) => sum + s.weightPercentage, 0)
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Curriculum Standards</h2>
            <p className="text-sm text-gray-600">Define and manage learning standards for this curriculum</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadStandards}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={handleAddStandard}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Standard
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search standards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="KNOWLEDGE">Knowledge</option>
            <option value="SKILLS">Skills</option>
            <option value="ATTITUDES">Attitudes</option>
            <option value="COMPETENCIES">Competencies</option>
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Levels</option>
            <option value="BASIC">Basic</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="MASTERY">Mastery</option>
          </select>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Total Standards</p>
                <p className="text-lg font-bold text-blue-900">{stats.total}</p>
              </div>
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Core Standards</p>
                <p className="text-lg font-bold text-green-900">{stats.core}</p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Knowledge</p>
                <p className="text-lg font-bold text-purple-900">{stats.knowledge}</p>
              </div>
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-1">Skills</p>
                <p className="text-lg font-bold text-orange-900">{stats.skills}</p>
              </div>
              <Target className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-indigo-600 mb-1">Competencies</p>
                <p className="text-lg font-bold text-indigo-900">{stats.competencies}</p>
              </div>
              <Award className="h-4 w-4 text-indigo-600" />
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 mb-1">Total Weight</p>
                <p className="text-lg font-bold text-yellow-900">{stats.totalWeight}%</p>
              </div>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Standards List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Standards ({filteredStandards.length})</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg text-blue-600"></div>
                <p className="mt-3 text-sm text-gray-600">Loading standards...</p>
              </div>
            </div>
          ) : filteredStandards.length === 0 ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-2">No standards found</h4>
                <p className="text-sm text-gray-500 mb-4">
                  {searchTerm || filterCategory !== 'all' || filterLevel !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No standards have been defined for this curriculum yet.'
                  }
                </p>
                {(!searchTerm && filterCategory === 'all' && filterLevel === 'all') && (
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
                <div
                  key={standard.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{standard.title}</h4>
                        <span className="text-sm text-gray-500 font-mono">({standard.code})</span>
                        {getCategoryBadge(standard.category)}
                        {getLevelBadge(standard.level)}
                        {standard.isCore && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Core
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{standard.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Learning Outcomes:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {standard.learningOutcomes.map((outcome, index) => (
                              <li key={index}>{outcome}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Assessment Criteria:</h5>
                          <p className="text-gray-600">{standard.assessmentCriteria}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-xs text-gray-500">Weight: {standard.weightPercentage}%</span>
                            <span className="text-xs text-gray-500">
                              Modified: {new Date(standard.modifiedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-3 flex-shrink-0">
                      <button
                        onClick={() => handleEditStandard(standard)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit standard"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStandard(standard.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete standard"
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

      {/* Add/Edit Standard Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                {showEditModal ? 'Edit Standard' : 'Add New Standard'}
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
                      placeholder="STD-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.weightPercentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, weightPercentage: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    placeholder="Standard title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="Describe what this standard covers..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="KNOWLEDGE">Knowledge</option>
                      <option value="SKILLS">Skills</option>
                      <option value="ATTITUDES">Attitudes</option>
                      <option value="COMPETENCIES">Competencies</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="BASIC">Basic</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="MASTERY">Mastery</option>
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
                      <span className="ml-2 text-sm text-gray-700">Core Standard</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Criteria</label>
                  <textarea
                    value={formData.assessmentCriteria}
                    onChange={(e) => setFormData(prev => ({ ...prev, assessmentCriteria: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="How will this standard be assessed?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                  {formData.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => updateLearningOutcome(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Learning outcome ${index + 1}`}
                      />
                      {formData.learningOutcomes.length > 1 && (
                        <button
                          onClick={() => removeLearningOutcome(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addLearningOutcome}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Learning Outcome
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
                  {formData.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={prereq}
                        onChange={(e) => updatePrerequisite(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Prerequisite ${index + 1}`}
                      />
                      {formData.prerequisites.length > 1 && (
                        <button
                          onClick={() => removePrerequisite(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addPrerequisite}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Prerequisite
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedStandard(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStandard}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {showEditModal ? 'Update Standard' : 'Create Standard'}
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