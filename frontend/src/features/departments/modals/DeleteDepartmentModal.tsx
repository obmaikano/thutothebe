import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { deleteDepartment, fetchDepartmentsBySchool, fetchDepartments } from '../departmentsSlice';
import { Department } from '../../../api/services/departmentApi';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteDepartmentModalProps {
  extraObject?: Department;
}

export const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const department = extraObject;

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const handleDelete = async () => {
    if (!department) return;

    try {
      setIsLoading(true);

      await dispatch(deleteDepartment(department.id)).unwrap();
      
      // Refresh the departments list
      if (user?.schoolId) {
        await dispatch(fetchDepartmentsBySchool(user.schoolId));
      } else {
        await dispatch(fetchDepartments());
      }
      
      handleClose();
      
    } catch (error) {
      console.error('Failed to delete department:', error);
      setIsLoading(false);
    }
  };

  if (!department) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No department data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-red-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Department</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      {/* Warning Content */}
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-800 mb-1">Warning</h4>
              <p className="text-red-700 text-sm">
                You are about to permanently delete the department "{department.name}". 
                This action will remove all associated data and cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Department Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Department Information</h4>
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
              <span className="text-gray-600">Department Head:</span>
              <p className="font-medium">{department.departmentHeadName || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-gray-600">Teachers:</span>
              <p className="font-medium">{department.teacherIds.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Subjects:</span>
              <p className="font-medium">{department.subjectIds.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <p className={`font-medium ${department.active ? 'text-green-600' : 'text-red-600'}`}>
                {department.active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Impact Warning */}
        {(department.teacherIds.length > 0 || department.subjectIds.length > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">Impact Assessment</h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  {department.teacherIds.length > 0 && (
                    <li>• {department.teacherIds.length} teacher(s) will be unassigned from this department</li>
                  )}
                  {department.subjectIds.length > 0 && (
                    <li>• {department.subjectIds.length} subject(s) will be unassigned from this department</li>
                  )}
                  {department.departmentHeadName && (
                    <li>• Department head assignment will be removed</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            To confirm deletion, please type the department name: <strong>{department.name}</strong>
          </p>
          <input
            type="text"
            className="input input-bordered w-full mt-2"
            placeholder={`Type "${department.name}" to confirm`}
            id="confirmationInput"
          />
        </div>
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
          onClick={handleDelete}
          className="btn btn-error"
          disabled={isLoading || (() => {
            const input = document.getElementById('confirmationInput') as HTMLInputElement;
            return !input || input.value !== department.name;
          })()}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Deleting...
            </>
          ) : (
            <>
              <Trash2 size={16} />
              Delete Department
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteDepartmentModal; 