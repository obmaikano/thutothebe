import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Search, Plus, BookOpen, Target, Edit, Trash2, Eye, ChevronRight, ChevronDown } from 'lucide-react';

interface LearningStandard {
  id: number;
  title: string;
  description: string;
  category: string;
  bloomsLevel: string;
  estimatedHours: number;
  children?: LearningStandard[];
}

const StandardsManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [expandedStandards, setExpandedStandards] = useState<Set<number>>(new Set());
  const [standards, setStandards] = useState<LearningStandard[]>([]);

  useEffect(() => {
    dispatch(fetchCurricula());
    return () => {
      dispatch(clearCurriculumError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedCurriculum && selectedCurriculum.metadata) {
      try {
        const metadata = JSON.parse(selectedCurriculum.metadata);
        setStandards(metadata.learningStandards || []);
      } catch (error) {
        console.error('Failed to parse curriculum metadata:', error);
        setStandards([]);
      }
    } else {
      setStandards([]);
    }
  }, [selectedCurriculum]);

  const handleCreateStandard = () => {
    if (!selectedCurriculum) return;
    
    dispatch(openModal({
      title: 'Create Learning Standard',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW, // We'll need to create specific standard modals
      extraObject: { curriculum: selectedCurriculum },
      size: 'lg'
    }));
  };

  const handleEditStandard = (standard: LearningStandard) => {
    dispatch(openModal({
      title: 'Edit Learning Standard',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_EDIT,
      extraObject: { standard, curriculum: selectedCurriculum },
      size: 'lg'
    }));
  };

  const handleDeleteStandard = (standard: LearningStandard) => {
    dispatch(openModal({
      title: 'Delete Learning Standard',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION,
      extraObject: { standard, curriculum: selectedCurriculum }
    }));
  };

  const toggleStandardExpansion = (standardId: number) => {
    setExpandedStandards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(standardId)) {
        newSet.delete(standardId);
      } else {
        newSet.add(standardId);
      }
      return newSet;
    });
  };

  const canManageStandards = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'DIRECTOR',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const filteredCurricula = curricula.filter((curriculum: Curriculum) => {
    const matchesSearch = 
      curriculum.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (curriculum.description && curriculum.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'KNOWLEDGE': { color: 'bg-blue-100 text-blue-800', label: 'Knowledge' },
      'SKILLS': { color: 'bg-green-100 text-green-800', label: 'Skills' },
      'UNDERSTANDING': { color: 'bg-purple-100 text-purple-800', label: 'Understanding' },
      'APPLICATION': { color: 'bg-orange-100 text-orange-800', label: 'Application' },
      'ANALYSIS': { color: 'bg-red-100 text-red-800', label: 'Analysis' },
      'SYNTHESIS': { color: 'bg-indigo-100 text-indigo-800', label: 'Synthesis' },
      'EVALUATION': { color: 'bg-pink-100 text-pink-800', label: 'Evaluation' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.KNOWLEDGE;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getBloomsLevelBadge = (level: string) => {
    const levelConfig = {
      'REMEMBER': { color: 'bg-gray-100 text-gray-800', label: 'Remember' },
      'UNDERSTAND': { color: 'bg-blue-100 text-blue-800', label: 'Understand' },
      'APPLY': { color: 'bg-green-100 text-green-800', label: 'Apply' },
      'ANALYZE': { color: 'bg-yellow-100 text-yellow-800', label: 'Analyze' },
      'EVALUATE': { color: 'bg-orange-100 text-orange-800', label: 'Evaluate' },
      'CREATE': { color: 'bg-red-100 text-red-800', label: 'Create' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.REMEMBER;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const renderStandard = (standard: LearningStandard, level: number = 0) => {
    const isExpanded = expandedStandards.has(standard.id);
    const hasChildren = standard.children && standard.children.length > 0;

    return (
      <div key={standard.id} className={`${level > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {hasChildren && (
                  <button
                    onClick={() => toggleStandardExpansion(standard.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <h3 className="font-semibold text-gray-900">{standard.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{standard.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {getCategoryBadge(standard.category)}
                {getBloomsLevelBadge(standard.bloomsLevel)}
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                  {standard.estimatedHours}h
                </span>
              </div>
            </div>
            
            {canManageStandards && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleEditStandard(standard)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Standard"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteStandard(standard)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Standard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {standard.children!.map(child => renderStandard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Standards Management</h1>
          <p className="text-gray-600 mt-2">Manage curriculum learning standards and competencies</p>
        </div>
        {canManageStandards && selectedCurriculum && (
          <button 
            onClick={handleCreateStandard} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Standard
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Curriculum Selection Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Curriculum
            </h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search curricula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Curriculum List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCurricula.map((curriculum) => (
                <button
                  key={curriculum.id}
                  onClick={() => setSelectedCurriculum(curriculum)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCurriculum?.id === curriculum.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-sm">{curriculum.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {curriculum.gradeLevel.replace('_', ' ')} • {curriculum.curriculumType.replace('_', ' ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Standards Content */}
        <div className="lg:col-span-3">
          {selectedCurriculum ? (
            <div className="space-y-6">
              {/* Selected Curriculum Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedCurriculum.title}</h2>
                <p className="text-gray-600 mb-4">{selectedCurriculum.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    {selectedCurriculum.gradeLevel.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    {selectedCurriculum.curriculumType.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                    {selectedCurriculum.academicYear}
                  </span>
                </div>
              </div>

              {/* Learning Standards */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Standards ({standards.length})
                  </h2>
                </div>

                {standards.length > 0 ? (
                  <div className="space-y-4">
                    {standards.map(standard => renderStandard(standard))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Standards</h3>
                    <p className="text-gray-600 mb-4">
                      This curriculum doesn't have any learning standards defined yet.
                    </p>
                    {canManageStandards && (
                      <button 
                        onClick={handleCreateStandard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create First Standard
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Curriculum</h2>
              <p className="text-gray-600">
                Choose a curriculum from the sidebar to view and manage its learning standards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardsManagementPage; 