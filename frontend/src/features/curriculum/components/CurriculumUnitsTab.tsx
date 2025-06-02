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
  CheckCircle
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

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch units when component mounts or curriculumId changes
  useEffect(() => {
    if (curriculumId) {
      dispatch(fetchCurriculumUnits(curriculumId));
    }
  }, [dispatch, curriculumId]);

  // Fetch topics when a unit is expanded
  const toggleUnitExpansion = (unitId: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
      // Fetch topics for this unit if not already loaded
      if (!topics[unitId]) {
        dispatch(fetchCurriculumTopics(unitId));
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
            dispatch(fetchCurriculumById(curriculumId));
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
            dispatch(fetchCurriculumById(curriculumId));
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
          // In real implementation, this would call an update API
          showNotification('success', 'Curriculum unit updated successfully');
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
          // In real implementation, this would call an update API
          showNotification('success', 'Curriculum topic updated successfully');
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
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`alert ${
          notification.type === 'success' ? 'alert-success' : 
          notification.type === 'error' ? 'alert-error' : 'alert-info'
        } mb-4`}>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header with Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Curriculum Units & Topics</h3>
            <p className="text-gray-600">Manage the structure and content of your curriculum</p>
          </div>
          <button
            onClick={handleCreateUnit}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Unit
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{units.length}</div>
                <div className="text-sm text-blue-600">Total Units</div>
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <div className="text-2xl font-bold text-green-900">{getTotalTopics()}</div>
                <div className="text-sm text-green-600">Total Topics</div>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-purple-600 mr-2" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{getTotalWeeks()}</div>
                <div className="text-sm text-purple-600">Total Weeks</div>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              <div>
                <div className="text-2xl font-bold text-orange-900">{getTotalHours()}</div>
                <div className="text-sm text-orange-600">Total Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {units.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Units Created</h3>
            <p className="text-gray-600 mb-6">Start building your curriculum by creating the first unit.</p>
            <button
              onClick={handleCreateUnit}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Unit
            </button>
          </div>
        ) : (
          units.map((unit) => (
            <div key={unit.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Unit Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleUnitExpansion(unit.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {expandedUnits.has(unit.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Hash className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Unit {unit.unitOrder}: {unit.title}
                        </h4>
                        {unit.description && (
                          <p className="text-sm text-gray-600">{unit.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mr-4">
                      {unit.durationWeeks && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {unit.durationWeeks} weeks
                        </span>
                      )}
                      {unit.allocatedHours && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {unit.allocatedHours} hours
                        </span>
                      )}
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {topics[unit.id]?.length || 0} topics
                      </span>
                    </div>
                    <button
                      onClick={() => handleEditUnit(unit)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUnit(unit.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Unit Content (Topics) */}
              {expandedUnits.has(unit.id) && (
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="text-md font-semibold text-gray-900">Topics</h5>
                    <button
                      onClick={() => handleCreateTopic(unit.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Topic
                    </button>
                  </div>

                  {topics[unit.id] && topics[unit.id].length > 0 ? (
                    <div className="space-y-3">
                      {topics[unit.id].map((topic) => (
                        <div key={topic.id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-xs font-semibold text-green-600">
                                  {topic.topicOrder}
                                </span>
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-900">{topic.title}</h6>
                                {topic.description && (
                                  <p className="text-sm text-gray-600">{topic.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {topic.durationHours && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {topic.durationHours}h
                                </span>
                              )}
                              <button
                                onClick={() => handleEditTopic(topic, unit.id)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteTopic(topic.id, unit.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">No topics created for this unit</p>
                      <button
                        onClick={() => handleCreateTopic(unit.id)}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Create the first topic
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CurriculumUnitsTab; 