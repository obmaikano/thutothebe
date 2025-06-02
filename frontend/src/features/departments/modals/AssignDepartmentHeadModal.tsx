import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { Department } from '../../../api/services/departmentApi';
import { assignDepartmentHead, fetchDepartments, fetchDepartmentsBySchool } from '../departmentsSlice';
import { Users, Search, CheckCircle } from 'lucide-react';
import userApi, { User } from '../../../api/services/userApi';

interface AssignDepartmentHeadModalProps {
  extraObject?: Department;
}

export const AssignDepartmentHeadModal: React.FC<AssignDepartmentHeadModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const department = extraObject;

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setError(null);
        
        // Fetch teachers and senior teachers who can be department heads
        const response = await userApi.getAllTeachers();
        
        if (response.data.data) {
          const users = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          // Filter for users who can be department heads (teachers, senior teachers)
          const eligibleUsers = users.filter((user: User) => 
            ['TEACHER', 'SENIOR_TEACHER', 'DEPARTMENT_HEAD'].includes(user.role) &&
            user.active &&
            (!user.schoolId || user.schoolId === department?.schoolId)
          );
          setAvailableUsers(eligibleUsers);
        } else {
          setAvailableUsers([]);
        }
      } catch (error: any) {
        console.error('Failed to fetch available users:', error);
        setError(error.response?.data?.message || 'Failed to fetch available users');
        setAvailableUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    if (department) {
      fetchAvailableUsers();
    }
  }, [department]);

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleAssign = async () => {
    if (!department || !selectedUserId) return;

    try {
      setIsLoading(true);
      setError(null);

      await dispatch(assignDepartmentHead({ 
        departmentId: department.id, 
        userId: selectedUserId 
      })).unwrap();
      
      setIsSuccess(true);
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
      // Show success briefly then close
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Failed to assign department head:', error);
      setError(error || 'Failed to assign department head');
      setIsLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Head Assigned Successfully!</h3>
        <p className="text-gray-600">The department head has been assigned to the department.</p>
      </div>
    );
  }

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
        <div className="p-2 bg-purple-100 rounded-lg">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assign Department Head</h3>
          <p className="text-sm text-gray-600">Select a user to be the head of {department.name}</p>
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
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Name:</span>
            <p className="font-medium">{department.name}</p>
          </div>
          <div>
            <span className="text-gray-600">School:</span>
            <p className="font-medium">{department.schoolName}</p>
          </div>
          <div>
            <span className="text-gray-600">Current Head:</span>
            <p className="font-medium">{department.departmentHeadName || 'Not assigned'}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full pl-10"
          disabled={isLoadingUsers}
        />
      </div>

      {/* User Selection */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="font-medium text-gray-900">Available Users</h4>
        
        {isLoadingUsers ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm ? 'No users found matching your search.' : 'No eligible users available.'}
            </p>
            {!searchTerm && (
              <p className="text-sm text-gray-400 mt-2">
                Only teachers and senior teachers can be assigned as department heads.
              </p>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedUserId === user.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedUserId(user.id)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-gray-500">{user.role.replace('_', ' ')}</div>
                </div>
                {selectedUserId === user.id && (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          ))
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
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAssign}
          className="btn btn-primary"
          disabled={isLoading || !selectedUserId || isLoadingUsers}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Assigning...
            </>
          ) : (
            <>
              <Users size={16} />
              Assign as Head
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AssignDepartmentHeadModal; 