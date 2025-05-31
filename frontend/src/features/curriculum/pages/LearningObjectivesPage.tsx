import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCurricula, clearCurriculumError } from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import { Curriculum } from '../../../api/services/curriculumApi';
import { Search, Plus, BookOpen, Target, Edit, Trash2, Clock, Brain, Heart, Hand } from 'lucide-react';

interface LearningObjective {
  id: number;
  title: string;
  description: string;
  type: 'COGNITIVE' | 'AFFECTIVE' | 'PSYCHOMOTOR';
  bloomsLevel: string;
  estimatedTime: number;
}

const LearningObjectivesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { curricula, status, error } = useAppSelector(state => state.curriculum);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [objectives, setObjectives] = useState<LearningObjective[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [bloomsFilter, setBloomsFilter] = useState('');

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
        setObjectives(metadata.learningObjectives || []);
      } catch (error) {
        console.error('Failed to parse curriculum metadata:', error);
        setObjectives([]);
      }
    } else {
      setObjectives([]);
    }
  }, [selectedCurriculum]);

  const handleCreateObjective = () => {
    if (!selectedCurriculum) return;
    
    dispatch(openModal({
      title: 'Create Learning Objective',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_ADD_NEW, // We'll need to create specific objective modals
      extraObject: { curriculum: selectedCurriculum },
      size: 'lg'
    }));
  };

  const handleEditObjective = (objective: LearningObjective) => {
    dispatch(openModal({
      title: 'Edit Learning Objective',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_EDIT,
      extraObject: { objective, curriculum: selectedCurriculum },
      size: 'lg'
    }));
  };

  const handleDeleteObjective = (objective: LearningObjective) => {
    dispatch(openModal({
      title: 'Delete Learning Objective',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_DELETE_CONFIRMATION,
      extraObject: { objective, curriculum: selectedCurriculum }
    }));
  };

  const canManageObjectives = user && [
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

  const filteredObjectives = objectives.filter((objective) => {
    const matchesType = typeFilter === '' || objective.type === typeFilter;
    const matchesBlooms = bloomsFilter === '' || objective.bloomsLevel === bloomsFilter;
    
    return matchesType && matchesBlooms;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'COGNITIVE': { color: 'bg-blue-100 text-blue-800', label: 'Cognitive', icon: Brain },
      'AFFECTIVE': { color: 'bg-red-100 text-red-800', label: 'Affective', icon: Heart },
      'PSYCHOMOTOR': { color: 'bg-green-100 text-green-800', label: 'Psychomotor', icon: Hand }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.COGNITIVE;
    const IconComponent = config.icon;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
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

  const getObjectiveStats = () => {
    const stats = {
      total: objectives.length,
      cognitive: objectives.filter(obj => obj.type === 'COGNITIVE').length,
      affective: objectives.filter(obj => obj.type === 'AFFECTIVE').length,
      psychomotor: objectives.filter(obj => obj.type === 'PSYCHOMOTOR').length,
      totalTime: objectives.reduce((sum, obj) => sum + obj.estimatedTime, 0)
    };
    
    return stats;
  };

  const stats = getObjectiveStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Learning Objectives Management</h1>
          <p className="text-gray-600 mt-2">Define and manage specific learning objectives for curricula</p>
        </div>
        {canManageObjectives && selectedCurriculum && (
          <button 
            onClick={handleCreateObjective} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Objective
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

        {/* Objectives Content */}
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

              {/* Statistics */}
              {objectives.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Objectives</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.cognitive}</div>
                    <div className="text-sm text-gray-600">Cognitive</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.affective}</div>
                    <div className="text-sm text-gray-600">Affective</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.psychomotor}</div>
                    <div className="text-sm text-gray-600">Psychomotor</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(stats.totalTime / 60)}h</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                </div>
              )}

              {/* Filters */}
              {objectives.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objective Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Types</option>
                        <option value="COGNITIVE">Cognitive</option>
                        <option value="AFFECTIVE">Affective</option>
                        <option value="PSYCHOMOTOR">Psychomotor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bloom's Level
                      </label>
                      <select
                        value={bloomsFilter}
                        onChange={(e) => setBloomsFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Levels</option>
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
              )}

              {/* Learning Objectives */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Learning Objectives ({filteredObjectives.length})
                  </h2>
                </div>

                {filteredObjectives.length > 0 ? (
                  <div className="space-y-4">
                    {filteredObjectives.map((objective, index) => (
                      <div key={objective.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              <h3 className="font-semibold text-gray-900">{objective.title}</h3>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-3">{objective.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {getTypeBadge(objective.type)}
                              {getBloomsLevelBadge(objective.bloomsLevel)}
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {objective.estimatedTime}min
                              </span>
                            </div>
                          </div>
                          
                          {canManageObjectives && (
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => handleEditObjective(objective)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Objective"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteObjective(objective)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Objective"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : objectives.length > 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Objectives</h3>
                    <p className="text-gray-600 mb-4">
                      No learning objectives match your current filters.
                    </p>
                    <button 
                      onClick={() => {
                        setTypeFilter('');
                        setBloomsFilter('');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Learning Objectives</h3>
                    <p className="text-gray-600 mb-4">
                      This curriculum doesn't have any learning objectives defined yet.
                    </p>
                    {canManageObjectives && (
                      <button 
                        onClick={handleCreateObjective}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create First Objective
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
                Choose a curriculum from the sidebar to view and manage its learning objectives.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningObjectivesPage; 