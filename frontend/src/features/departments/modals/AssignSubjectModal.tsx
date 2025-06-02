import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { assignSubjectToDepartment, removeSubjectFromDepartment, fetchDepartmentsBySchool, fetchDepartments } from '../departmentsSlice';
import { Department } from '../../../api/services/departmentApi';
import { BookOpen, Search, Plus, Minus } from 'lucide-react';
import subjectApi, { Subject } from '../../../api/services/subjectApi';

interface AssignSubjectModalProps {
  extraObject?: Department;
}

export const AssignSubjectModal: React.FC<AssignSubjectModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'assign' | 'manage'>('assign');
  const [error, setError] = useState<string | null>(null);

  const department = extraObject;

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        setError(null);
        
        // Fetch all active subjects
        const response = await subjectApi.getActiveSubjects();
        
        if (response.data.data) {
          const subjects = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          setAvailableSubjects(subjects);
        } else {
          setAvailableSubjects([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch available subjects:', error);
        setError(error.response?.data?.message || 'Failed to fetch available subjects');
        setAvailableSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchAvailableSubjects();
  }, []);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleAssignSubject = async (subjectId: number) => {
    if (!department) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(assignSubjectToDepartment({ 
        departmentId: department.id, 
        subjectId 
      })).unwrap();
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
    } catch (error: any) {
      console.error('Failed to assign subject:', error);
      setError(error || 'Failed to assign subject');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSubject = async (subjectId: number) => {
    if (!department) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(removeSubjectFromDepartment({ 
        departmentId: department.id, 
        subjectId 
      })).unwrap();
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
    } catch (error: any) {
      console.error('Failed to remove subject:', error);
      setError(error || 'Failed to remove subject');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = availableSubjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const assignedSubjects = availableSubjects.filter(subject => 
    department?.subjectIds.includes(subject.id)
  );

  const unassignedSubjects = filteredSubjects.filter(subject => 
    !department?.subjectIds.includes(subject.id)
  );

  if (!department) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">No Data</h3>
          <p className="text-red-600">No department information available.</p>
          <button 
            onClick={handleClose}
            className="btn btn-ghost mt-4"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-orange-100 rounded-lg">
          <BookOpen className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Department Subjects</h3>
          <p className="text-sm text-gray-600">Assign and manage subjects for {department.name}</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Department Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Department Information</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <p className="font-medium">{department.name}</p>
          </div>
          <div>
            <span className="text-gray-600">School:</span>
            <p className="font-medium">{department.schoolName}</p>
          </div>
          <div>
            <span className="text-gray-600">Current Subjects:</span>
            <p className="font-medium">{department.subjectIds.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('assign')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assign'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assign Subjects ({isLoadingSubjects ? '...' : unassignedSubjects.length})
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Current Subjects ({isLoadingSubjects ? '...' : assignedSubjects.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10"
          disabled={isLoadingSubjects}
        />
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoadingSubjects ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : activeTab === 'assign' ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Available Subjects</h4>
            {unassignedSubjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No subjects found matching your search.' : 'All available subjects are already assigned.'}
                </p>
                {!searchTerm && availableSubjects.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    No active subjects available.
                  </p>
                )}
              </div>
            ) : (
              unassignedSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {subject.name} ({subject.code})
                      </div>
                      <div className="text-sm text-gray-600">
                        {subject.description || 'No description available'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignSubject(subject.id)}
                      disabled={isLoading}
                      className="btn btn-sm btn-primary"
                    >
                      {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <>
                          <Plus size={14} />
                          Assign
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Current Subjects</h4>
            {assignedSubjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No subjects currently assigned to this department.</p>
              </div>
            ) : (
              assignedSubjects
                .filter(subject =>
                  subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  (subject.description && subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((subject) => (
                  <div
                    key={subject.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {subject.name} ({subject.code})
                        </div>
                        <div className="text-sm text-gray-600">
                          {subject.description || 'No description available'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        disabled={isLoading}
                        className="btn btn-sm btn-error"
                      >
                        {isLoading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <>
                            <Minus size={14} />
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-ghost"
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AssignSubjectModal; 