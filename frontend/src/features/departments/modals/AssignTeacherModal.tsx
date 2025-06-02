import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { assignTeacherToDepartment, removeTeacherFromDepartment, fetchDepartmentsBySchool, fetchDepartments } from '../departmentsSlice';
import { Department } from '../../../api/services/departmentApi';
import { Users, Search, CheckCircle, X, Plus, Minus } from 'lucide-react';
import userApi, { User } from '../../../api/services/userApi';

interface AssignTeacherModalProps {
  extraObject?: Department;
}

export const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'assign' | 'manage'>('assign');
  const [error, setError] = useState<string | null>(null);

  const department = extraObject;

  useEffect(() => {
    const fetchAvailableTeachers = async () => {
      try {
        setIsLoadingTeachers(true);
        setError(null);
        
        // Fetch all teachers
        const response = await userApi.getAllTeachers();
        
        if (response.data.data) {
          const teachers = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          // Filter for active teachers in the same school
          const eligibleTeachers = teachers.filter((teacher: User) => 
            ['TEACHER', 'SENIOR_TEACHER'].includes(teacher.role) &&
            teacher.active &&
            (!teacher.schoolId || teacher.schoolId === department?.schoolId)
          );
          setAvailableTeachers(eligibleTeachers);
        } else {
          setAvailableTeachers([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch available teachers:', error);
        setError(error.response?.data?.message || 'Failed to fetch available teachers');
        setAvailableTeachers([]);
      } finally {
        setIsLoadingTeachers(false);
      }
    };

    if (department) {
      fetchAvailableTeachers();
    }
  }, [department]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleAssignTeacher = async (teacherId: number) => {
    if (!department) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(assignTeacherToDepartment({ 
        departmentId: department.id, 
        teacherId 
      })).unwrap();
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
    } catch (error: any) {
      console.error('Failed to assign teacher:', error);
      setError(error || 'Failed to assign teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    if (!department) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await dispatch(removeTeacherFromDepartment({ 
        departmentId: department.id, 
        teacherId 
      })).unwrap();
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
    } catch (error: any) {
      console.error('Failed to remove teacher:', error);
      setError(error || 'Failed to remove teacher');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeachers = availableTeachers.filter(teacher =>
    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const assignedTeachers = availableTeachers.filter(teacher => 
    department?.teacherIds.includes(teacher.id)
  );

  const unassignedTeachers = filteredTeachers.filter(teacher => 
    !department?.teacherIds.includes(teacher.id)
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
        <div className="p-2 bg-green-100 rounded-lg">
          <Users className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Department Teachers</h3>
          <p className="text-sm text-gray-600">Assign and manage teachers for {department.name}</p>
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
            <span className="text-gray-600">Current Teachers:</span>
            <p className="font-medium">{department.teacherIds.length}</p>
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
            Assign Teachers ({isLoadingTeachers ? '...' : unassignedTeachers.length})
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'manage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Current Teachers ({isLoadingTeachers ? '...' : assignedTeachers.length})
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search teachers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10"
          disabled={isLoadingTeachers}
        />
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {isLoadingTeachers ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : activeTab === 'assign' ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Available Teachers</h4>
            {unassignedTeachers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'No teachers found matching your search.' : 'All available teachers are already assigned.'}
                </p>
                {!searchTerm && availableTeachers.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">
                    No teachers available in this school.
                  </p>
                )}
              </div>
            ) : (
              unassignedTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{teacher.email}</div>
                      <div className="text-xs text-gray-500">{teacher.role.replace('_', ' ')}</div>
                    </div>
                    <button
                      onClick={() => handleAssignTeacher(teacher.id)}
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
            <h4 className="font-medium text-gray-900">Current Teachers</h4>
            {assignedTeachers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No teachers currently assigned to this department.</p>
              </div>
            ) : (
              assignedTeachers
                .filter(teacher =>
                  `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((teacher) => (
                  <div
                    key={teacher.id}
                    className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{teacher.email}</div>
                        <div className="text-xs text-gray-500">{teacher.role.replace('_', ' ')}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveTeacher(teacher.id)}
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

export default AssignTeacherModal; 