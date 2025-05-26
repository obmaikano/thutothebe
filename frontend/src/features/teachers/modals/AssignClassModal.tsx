import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { assignTeacherToClass } from '../../classes/classesSlice';
import { closeModal } from '../../common/modalSlice';
import { Teacher } from '../../../api/services/teacherApi';
import classApi, { Class } from '../../../api/services/classApi';
import { Users, Search, X, Plus } from 'lucide-react';

interface AssignClassModalProps {
  extraObject?: Teacher;
}

const AssignClassModal: React.FC<AssignClassModalProps> = ({ extraObject: teacher }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.classes);
  
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingClasses, setFetchingClasses] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableClasses = async () => {
      if (!teacher) return;

      try {
        setFetchingClasses(true);
        setError(null);

        // Get all active classes
        const allClassesResponse = await classApi.getActiveClasses();
        const allClasses = Array.isArray(allClassesResponse.data.data) 
          ? allClassesResponse.data.data 
          : [];

        // Get classes already assigned to this teacher
        const teacherClassesResponse = await classApi.getByTeacher(teacher.id);
        const teacherClasses = Array.isArray(teacherClassesResponse.data.data) 
          ? teacherClassesResponse.data.data 
          : [];

        // Filter out classes already assigned to the teacher
        const assignedClassIds = teacherClasses.map((classItem: Class) => classItem.id);
        const available = allClasses.filter((classItem: Class) => !assignedClassIds.includes(classItem.id));

        setAvailableClasses(available);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load available classes');
      } finally {
        setFetchingClasses(false);
      }
    };

    fetchAvailableClasses();
  }, [teacher]);

  useEffect(() => {
    // Filter classes based on search term
    const filtered = availableClasses.filter(classItem => {
      const matchesSearch = 
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.grade.toString().includes(searchTerm.toLowerCase());
      
      return matchesSearch && classItem.active;
    });
    
    setFilteredClasses(filtered);
  }, [searchTerm, availableClasses]);

  const handleClassToggle = (classId: number) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClasses.length === filteredClasses.length) {
      setSelectedClasses([]);
    } else {
      setSelectedClasses(filteredClasses.map(classItem => classItem.id));
    }
  };

  const handleSubmit = async () => {
    if (!teacher || selectedClasses.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Assign teacher to classes one by one
      for (const classId of selectedClasses) {
        await dispatch(assignTeacherToClass({ classId, teacherId: teacher.id })).unwrap();
      }
      
      dispatch(closeModal({}));
    } catch (error: any) {
      console.error('Failed to assign classes to teacher:', error);
      setError(error || 'Failed to assign classes to teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  if (!teacher) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Error: No teacher data provided</div>
        <button
          onClick={handleClose}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assign Classes</h3>
          <p className="text-sm text-gray-600">
            Assign classes to {teacher.firstName} {teacher.lastName}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-400" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {fetchingClasses ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading classes...</span>
        </div>
      ) : (
        <>
          {/* Search and Select All */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search classes by name or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {filteredClasses.length > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} available
                </span>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedClasses.length === filteredClasses.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}
          </div>

          {/* Classes List */}
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {filteredClasses.length === 0 ? (
              <div className="text-center py-8">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-2">
                  {availableClasses.length === 0 
                    ? 'No classes available for assignment' 
                    : 'No classes match your search'
                  }
                </p>
                {availableClasses.length === 0 && (
                  <p className="text-sm text-gray-500">
                    All active classes may already be assigned to this teacher.
                  </p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredClasses.map((classItem) => {
                  const isSelected = selectedClasses.includes(classItem.id);
                  
                  return (
                    <div key={classItem.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleClassToggle(classItem.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{classItem.name}</h4>
                              <p className="text-sm text-gray-600">Grade: {classItem.grade}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {classItem.currentEnrollment || 0} students
                              </span>
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                Capacity: {classItem.capacity || 'Not set'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Classes Summary */}
          {selectedClasses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Selected Classes ({selectedClasses.length})
              </h4>
              <div className="space-y-1">
                {selectedClasses.map((classId) => {
                  const classItem = filteredClasses.find(c => c.id === classId);
                  if (!classItem) return null;
                  
                  return (
                    <div key={classId} className="flex items-center justify-between text-sm">
                      <span className="text-blue-800">{classItem.name} (Grade {classItem.grade})</span>
                      <span className="text-blue-600">{classItem.currentEnrollment || 0} students</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || selectedClasses.length === 0}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning Classes...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Assign {selectedClasses.length} Class{selectedClasses.length !== 1 ? 'es' : ''}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignClassModal; 