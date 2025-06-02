import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { closeModal } from '../../common/modalSlice';
import { createDepartment, fetchDepartmentsBySchool, fetchDepartments } from '../departmentsSlice';
import { CreateDepartmentRequest } from '../../../api/services/departmentApi';
import { Building2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CreateDepartmentModalProps {
  extraObject?: any;
}

export const CreateDepartmentModal: React.FC<CreateDepartmentModalProps> = ({ extraObject }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateDepartmentRequest>();

  const handleClose = () => {
    dispatch(closeModal({}));
  };

  const onSubmit = async (data: CreateDepartmentRequest) => {
    try {
      setIsLoading(true);
      
      // Set school ID from current user if not provided
      const departmentData = {
        ...data,
        schoolId: data.schoolId || user?.schoolId || 0
      };

      await dispatch(createDepartment(departmentData)).unwrap();
      
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
      
    } catch (error) {
      console.error('Failed to create department:', error);
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <Building2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Department Created Successfully!</h3>
        <p className="text-gray-600">The new department has been added to your school.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Create New Department</h3>
          <p className="text-sm text-gray-600">Add a new academic department to your school</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Department Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Department Name *</span>
            </label>
            <input
              type="text"
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter department name"
              {...register('name', { 
                required: 'Department name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter department description (optional)"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* School ID (hidden for school users) */}
          {!user?.schoolId && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">School ID *</span>
              </label>
              <input
                type="number"
                className={`input input-bordered w-full ${errors.schoolId ? 'input-error' : ''}`}
                placeholder="Enter school ID"
                {...register('schoolId', { 
                  required: 'School ID is required',
                  min: { value: 1, message: 'School ID must be a positive number' }
                })}
              />
              {errors.schoolId && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.schoolId.message}</span>
                </label>
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
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Create Department
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDepartmentModal; 