import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { 
  fetchCurriculumSubjects, 
  fetchAvailableSubjects, 
  addSubjectToCurriculum, 
  removeSubjectFromCurriculum,
  updateCurriculumSubject,
  fetchCurriculumSubjectStatistics,
  clearError,
  clearNotification
} from '../curriculumSubjectSlice';
import { useNavigate } from 'react-router-dom';
import { BookMarked, Plus, Trash2, Search, Clock, Percent, CheckCircle, AlertCircle, Save, X, Settings } from 'lucide-react';

interface CurriculumSubjectsTabProps {
  curriculumId: number;
  currentSubjectIds: number[];
  currentSubjectNames: string[];
  onSubjectsUpdate?: (subjectIds: number[]) => void;
}

const CurriculumSubjectsTab: React.FC<CurriculumSubjectsTabProps> = ({ 
  curriculumId, 
  currentSubjectIds, 
  currentSubjectNames,
  onSubjectsUpdate 
}) => {
  const dispatch = useAppDispatch();
  const { 
    curriculumSubjects, 
    availableSubjects, 
    statistics,
    loading, 
    error, 
    operationLoading, 
    notification 
  } = useAppSelector(state => state.curriculumSubject);
  const { user } = useAppSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSubject, setEditingSubject] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch curriculum subjects, available subjects, and statistics when component mounts
    dispatch(fetchCurriculumSubjects(curriculumId));
    dispatch(fetchAvailableSubjects(curriculumId));
    dispatch(fetchCurriculumSubjectStatistics(curriculumId));
  }, [dispatch, curriculumId]);

  useEffect(() => {
    // Clear notifications after 5 seconds
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const canManageSubjects = user && [
    'MINISTRY_STAFF',
    'MINISTRY_EXECUTIVE',
    'REGIONAL_ADMIN',
    'SCHOOL_ADMIN',
    'SUPER_ADMIN'
  ].includes(user.role);

  const filteredCurriculumSubjects = curriculumSubjects.filter(subject =>
    subject.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.subjectCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAvailableSubjects = availableSubjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = async (subjectId: number) => {
    if (!canManageSubjects) return;

    try {
      await dispatch(addSubjectToCurriculum({
        curriculumId,
        subjectId,
        isCore: true,
        allocatedHours: undefined,
        weightPercentage: undefined
      })).unwrap();

      // Refresh statistics
      dispatch(fetchCurriculumSubjectStatistics(curriculumId));
      onSubjectsUpdate?.([...currentSubjectIds, subjectId]);
    } catch (error: any) {
      console.error('Failed to add subject:', error);
    }
  };

  const handleRemoveSubject = async (subjectId: number) => {
    if (!canManageSubjects) return;

    try {
      await dispatch(removeSubjectFromCurriculum({
        curriculumId,
        subjectId
      })).unwrap();
      
      // Refresh statistics
      dispatch(fetchCurriculumSubjectStatistics(curriculumId));
      const newSubjectIds = currentSubjectIds.filter(id => id !== subjectId);
      onSubjectsUpdate?.(newSubjectIds);
    } catch (error: any) {
      console.error('Failed to remove subject:', error);
    }
  };

  const handleUpdateSubjectDetails = (subjectId: number, field: string, value: any) => {
    // This will be handled by the updateCurriculumSubject action
    console.log('Update subject details:', subjectId, field, value);
  };

  const handleSaveSubjectDetails = async (subjectId: number) => {
    if (!canManageSubjects) return;

    try {
      const curriculumSubject = curriculumSubjects.find(cs => cs.subjectId === subjectId);
      if (!curriculumSubject) return;

      await dispatch(updateCurriculumSubject({
        curriculumId,
        subjectId,
        updateData: {
          isCore: curriculumSubject.isCore,
          allocatedHours: curriculumSubject.allocatedHours,
          weightPercentage: curriculumSubject.weightPercentage,
          objectives: curriculumSubject.objectives
        }
      })).unwrap();

      // Refresh statistics
      dispatch(fetchCurriculumSubjectStatistics(curriculumId));
      setEditingSubject(null);
    } catch (error: any) {
      console.error('Failed to update subject details:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Curriculum Subjects</h3>
            <p className="text-gray-600 mt-1">
              Manage subjects associated with this curriculum
            </p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            notification.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <div className="flex justify-between items-center">
              <span>{notification.message}</span>
              <button
                onClick={() => dispatch(clearNotification())}
                className="text-current hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <BookMarked className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics?.totalSubjects || curriculumSubjects.length}
              </div>
              <div className="text-sm text-gray-500">Associated Subjects</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics?.totalAllocatedHours || 0}
              </div>
              <div className="text-sm text-gray-500">Total Allocated Hours</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Percent className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {statistics?.totalWeightPercentage?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-gray-500">Total Weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {canManageSubjects && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/app/curriculum/${curriculumId}/subjects`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Manage Subjects
          </button>
        </div>
      )}

      {/* Associated Subjects */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Associated Subjects ({filteredCurriculumSubjects.length})
        </h4>
        
        {filteredCurriculumSubjects.length === 0 ? (
          <div className="text-center py-8">
            <BookMarked className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h5 className="text-lg font-medium text-gray-900 mb-2">No subjects assigned</h5>
            <p className="text-gray-500 mb-4">This curriculum doesn't have any subjects assigned yet.</p>
            {canManageSubjects && (
              <button
                onClick={() => navigate(`/app/curriculum/${curriculumId}/subjects`)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subjects
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCurriculumSubjects.map((subject) => {
              const isEditing = editingSubject === subject.subjectId;
              
              return (
                <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-gray-900">{subject.subjectName}</h5>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {subject.subjectCode}
                        </span>
                        {subject.isCore && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                            Core
                          </span>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select
                              value={subject.isCore ? 'core' : 'elective'}
                              onChange={(e) => handleUpdateSubjectDetails(subject.subjectId, 'isCore', e.target.value === 'core')}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="core">Core Subject</option>
                              <option value="elective">Elective Subject</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Allocated Hours
                            </label>
                            <input
                              type="number"
                              value={subject.allocatedHours || ''}
                              onChange={(e) => handleUpdateSubjectDetails(subject.subjectId, 'allocatedHours', parseInt(e.target.value) || undefined)}
                              placeholder="Hours"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Weight %
                            </label>
                            <input
                              type="number"
                              value={subject.weightPercentage || ''}
                              onChange={(e) => handleUpdateSubjectDetails(subject.subjectId, 'weightPercentage', parseFloat(e.target.value) || undefined)}
                              placeholder="Percentage"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          {subject.allocatedHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {subject.allocatedHours} hours
                            </span>
                          )}
                          {subject.weightPercentage && (
                            <span className="flex items-center gap-1">
                              <Percent className="h-4 w-4" />
                              {subject.weightPercentage}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {canManageSubjects && (
                      <div className="flex items-center gap-2 ml-4">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveSubjectDetails(subject.subjectId)}
                              disabled={operationLoading}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingSubject(null)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditingSubject(subject.subjectId)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit subject details"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveSubject(subject.subjectId)}
                          disabled={operationLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Subjects */}
      {canManageSubjects && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Available Subjects ({filteredAvailableSubjects.length})
          </h4>
          
          {filteredAvailableSubjects.length === 0 ? (
            <div className="text-center py-8">
              <BookMarked className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h5 className="text-lg font-medium text-gray-900 mb-2">No available subjects</h5>
              <p className="text-gray-500">All subjects have been assigned to this curriculum.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailableSubjects.map((subject) => (
                <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 mb-1">{subject.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{subject.code}</p>
                      {subject.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{subject.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddSubject(subject.id)}
                      disabled={operationLoading}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                      title="Add subject"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!canManageSubjects && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">
              You don't have permission to manage subjects for this curriculum.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumSubjectsTab; 