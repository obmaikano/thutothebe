import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchCurriculumUnits, 
  fetchCurriculumTopics,
  createCurriculumUnit, 
  createCurriculumTopic, 
  updateCurriculumUnit,
  updateCurriculumTopic,
  deleteCurriculumUnit,
  deleteCurriculumTopic,
  fetchCurriculumById,
  CurriculumUnit,
  CurriculumTopic
} from '../curriculumSlice';
import { openModal } from '../../common/modalSlice';
import { MODAL_BODY_TYPES } from '../../../utils/modalConstants';
import {
  Plus,
  BookOpen,
  Clock,
  Hash,
  FileText,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  Target,
  Calendar,
  Users,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';

interface CurriculumUnitsTabProps {
  curriculumId: number;
}

const CurriculumUnitsTab: React.FC<CurriculumUnitsTabProps> = ({ curriculumId }) => {
  const dispatch = useAppDispatch();
  const { units, topics, status } = useAppSelector(state => state.curriculum);
  
  const [expandedUnits, setExpandedUnits] = useState<Set<number>>(new Set());
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Load units when component mounts or curriculumId changes
  useEffect(() => {
    if (curriculumId) {
      dispatch(fetchCurriculumUnits(curriculumId));
    }
  }, [dispatch, curriculumId]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
  };

  // Fetch topics when a unit is expanded
  const toggleUnitExpansion = async (unitId: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
      // Fetch topics for this unit if not already loaded
      if (!topics[unitId]) {
        try {
          await dispatch(fetchCurriculumTopics(unitId)).unwrap();
        } catch (error) {
          showNotification('error', 'Failed to load topics for this unit');
        }
      }
    }
    setExpandedUnits(newExpanded);
  };

  const handleCreateUnit = () => {
    dispatch(openModal({
      title: 'Create Curriculum Unit',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_UNIT_FORM,
      extraObject: { 
        curriculumId,
        mode: 'create',
        onSubmit: async (unitData: any) => {
          try {
            await dispatch(createCurriculumUnit({
              curriculumId,
              title: unitData.title,
              description: unitData.description,
              unitOrder: unitData.unitOrder,
              durationWeeks: unitData.durationWeeks,
              allocatedHours: unitData.allocatedHours
            })).unwrap();
            
            showNotification('success', 'Curriculum unit created successfully');
            // Refresh units list
            dispatch(fetchCurriculumUnits(curriculumId));
          } catch (error: any) {
            showNotification('error', error || 'Failed to create curriculum unit');
          }
        }
      }
    }));
  };

  const handleCreateTopic = (unitId: number) => {
    dispatch(openModal({
      title: 'Create Curriculum Topic',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_TOPIC_FORM,
      extraObject: { 
        curriculumUnitId: unitId,
        mode: 'create',
        onSubmit: async (topicData: any) => {
          try {
            await dispatch(createCurriculumTopic({
              curriculumUnitId: unitId,
              title: topicData.title,
              description: topicData.description,
              topicOrder: topicData.topicOrder,
              durationHours: topicData.durationHours
            })).unwrap();
            
            showNotification('success', 'Curriculum topic created successfully');
            // Refresh topics for this unit
            dispatch(fetchCurriculumTopics(unitId));
          } catch (error: any) {
            showNotification('error', error || 'Failed to create curriculum topic');
          }
        }
      }
    }));
  };

  const handleEditUnit = (unit: CurriculumUnit) => {
    dispatch(openModal({
      title: 'Edit Curriculum Unit',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_UNIT_FORM,
      extraObject: { 
        curriculumId,
        unit,
        mode: 'edit',
        onSubmit: async (unitData: any) => {
          try {
            await dispatch(updateCurriculumUnit({
              id: unit.id,
              ...unitData
            })).unwrap();
            showNotification('success', 'Curriculum unit updated successfully');
            // Refresh units list
            dispatch(fetchCurriculumUnits(curriculumId));
          } catch (error: any) {
            showNotification('error', error || 'Failed to update curriculum unit');
          }
        }
      }
    }));
  };

  const handleEditTopic = (topic: CurriculumTopic, unitId: number) => {
    dispatch(openModal({
      title: 'Edit Curriculum Topic',
      bodyType: MODAL_BODY_TYPES.CURRICULUM_TOPIC_FORM,
      extraObject: { 
        curriculumUnitId: unitId,
        topic,
        mode: 'edit',
        onSubmit: async (topicData: any) => {
          try {
            await dispatch(updateCurriculumTopic({
              id: topic.id,
              ...topicData
            })).unwrap();
            showNotification('success', 'Curriculum topic updated successfully');
            // Refresh topics for this unit
            dispatch(fetchCurriculumTopics(unitId));
          } catch (error: any) {
            showNotification('error', error || 'Failed to update curriculum topic');
          }
        }
      }
    }));
  };

  const handleDeleteUnit = async (unitId: number) => {
    if (window.confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      try {
        await dispatch(deleteCurriculumUnit(unitId)).unwrap();
        showNotification('success', 'Curriculum unit deleted successfully');
        // Refresh units list
        dispatch(fetchCurriculumUnits(curriculumId));
      } catch (error: any) {
        showNotification('error', error || 'Failed to delete curriculum unit');
      }
    }
  };

  const handleDeleteTopic = async (topicId: number, unitId: number) => {
    if (window.confirm('Are you sure you want to delete this topic? This action cannot be undone.')) {
      try {
        await dispatch(deleteCurriculumTopic(topicId)).unwrap();
        showNotification('success', 'Curriculum topic deleted successfully');
        // Refresh topics for this unit
        dispatch(fetchCurriculumTopics(unitId));
      } catch (error: any) {
        showNotification('error', error || 'Failed to delete curriculum topic');
      }
    }
  };

  const getTotalHours = () => {
    return units.reduce((total, unit) => total + (unit.allocatedHours || 0), 0);
  };

  const getTotalWeeks = () => {
    return units.reduce((total, unit) => total + (unit.durationWeeks || 0), 0);
  };

  const getTotalTopics = () => {
    return Object.values(topics).reduce((total, unitTopics) => total + unitTopics.length, 0);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-blue-600"></div>
          <p className="mt-3 text-sm text-gray-600">Loading curriculum units...</p>
        </div>
      </div>
    );
  }

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
              {notification.type === 'error' && <X className="h-4 w-4 text-red-600" />}
              {notification.type === 'info' && <X className="h-4 w-4 text-blue-600" />}
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Curriculum Units & Topics</h2>
            <p className="text-sm text-gray-600">Organize your curriculum into structured units and topics</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(fetchCurriculumUnits(curriculumId))}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleCreateUnit}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Unit
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Total Units</p>
                <p className="text-lg font-bold text-blue-900">{units.length}</p>
              </div>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Total Topics</p>
                <p className="text-lg font-bold text-green-900">{getTotalTopics()}</p>
              </div>
              <Target className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Total Hours</p>
                <p className="text-lg font-bold text-purple-900">{getTotalHours()}</p>
              </div>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-1">Total Weeks</p>
                <p className="text-lg font-bold text-orange-900">{getTotalWeeks()}</p>
              </div>
              <Calendar className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Units ({units.length})</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          {units.length === 0 ? (
            <div className="flex justify-center items-center h-full min-h-[200px]">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h4 className="text-base font-medium text-gray-900 mb-2">No units found</h4>
                <p className="text-sm text-gray-500 mb-4">No units have been created for this curriculum yet.</p>
                <button
                  onClick={handleCreateUnit}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create First Unit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Unit Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <button
                            onClick={() => toggleUnitExpansion(unit.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            {expandedUnits.has(unit.id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                          <h4 className="font-semibold text-gray-900">{unit.title}</h4>
                          <span className="text-sm text-gray-500">Unit {unit.unitOrder}</span>
                        </div>
                        <p className="text-sm text-gray-600 ml-8">{unit.description}</p>
                        
                        <div className="flex items-center gap-6 mt-2 ml-8 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {unit.durationWeeks} weeks
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {unit.allocatedHours} hours
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {topics[unit.id]?.length || 0} topics
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-3 flex-shrink-0">
                        <button
                          onClick={() => handleCreateTopic(unit.id)}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                          title="Add topic"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUnit(unit)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit unit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete unit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Topics List */}
                  {expandedUnits.has(unit.id) && (
                    <div className="p-4">
                      {topics[unit.id]?.length > 0 ? (
                        <div className="space-y-3">
                          {topics[unit.id].map((topic) => (
                            <div
                              key={topic.id}
                              className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-gray-900">{topic.title}</h5>
                                    <span className="text-xs text-gray-500">Topic {topic.topicOrder}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {topic.durationHours} hours
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-3 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditTopic(topic, unit.id)}
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Edit topic"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTopic(topic.id, unit.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Delete topic"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-3">No topics in this unit yet</p>
                          <button
                            onClick={() => handleCreateTopic(unit.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            Add First Topic
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurriculumUnitsTab; 