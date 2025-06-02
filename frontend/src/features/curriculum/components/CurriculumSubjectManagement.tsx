import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  fetchCurriculumSubjects,
  fetchAvailableSubjects,
  addSubjectToCurriculum,
  removeSubjectFromCurriculum,
  updateCurriculumSubject,
  clearNotification,
  setNotification
} from '../curriculumSubjectSlice';
import { CurriculumSubjectDTO, Subject, UpdateCurriculumSubjectRequest } from '../../../api/services/curriculumSubjectApi';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  BookOpen, 
  Clock, 
  Target, 
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface CurriculumSubjectManagementProps {
  curriculumId: number;
}

interface AddSubjectModalData {
  subject: Subject;
  isCore: boolean;
  allocatedHours: number;
  weightPercentage: number;
}

interface EditSubjectModalData {
  curriculumSubject: CurriculumSubjectDTO;
  isCore: boolean;
  allocatedHours: number;
  weightPercentage: number;
  objectives: string;
}

const CurriculumSubjectManagement: React.FC<CurriculumSubjectManagementProps> = ({ curriculumId }) => {
  const dispatch = useAppDispatch();
  const { 
    curriculumSubjects, 
    availableSubjects, 
    loading, 
    operationLoading, 
    notification 
  } = useAppSelector(state => state.curriculumSubject);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'core' | 'elective'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCurriculumSubject, setSelectedCurriculumSubject] = useState<CurriculumSubjectDTO | null>(null);
  
  // Modal form data
  const [addModalData, setAddModalData] = useState<AddSubjectModalData>({
    subject: {} as Subject,
    isCore: true,
    allocatedHours: 40,
    weightPercentage: 10
  });

  const [editModalData, setEditModalData] = useState<EditSubjectModalData>({
    curriculumSubject: {} as CurriculumSubjectDTO,
    isCore: true,
    allocatedHours: 40,
    weightPercentage: 10,
    objectives: ''
  });

  // Load data on mount
  useEffect(() => {
    dispatch(fetchCurriculumSubjects(curriculumId));
    dispatch(fetchAvailableSubjects(curriculumId));
  }, [dispatch, curriculumId]);

  // Auto-clear notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  // Filter functions
  const filteredCurriculumSubjects = curriculumSubjects.filter(cs => {
    const matchesSearch = cs.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cs.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'core' && cs.isCore) ||
                         (filterType === 'elective' && !cs.isCore);
    return matchesSearch && matchesFilter;
  });

  const filteredAvailableSubjects = availableSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Modal handlers
  const handleAddSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setAddModalData({
      subject,
      isCore: true,
      allocatedHours: 40,
      weightPercentage: 10
    });
    setShowAddModal(true);
  };

  const handleEditSubject = (curriculumSubject: CurriculumSubjectDTO) => {
    setSelectedCurriculumSubject(curriculumSubject);
    setEditModalData({
      curriculumSubject,
      isCore: curriculumSubject.isCore,
      allocatedHours: curriculumSubject.allocatedHours || 40,
      weightPercentage: curriculumSubject.weightPercentage || 10,
      objectives: curriculumSubject.objectives || ''
    });
    setShowEditModal(true);
  };

  const handleDeleteSubject = (curriculumSubject: CurriculumSubjectDTO) => {
    setSelectedCurriculumSubject(curriculumSubject);
    setShowDeleteModal(true);
  };

  // API operations
  const handleConfirmAdd = async () => {
    if (!selectedSubject) return;

    try {
      await dispatch(addSubjectToCurriculum({
        curriculumId,
        subjectId: selectedSubject.id,
        isCore: addModalData.isCore,
        allocatedHours: addModalData.allocatedHours,
        weightPercentage: addModalData.weightPercentage
      })).unwrap();
      
      setShowAddModal(false);
      setSelectedSubject(null);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleConfirmEdit = async () => {
    if (!selectedCurriculumSubject) return;

    const updateData: UpdateCurriculumSubjectRequest = {
      isCore: editModalData.isCore,
      allocatedHours: editModalData.allocatedHours,
      weightPercentage: editModalData.weightPercentage,
      objectives: editModalData.objectives
    };

    try {
      await dispatch(updateCurriculumSubject({
        curriculumId,
        subjectId: selectedCurriculumSubject.subjectId,
        updateData
      })).unwrap();
      
      setShowEditModal(false);
      setSelectedCurriculumSubject(null);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCurriculumSubject) return;

    try {
      await dispatch(removeSubjectFromCurriculum({
        curriculumId,
        subjectId: selectedCurriculumSubject.subjectId
      })).unwrap();
      
      setShowDeleteModal(false);
      setSelectedCurriculumSubject(null);
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const getTotalAllocatedHours = () => {
    return curriculumSubjects.reduce((total, cs) => total + (cs.allocatedHours || 0), 0);
  };

  const getTotalWeightPercentage = () => {
    return curriculumSubjects.reduce((total, cs) => total + (cs.weightPercentage || 0), 0);
  };

  const handleRefresh = () => {
    dispatch(fetchCurriculumSubjects(curriculumId));
    dispatch(fetchAvailableSubjects(curriculumId));
  };

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
              onClick={() => dispatch(clearNotification())}
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
            <h2 className="text-xl font-bold text-gray-900 mb-1">Subject Management</h2>
            <p className="text-sm text-gray-600">Manage subjects associated with this curriculum</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'core' | 'elective')}
            className="px-3 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          >
            <option value="all">All Subjects</option>
            <option value="core">Core Subjects</option>
            <option value="elective">Elective Subjects</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-1">Total Subjects</p>
                <p className="text-2xl font-bold text-blue-900">{curriculumSubjects.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-md">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-1">Core Subjects</p>
                <p className="text-2xl font-bold text-green-900">
                  {curriculumSubjects.filter(cs => cs.isCore).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-md">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-600 mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-purple-900">{getTotalAllocatedHours()}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-md">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-1">Total Weight</p>
                <p className="text-2xl font-bold text-orange-900">{getTotalWeightPercentage()}%</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-md">
                <Filter className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout - Flexible Height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Current Curriculum Subjects */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">Current Subjects</h3>
            <p className="text-sm text-gray-600 mt-0.5">Subjects currently assigned to this curriculum</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg text-blue-600"></div>
                  <p className="mt-3 text-sm text-gray-600">Loading subjects...</p>
                </div>
              </div>
            ) : filteredCurriculumSubjects.length === 0 ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-base font-medium text-gray-900 mb-2">No subjects found</h4>
                  <p className="text-sm text-gray-500">
                    {searchTerm || filterType !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No subjects have been added to this curriculum yet.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCurriculumSubjects.map((curriculumSubject) => (
                  <div
                    key={curriculumSubject.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 truncate">{curriculumSubject.subjectName}</h4>
                          <span className="text-sm text-gray-500 flex-shrink-0">({curriculumSubject.subjectCode})</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            curriculumSubject.isCore 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {curriculumSubject.isCore ? 'Core' : 'Elective'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                          {curriculumSubject.allocatedHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {curriculumSubject.allocatedHours} hours
                            </span>
                          )}
                          {curriculumSubject.weightPercentage && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {curriculumSubject.weightPercentage}% weight
                            </span>
                          )}
                        </div>
                        {curriculumSubject.objectives && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {curriculumSubject.objectives}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 ml-3 flex-shrink-0">
                        <button
                          onClick={() => handleEditSubject(curriculumSubject)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          disabled={operationLoading}
                          title="Edit subject"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(curriculumSubject)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          disabled={operationLoading}
                          title="Remove subject"
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

        {/* Available Subjects */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">Available Subjects</h3>
            <p className="text-sm text-gray-600 mt-0.5">Subjects that can be added to this curriculum</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg text-blue-600"></div>
                  <p className="mt-3 text-sm text-gray-600">Loading available subjects...</p>
                </div>
              </div>
            ) : filteredAvailableSubjects.length === 0 ? (
              <div className="flex justify-center items-center h-full min-h-[200px]">
                <div className="text-center">
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-base font-medium text-gray-900 mb-2">No available subjects</h4>
                  <p className="text-sm text-gray-500">
                    {searchTerm 
                      ? 'No subjects match your search criteria.'
                      : 'All subjects have been added to this curriculum.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAvailableSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{subject.name}</h4>
                          <span className="text-sm text-gray-500 flex-shrink-0">({subject.code})</span>
                        </div>
                        {subject.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {subject.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddSubject(subject)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors ml-3 flex-shrink-0"
                        disabled={operationLoading}
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Add Subject to Curriculum</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-900">{selectedSubject.name}</p>
                    <p className="text-sm text-gray-600">{selectedSubject.code}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isCore"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={addModalData.isCore}
                        onChange={() => setAddModalData(prev => ({ ...prev, isCore: true }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Core Subject</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="isCore"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={!addModalData.isCore}
                        onChange={() => setAddModalData(prev => ({ ...prev, isCore: false }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Elective Subject</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allocated Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={addModalData.allocatedHours}
                    onChange={(e) => setAddModalData(prev => ({ 
                      ...prev, 
                      allocatedHours: parseInt(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={addModalData.weightPercentage}
                    onChange={(e) => setAddModalData(prev => ({ 
                      ...prev, 
                      weightPercentage: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAdd}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={operationLoading}
                >
                  {operationLoading ? 'Adding...' : 'Add Subject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && selectedCurriculumSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Edit Subject Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="font-semibold text-gray-900">{selectedCurriculumSubject.subjectName}</p>
                    <p className="text-sm text-gray-600">{selectedCurriculumSubject.subjectCode}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="editIsCore"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={editModalData.isCore}
                        onChange={() => setEditModalData(prev => ({ ...prev, isCore: true }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Core Subject</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="editIsCore"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={!editModalData.isCore}
                        onChange={() => setEditModalData(prev => ({ ...prev, isCore: false }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Elective Subject</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allocated Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="200"
                    value={editModalData.allocatedHours}
                    onChange={(e) => setEditModalData(prev => ({ 
                      ...prev, 
                      allocatedHours: parseInt(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight Percentage</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editModalData.weightPercentage}
                    onChange={(e) => setEditModalData(prev => ({ 
                      ...prev, 
                      weightPercentage: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Objectives</label>
                  <textarea
                    value={editModalData.objectives}
                    onChange={(e) => setEditModalData(prev => ({ 
                      ...prev, 
                      objectives: e.target.value 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
                    placeholder="Enter learning objectives for this subject..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={operationLoading}
                >
                  {operationLoading ? 'Updating...' : 'Update Subject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCurriculumSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-5">
              <h3 className="text-lg font-bold text-red-600 mb-5">Remove Subject</h3>
              
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">
                        Are you sure you want to remove this subject?
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        This will remove "{selectedCurriculumSubject.subjectName}" from the curriculum. 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="font-semibold text-gray-900">{selectedCurriculumSubject.subjectName}</p>
                  <p className="text-sm text-gray-600">{selectedCurriculumSubject.subjectCode}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedCurriculumSubject.isCore 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCurriculumSubject.isCore ? 'Core' : 'Elective'}
                    </span>
                    {selectedCurriculumSubject.allocatedHours && (
                      <span>{selectedCurriculumSubject.allocatedHours} hours</span>
                    )}
                    {selectedCurriculumSubject.weightPercentage && (
                      <span>{selectedCurriculumSubject.weightPercentage}% weight</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={operationLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                  disabled={operationLoading}
                >
                  {operationLoading ? 'Removing...' : 'Remove Subject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumSubjectManagement; 